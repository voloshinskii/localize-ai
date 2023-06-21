const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require("openai");
const core = require('@actions/core');

const apiKey = core.getInput('openai-token');
const mainLocale =  core.getInput('main-locale');
const model = core.getInput('model');
const dir = core.toPlatformPath(core.getInput('locales-path'));
const localeCodes = require('locale-codes');
const verbose = core.getInput('verbose') === 'true';

const dropPluralRegex = /(_one|_two|_few|_many|_other|_zero)$/;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const configuration = new Configuration({
    apiKey,
});
const openai = new OpenAIApi(configuration);

const locales = {};
fs.readdirSync(dir).forEach(file => {
    const locale = file.split('.')[0];
    locales[locale] = JSON.parse(fs.readFileSync(path.join(dir, file), { encoding: 'utf-8' }));
});

function asyncForEach(array, cb) {
    return new Promise((resolve, reject) => {
        (async function loop() {
            for (let index = 0; index < array.length; index++) {
                await cb(array[index], index, array);
            }
            resolve();
        })();
    });
}

function deepDiff(a, b) {
    const diff = {};
    Object.entries(a).forEach(([key, value]) => {
        if (key.match(dropPluralRegex)) {
            return;
        }
        if (typeof value === 'string') {
            if (!b[key]) {
                diff[key] = value;
            }
        } else {
            diff[key] = deepDiff(value, b[key] || {});
        }
    });
    return diff;
}

async function getTranslationOfStringFromBackend(string, locale, num_of_retry = 0) {
    try {
        const prompt = `Translate the following string to ${localeCodes.getByTag(locale).name}:\n\n${string}\n\n`;
        const messages = [
            {"role": "user", "content": prompt},
        ];

        const completion = await openai.createChatCompletion({
            model,
            messages,
            max_tokens: 500,
        });

        return completion.data.choices[0]?.message.content;
    } catch (e) {
        if (num_of_retry >= 5 || e.response?.status !== 429) {
            throw e;
        }
        if (verbose) {
            console.log(e);
        }
        console.log('Too many requests, waiting 1 minute...');
        await sleep(60000);
        return await getTranslationOfStringFromBackend(string, locale, num_of_retry + 1);
    }
}

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

async function deepLocalization(locale, diff, locale_key) {
    const loc = deepCopy(locale);
    await asyncForEach(Object.entries(diff), async ([key, value]) => {
        if (typeof value === 'string') {
            loc[key] = await getTranslationOfStringFromBackend(value, locale_key);
        } else {
            loc[key] = await deepLocalization(loc[key] || {}, value, locale_key);
        }
    });
    return loc;
}

function saveAsJson() {
    Object.entries(locales).forEach(([locale, translations]) => {
        fs.writeFileSync(path.join(dir, `${locale}.json`), JSON.stringify(translations, null, 2));
    });
}

async function localizeRestLanguages() {
    await asyncForEach(Object.entries(locales), async ([locale, translations]) => {
        if (locale === mainLocale) {
            return;
        }
        console.log(`Localizing ${locale}...`);
        const diff = deepDiff(locales[mainLocale], translations);
        console.log('detected new strings: ');
        console.log(JSON.stringify(diff, null, 2));

        locales[locale] = await deepLocalization(locales[locale], diff, locale);
    });
    saveAsJson();
}

localizeRestLanguages();
