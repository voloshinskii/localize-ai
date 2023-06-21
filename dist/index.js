require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const reqHost = reqUrl.hostname;
    if (isLoopbackAddress(reqHost)) {
        return true;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperNoProxyItem === '*' ||
            upperReqHosts.some(x => x === upperNoProxyItem ||
                x.endsWith(`.${upperNoProxyItem}`) ||
                (upperNoProxyItem.startsWith('.') &&
                    x.endsWith(`${upperNoProxyItem}`)))) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
function isLoopbackAddress(host) {
    const hostLower = host.toLowerCase();
    return (hostLower === 'localhost' ||
        hostLower.startsWith('127.') ||
        hostLower.startsWith('[::1]') ||
        hostLower.startsWith('[0:0:0:0:0:0:0:1]'));
}
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 4812:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports =
{
  parallel      : __nccwpck_require__(8210),
  serial        : __nccwpck_require__(445),
  serialOrdered : __nccwpck_require__(3578)
};


/***/ }),

/***/ 1700:
/***/ ((module) => {

// API
module.exports = abort;

/**
 * Aborts leftover active jobs
 *
 * @param {object} state - current state object
 */
function abort(state)
{
  Object.keys(state.jobs).forEach(clean.bind(state));

  // reset leftover jobs
  state.jobs = {};
}

/**
 * Cleans up leftover job by invoking abort function for the provided job id
 *
 * @this  state
 * @param {string|number} key - job id to abort
 */
function clean(key)
{
  if (typeof this.jobs[key] == 'function')
  {
    this.jobs[key]();
  }
}


/***/ }),

/***/ 2794:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var defer = __nccwpck_require__(5295);

// API
module.exports = async;

/**
 * Runs provided callback asynchronously
 * even if callback itself is not
 *
 * @param   {function} callback - callback to invoke
 * @returns {function} - augmented callback
 */
function async(callback)
{
  var isAsync = false;

  // check if async happened
  defer(function() { isAsync = true; });

  return function async_callback(err, result)
  {
    if (isAsync)
    {
      callback(err, result);
    }
    else
    {
      defer(function nextTick_callback()
      {
        callback(err, result);
      });
    }
  };
}


/***/ }),

/***/ 5295:
/***/ ((module) => {

module.exports = defer;

/**
 * Runs provided function on next iteration of the event loop
 *
 * @param {function} fn - function to run
 */
function defer(fn)
{
  var nextTick = typeof setImmediate == 'function'
    ? setImmediate
    : (
      typeof process == 'object' && typeof process.nextTick == 'function'
      ? process.nextTick
      : null
    );

  if (nextTick)
  {
    nextTick(fn);
  }
  else
  {
    setTimeout(fn, 0);
  }
}


/***/ }),

/***/ 9023:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var async = __nccwpck_require__(2794)
  , abort = __nccwpck_require__(1700)
  ;

// API
module.exports = iterate;

/**
 * Iterates over each job object
 *
 * @param {array|object} list - array or object (named list) to iterate over
 * @param {function} iterator - iterator to run
 * @param {object} state - current job status
 * @param {function} callback - invoked when all elements processed
 */
function iterate(list, iterator, state, callback)
{
  // store current index
  var key = state['keyedList'] ? state['keyedList'][state.index] : state.index;

  state.jobs[key] = runJob(iterator, key, list[key], function(error, output)
  {
    // don't repeat yourself
    // skip secondary callbacks
    if (!(key in state.jobs))
    {
      return;
    }

    // clean up jobs
    delete state.jobs[key];

    if (error)
    {
      // don't process rest of the results
      // stop still active jobs
      // and reset the list
      abort(state);
    }
    else
    {
      state.results[key] = output;
    }

    // return salvaged results
    callback(error, state.results);
  });
}

/**
 * Runs iterator over provided job element
 *
 * @param   {function} iterator - iterator to invoke
 * @param   {string|number} key - key/index of the element in the list of jobs
 * @param   {mixed} item - job description
 * @param   {function} callback - invoked after iterator is done with the job
 * @returns {function|mixed} - job abort function or something else
 */
function runJob(iterator, key, item, callback)
{
  var aborter;

  // allow shortcut if iterator expects only two arguments
  if (iterator.length == 2)
  {
    aborter = iterator(item, async(callback));
  }
  // otherwise go with full three arguments
  else
  {
    aborter = iterator(item, key, async(callback));
  }

  return aborter;
}


/***/ }),

/***/ 2474:
/***/ ((module) => {

// API
module.exports = state;

/**
 * Creates initial state object
 * for iteration over list
 *
 * @param   {array|object} list - list to iterate over
 * @param   {function|null} sortMethod - function to use for keys sort,
 *                                     or `null` to keep them as is
 * @returns {object} - initial state object
 */
function state(list, sortMethod)
{
  var isNamedList = !Array.isArray(list)
    , initState =
    {
      index    : 0,
      keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
      jobs     : {},
      results  : isNamedList ? {} : [],
      size     : isNamedList ? Object.keys(list).length : list.length
    }
    ;

  if (sortMethod)
  {
    // sort array keys based on it's values
    // sort object's keys just on own merit
    initState.keyedList.sort(isNamedList ? sortMethod : function(a, b)
    {
      return sortMethod(list[a], list[b]);
    });
  }

  return initState;
}


/***/ }),

/***/ 7942:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var abort = __nccwpck_require__(1700)
  , async = __nccwpck_require__(2794)
  ;

// API
module.exports = terminator;

/**
 * Terminates jobs in the attached state context
 *
 * @this  AsyncKitState#
 * @param {function} callback - final callback to invoke after termination
 */
function terminator(callback)
{
  if (!Object.keys(this.jobs).length)
  {
    return;
  }

  // fast forward iteration index
  this.index = this.size;

  // abort jobs
  abort(this);

  // send back results we have so far
  async(callback)(null, this.results);
}


/***/ }),

/***/ 8210:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var iterate    = __nccwpck_require__(9023)
  , initState  = __nccwpck_require__(2474)
  , terminator = __nccwpck_require__(7942)
  ;

// Public API
module.exports = parallel;

/**
 * Runs iterator over provided array elements in parallel
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function parallel(list, iterator, callback)
{
  var state = initState(list);

  while (state.index < (state['keyedList'] || list).length)
  {
    iterate(list, iterator, state, function(error, result)
    {
      if (error)
      {
        callback(error, result);
        return;
      }

      // looks like it's the last one
      if (Object.keys(state.jobs).length === 0)
      {
        callback(null, state.results);
        return;
      }
    });

    state.index++;
  }

  return terminator.bind(state, callback);
}


/***/ }),

/***/ 445:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var serialOrdered = __nccwpck_require__(3578);

// Public API
module.exports = serial;

/**
 * Runs iterator over provided array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function serial(list, iterator, callback)
{
  return serialOrdered(list, iterator, null, callback);
}


/***/ }),

/***/ 3578:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var iterate    = __nccwpck_require__(9023)
  , initState  = __nccwpck_require__(2474)
  , terminator = __nccwpck_require__(7942)
  ;

// Public API
module.exports = serialOrdered;
// sorting helpers
module.exports.ascending  = ascending;
module.exports.descending = descending;

/**
 * Runs iterator over provided sorted array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} sortMethod - custom sort function
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function serialOrdered(list, iterator, sortMethod, callback)
{
  var state = initState(list, sortMethod);

  iterate(list, iterator, state, function iteratorHandler(error, result)
  {
    if (error)
    {
      callback(error, result);
      return;
    }

    state.index++;

    // are we there yet?
    if (state.index < (state['keyedList'] || list).length)
    {
      iterate(list, iterator, state, iteratorHandler);
      return;
    }

    // done here
    callback(null, state.results);
  });

  return terminator.bind(state, callback);
}

/*
 * -- Sort methods
 */

/**
 * sort helper to sort array elements in ascending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */
function ascending(a, b)
{
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * sort helper to sort array elements in descending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */
function descending(a, b)
{
  return -1 * ascending(a, b);
}


/***/ }),

/***/ 6545:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(2618);

/***/ }),

/***/ 8104:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var settle = __nccwpck_require__(3211);
var buildFullPath = __nccwpck_require__(1934);
var buildURL = __nccwpck_require__(646);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var httpFollow = (__nccwpck_require__(7707).http);
var httpsFollow = (__nccwpck_require__(7707).https);
var url = __nccwpck_require__(7310);
var zlib = __nccwpck_require__(9796);
var VERSION = (__nccwpck_require__(4322).version);
var createError = __nccwpck_require__(5226);
var enhanceError = __nccwpck_require__(1516);
var transitionalDefaults = __nccwpck_require__(936);
var Cancel = __nccwpck_require__(8875);

var isHttps = /https:?/;

/**
 *
 * @param {http.ClientRequestArgs} options
 * @param {AxiosProxyConfig} proxy
 * @param {string} location
 */
function setProxy(options, proxy, location) {
  options.hostname = proxy.host;
  options.host = proxy.host;
  options.port = proxy.port;
  options.path = location;

  // Basic proxy authorization
  if (proxy.auth) {
    var base64 = Buffer.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
    options.headers['Proxy-Authorization'] = 'Basic ' + base64;
  }

  // If a proxy is used, any redirects must also pass through the proxy
  options.beforeRedirect = function beforeRedirect(redirection) {
    redirection.headers.host = redirection.host;
    setProxy(redirection, proxy, redirection.href);
  };
}

/*eslint consistent-return:0*/
module.exports = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }
    var resolve = function resolve(value) {
      done();
      resolvePromise(value);
    };
    var rejected = false;
    var reject = function reject(value) {
      done();
      rejected = true;
      rejectPromise(value);
    };
    var data = config.data;
    var headers = config.headers;
    var headerNames = {};

    Object.keys(headers).forEach(function storeLowerName(name) {
      headerNames[name.toLowerCase()] = name;
    });

    // Set User-Agent (required by some servers)
    // See https://github.com/axios/axios/issues/69
    if ('user-agent' in headerNames) {
      // User-Agent is specified; handle case where no UA header is desired
      if (!headers[headerNames['user-agent']]) {
        delete headers[headerNames['user-agent']];
      }
      // Otherwise, use specified value
    } else {
      // Only set header if it hasn't been set in config
      headers['User-Agent'] = 'axios/' + VERSION;
    }

    if (data && !utils.isStream(data)) {
      if (Buffer.isBuffer(data)) {
        // Nothing to do...
      } else if (utils.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils.isString(data)) {
        data = Buffer.from(data, 'utf-8');
      } else {
        return reject(createError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          config
        ));
      }

      if (config.maxBodyLength > -1 && data.length > config.maxBodyLength) {
        return reject(createError('Request body larger than maxBodyLength limit', config));
      }

      // Add Content-Length header if data exists
      if (!headerNames['content-length']) {
        headers['Content-Length'] = data.length;
      }
    }

    // HTTP basic authentication
    var auth = undefined;
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      auth = username + ':' + password;
    }

    // Parse url
    var fullPath = buildFullPath(config.baseURL, config.url);
    var parsed = url.parse(fullPath);
    var protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth && headerNames.authorization) {
      delete headers[headerNames.authorization];
    }

    var isHttpsRequest = isHttps.test(protocol);
    var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

    try {
      buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, '');
    } catch (err) {
      var customErr = new Error(err.message);
      customErr.config = config;
      customErr.url = config.url;
      customErr.exists = true;
      reject(customErr);
    }

    var options = {
      path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
      method: config.method.toUpperCase(),
      headers: headers,
      agent: agent,
      agents: { http: config.httpAgent, https: config.httpsAgent },
      auth: auth
    };

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
    }

    var proxy = config.proxy;
    if (!proxy && proxy !== false) {
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
      if (proxyUrl) {
        var parsedProxyUrl = url.parse(proxyUrl);
        var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
        var shouldProxy = true;

        if (noProxyEnv) {
          var noProxy = noProxyEnv.split(',').map(function trim(s) {
            return s.trim();
          });

          shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
            if (!proxyElement) {
              return false;
            }
            if (proxyElement === '*') {
              return true;
            }
            if (proxyElement[0] === '.' &&
                parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
              return true;
            }

            return parsed.hostname === proxyElement;
          });
        }

        if (shouldProxy) {
          proxy = {
            host: parsedProxyUrl.hostname,
            port: parsedProxyUrl.port,
            protocol: parsedProxyUrl.protocol
          };

          if (parsedProxyUrl.auth) {
            var proxyUrlAuth = parsedProxyUrl.auth.split(':');
            proxy.auth = {
              username: proxyUrlAuth[0],
              password: proxyUrlAuth[1]
            };
          }
        }
      }
    }

    if (proxy) {
      options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      setProxy(options, proxy, protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path);
    }

    var transport;
    var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttpsProxy ? https : http;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      transport = isHttpsProxy ? httpsFollow : httpFollow;
    }

    if (config.maxBodyLength > -1) {
      options.maxBodyLength = config.maxBodyLength;
    }

    if (config.insecureHTTPParser) {
      options.insecureHTTPParser = config.insecureHTTPParser;
    }

    // Create the request
    var req = transport.request(options, function handleResponse(res) {
      if (req.aborted) return;

      // uncompress the response body transparently if required
      var stream = res;

      // return the last request in case of redirects
      var lastRequest = res.req || req;


      // if no content, is HEAD request or decompress disabled we should not decompress
      if (res.statusCode !== 204 && lastRequest.method !== 'HEAD' && config.decompress !== false) {
        switch (res.headers['content-encoding']) {
        /*eslint default-case:0*/
        case 'gzip':
        case 'compress':
        case 'deflate':
        // add the unzipper to the body stream processing pipeline
          stream = stream.pipe(zlib.createUnzip());

          // remove the content-encoding in order to not confuse downstream operations
          delete res.headers['content-encoding'];
          break;
        }
      }

      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config: config,
        request: lastRequest
      };

      if (config.responseType === 'stream') {
        response.data = stream;
        settle(resolve, reject, response);
      } else {
        var responseBuffer = [];
        var totalResponseBytes = 0;
        stream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);
          totalResponseBytes += chunk.length;

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
            // stream.destoy() emit aborted event before calling reject() on Node.js v16
            rejected = true;
            stream.destroy();
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              config, null, lastRequest));
          }
        });

        stream.on('aborted', function handlerStreamAborted() {
          if (rejected) {
            return;
          }
          stream.destroy();
          reject(createError('error request aborted', config, 'ERR_REQUEST_ABORTED', lastRequest));
        });

        stream.on('error', function handleStreamError(err) {
          if (req.aborted) return;
          reject(enhanceError(err, config, null, lastRequest));
        });

        stream.on('end', function handleStreamEnd() {
          try {
            var responseData = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
            if (config.responseType !== 'arraybuffer') {
              responseData = responseData.toString(config.responseEncoding);
              if (!config.responseEncoding || config.responseEncoding === 'utf8') {
                responseData = utils.stripBOM(responseData);
              }
            }
            response.data = responseData;
          } catch (err) {
            reject(enhanceError(err, config, err.code, response.request, response));
          }
          settle(resolve, reject, response);
        });
      }
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      if (req.aborted && err.code !== 'ERR_FR_TOO_MANY_REDIRECTS') return;
      reject(enhanceError(err, config, null, req));
    });

    // set tcp keep alive to prevent drop connection by peer
    req.on('socket', function handleRequestSocket(socket) {
      // default interval of sending ack packet is 1 minute
      socket.setKeepAlive(true, 1000 * 60);
    });

    // Handle request timeout
    if (config.timeout) {
      // This is forcing a int timeout to avoid problems if the `req` interface doesn't handle other types.
      var timeout = parseInt(config.timeout, 10);

      if (isNaN(timeout)) {
        reject(createError(
          'error trying to parse `config.timeout` to int',
          config,
          'ERR_PARSE_TIMEOUT',
          req
        ));

        return;
      }

      // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
      // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
      // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
      // And then these socket which be hang up will devoring CPU little by little.
      // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
      req.setTimeout(timeout, function handleRequestTimeout() {
        req.abort();
        var timeoutErrorMessage = '';
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        } else {
          timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
        }
        var transitional = config.transitional || transitionalDefaults;
        reject(createError(
          timeoutErrorMessage,
          config,
          transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
          req
        ));
      });
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (req.aborted) return;

        req.abort();
        reject(!cancel || (cancel && cancel.type) ? new Cancel('canceled') : cancel);
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }


    // Send the request
    if (utils.isStream(data)) {
      data.on('error', function handleStreamError(err) {
        reject(enhanceError(err, config, null, req));
      }).pipe(req);
    } else {
      req.end(data);
    }
  });
};


/***/ }),

/***/ 3454:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var settle = __nccwpck_require__(3211);
var cookies = __nccwpck_require__(1545);
var buildURL = __nccwpck_require__(646);
var buildFullPath = __nccwpck_require__(1934);
var parseHeaders = __nccwpck_require__(6455);
var isURLSameOrigin = __nccwpck_require__(3608);
var createError = __nccwpck_require__(5226);
var transitionalDefaults = __nccwpck_require__(936);
var Cancel = __nccwpck_require__(8875);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      var transitional = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (!request) {
          return;
        }
        reject(!cancel || (cancel && cancel.type) ? new Cancel('canceled') : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ 2618:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var bind = __nccwpck_require__(7065);
var Axios = __nccwpck_require__(8178);
var mergeConfig = __nccwpck_require__(4831);
var defaults = __nccwpck_require__(1626);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Expose Cancel & CancelToken
axios.Cancel = __nccwpck_require__(8875);
axios.CancelToken = __nccwpck_require__(1587);
axios.isCancel = __nccwpck_require__(4057);
axios.VERSION = (__nccwpck_require__(4322).version);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __nccwpck_require__(4850);

// Expose isAxiosError
axios.isAxiosError = __nccwpck_require__(650);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ 8875:
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ 1587:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var Cancel = __nccwpck_require__(8875);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;

  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;

  // eslint-disable-next-line func-names
  this.promise.then(function(cancel) {
    if (!token._listeners) return;

    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  // eslint-disable-next-line func-names
  this.promise.then = function(onfulfilled) {
    var _resolve;
    // eslint-disable-next-line func-names
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Subscribe to the cancel signal
 */

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * Unsubscribe from the cancel signal
 */

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ 4057:
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ 8178:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var buildURL = __nccwpck_require__(646);
var InterceptorManager = __nccwpck_require__(3214);
var dispatchRequest = __nccwpck_require__(5062);
var mergeConfig = __nccwpck_require__(4831);
var validator = __nccwpck_require__(1632);

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(configOrUrl, config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof configOrUrl === 'string') {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ 3214:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ 1934:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var isAbsoluteURL = __nccwpck_require__(1301);
var combineURLs = __nccwpck_require__(7189);

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ 5226:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var enhanceError = __nccwpck_require__(1516);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ 5062:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var transformData = __nccwpck_require__(9812);
var isCancel = __nccwpck_require__(4057);
var defaults = __nccwpck_require__(1626);
var Cancel = __nccwpck_require__(8875);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new Cancel('canceled');
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ 1516:
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  };
  return error;
};


/***/ }),

/***/ 4831:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };

  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
};


/***/ }),

/***/ 3211:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var createError = __nccwpck_require__(5226);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ 9812:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var defaults = __nccwpck_require__(1626);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ 1626:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var normalizeHeaderName = __nccwpck_require__(6240);
var enhanceError = __nccwpck_require__(1516);
var transitionalDefaults = __nccwpck_require__(936);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __nccwpck_require__(3454);
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __nccwpck_require__(8104);
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: transitionalDefaults,

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ 936:
/***/ ((module) => {

"use strict";


module.exports = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};


/***/ }),

/***/ 4322:
/***/ ((module) => {

module.exports = {
  "version": "0.26.1"
};

/***/ }),

/***/ 7065:
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ 646:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ 7189:
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ 1545:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ 1301:
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ 650:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
};


/***/ }),

/***/ 3608:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ 6240:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ 6455:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ 4850:
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ 1632:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var VERSION = (__nccwpck_require__(4322).version);

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};

/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')));
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ 328:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var bind = __nccwpck_require__(7065);

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return Array.isArray(val);
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return toString.call(val) === '[object FormData]';
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return toString.call(val) === '[object URLSearchParams]';
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ 5443:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var util = __nccwpck_require__(3837);
var Stream = (__nccwpck_require__(2781).Stream);
var DelayedStream = __nccwpck_require__(8611);

module.exports = CombinedStream;
function CombinedStream() {
  this.writable = false;
  this.readable = true;
  this.dataSize = 0;
  this.maxDataSize = 2 * 1024 * 1024;
  this.pauseStreams = true;

  this._released = false;
  this._streams = [];
  this._currentStream = null;
  this._insideLoop = false;
  this._pendingNext = false;
}
util.inherits(CombinedStream, Stream);

CombinedStream.create = function(options) {
  var combinedStream = new this();

  options = options || {};
  for (var option in options) {
    combinedStream[option] = options[option];
  }

  return combinedStream;
};

CombinedStream.isStreamLike = function(stream) {
  return (typeof stream !== 'function')
    && (typeof stream !== 'string')
    && (typeof stream !== 'boolean')
    && (typeof stream !== 'number')
    && (!Buffer.isBuffer(stream));
};

CombinedStream.prototype.append = function(stream) {
  var isStreamLike = CombinedStream.isStreamLike(stream);

  if (isStreamLike) {
    if (!(stream instanceof DelayedStream)) {
      var newStream = DelayedStream.create(stream, {
        maxDataSize: Infinity,
        pauseStream: this.pauseStreams,
      });
      stream.on('data', this._checkDataSize.bind(this));
      stream = newStream;
    }

    this._handleErrors(stream);

    if (this.pauseStreams) {
      stream.pause();
    }
  }

  this._streams.push(stream);
  return this;
};

CombinedStream.prototype.pipe = function(dest, options) {
  Stream.prototype.pipe.call(this, dest, options);
  this.resume();
  return dest;
};

CombinedStream.prototype._getNext = function() {
  this._currentStream = null;

  if (this._insideLoop) {
    this._pendingNext = true;
    return; // defer call
  }

  this._insideLoop = true;
  try {
    do {
      this._pendingNext = false;
      this._realGetNext();
    } while (this._pendingNext);
  } finally {
    this._insideLoop = false;
  }
};

CombinedStream.prototype._realGetNext = function() {
  var stream = this._streams.shift();


  if (typeof stream == 'undefined') {
    this.end();
    return;
  }

  if (typeof stream !== 'function') {
    this._pipeNext(stream);
    return;
  }

  var getStream = stream;
  getStream(function(stream) {
    var isStreamLike = CombinedStream.isStreamLike(stream);
    if (isStreamLike) {
      stream.on('data', this._checkDataSize.bind(this));
      this._handleErrors(stream);
    }

    this._pipeNext(stream);
  }.bind(this));
};

CombinedStream.prototype._pipeNext = function(stream) {
  this._currentStream = stream;

  var isStreamLike = CombinedStream.isStreamLike(stream);
  if (isStreamLike) {
    stream.on('end', this._getNext.bind(this));
    stream.pipe(this, {end: false});
    return;
  }

  var value = stream;
  this.write(value);
  this._getNext();
};

CombinedStream.prototype._handleErrors = function(stream) {
  var self = this;
  stream.on('error', function(err) {
    self._emitError(err);
  });
};

CombinedStream.prototype.write = function(data) {
  this.emit('data', data);
};

CombinedStream.prototype.pause = function() {
  if (!this.pauseStreams) {
    return;
  }

  if(this.pauseStreams && this._currentStream && typeof(this._currentStream.pause) == 'function') this._currentStream.pause();
  this.emit('pause');
};

CombinedStream.prototype.resume = function() {
  if (!this._released) {
    this._released = true;
    this.writable = true;
    this._getNext();
  }

  if(this.pauseStreams && this._currentStream && typeof(this._currentStream.resume) == 'function') this._currentStream.resume();
  this.emit('resume');
};

CombinedStream.prototype.end = function() {
  this._reset();
  this.emit('end');
};

CombinedStream.prototype.destroy = function() {
  this._reset();
  this.emit('close');
};

CombinedStream.prototype._reset = function() {
  this.writable = false;
  this._streams = [];
  this._currentStream = null;
};

CombinedStream.prototype._checkDataSize = function() {
  this._updateDataSize();
  if (this.dataSize <= this.maxDataSize) {
    return;
  }

  var message =
    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
  this._emitError(new Error(message));
};

CombinedStream.prototype._updateDataSize = function() {
  this.dataSize = 0;

  var self = this;
  this._streams.forEach(function(stream) {
    if (!stream.dataSize) {
      return;
    }

    self.dataSize += stream.dataSize;
  });

  if (this._currentStream && this._currentStream.dataSize) {
    this.dataSize += this._currentStream.dataSize;
  }
};

CombinedStream.prototype._emitError = function(err) {
  this._reset();
  this.emit('error', err);
};


/***/ }),

/***/ 8611:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Stream = (__nccwpck_require__(2781).Stream);
var util = __nccwpck_require__(3837);

module.exports = DelayedStream;
function DelayedStream() {
  this.source = null;
  this.dataSize = 0;
  this.maxDataSize = 1024 * 1024;
  this.pauseStream = true;

  this._maxDataSizeExceeded = false;
  this._released = false;
  this._bufferedEvents = [];
}
util.inherits(DelayedStream, Stream);

DelayedStream.create = function(source, options) {
  var delayedStream = new this();

  options = options || {};
  for (var option in options) {
    delayedStream[option] = options[option];
  }

  delayedStream.source = source;

  var realEmit = source.emit;
  source.emit = function() {
    delayedStream._handleEmit(arguments);
    return realEmit.apply(source, arguments);
  };

  source.on('error', function() {});
  if (delayedStream.pauseStream) {
    source.pause();
  }

  return delayedStream;
};

Object.defineProperty(DelayedStream.prototype, 'readable', {
  configurable: true,
  enumerable: true,
  get: function() {
    return this.source.readable;
  }
});

DelayedStream.prototype.setEncoding = function() {
  return this.source.setEncoding.apply(this.source, arguments);
};

DelayedStream.prototype.resume = function() {
  if (!this._released) {
    this.release();
  }

  this.source.resume();
};

DelayedStream.prototype.pause = function() {
  this.source.pause();
};

DelayedStream.prototype.release = function() {
  this._released = true;

  this._bufferedEvents.forEach(function(args) {
    this.emit.apply(this, args);
  }.bind(this));
  this._bufferedEvents = [];
};

DelayedStream.prototype.pipe = function() {
  var r = Stream.prototype.pipe.apply(this, arguments);
  this.resume();
  return r;
};

DelayedStream.prototype._handleEmit = function(args) {
  if (this._released) {
    this.emit.apply(this, args);
    return;
  }

  if (args[0] === 'data') {
    this.dataSize += args[1].length;
    this._checkIfMaxDataSizeExceeded();
  }

  this._bufferedEvents.push(args);
};

DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
  if (this._maxDataSizeExceeded) {
    return;
  }

  if (this.dataSize <= this.maxDataSize) {
    return;
  }

  this._maxDataSizeExceeded = true;
  var message =
    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.'
  this.emit('error', new Error(message));
};


/***/ }),

/***/ 1133:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var debug;

module.exports = function () {
  if (!debug) {
    try {
      /* eslint global-require: off */
      debug = __nccwpck_require__(9975)("follow-redirects");
    }
    catch (error) { /* */ }
    if (typeof debug !== "function") {
      debug = function () { /* */ };
    }
  }
  debug.apply(null, arguments);
};


/***/ }),

/***/ 7707:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var url = __nccwpck_require__(7310);
var URL = url.URL;
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var Writable = (__nccwpck_require__(2781).Writable);
var assert = __nccwpck_require__(9491);
var debug = __nccwpck_require__(1133);

// Create handlers that pass events from native requests
var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
var eventHandlers = Object.create(null);
events.forEach(function (event) {
  eventHandlers[event] = function (arg1, arg2, arg3) {
    this._redirectable.emit(event, arg1, arg2, arg3);
  };
});

var InvalidUrlError = createErrorType(
  "ERR_INVALID_URL",
  "Invalid URL",
  TypeError
);
// Error types with codes
var RedirectionError = createErrorType(
  "ERR_FR_REDIRECTION_FAILURE",
  "Redirected request failed"
);
var TooManyRedirectsError = createErrorType(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded"
);
var MaxBodyLengthExceededError = createErrorType(
  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
  "Request body larger than maxBodyLength limit"
);
var WriteAfterEndError = createErrorType(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
);

// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
  // Initialize the request
  Writable.call(this);
  this._sanitizeOptions(options);
  this._options = options;
  this._ended = false;
  this._ending = false;
  this._redirectCount = 0;
  this._redirects = [];
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];

  // Attach a callback if passed
  if (responseCallback) {
    this.on("response", responseCallback);
  }

  // React to responses of native requests
  var self = this;
  this._onNativeResponse = function (response) {
    self._processResponse(response);
  };

  // Perform the first request
  this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);

RedirectableRequest.prototype.abort = function () {
  abortRequest(this._currentRequest);
  this.emit("abort");
};

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding, callback) {
  // Writing is not allowed if end has been called
  if (this._ending) {
    throw new WriteAfterEndError();
  }

  // Validate input and shift parameters if necessary
  if (!isString(data) && !isBuffer(data)) {
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  }
  if (isFunction(encoding)) {
    callback = encoding;
    encoding = null;
  }

  // Ignore empty buffers, since writing them doesn't invoke the callback
  // https://github.com/nodejs/node/issues/22066
  if (data.length === 0) {
    if (callback) {
      callback();
    }
    return;
  }
  // Only write when we don't exceed the maximum body length
  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data: data, encoding: encoding });
    this._currentRequest.write(data, encoding, callback);
  }
  // Error when we exceed the maximum body length
  else {
    this.emit("error", new MaxBodyLengthExceededError());
    this.abort();
  }
};

// Ends the current native request
RedirectableRequest.prototype.end = function (data, encoding, callback) {
  // Shift parameters if necessary
  if (isFunction(data)) {
    callback = data;
    data = encoding = null;
  }
  else if (isFunction(encoding)) {
    callback = encoding;
    encoding = null;
  }

  // Write data if needed and end
  if (!data) {
    this._ended = this._ending = true;
    this._currentRequest.end(null, null, callback);
  }
  else {
    var self = this;
    var currentRequest = this._currentRequest;
    this.write(data, encoding, function () {
      self._ended = true;
      currentRequest.end(null, null, callback);
    });
    this._ending = true;
  }
};

// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function (name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};

// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function (name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};

// Global timeout for all underlying requests
RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
  var self = this;

  // Destroys the socket on timeout
  function destroyOnTimeout(socket) {
    socket.setTimeout(msecs);
    socket.removeListener("timeout", socket.destroy);
    socket.addListener("timeout", socket.destroy);
  }

  // Sets up a timer to trigger a timeout event
  function startTimer(socket) {
    if (self._timeout) {
      clearTimeout(self._timeout);
    }
    self._timeout = setTimeout(function () {
      self.emit("timeout");
      clearTimer();
    }, msecs);
    destroyOnTimeout(socket);
  }

  // Stops a timeout from triggering
  function clearTimer() {
    // Clear the timeout
    if (self._timeout) {
      clearTimeout(self._timeout);
      self._timeout = null;
    }

    // Clean up all attached listeners
    self.removeListener("abort", clearTimer);
    self.removeListener("error", clearTimer);
    self.removeListener("response", clearTimer);
    if (callback) {
      self.removeListener("timeout", callback);
    }
    if (!self.socket) {
      self._currentRequest.removeListener("socket", startTimer);
    }
  }

  // Attach callback if passed
  if (callback) {
    this.on("timeout", callback);
  }

  // Start the timer if or when the socket is opened
  if (this.socket) {
    startTimer(this.socket);
  }
  else {
    this._currentRequest.once("socket", startTimer);
  }

  // Clean up on events
  this.on("socket", destroyOnTimeout);
  this.on("abort", clearTimer);
  this.on("error", clearTimer);
  this.on("response", clearTimer);

  return this;
};

// Proxy all other public ClientRequest methods
[
  "flushHeaders", "getHeader",
  "setNoDelay", "setSocketKeepAlive",
].forEach(function (method) {
  RedirectableRequest.prototype[method] = function (a, b) {
    return this._currentRequest[method](a, b);
  };
});

// Proxy all public ClientRequest properties
["aborted", "connection", "socket"].forEach(function (property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function () { return this._currentRequest[property]; },
  });
});

RedirectableRequest.prototype._sanitizeOptions = function (options) {
  // Ensure headers are always present
  if (!options.headers) {
    options.headers = {};
  }

  // Since http.request treats host as an alias of hostname,
  // but the url module interprets host as hostname plus port,
  // eliminate the host property to avoid confusion.
  if (options.host) {
    // Use hostname if set, because it has precedence
    if (!options.hostname) {
      options.hostname = options.host;
    }
    delete options.host;
  }

  // Complete the URL object when necessary
  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    }
    else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }
};


// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
  // Load the native protocol
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];
  if (!nativeProtocol) {
    this.emit("error", new TypeError("Unsupported protocol " + protocol));
    return;
  }

  // If specified, use the agent corresponding to the protocol
  // (HTTP and HTTPS use different types of agents)
  if (this._options.agents) {
    var scheme = protocol.slice(0, -1);
    this._options.agent = this._options.agents[scheme];
  }

  // Create the native request and set up its event handlers
  var request = this._currentRequest =
        nativeProtocol.request(this._options, this._onNativeResponse);
  request._redirectable = this;
  for (var event of events) {
    request.on(event, eventHandlers[event]);
  }

  // RFC7230§5.3.1: When making a request directly to an origin server, […]
  // a client MUST send only the absolute path […] as the request-target.
  this._currentUrl = /^\//.test(this._options.path) ?
    url.format(this._options) :
    // When making a request to a proxy, […]
    // a client MUST send the target URI in absolute-form […].
    this._options.path;

  // End a redirected request
  // (The first request must be ended explicitly with RedirectableRequest#end)
  if (this._isRedirect) {
    // Write the request entity and end
    var i = 0;
    var self = this;
    var buffers = this._requestBodyBuffers;
    (function writeNext(error) {
      // Only write if this request has not been redirected yet
      /* istanbul ignore else */
      if (request === self._currentRequest) {
        // Report any write errors
        /* istanbul ignore if */
        if (error) {
          self.emit("error", error);
        }
        // Write the next buffer if there are still left
        else if (i < buffers.length) {
          var buffer = buffers[i++];
          /* istanbul ignore else */
          if (!request.finished) {
            request.write(buffer.data, buffer.encoding, writeNext);
          }
        }
        // End the request if `end` has been called on us
        else if (self._ended) {
          request.end();
        }
      }
    }());
  }
};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
  // Store the redirected response
  var statusCode = response.statusCode;
  if (this._options.trackRedirects) {
    this._redirects.push({
      url: this._currentUrl,
      headers: response.headers,
      statusCode: statusCode,
    });
  }

  // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
  // that further action needs to be taken by the user agent in order to
  // fulfill the request. If a Location header field is provided,
  // the user agent MAY automatically redirect its request to the URI
  // referenced by the Location field value,
  // even if the specific status code is not understood.

  // If the response is not a redirect; return it as-is
  var location = response.headers.location;
  if (!location || this._options.followRedirects === false ||
      statusCode < 300 || statusCode >= 400) {
    response.responseUrl = this._currentUrl;
    response.redirects = this._redirects;
    this.emit("response", response);

    // Clean up
    this._requestBodyBuffers = [];
    return;
  }

  // The response is a redirect, so abort the current request
  abortRequest(this._currentRequest);
  // Discard the remainder of the response to avoid waiting for data
  response.destroy();

  // RFC7231§6.4: A client SHOULD detect and intervene
  // in cyclical redirections (i.e., "infinite" redirection loops).
  if (++this._redirectCount > this._options.maxRedirects) {
    this.emit("error", new TooManyRedirectsError());
    return;
  }

  // Store the request headers if applicable
  var requestHeaders;
  var beforeRedirect = this._options.beforeRedirect;
  if (beforeRedirect) {
    requestHeaders = Object.assign({
      // The Host header was set by nativeProtocol.request
      Host: response.req.getHeader("host"),
    }, this._options.headers);
  }

  // RFC7231§6.4: Automatic redirection needs to done with
  // care for methods not known to be safe, […]
  // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
  // the request method from POST to GET for the subsequent request.
  var method = this._options.method;
  if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" ||
      // RFC7231§6.4.4: The 303 (See Other) status code indicates that
      // the server is redirecting the user agent to a different resource […]
      // A user agent can perform a retrieval request targeting that URI
      // (a GET or HEAD request if using HTTP) […]
      (statusCode === 303) && !/^(?:GET|HEAD)$/.test(this._options.method)) {
    this._options.method = "GET";
    // Drop a possible entity and headers related to it
    this._requestBodyBuffers = [];
    removeMatchingHeaders(/^content-/i, this._options.headers);
  }

  // Drop the Host header, as the redirect might lead to a different host
  var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);

  // If the redirect is relative, carry over the host of the last request
  var currentUrlParts = url.parse(this._currentUrl);
  var currentHost = currentHostHeader || currentUrlParts.host;
  var currentUrl = /^\w+:/.test(location) ? this._currentUrl :
    url.format(Object.assign(currentUrlParts, { host: currentHost }));

  // Determine the URL of the redirection
  var redirectUrl;
  try {
    redirectUrl = url.resolve(currentUrl, location);
  }
  catch (cause) {
    this.emit("error", new RedirectionError({ cause: cause }));
    return;
  }

  // Create the redirected request
  debug("redirecting to", redirectUrl);
  this._isRedirect = true;
  var redirectUrlParts = url.parse(redirectUrl);
  Object.assign(this._options, redirectUrlParts);

  // Drop confidential headers when redirecting to a less secure protocol
  // or to a different domain that is not a superdomain
  if (redirectUrlParts.protocol !== currentUrlParts.protocol &&
     redirectUrlParts.protocol !== "https:" ||
     redirectUrlParts.host !== currentHost &&
     !isSubdomain(redirectUrlParts.host, currentHost)) {
    removeMatchingHeaders(/^(?:authorization|cookie)$/i, this._options.headers);
  }

  // Evaluate the beforeRedirect callback
  if (isFunction(beforeRedirect)) {
    var responseDetails = {
      headers: response.headers,
      statusCode: statusCode,
    };
    var requestDetails = {
      url: currentUrl,
      method: method,
      headers: requestHeaders,
    };
    try {
      beforeRedirect(this._options, responseDetails, requestDetails);
    }
    catch (err) {
      this.emit("error", err);
      return;
    }
    this._sanitizeOptions(this._options);
  }

  // Perform the redirected request
  try {
    this._performRequest();
  }
  catch (cause) {
    this.emit("error", new RedirectionError({ cause: cause }));
  }
};

// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
  // Default settings
  var exports = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024,
  };

  // Wrap each protocol
  var nativeProtocols = {};
  Object.keys(protocols).forEach(function (scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

    // Executes a request, following redirects
    function request(input, options, callback) {
      // Parse parameters
      if (isString(input)) {
        var parsed;
        try {
          parsed = urlToOptions(new URL(input));
        }
        catch (err) {
          /* istanbul ignore next */
          parsed = url.parse(input);
        }
        if (!isString(parsed.protocol)) {
          throw new InvalidUrlError({ input });
        }
        input = parsed;
      }
      else if (URL && (input instanceof URL)) {
        input = urlToOptions(input);
      }
      else {
        callback = options;
        options = input;
        input = { protocol: protocol };
      }
      if (isFunction(options)) {
        callback = options;
        options = null;
      }

      // Set defaults
      options = Object.assign({
        maxRedirects: exports.maxRedirects,
        maxBodyLength: exports.maxBodyLength,
      }, input, options);
      options.nativeProtocols = nativeProtocols;
      if (!isString(options.host) && !isString(options.hostname)) {
        options.hostname = "::1";
      }

      assert.equal(options.protocol, protocol, "protocol mismatch");
      debug("options", options);
      return new RedirectableRequest(options, callback);
    }

    // Executes a GET request, following redirects
    function get(input, options, callback) {
      var wrappedRequest = wrappedProtocol.request(input, options, callback);
      wrappedRequest.end();
      return wrappedRequest;
    }

    // Expose the properties on the wrapped protocol
    Object.defineProperties(wrappedProtocol, {
      request: { value: request, configurable: true, enumerable: true, writable: true },
      get: { value: get, configurable: true, enumerable: true, writable: true },
    });
  });
  return exports;
}

/* istanbul ignore next */
function noop() { /* empty */ }

// from https://github.com/nodejs/node/blob/master/lib/internal/url.js
function urlToOptions(urlObject) {
  var options = {
    protocol: urlObject.protocol,
    hostname: urlObject.hostname.startsWith("[") ?
      /* istanbul ignore next */
      urlObject.hostname.slice(1, -1) :
      urlObject.hostname,
    hash: urlObject.hash,
    search: urlObject.search,
    pathname: urlObject.pathname,
    path: urlObject.pathname + urlObject.search,
    href: urlObject.href,
  };
  if (urlObject.port !== "") {
    options.port = Number(urlObject.port);
  }
  return options;
}

function removeMatchingHeaders(regex, headers) {
  var lastValue;
  for (var header in headers) {
    if (regex.test(header)) {
      lastValue = headers[header];
      delete headers[header];
    }
  }
  return (lastValue === null || typeof lastValue === "undefined") ?
    undefined : String(lastValue).trim();
}

function createErrorType(code, message, baseClass) {
  // Create constructor
  function CustomError(properties) {
    Error.captureStackTrace(this, this.constructor);
    Object.assign(this, properties || {});
    this.code = code;
    this.message = this.cause ? message + ": " + this.cause.message : message;
  }

  // Attach constructor and set default properties
  CustomError.prototype = new (baseClass || Error)();
  CustomError.prototype.constructor = CustomError;
  CustomError.prototype.name = "Error [" + code + "]";
  return CustomError;
}

function abortRequest(request) {
  for (var event of events) {
    request.removeListener(event, eventHandlers[event]);
  }
  request.on("error", noop);
  request.abort();
}

function isSubdomain(subdomain, domain) {
  assert(isString(subdomain) && isString(domain));
  var dot = subdomain.length - domain.length - 1;
  return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
}

function isString(value) {
  return typeof value === "string" || value instanceof String;
}

function isFunction(value) {
  return typeof value === "function";
}

function isBuffer(value) {
  return typeof value === "object" && ("length" in value);
}

// Exports
module.exports = wrap({ http: http, https: https });
module.exports.wrap = wrap;


/***/ }),

/***/ 4334:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var CombinedStream = __nccwpck_require__(5443);
var util = __nccwpck_require__(3837);
var path = __nccwpck_require__(1017);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var parseUrl = (__nccwpck_require__(7310).parse);
var fs = __nccwpck_require__(7147);
var Stream = (__nccwpck_require__(2781).Stream);
var mime = __nccwpck_require__(3583);
var asynckit = __nccwpck_require__(4812);
var populate = __nccwpck_require__(7142);

// Public API
module.exports = FormData;

// make it a Stream
util.inherits(FormData, CombinedStream);

/**
 * Create readable "multipart/form-data" streams.
 * Can be used to submit forms
 * and file uploads to other web applications.
 *
 * @constructor
 * @param {Object} options - Properties to be added/overriden for FormData and CombinedStream
 */
function FormData(options) {
  if (!(this instanceof FormData)) {
    return new FormData(options);
  }

  this._overheadLength = 0;
  this._valueLength = 0;
  this._valuesToMeasure = [];

  CombinedStream.call(this);

  options = options || {};
  for (var option in options) {
    this[option] = options[option];
  }
}

FormData.LINE_BREAK = '\r\n';
FormData.DEFAULT_CONTENT_TYPE = 'application/octet-stream';

FormData.prototype.append = function(field, value, options) {

  options = options || {};

  // allow filename as single option
  if (typeof options == 'string') {
    options = {filename: options};
  }

  var append = CombinedStream.prototype.append.bind(this);

  // all that streamy business can't handle numbers
  if (typeof value == 'number') {
    value = '' + value;
  }

  // https://github.com/felixge/node-form-data/issues/38
  if (util.isArray(value)) {
    // Please convert your array into string
    // the way web server expects it
    this._error(new Error('Arrays are not supported.'));
    return;
  }

  var header = this._multiPartHeader(field, value, options);
  var footer = this._multiPartFooter();

  append(header);
  append(value);
  append(footer);

  // pass along options.knownLength
  this._trackLength(header, value, options);
};

FormData.prototype._trackLength = function(header, value, options) {
  var valueLength = 0;

  // used w/ getLengthSync(), when length is known.
  // e.g. for streaming directly from a remote server,
  // w/ a known file a size, and not wanting to wait for
  // incoming file to finish to get its size.
  if (options.knownLength != null) {
    valueLength += +options.knownLength;
  } else if (Buffer.isBuffer(value)) {
    valueLength = value.length;
  } else if (typeof value === 'string') {
    valueLength = Buffer.byteLength(value);
  }

  this._valueLength += valueLength;

  // @check why add CRLF? does this account for custom/multiple CRLFs?
  this._overheadLength +=
    Buffer.byteLength(header) +
    FormData.LINE_BREAK.length;

  // empty or either doesn't have path or not an http response or not a stream
  if (!value || ( !value.path && !(value.readable && value.hasOwnProperty('httpVersion')) && !(value instanceof Stream))) {
    return;
  }

  // no need to bother with the length
  if (!options.knownLength) {
    this._valuesToMeasure.push(value);
  }
};

FormData.prototype._lengthRetriever = function(value, callback) {

  if (value.hasOwnProperty('fd')) {

    // take read range into a account
    // `end` = Infinity –> read file till the end
    //
    // TODO: Looks like there is bug in Node fs.createReadStream
    // it doesn't respect `end` options without `start` options
    // Fix it when node fixes it.
    // https://github.com/joyent/node/issues/7819
    if (value.end != undefined && value.end != Infinity && value.start != undefined) {

      // when end specified
      // no need to calculate range
      // inclusive, starts with 0
      callback(null, value.end + 1 - (value.start ? value.start : 0));

    // not that fast snoopy
    } else {
      // still need to fetch file size from fs
      fs.stat(value.path, function(err, stat) {

        var fileSize;

        if (err) {
          callback(err);
          return;
        }

        // update final size based on the range options
        fileSize = stat.size - (value.start ? value.start : 0);
        callback(null, fileSize);
      });
    }

  // or http response
  } else if (value.hasOwnProperty('httpVersion')) {
    callback(null, +value.headers['content-length']);

  // or request stream http://github.com/mikeal/request
  } else if (value.hasOwnProperty('httpModule')) {
    // wait till response come back
    value.on('response', function(response) {
      value.pause();
      callback(null, +response.headers['content-length']);
    });
    value.resume();

  // something else
  } else {
    callback('Unknown stream');
  }
};

FormData.prototype._multiPartHeader = function(field, value, options) {
  // custom header specified (as string)?
  // it becomes responsible for boundary
  // (e.g. to handle extra CRLFs on .NET servers)
  if (typeof options.header == 'string') {
    return options.header;
  }

  var contentDisposition = this._getContentDisposition(value, options);
  var contentType = this._getContentType(value, options);

  var contents = '';
  var headers  = {
    // add custom disposition as third element or keep it two elements if not
    'Content-Disposition': ['form-data', 'name="' + field + '"'].concat(contentDisposition || []),
    // if no content type. allow it to be empty array
    'Content-Type': [].concat(contentType || [])
  };

  // allow custom headers.
  if (typeof options.header == 'object') {
    populate(headers, options.header);
  }

  var header;
  for (var prop in headers) {
    if (!headers.hasOwnProperty(prop)) continue;
    header = headers[prop];

    // skip nullish headers.
    if (header == null) {
      continue;
    }

    // convert all headers to arrays.
    if (!Array.isArray(header)) {
      header = [header];
    }

    // add non-empty headers.
    if (header.length) {
      contents += prop + ': ' + header.join('; ') + FormData.LINE_BREAK;
    }
  }

  return '--' + this.getBoundary() + FormData.LINE_BREAK + contents + FormData.LINE_BREAK;
};

FormData.prototype._getContentDisposition = function(value, options) {

  var filename
    , contentDisposition
    ;

  if (typeof options.filepath === 'string') {
    // custom filepath for relative paths
    filename = path.normalize(options.filepath).replace(/\\/g, '/');
  } else if (options.filename || value.name || value.path) {
    // custom filename take precedence
    // formidable and the browser add a name property
    // fs- and request- streams have path property
    filename = path.basename(options.filename || value.name || value.path);
  } else if (value.readable && value.hasOwnProperty('httpVersion')) {
    // or try http response
    filename = path.basename(value.client._httpMessage.path || '');
  }

  if (filename) {
    contentDisposition = 'filename="' + filename + '"';
  }

  return contentDisposition;
};

FormData.prototype._getContentType = function(value, options) {

  // use custom content-type above all
  var contentType = options.contentType;

  // or try `name` from formidable, browser
  if (!contentType && value.name) {
    contentType = mime.lookup(value.name);
  }

  // or try `path` from fs-, request- streams
  if (!contentType && value.path) {
    contentType = mime.lookup(value.path);
  }

  // or if it's http-reponse
  if (!contentType && value.readable && value.hasOwnProperty('httpVersion')) {
    contentType = value.headers['content-type'];
  }

  // or guess it from the filepath or filename
  if (!contentType && (options.filepath || options.filename)) {
    contentType = mime.lookup(options.filepath || options.filename);
  }

  // fallback to the default content type if `value` is not simple value
  if (!contentType && typeof value == 'object') {
    contentType = FormData.DEFAULT_CONTENT_TYPE;
  }

  return contentType;
};

FormData.prototype._multiPartFooter = function() {
  return function(next) {
    var footer = FormData.LINE_BREAK;

    var lastPart = (this._streams.length === 0);
    if (lastPart) {
      footer += this._lastBoundary();
    }

    next(footer);
  }.bind(this);
};

FormData.prototype._lastBoundary = function() {
  return '--' + this.getBoundary() + '--' + FormData.LINE_BREAK;
};

FormData.prototype.getHeaders = function(userHeaders) {
  var header;
  var formHeaders = {
    'content-type': 'multipart/form-data; boundary=' + this.getBoundary()
  };

  for (header in userHeaders) {
    if (userHeaders.hasOwnProperty(header)) {
      formHeaders[header.toLowerCase()] = userHeaders[header];
    }
  }

  return formHeaders;
};

FormData.prototype.setBoundary = function(boundary) {
  this._boundary = boundary;
};

FormData.prototype.getBoundary = function() {
  if (!this._boundary) {
    this._generateBoundary();
  }

  return this._boundary;
};

FormData.prototype.getBuffer = function() {
  var dataBuffer = new Buffer.alloc( 0 );
  var boundary = this.getBoundary();

  // Create the form content. Add Line breaks to the end of data.
  for (var i = 0, len = this._streams.length; i < len; i++) {
    if (typeof this._streams[i] !== 'function') {

      // Add content to the buffer.
      if(Buffer.isBuffer(this._streams[i])) {
        dataBuffer = Buffer.concat( [dataBuffer, this._streams[i]]);
      }else {
        dataBuffer = Buffer.concat( [dataBuffer, Buffer.from(this._streams[i])]);
      }

      // Add break after content.
      if (typeof this._streams[i] !== 'string' || this._streams[i].substring( 2, boundary.length + 2 ) !== boundary) {
        dataBuffer = Buffer.concat( [dataBuffer, Buffer.from(FormData.LINE_BREAK)] );
      }
    }
  }

  // Add the footer and return the Buffer object.
  return Buffer.concat( [dataBuffer, Buffer.from(this._lastBoundary())] );
};

FormData.prototype._generateBoundary = function() {
  // This generates a 50 character boundary similar to those used by Firefox.
  // They are optimized for boyer-moore parsing.
  var boundary = '--------------------------';
  for (var i = 0; i < 24; i++) {
    boundary += Math.floor(Math.random() * 10).toString(16);
  }

  this._boundary = boundary;
};

// Note: getLengthSync DOESN'T calculate streams length
// As workaround one can calculate file size manually
// and add it as knownLength option
FormData.prototype.getLengthSync = function() {
  var knownLength = this._overheadLength + this._valueLength;

  // Don't get confused, there are 3 "internal" streams for each keyval pair
  // so it basically checks if there is any value added to the form
  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }

  // https://github.com/form-data/form-data/issues/40
  if (!this.hasKnownLength()) {
    // Some async length retrievers are present
    // therefore synchronous length calculation is false.
    // Please use getLength(callback) to get proper length
    this._error(new Error('Cannot calculate proper length in synchronous way.'));
  }

  return knownLength;
};

// Public API to check if length of added values is known
// https://github.com/form-data/form-data/issues/196
// https://github.com/form-data/form-data/issues/262
FormData.prototype.hasKnownLength = function() {
  var hasKnownLength = true;

  if (this._valuesToMeasure.length) {
    hasKnownLength = false;
  }

  return hasKnownLength;
};

FormData.prototype.getLength = function(cb) {
  var knownLength = this._overheadLength + this._valueLength;

  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }

  if (!this._valuesToMeasure.length) {
    process.nextTick(cb.bind(this, null, knownLength));
    return;
  }

  asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
    if (err) {
      cb(err);
      return;
    }

    values.forEach(function(length) {
      knownLength += length;
    });

    cb(null, knownLength);
  });
};

FormData.prototype.submit = function(params, cb) {
  var request
    , options
    , defaults = {method: 'post'}
    ;

  // parse provided url if it's string
  // or treat it as options object
  if (typeof params == 'string') {

    params = parseUrl(params);
    options = populate({
      port: params.port,
      path: params.pathname,
      host: params.hostname,
      protocol: params.protocol
    }, defaults);

  // use custom params
  } else {

    options = populate(params, defaults);
    // if no port provided use default one
    if (!options.port) {
      options.port = options.protocol == 'https:' ? 443 : 80;
    }
  }

  // put that good code in getHeaders to some use
  options.headers = this.getHeaders(params.headers);

  // https if specified, fallback to http in any other case
  if (options.protocol == 'https:') {
    request = https.request(options);
  } else {
    request = http.request(options);
  }

  // get content length and fire away
  this.getLength(function(err, length) {
    if (err && err !== 'Unknown stream') {
      this._error(err);
      return;
    }

    // add content length
    if (length) {
      request.setHeader('Content-Length', length);
    }

    this.pipe(request);
    if (cb) {
      var onResponse;

      var callback = function (error, responce) {
        request.removeListener('error', callback);
        request.removeListener('response', onResponse);

        return cb.call(this, error, responce);
      };

      onResponse = callback.bind(this, null);

      request.on('error', callback);
      request.on('response', onResponse);
    }
  }.bind(this));

  return request;
};

FormData.prototype._error = function(err) {
  if (!this.error) {
    this.error = err;
    this.pause();
    this.emit('error', err);
  }
};

FormData.prototype.toString = function () {
  return '[object FormData]';
};


/***/ }),

/***/ 7142:
/***/ ((module) => {

// populates missing values
module.exports = function(dst, src) {

  Object.keys(src).forEach(function(prop)
  {
    dst[prop] = dst[prop] || src[prop];
  });

  return dst;
};


/***/ }),

/***/ 69:
/***/ ((module) => {

module.exports = [
    {"name":"Abkhaz", "local":"Аҧсуа", "1":"ab", "2":"abk", "2T":"abk", "2B":"abk", "3":"abk"},
    {"name":"Afar", "local":"Afaraf", "1":"aa", "2":"aar", "2T":"aar", "2B":"aar", "3":"aar"},
    {"name":"Afrikaans", "local":"Afrikaans", "1":"af", "2":"afr", "2T":"afr", "2B":"afr", "3":"afr"},
    {"name":"Akan", "local":"Akan", "1":"ak", "2":"aka", "2T":"aka", "2B":"aka", "3":"aka"},
    {"name":"Albanian", "local":"Shqip", "1":"sq", "2":"sqi", "2T":"sqi", "2B":"alb", "3":"sqi"},
    {"name":"Amharic", "local":"አማርኛ", "1":"am", "2":"amh", "2T":"amh", "2B":"amh", "3":"amh"},
    {"name":"Arabic", "local":"العربية", "1":"ar", "2":"ara", "2T":"ara", "2B":"ara", "3":"ara"},
    {"name":"Aragonese", "local":"Aragonés", "1":"an", "2":"arg", "2T":"arg", "2B":"arg", "3":"arg"},
    {"name":"Armenian", "local":"Հայերեն", "1":"hy", "2":"hye", "2T":"hye", "2B":"arm", "3":"hye"},
    {"name":"Assamese", "local":"অসমীয়া", "1":"as", "2":"asm", "2T":"asm", "2B":"asm", "3":"asm"},
    {"name":"Avaric", "local":"Авар", "1":"av", "2":"ava", "2T":"ava", "2B":"ava", "3":"ava"},
    {"name":"Avestan", "local":"avesta", "1":"ae", "2":"ave", "2T":"ave", "2B":"ave", "3":"ave"},
    {"name":"Aymara", "local":"Aymar", "1":"ay", "2":"aym", "2T":"aym", "2B":"aym", "3":"aym"},
    {"name":"Azerbaijani", "local":"Azərbaycanca", "1":"az", "2":"aze", "2T":"aze", "2B":"aze", "3":"aze"},
    {"name":"Bambara", "local":"Bamanankan", "1":"bm", "2":"bam", "2T":"bam", "2B":"bam", "3":"bam"},
    {"name":"Bashkir", "local":"Башҡортса", "1":"ba", "2":"bak", "2T":"bak", "2B":"bak", "3":"bak"},
    {"name":"Basque", "local":"Euskara", "1":"eu", "2":"eus", "2T":"eus", "2B":"baq", "3":"eus"},
    {"name":"Belarusian", "local":"Беларуская", "1":"be", "2":"bel", "2T":"bel", "2B":"bel", "3":"bel"},
    {"name":"Bengali", "local":"বাংলা", "1":"bn", "2":"ben", "2T":"ben", "2B":"ben", "3":"ben"},
    {"name":"Bihari", "local":"भोजपुरी", "1":"bh", "2":"bih", "2T":"bih", "2B":"bih", "3":"bih"},
    {"name":"Bislama", "local":"Bislama", "1":"bi", "2":"bis", "2T":"bis", "2B":"bis", "3":"bis"},
    {"name":"Bosnian", "local":"Bosanski", "1":"bs", "2":"bos", "2T":"bos", "2B":"bos", "3":"bos"},
    {"name":"Breton", "local":"Brezhoneg", "1":"br", "2":"bre", "2T":"bre", "2B":"bre", "3":"bre"},
    {"name":"Bulgarian", "local":"Български", "1":"bg", "2":"bul", "2T":"bul", "2B":"bul", "3":"bul"},
    {"name":"Burmese", "local":"မြန်မာဘာသာ", "1":"my", "2":"mya", "2T":"mya", "2B":"bur", "3":"mya"},
    {"name":"Catalan", "local":"Català", "1":"ca", "2":"cat", "2T":"cat", "2B":"cat", "3":"cat"},
    {"name":"Chamorro", "local":"Chamoru", "1":"ch", "2":"cha", "2T":"cha", "2B":"cha", "3":"cha"},
    {"name":"Chechen", "local":"Нохчийн", "1":"ce", "2":"che", "2T":"che", "2B":"che", "3":"che"},
    {"name":"Chichewa", "local":"Chichewa", "1":"ny", "2":"nya", "2T":"nya", "2B":"nya", "3":"nya"},
    {"name":"Chinese", "local":"中文", "1":"zh", "2":"zho", "2T":"zho", "2B":"chi", "3":"zho"},
    {"name":"Chuvash", "local":"Чӑвашла", "1":"cv", "2":"chv", "2T":"chv", "2B":"chv", "3":"chv"},
    {"name":"Cornish", "local":"Kernewek", "1":"kw", "2":"cor", "2T":"cor", "2B":"cor", "3":"cor"},
    {"name":"Corsican", "local":"Corsu", "1":"co", "2":"cos", "2T":"cos", "2B":"cos", "3":"cos"},
    {"name":"Cree", "local":"ᓀᐦᐃᔭᐍᐏᐣ", "1":"cr", "2":"cre", "2T":"cre", "2B":"cre", "3":"cre"},
    {"name":"Croatian", "local":"Hrvatski", "1":"hr", "2":"hrv", "2T":"hrv", "2B":"hrv", "3":"hrv"},
    {"name":"Czech", "local":"Čeština", "1":"cs", "2":"ces", "2T":"ces", "2B":"cze", "3":"ces"},
    {"name":"Danish", "local":"Dansk", "1":"da", "2":"dan", "2T":"dan", "2B":"dan", "3":"dan"},
    {"name":"Divehi", "local":"Divehi", "1":"dv", "2":"div", "2T":"div", "2B":"div", "3":"div"},
    {"name":"Dutch", "local":"Nederlands", "1":"nl", "2":"nld", "2T":"nld", "2B":"dut", "3":"nld"},
    {"name":"Dzongkha", "local":"རྫོང་ཁ", "1":"dz", "2":"dzo", "2T":"dzo", "2B":"dzo", "3":"dzo"},
    {"name":"English", "local":"English", "1":"en", "2":"eng", "2T":"eng", "2B":"eng", "3":"eng"},
    {"name":"Esperanto", "local":"Esperanto", "1":"eo", "2":"epo", "2T":"epo", "2B":"epo", "3":"epo"},
    {"name":"Estonian", "local":"Eesti", "1":"et", "2":"est", "2T":"est", "2B":"est", "3":"est"},
    {"name":"Ewe", "local":"Eʋegbe", "1":"ee", "2":"ewe", "2T":"ewe", "2B":"ewe", "3":"ewe"},
    {"name":"Faroese", "local":"Føroyskt", "1":"fo", "2":"fao", "2T":"fao", "2B":"fao", "3":"fao"},
    {"name":"Fijian", "local":"Na Vosa Vaka-Viti", "1":"fj", "2":"fij", "2T":"fij", "2B":"fij", "3":"fij"},
    {"name":"Finnish", "local":"Suomi", "1":"fi", "2":"fin", "2T":"fin", "2B":"fin", "3":"fin"},
    {"name":"French", "local":"Français", "1":"fr", "2":"fra", "2T":"fra", "2B":"fre", "3":"fra"},
    {"name":"Fula", "local":"Fulfulde", "1":"ff", "2":"ful", "2T":"ful", "2B":"ful", "3":"ful"},
    {"name":"Galician", "local":"Galego", "1":"gl", "2":"glg", "2T":"glg", "2B":"glg", "3":"glg"},
    {"name":"Georgian", "local":"ქართული", "1":"ka", "2":"kat", "2T":"kat", "2B":"geo", "3":"kat"},
    {"name":"German", "local":"Deutsch", "1":"de", "2":"deu", "2T":"deu", "2B":"ger", "3":"deu"},
    {"name":"Greek", "local":"Ελληνικά", "1":"el", "2":"ell", "2T":"ell", "2B":"gre", "3":"ell"},
    {"name":"Guaraní", "local":"Avañe'ẽ", "1":"gn", "2":"grn", "2T":"grn", "2B":"grn", "3":"grn"},
    {"name":"Gujarati", "local":"ગુજરાતી", "1":"gu", "2":"guj", "2T":"guj", "2B":"guj", "3":"guj"},
    {"name":"Haitian", "local":"Kreyòl Ayisyen", "1":"ht", "2":"hat", "2T":"hat", "2B":"hat", "3":"hat"},
    {"name":"Hausa", "local":"هَوُسَ", "1":"ha", "2":"hau", "2T":"hau", "2B":"hau", "3":"hau"},
    {"name":"Hebrew", "local":"עברית", "1":"he", "2":"heb", "2T":"heb", "2B":"heb", "3":"heb"},
    {"name":"Herero", "local":"Otjiherero", "1":"hz", "2":"her", "2T":"her", "2B":"her", "3":"her"},
    {"name":"Hindi", "local":"हिन्दी", "1":"hi", "2":"hin", "2T":"hin", "2B":"hin", "3":"hin"},
    {"name":"Hiri Motu", "local":"Hiri Motu", "1":"ho", "2":"hmo", "2T":"hmo", "2B":"hmo", "3":"hmo"},
    {"name":"Hungarian", "local":"Magyar", "1":"hu", "2":"hun", "2T":"hun", "2B":"hun", "3":"hun"},
    {"name":"Interlingua", "local":"Interlingua", "1":"ia", "2":"ina", "2T":"ina", "2B":"ina", "3":"ina"},
    {"name":"Indonesian", "local":"Bahasa Indonesia", "1":"id", "2":"ind", "2T":"ind", "2B":"ind", "3":"ind"},
    {"name":"Interlingue", "local":"Interlingue", "1":"ie", "2":"ile", "2T":"ile", "2B":"ile", "3":"ile"},
    {"name":"Irish", "local":"Gaeilge", "1":"ga", "2":"gle", "2T":"gle", "2B":"gle", "3":"gle"},
    {"name":"Igbo", "local":"Igbo", "1":"ig", "2":"ibo", "2T":"ibo", "2B":"ibo", "3":"ibo"},
    {"name":"Inupiaq", "local":"Iñupiak", "1":"ik", "2":"ipk", "2T":"ipk", "2B":"ipk", "3":"ipk"},
    {"name":"Ido", "local":"Ido", "1":"io", "2":"ido", "2T":"ido", "2B":"ido", "3":"ido"},
    {"name":"Icelandic", "local":"Íslenska", "1":"is", "2":"isl", "2T":"isl", "2B":"ice", "3":"isl"},
    {"name":"Italian", "local":"Italiano", "1":"it", "2":"ita", "2T":"ita", "2B":"ita", "3":"ita"},
    {"name":"Inuktitut", "local":"ᐃᓄᒃᑎᑐᑦ", "1":"iu", "2":"iku", "2T":"iku", "2B":"iku", "3":"iku"},
    {"name":"Japanese", "local":"日本語", "1":"ja", "2":"jpn", "2T":"jpn", "2B":"jpn", "3":"jpn"},
    {"name":"Javanese", "local":"Basa Jawa", "1":"jv", "2":"jav", "2T":"jav", "2B":"jav", "3":"jav"},
    {"name":"Kalaallisut", "local":"Kalaallisut", "1":"kl", "2":"kal", "2T":"kal", "2B":"kal", "3":"kal"},
    {"name":"Kannada", "local":"ಕನ್ನಡ", "1":"kn", "2":"kan", "2T":"kan", "2B":"kan", "3":"kan"},
    {"name":"Kanuri", "local":"Kanuri", "1":"kr", "2":"kau", "2T":"kau", "2B":"kau", "3":"kau"},
    {"name":"Kashmiri", "local":"كشميري", "1":"ks", "2":"kas", "2T":"kas", "2B":"kas", "3":"kas"},
    {"name":"Kazakh", "local":"Қазақша", "1":"kk", "2":"kaz", "2T":"kaz", "2B":"kaz", "3":"kaz"},
    {"name":"Khmer", "local":"ភាសាខ្មែរ", "1":"km", "2":"khm", "2T":"khm", "2B":"khm", "3":"khm"},
    {"name":"Kikuyu", "local":"Gĩkũyũ", "1":"ki", "2":"kik", "2T":"kik", "2B":"kik", "3":"kik"},
    {"name":"Kinyarwanda", "local":"Kinyarwanda", "1":"rw", "2":"kin", "2T":"kin", "2B":"kin", "3":"kin"},
    {"name":"Kyrgyz", "local":"Кыргызча", "1":"ky", "2":"kir", "2T":"kir", "2B":"kir", "3":"kir"},
    {"name":"Komi", "local":"Коми", "1":"kv", "2":"kom", "2T":"kom", "2B":"kom", "3":"kom"},
    {"name":"Kongo", "local":"Kongo", "1":"kg", "2":"kon", "2T":"kon", "2B":"kon", "3":"kon"},
    {"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"},
    {"name":"Kurdish", "local":"Kurdî", "1":"ku", "2":"kur", "2T":"kur", "2B":"kur", "3":"kur"},
    {"name":"Kwanyama", "local":"Kuanyama", "1":"kj", "2":"kua", "2T":"kua", "2B":"kua", "3":"kua"},
    {"name":"Latin", "local":"Latina", "1":"la", "2":"lat", "2T":"lat", "2B":"lat", "3":"lat"},
    {"name":"Luxembourgish", "local":"Lëtzebuergesch", "1":"lb", "2":"ltz", "2T":"ltz", "2B":"ltz", "3":"ltz"},
    {"name":"Ganda", "local":"Luganda", "1":"lg", "2":"lug", "2T":"lug", "2B":"lug", "3":"lug"},
    {"name":"Limburgish", "local":"Limburgs", "1":"li", "2":"lim", "2T":"lim", "2B":"lim", "3":"lim"},
    {"name":"Lingala", "local":"Lingála", "1":"ln", "2":"lin", "2T":"lin", "2B":"lin", "3":"lin"},
    {"name":"Lao", "local":"ພາສາລາວ", "1":"lo", "2":"lao", "2T":"lao", "2B":"lao", "3":"lao"},
    {"name":"Lithuanian", "local":"Lietuvių", "1":"lt", "2":"lit", "2T":"lit", "2B":"lit", "3":"lit"},
    {"name":"Luba-Katanga", "local":"Tshiluba", "1":"lu", "2":"lub", "2T":"lub", "2B":"lub", "3":"lub"},
    {"name":"Latvian", "local":"Latviešu", "1":"lv", "2":"lav", "2T":"lav", "2B":"lav", "3":"lav"},
    {"name":"Manx", "local":"Gaelg", "1":"gv", "2":"glv", "2T":"glv", "2B":"glv", "3":"glv"},
    {"name":"Macedonian", "local":"Македонски", "1":"mk", "2":"mkd", "2T":"mkd", "2B":"mac", "3":"mkd"},
    {"name":"Malagasy", "local":"Malagasy", "1":"mg", "2":"mlg", "2T":"mlg", "2B":"mlg", "3":"mlg"},
    {"name":"Malay", "local":"Bahasa Melayu", "1":"ms", "2":"msa", "2T":"msa", "2B":"may", "3":"msa"},
    {"name":"Malayalam", "local":"മലയാളം", "1":"ml", "2":"mal", "2T":"mal", "2B":"mal", "3":"mal"},
    {"name":"Maltese", "local":"Malti", "1":"mt", "2":"mlt", "2T":"mlt", "2B":"mlt", "3":"mlt"},
    {"name":"Māori", "local":"Māori", "1":"mi", "2":"mri", "2T":"mri", "2B":"mao", "3":"mri"},
    {"name":"Marathi", "local":"मराठी", "1":"mr", "2":"mar", "2T":"mar", "2B":"mar", "3":"mar"},
    {"name":"Marshallese", "local":"Kajin M̧ajeļ", "1":"mh", "2":"mah", "2T":"mah", "2B":"mah", "3":"mah"},
    {"name":"Mongolian", "local":"Монгол", "1":"mn", "2":"mon", "2T":"mon", "2B":"mon", "3":"mon"},
    {"name":"Nauru", "local":"Dorerin Naoero", "1":"na", "2":"nau", "2T":"nau", "2B":"nau", "3":"nau"},
    {"name":"Navajo", "local":"Diné Bizaad", "1":"nv", "2":"nav", "2T":"nav", "2B":"nav", "3":"nav"},
    {"name":"Northern Ndebele", "local":"isiNdebele", "1":"nd", "2":"nde", "2T":"nde", "2B":"nde", "3":"nde"},
    {"name":"Nepali", "local":"नेपाली", "1":"ne", "2":"nep", "2T":"nep", "2B":"nep", "3":"nep"},
    {"name":"Ndonga", "local":"Owambo", "1":"ng", "2":"ndo", "2T":"ndo", "2B":"ndo", "3":"ndo"},
    {"name":"Norwegian Bokmål", "local":"Norsk (Bokmål)", "1":"nb", "2":"nob", "2T":"nob", "2B":"nob", "3":"nob"},
    {"name":"Norwegian Nynorsk", "local":"Norsk (Nynorsk)", "1":"nn", "2":"nno", "2T":"nno", "2B":"nno", "3":"nno"},
    {"name":"Norwegian", "local":"Norsk", "1":"no", "2":"nor", "2T":"nor", "2B":"nor", "3":"nor"},
    {"name":"Nuosu", "local":"ꆈꌠ꒿ Nuosuhxop", "1":"ii", "2":"iii", "2T":"iii", "2B":"iii", "3":"iii"},
    {"name":"Southern Ndebele", "local":"isiNdebele", "1":"nr", "2":"nbl", "2T":"nbl", "2B":"nbl", "3":"nbl"},
    {"name":"Occitan", "local":"Occitan", "1":"oc", "2":"oci", "2T":"oci", "2B":"oci", "3":"oci"},
    {"name":"Ojibwe", "local":"ᐊᓂᔑᓈᐯᒧᐎᓐ", "1":"oj", "2":"oji", "2T":"oji", "2B":"oji", "3":"oji"},
    {"name":"Old Church Slavonic", "local":"Словѣ́ньскъ", "1":"cu", "2":"chu", "2T":"chu", "2B":"chu", "3":"chu"},
    {"name":"Oromo", "local":"Afaan Oromoo", "1":"om", "2":"orm", "2T":"orm", "2B":"orm", "3":"orm"},
    {"name":"Oriya", "local":"ଓଡି଼ଆ", "1":"or", "2":"ori", "2T":"ori", "2B":"ori", "3":"ori"},
    {"name":"Ossetian", "local":"Ирон æвзаг", "1":"os", "2":"oss", "2T":"oss", "2B":"oss", "3":"oss"},
    {"name":"Panjabi", "local":"ਪੰਜਾਬੀ", "1":"pa", "2":"pan", "2T":"pan", "2B":"pan", "3":"pan"},
    {"name":"Pāli", "local":"पाऴि", "1":"pi", "2":"pli", "2T":"pli", "2B":"pli", "3":"pli"},
    {"name":"Persian", "local":"فارسی", "1":"fa", "2":"fas", "2T":"fas", "2B":"per", "3":"fas"},
    {"name":"Polish", "local":"Polski", "1":"pl", "2":"pol", "2T":"pol", "2B":"pol", "3":"pol"},
    {"name":"Pashto", "local":"پښتو", "1":"ps", "2":"pus", "2T":"pus", "2B":"pus", "3":"pus"},
    {"name":"Portuguese", "local":"Português", "1":"pt", "2":"por", "2T":"por", "2B":"por", "3":"por"},
    {"name":"Quechua", "local":"Runa Simi", "1":"qu", "2":"que", "2T":"que", "2B":"que", "3":"que"},
    {"name":"Romansh", "local":"Rumantsch", "1":"rm", "2":"roh", "2T":"roh", "2B":"roh", "3":"roh"},
    {"name":"Kirundi", "local":"Kirundi", "1":"rn", "2":"run", "2T":"run", "2B":"run", "3":"run"},
    {"name":"Romanian", "local":"Română", "1":"ro", "2":"ron", "2T":"ron", "2B":"rum", "3":"ron"},
    {"name":"Russian", "local":"Русский", "1":"ru", "2":"rus", "2T":"rus", "2B":"rus", "3":"rus"},
    {"name":"Sanskrit", "local":"संस्कृतम्", "1":"sa", "2":"san", "2T":"san", "2B":"san", "3":"san"},
    {"name":"Sardinian", "local":"Sardu", "1":"sc", "2":"srd", "2T":"srd", "2B":"srd", "3":"srd"},
    {"name":"Sindhi", "local":"سنڌي‎", "1":"sd", "2":"snd", "2T":"snd", "2B":"snd", "3":"snd"},
    {"name":"Northern Sami", "local":"Sámegiella", "1":"se", "2":"sme", "2T":"sme", "2B":"sme", "3":"sme"},
    {"name":"Samoan", "local":"Gagana Sāmoa", "1":"sm", "2":"smo", "2T":"smo", "2B":"smo", "3":"smo"},
    {"name":"Sango", "local":"Sängö", "1":"sg", "2":"sag", "2T":"sag", "2B":"sag", "3":"sag"},
    {"name":"Serbian", "local":"Српски", "1":"sr", "2":"srp", "2T":"srp", "2B":"srp", "3":"srp"},
    {"name":"Gaelic", "local":"Gàidhlig", "1":"gd", "2":"gla", "2T":"gla", "2B":"gla", "3":"gla"},
    {"name":"Shona", "local":"ChiShona", "1":"sn", "2":"sna", "2T":"sna", "2B":"sna", "3":"sna"},
    {"name":"Sinhala", "local":"සිංහල", "1":"si", "2":"sin", "2T":"sin", "2B":"sin", "3":"sin"},
    {"name":"Slovak", "local":"Slovenčina", "1":"sk", "2":"slk", "2T":"slk", "2B":"slo", "3":"slk"},
    {"name":"Slovene", "local":"Slovenščina", "1":"sl", "2":"slv", "2T":"slv", "2B":"slv", "3":"slv"},
    {"name":"Somali", "local":"Soomaaliga", "1":"so", "2":"som", "2T":"som", "2B":"som", "3":"som"},
    {"name":"Southern Sotho", "local":"Sesotho", "1":"st", "2":"sot", "2T":"sot", "2B":"sot", "3":"sot"},
    {"name":"Spanish", "local":"Español", "1":"es", "2":"spa", "2T":"spa", "2B":"spa", "3":"spa"},
    {"name":"Sundanese", "local":"Basa Sunda", "1":"su", "2":"sun", "2T":"sun", "2B":"sun", "3":"sun"},
    {"name":"Swahili", "local":"Kiswahili", "1":"sw", "2":"swa", "2T":"swa", "2B":"swa", "3":"swa"},
    {"name":"Swati", "local":"SiSwati", "1":"ss", "2":"ssw", "2T":"ssw", "2B":"ssw", "3":"ssw"},
    {"name":"Swedish", "local":"Svenska", "1":"sv", "2":"swe", "2T":"swe", "2B":"swe", "3":"swe"},
    {"name":"Tamil", "local":"தமிழ்", "1":"ta", "2":"tam", "2T":"tam", "2B":"tam", "3":"tam"},
    {"name":"Telugu", "local":"తెలుగు", "1":"te", "2":"tel", "2T":"tel", "2B":"tel", "3":"tel"},
    {"name":"Tajik", "local":"Тоҷикӣ", "1":"tg", "2":"tgk", "2T":"tgk", "2B":"tgk", "3":"tgk"},
    {"name":"Thai", "local":"ภาษาไทย", "1":"th", "2":"tha", "2T":"tha", "2B":"tha", "3":"tha"},
    {"name":"Tigrinya", "local":"ትግርኛ", "1":"ti", "2":"tir", "2T":"tir", "2B":"tir", "3":"tir"},
    {"name":"Tibetan Standard", "local":"བོད་ཡིག", "1":"bo", "2":"bod", "2T":"bod", "2B":"tib", "3":"bod"},
    {"name":"Turkmen", "local":"Türkmençe", "1":"tk", "2":"tuk", "2T":"tuk", "2B":"tuk", "3":"tuk"},
    {"name":"Tagalog", "local":"Tagalog", "1":"tl", "2":"tgl", "2T":"tgl", "2B":"tgl", "3":"tgl"},
    {"name":"Tswana", "local":"Setswana", "1":"tn", "2":"tsn", "2T":"tsn", "2B":"tsn", "3":"tsn"},
    {"name":"Tonga", "local":"faka Tonga", "1":"to", "2":"ton", "2T":"ton", "2B":"ton", "3":"ton"},
    {"name":"Turkish", "local":"Türkçe", "1":"tr", "2":"tur", "2T":"tur", "2B":"tur", "3":"tur"},
    {"name":"Tsonga", "local":"Xitsonga", "1":"ts", "2":"tso", "2T":"tso", "2B":"tso", "3":"tso"},
    {"name":"Tatar", "local":"Татарча", "1":"tt", "2":"tat", "2T":"tat", "2B":"tat", "3":"tat"},
    {"name":"Twi", "local":"Twi", "1":"tw", "2":"twi", "2T":"twi", "2B":"twi", "3":"twi"},
    {"name":"Tahitian", "local":"Reo Mā’ohi", "1":"ty", "2":"tah", "2T":"tah", "2B":"tah", "3":"tah"},
    {"name":"Uyghur", "local":"ئۇيغۇرچه", "1":"ug", "2":"uig", "2T":"uig", "2B":"uig", "3":"uig"},
    {"name":"Ukrainian", "local":"Українська", "1":"uk", "2":"ukr", "2T":"ukr", "2B":"ukr", "3":"ukr"},
    {"name":"Urdu", "local":"اردو", "1":"ur", "2":"urd", "2T":"urd", "2B":"urd", "3":"urd"},
    {"name":"Uzbek", "local":"O‘zbek", "1":"uz", "2":"uzb", "2T":"uzb", "2B":"uzb", "3":"uzb"},
    {"name":"Venda", "local":"Tshivenḓa", "1":"ve", "2":"ven", "2T":"ven", "2B":"ven", "3":"ven"},
    {"name":"Vietnamese", "local":"Tiếng Việt", "1":"vi", "2":"vie", "2T":"vie", "2B":"vie", "3":"vie"},
    {"name":"Volapük", "local":"Volapük", "1":"vo", "2":"vol", "2T":"vol", "2B":"vol", "3":"vol"},
    {"name":"Walloon", "local":"Walon", "1":"wa", "2":"wln", "2T":"wln", "2B":"wln", "3":"wln"},
    {"name":"Welsh", "local":"Cymraeg", "1":"cy", "2":"cym", "2T":"cym", "2B":"wel", "3":"cym"},
    {"name":"Wolof", "local":"Wolof", "1":"wo", "2":"wol", "2T":"wol", "2B":"wol", "3":"wol"},
    {"name":"Western Frisian", "local":"Frysk", "1":"fy", "2":"fry", "2T":"fry", "2B":"fry", "3":"fry"},
    {"name":"Xhosa", "local":"isiXhosa", "1":"xh", "2":"xho", "2T":"xho", "2B":"xho", "3":"xho"},
    {"name":"Yiddish", "local":"ייִדיש", "1":"yi", "2":"yid", "2T":"yid", "2B":"yid", "3":"yid"},
    {"name":"Yoruba", "local":"Yorùbá", "1":"yo", "2":"yor", "2T":"yor", "2B":"yor", "3":"yor"},
    {"name":"Zhuang", "local":"Cuengh", "1":"za", "2":"zha", "2T":"zha", "2B":"zha", "3":"zha"},
    {"name":"Zulu", "local":"isiZulu", "1":"zu", "2":"zul", "2T":"zul", "2B":"zul", "3":"zul"}
];


/***/ }),

/***/ 2494:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var data = __nccwpck_require__(69);

var langs = {
    all:   allLanguages,
    has:   hasLanguage,
    codes: getCodes,
    names: getNames,
    where: findBy
};

module.exports = langs;

// allLanguages :: -> Language[]
function allLanguages() {
    return data;
}

// hasLanguage :: String, String -> Boolean
function hasLanguage(crit, val) {
    return void(0) !== findBy(crit, val);
}

// getCodes :: String -> String[]
function getCodes(type) {
    if (isValidType(type)) {
        return forAll(data, function getCodesIterator(row) {
            return row[type];
        });
    }
}

// getNames :: Boolean -> String[]
function getNames(local) {
    return forAll(data, function getNamesIterator(row) {
        return local ? row.local : row.name;
    });
}

// findBy :: String, String -> Language
function findBy(crit, val) {
    for (var i = 0; i < data.length; i++) {
        if (val === data[i][crit]) {
            return data[i];
        }
    }
}

// forAll :: Array, Function -> Array
function forAll(arr, fn) {
    var out = [], i;
    for (i = 0; i < arr.length; i++) {
        out.push(fn(arr[i], i));
    }

    return out;
}

// isValidType :: String -> Boolean
function isValidType(type) {
    var types = [1, 2, 3, '1', '2', '2B', '2T', '3'];
    return -1 !== types.indexOf(type);
}


/***/ }),

/***/ 3188:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const lcid = __nccwpck_require__(7770)
const iso = __nccwpck_require__(4818)
const langs = (__nccwpck_require__(2494).all)()

const all = []

let lcidLanguage
let isoLanguage

const lcidKeys = Object.keys(lcid)
const isoKeys = Object.keys(iso)

lcidKeys.map(id => {
	lcidLanguage = id
	const locale = {
		name: lcid[lcidLanguage].language,
		local: null,
		location: lcid[lcidLanguage].location,
		tag: lcid[lcidLanguage].tag,
		lcid: lcid[lcidLanguage].id,
		'iso639-2': null,
		'iso639-1': null
	}

	isoLanguage = isoKeys.find(name => name.toLowerCase() === lcid[lcidLanguage].language.toLowerCase())
	if (isoLanguage) {
		locale['iso639-2'] = iso[isoLanguage]['iso639-2']
		locale['iso639-1'] = iso[isoLanguage]['iso639-1']

		const nameLocal = langs.find(element => {
			if (element['2T']) {
				return element['2T'].toLowerCase() === locale['iso639-2']
			}

			return false
		})

		if (nameLocal) {
			locale.local = nameLocal.local
		}
	}

	all.push(locale)
})

const where = (key = 'name', text = '') => {
	if (key === 'lcid') {
		return all.find(element => element[key] === text)
	}

	return all.find(element => element[key].toLowerCase() === text.toLowerCase())
}

const getByName = text => where('name', text)

const getByNameLocal = text => where('local', text)

const getByLocation = text => where('location', text)

const getByTag = text => where('tag', text)

const getByLCID = id => where('lcid', Number(id))

const getByISO6392 = text => where('iso639-2', text)

const getByISO6391 = text => where('iso639-1', text)

module.exports = {
	all,
	where,
	getByName,
	getByNameLocal,
	getByLocation,
	getByTag,
	getByLCID,
	getByISO6392,
	getByISO6391
}


/***/ }),

/***/ 7426:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 */

module.exports = __nccwpck_require__(3765)


/***/ }),

/***/ 3583:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var db = __nccwpck_require__(7426)
var extname = (__nccwpck_require__(1017).extname)

/**
 * Module variables.
 * @private
 */

var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/
var TEXT_TYPE_REGEXP = /^text\//i

/**
 * Module exports.
 * @public
 */

exports.charset = charset
exports.charsets = { lookup: charset }
exports.contentType = contentType
exports.extension = extension
exports.extensions = Object.create(null)
exports.lookup = lookup
exports.types = Object.create(null)

// Populate the extensions/types maps
populateMaps(exports.extensions, exports.types)

/**
 * Get the default charset for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function charset (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = EXTRACT_TYPE_REGEXP.exec(type)
  var mime = match && db[match[1].toLowerCase()]

  if (mime && mime.charset) {
    return mime.charset
  }

  // default text/* to utf-8
  if (match && TEXT_TYPE_REGEXP.test(match[1])) {
    return 'UTF-8'
  }

  return false
}

/**
 * Create a full Content-Type header given a MIME type or extension.
 *
 * @param {string} str
 * @return {boolean|string}
 */

function contentType (str) {
  // TODO: should this even be in this module?
  if (!str || typeof str !== 'string') {
    return false
  }

  var mime = str.indexOf('/') === -1
    ? exports.lookup(str)
    : str

  if (!mime) {
    return false
  }

  // TODO: use content-type or other module
  if (mime.indexOf('charset') === -1) {
    var charset = exports.charset(mime)
    if (charset) mime += '; charset=' + charset.toLowerCase()
  }

  return mime
}

/**
 * Get the default extension for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function extension (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = EXTRACT_TYPE_REGEXP.exec(type)

  // get extensions
  var exts = match && exports.extensions[match[1].toLowerCase()]

  if (!exts || !exts.length) {
    return false
  }

  return exts[0]
}

/**
 * Lookup the MIME type for a file path/extension.
 *
 * @param {string} path
 * @return {boolean|string}
 */

function lookup (path) {
  if (!path || typeof path !== 'string') {
    return false
  }

  // get the extension ("ext" or ".ext" or full path)
  var extension = extname('x.' + path)
    .toLowerCase()
    .substr(1)

  if (!extension) {
    return false
  }

  return exports.types[extension] || false
}

/**
 * Populate the extensions and types maps.
 * @private
 */

function populateMaps (extensions, types) {
  // source preference (least -> most)
  var preference = ['nginx', 'apache', undefined, 'iana']

  Object.keys(db).forEach(function forEachMimeType (type) {
    var mime = db[type]
    var exts = mime.extensions

    if (!exts || !exts.length) {
      return
    }

    // mime -> extensions
    extensions[type] = exts

    // extension -> mime
    for (var i = 0; i < exts.length; i++) {
      var extension = exts[i]

      if (types[extension]) {
        var from = preference.indexOf(db[types[extension]].source)
        var to = preference.indexOf(mime.source)

        if (types[extension] !== 'application/octet-stream' &&
          (from > to || (from === to && types[extension].substr(0, 12) === 'application/'))) {
          // skip the remapping
          continue
        }
      }

      // set the extension -> mime
      types[extension] = type
    }
  })
}


/***/ }),

/***/ 2716:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* tslint:disable */
/* eslint-disable */
/**
 * OpenAI API
 * APIs for sampling from and fine-tuning language models
 *
 * The version of the OpenAPI document: 1.3.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OpenAIApi = exports.OpenAIApiFactory = exports.OpenAIApiFp = exports.OpenAIApiAxiosParamCreator = exports.CreateImageRequestResponseFormatEnum = exports.CreateImageRequestSizeEnum = exports.ChatCompletionResponseMessageRoleEnum = exports.ChatCompletionRequestMessageRoleEnum = void 0;
const axios_1 = __nccwpck_require__(6545);
// Some imports not used depending on template conditions
// @ts-ignore
const common_1 = __nccwpck_require__(6478);
// @ts-ignore
const base_1 = __nccwpck_require__(8928);
exports.ChatCompletionRequestMessageRoleEnum = {
    System: 'system',
    User: 'user',
    Assistant: 'assistant',
    Function: 'function'
};
exports.ChatCompletionResponseMessageRoleEnum = {
    System: 'system',
    User: 'user',
    Assistant: 'assistant',
    Function: 'function'
};
exports.CreateImageRequestSizeEnum = {
    _256x256: '256x256',
    _512x512: '512x512',
    _1024x1024: '1024x1024'
};
exports.CreateImageRequestResponseFormatEnum = {
    Url: 'url',
    B64Json: 'b64_json'
};
/**
 * OpenAIApi - axios parameter creator
 * @export
 */
exports.OpenAIApiAxiosParamCreator = function (configuration) {
    return {
        /**
         *
         * @summary Immediately cancel a fine-tune job.
         * @param {string} fineTuneId The ID of the fine-tune job to cancel
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        cancelFineTune: (fineTuneId, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'fineTuneId' is not null or undefined
            common_1.assertParamExists('cancelFineTune', 'fineTuneId', fineTuneId);
            const localVarPath = `/fine-tunes/{fine_tune_id}/cancel`
                .replace(`{${"fine_tune_id"}}`, encodeURIComponent(String(fineTuneId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Answers the specified question using the provided documents and examples.  The endpoint first [searches](/docs/api-reference/searches) over provided documents or files to find relevant context. The relevant context is combined with the provided examples and question to create the prompt for [completion](/docs/api-reference/completions).
         * @param {CreateAnswerRequest} createAnswerRequest
         * @param {*} [options] Override http request option.
         * @deprecated
         * @throws {RequiredError}
         */
        createAnswer: (createAnswerRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'createAnswerRequest' is not null or undefined
            common_1.assertParamExists('createAnswer', 'createAnswerRequest', createAnswerRequest);
            const localVarPath = `/answers`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = common_1.serializeDataIfNeeded(createAnswerRequest, localVarRequestOptions, configuration);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Creates a model response for the given chat conversation.
         * @param {CreateChatCompletionRequest} createChatCompletionRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createChatCompletion: (createChatCompletionRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'createChatCompletionRequest' is not null or undefined
            common_1.assertParamExists('createChatCompletion', 'createChatCompletionRequest', createChatCompletionRequest);
            const localVarPath = `/chat/completions`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = common_1.serializeDataIfNeeded(createChatCompletionRequest, localVarRequestOptions, configuration);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Classifies the specified `query` using provided examples.  The endpoint first [searches](/docs/api-reference/searches) over the labeled examples to select the ones most relevant for the particular query. Then, the relevant examples are combined with the query to construct a prompt to produce the final label via the [completions](/docs/api-reference/completions) endpoint.  Labeled examples can be provided via an uploaded `file`, or explicitly listed in the request using the `examples` parameter for quick tests and small scale use cases.
         * @param {CreateClassificationRequest} createClassificationRequest
         * @param {*} [options] Override http request option.
         * @deprecated
         * @throws {RequiredError}
         */
        createClassification: (createClassificationRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'createClassificationRequest' is not null or undefined
            common_1.assertParamExists('createClassification', 'createClassificationRequest', createClassificationRequest);
            const localVarPath = `/classifications`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = common_1.serializeDataIfNeeded(createClassificationRequest, localVarRequestOptions, configuration);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Creates a completion for the provided prompt and parameters.
         * @param {CreateCompletionRequest} createCompletionRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createCompletion: (createCompletionRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'createCompletionRequest' is not null or undefined
            common_1.assertParamExists('createCompletion', 'createCompletionRequest', createCompletionRequest);
            const localVarPath = `/completions`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = common_1.serializeDataIfNeeded(createCompletionRequest, localVarRequestOptions, configuration);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Creates a new edit for the provided input, instruction, and parameters.
         * @param {CreateEditRequest} createEditRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createEdit: (createEditRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'createEditRequest' is not null or undefined
            common_1.assertParamExists('createEdit', 'createEditRequest', createEditRequest);
            const localVarPath = `/edits`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = common_1.serializeDataIfNeeded(createEditRequest, localVarRequestOptions, configuration);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Creates an embedding vector representing the input text.
         * @param {CreateEmbeddingRequest} createEmbeddingRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createEmbedding: (createEmbeddingRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'createEmbeddingRequest' is not null or undefined
            common_1.assertParamExists('createEmbedding', 'createEmbeddingRequest', createEmbeddingRequest);
            const localVarPath = `/embeddings`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = common_1.serializeDataIfNeeded(createEmbeddingRequest, localVarRequestOptions, configuration);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Upload a file that contains document(s) to be used across various endpoints/features. Currently, the size of all the files uploaded by one organization can be up to 1 GB. Please contact us if you need to increase the storage limit.
         * @param {File} file Name of the [JSON Lines](https://jsonlines.readthedocs.io/en/latest/) file to be uploaded.  If the &#x60;purpose&#x60; is set to \\\&quot;fine-tune\\\&quot;, each line is a JSON record with \\\&quot;prompt\\\&quot; and \\\&quot;completion\\\&quot; fields representing your [training examples](/docs/guides/fine-tuning/prepare-training-data).
         * @param {string} purpose The intended purpose of the uploaded documents.  Use \\\&quot;fine-tune\\\&quot; for [Fine-tuning](/docs/api-reference/fine-tunes). This allows us to validate the format of the uploaded file.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createFile: (file, purpose, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'file' is not null or undefined
            common_1.assertParamExists('createFile', 'file', file);
            // verify required parameter 'purpose' is not null or undefined
            common_1.assertParamExists('createFile', 'purpose', purpose);
            const localVarPath = `/files`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            const localVarFormParams = new ((configuration && configuration.formDataCtor) || FormData)();
            if (file !== undefined) {
                localVarFormParams.append('file', file);
            }
            if (purpose !== undefined) {
                localVarFormParams.append('purpose', purpose);
            }
            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), localVarFormParams.getHeaders()), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = localVarFormParams;
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Creates a job that fine-tunes a specified model from a given dataset.  Response includes details of the enqueued job including job status and the name of the fine-tuned models once complete.  [Learn more about Fine-tuning](/docs/guides/fine-tuning)
         * @param {CreateFineTuneRequest} createFineTuneRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createFineTune: (createFineTuneRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'createFineTuneRequest' is not null or undefined
            common_1.assertParamExists('createFineTune', 'createFineTuneRequest', createFineTuneRequest);
            const localVarPath = `/fine-tunes`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = common_1.serializeDataIfNeeded(createFineTuneRequest, localVarRequestOptions, configuration);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Creates an image given a prompt.
         * @param {CreateImageRequest} createImageRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createImage: (createImageRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'createImageRequest' is not null or undefined
            common_1.assertParamExists('createImage', 'createImageRequest', createImageRequest);
            const localVarPath = `/images/generations`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = common_1.serializeDataIfNeeded(createImageRequest, localVarRequestOptions, configuration);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Creates an edited or extended image given an original image and a prompt.
         * @param {File} image The image to edit. Must be a valid PNG file, less than 4MB, and square. If mask is not provided, image must have transparency, which will be used as the mask.
         * @param {string} prompt A text description of the desired image(s). The maximum length is 1000 characters.
         * @param {File} [mask] An additional image whose fully transparent areas (e.g. where alpha is zero) indicate where &#x60;image&#x60; should be edited. Must be a valid PNG file, less than 4MB, and have the same dimensions as &#x60;image&#x60;.
         * @param {number} [n] The number of images to generate. Must be between 1 and 10.
         * @param {string} [size] The size of the generated images. Must be one of &#x60;256x256&#x60;, &#x60;512x512&#x60;, or &#x60;1024x1024&#x60;.
         * @param {string} [responseFormat] The format in which the generated images are returned. Must be one of &#x60;url&#x60; or &#x60;b64_json&#x60;.
         * @param {string} [user] A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids).
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createImageEdit: (image, prompt, mask, n, size, responseFormat, user, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'image' is not null or undefined
            common_1.assertParamExists('createImageEdit', 'image', image);
            // verify required parameter 'prompt' is not null or undefined
            common_1.assertParamExists('createImageEdit', 'prompt', prompt);
            const localVarPath = `/images/edits`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            const localVarFormParams = new ((configuration && configuration.formDataCtor) || FormData)();
            if (image !== undefined) {
                localVarFormParams.append('image', image);
            }
            if (mask !== undefined) {
                localVarFormParams.append('mask', mask);
            }
            if (prompt !== undefined) {
                localVarFormParams.append('prompt', prompt);
            }
            if (n !== undefined) {
                localVarFormParams.append('n', n);
            }
            if (size !== undefined) {
                localVarFormParams.append('size', size);
            }
            if (responseFormat !== undefined) {
                localVarFormParams.append('response_format', responseFormat);
            }
            if (user !== undefined) {
                localVarFormParams.append('user', user);
            }
            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), localVarFormParams.getHeaders()), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = localVarFormParams;
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Creates a variation of a given image.
         * @param {File} image The image to use as the basis for the variation(s). Must be a valid PNG file, less than 4MB, and square.
         * @param {number} [n] The number of images to generate. Must be between 1 and 10.
         * @param {string} [size] The size of the generated images. Must be one of &#x60;256x256&#x60;, &#x60;512x512&#x60;, or &#x60;1024x1024&#x60;.
         * @param {string} [responseFormat] The format in which the generated images are returned. Must be one of &#x60;url&#x60; or &#x60;b64_json&#x60;.
         * @param {string} [user] A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids).
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createImageVariation: (image, n, size, responseFormat, user, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'image' is not null or undefined
            common_1.assertParamExists('createImageVariation', 'image', image);
            const localVarPath = `/images/variations`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            const localVarFormParams = new ((configuration && configuration.formDataCtor) || FormData)();
            if (image !== undefined) {
                localVarFormParams.append('image', image);
            }
            if (n !== undefined) {
                localVarFormParams.append('n', n);
            }
            if (size !== undefined) {
                localVarFormParams.append('size', size);
            }
            if (responseFormat !== undefined) {
                localVarFormParams.append('response_format', responseFormat);
            }
            if (user !== undefined) {
                localVarFormParams.append('user', user);
            }
            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), localVarFormParams.getHeaders()), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = localVarFormParams;
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Classifies if text violates OpenAI\'s Content Policy
         * @param {CreateModerationRequest} createModerationRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createModeration: (createModerationRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'createModerationRequest' is not null or undefined
            common_1.assertParamExists('createModeration', 'createModerationRequest', createModerationRequest);
            const localVarPath = `/moderations`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = common_1.serializeDataIfNeeded(createModerationRequest, localVarRequestOptions, configuration);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary The search endpoint computes similarity scores between provided query and documents. Documents can be passed directly to the API if there are no more than 200 of them.  To go beyond the 200 document limit, documents can be processed offline and then used for efficient retrieval at query time. When `file` is set, the search endpoint searches over all the documents in the given file and returns up to the `max_rerank` number of documents. These documents will be returned along with their search scores.  The similarity score is a positive score that usually ranges from 0 to 300 (but can sometimes go higher), where a score above 200 usually means the document is semantically similar to the query.
         * @param {string} engineId The ID of the engine to use for this request.  You can select one of &#x60;ada&#x60;, &#x60;babbage&#x60;, &#x60;curie&#x60;, or &#x60;davinci&#x60;.
         * @param {CreateSearchRequest} createSearchRequest
         * @param {*} [options] Override http request option.
         * @deprecated
         * @throws {RequiredError}
         */
        createSearch: (engineId, createSearchRequest, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'engineId' is not null or undefined
            common_1.assertParamExists('createSearch', 'engineId', engineId);
            // verify required parameter 'createSearchRequest' is not null or undefined
            common_1.assertParamExists('createSearch', 'createSearchRequest', createSearchRequest);
            const localVarPath = `/engines/{engine_id}/search`
                .replace(`{${"engine_id"}}`, encodeURIComponent(String(engineId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = common_1.serializeDataIfNeeded(createSearchRequest, localVarRequestOptions, configuration);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Transcribes audio into the input language.
         * @param {File} file The audio file object (not file name) to transcribe, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.
         * @param {string} model ID of the model to use. Only &#x60;whisper-1&#x60; is currently available.
         * @param {string} [prompt] An optional text to guide the model\\\&#39;s style or continue a previous audio segment. The [prompt](/docs/guides/speech-to-text/prompting) should match the audio language.
         * @param {string} [responseFormat] The format of the transcript output, in one of these options: json, text, srt, verbose_json, or vtt.
         * @param {number} [temperature] The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use [log probability](https://en.wikipedia.org/wiki/Log_probability) to automatically increase the temperature until certain thresholds are hit.
         * @param {string} [language] The language of the input audio. Supplying the input language in [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format will improve accuracy and latency.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createTranscription: (file, model, prompt, responseFormat, temperature, language, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'file' is not null or undefined
            common_1.assertParamExists('createTranscription', 'file', file);
            // verify required parameter 'model' is not null or undefined
            common_1.assertParamExists('createTranscription', 'model', model);
            const localVarPath = `/audio/transcriptions`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            const localVarFormParams = new ((configuration && configuration.formDataCtor) || FormData)();
            if (file !== undefined) {
                localVarFormParams.append('file', file);
            }
            if (model !== undefined) {
                localVarFormParams.append('model', model);
            }
            if (prompt !== undefined) {
                localVarFormParams.append('prompt', prompt);
            }
            if (responseFormat !== undefined) {
                localVarFormParams.append('response_format', responseFormat);
            }
            if (temperature !== undefined) {
                localVarFormParams.append('temperature', temperature);
            }
            if (language !== undefined) {
                localVarFormParams.append('language', language);
            }
            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), localVarFormParams.getHeaders()), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = localVarFormParams;
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Translates audio into into English.
         * @param {File} file The audio file object (not file name) translate, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.
         * @param {string} model ID of the model to use. Only &#x60;whisper-1&#x60; is currently available.
         * @param {string} [prompt] An optional text to guide the model\\\&#39;s style or continue a previous audio segment. The [prompt](/docs/guides/speech-to-text/prompting) should be in English.
         * @param {string} [responseFormat] The format of the transcript output, in one of these options: json, text, srt, verbose_json, or vtt.
         * @param {number} [temperature] The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use [log probability](https://en.wikipedia.org/wiki/Log_probability) to automatically increase the temperature until certain thresholds are hit.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createTranslation: (file, model, prompt, responseFormat, temperature, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'file' is not null or undefined
            common_1.assertParamExists('createTranslation', 'file', file);
            // verify required parameter 'model' is not null or undefined
            common_1.assertParamExists('createTranslation', 'model', model);
            const localVarPath = `/audio/translations`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            const localVarFormParams = new ((configuration && configuration.formDataCtor) || FormData)();
            if (file !== undefined) {
                localVarFormParams.append('file', file);
            }
            if (model !== undefined) {
                localVarFormParams.append('model', model);
            }
            if (prompt !== undefined) {
                localVarFormParams.append('prompt', prompt);
            }
            if (responseFormat !== undefined) {
                localVarFormParams.append('response_format', responseFormat);
            }
            if (temperature !== undefined) {
                localVarFormParams.append('temperature', temperature);
            }
            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), localVarFormParams.getHeaders()), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = localVarFormParams;
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Delete a file.
         * @param {string} fileId The ID of the file to use for this request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteFile: (fileId, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'fileId' is not null or undefined
            common_1.assertParamExists('deleteFile', 'fileId', fileId);
            const localVarPath = `/files/{file_id}`
                .replace(`{${"file_id"}}`, encodeURIComponent(String(fileId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'DELETE' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Delete a fine-tuned model. You must have the Owner role in your organization.
         * @param {string} model The model to delete
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteModel: (model, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'model' is not null or undefined
            common_1.assertParamExists('deleteModel', 'model', model);
            const localVarPath = `/models/{model}`
                .replace(`{${"model"}}`, encodeURIComponent(String(model)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'DELETE' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Returns the contents of the specified file
         * @param {string} fileId The ID of the file to use for this request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        downloadFile: (fileId, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'fileId' is not null or undefined
            common_1.assertParamExists('downloadFile', 'fileId', fileId);
            const localVarPath = `/files/{file_id}/content`
                .replace(`{${"file_id"}}`, encodeURIComponent(String(fileId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Lists the currently available (non-finetuned) models, and provides basic information about each one such as the owner and availability.
         * @param {*} [options] Override http request option.
         * @deprecated
         * @throws {RequiredError}
         */
        listEngines: (options = {}) => __awaiter(this, void 0, void 0, function* () {
            const localVarPath = `/engines`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Returns a list of files that belong to the user\'s organization.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listFiles: (options = {}) => __awaiter(this, void 0, void 0, function* () {
            const localVarPath = `/files`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Get fine-grained status updates for a fine-tune job.
         * @param {string} fineTuneId The ID of the fine-tune job to get events for.
         * @param {boolean} [stream] Whether to stream events for the fine-tune job. If set to true, events will be sent as data-only [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) as they become available. The stream will terminate with a &#x60;data: [DONE]&#x60; message when the job is finished (succeeded, cancelled, or failed).  If set to false, only events generated so far will be returned.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listFineTuneEvents: (fineTuneId, stream, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'fineTuneId' is not null or undefined
            common_1.assertParamExists('listFineTuneEvents', 'fineTuneId', fineTuneId);
            const localVarPath = `/fine-tunes/{fine_tune_id}/events`
                .replace(`{${"fine_tune_id"}}`, encodeURIComponent(String(fineTuneId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (stream !== undefined) {
                localVarQueryParameter['stream'] = stream;
            }
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary List your organization\'s fine-tuning jobs
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listFineTunes: (options = {}) => __awaiter(this, void 0, void 0, function* () {
            const localVarPath = `/fine-tunes`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Lists the currently available models, and provides basic information about each one such as the owner and availability.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listModels: (options = {}) => __awaiter(this, void 0, void 0, function* () {
            const localVarPath = `/models`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Retrieves a model instance, providing basic information about it such as the owner and availability.
         * @param {string} engineId The ID of the engine to use for this request
         * @param {*} [options] Override http request option.
         * @deprecated
         * @throws {RequiredError}
         */
        retrieveEngine: (engineId, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'engineId' is not null or undefined
            common_1.assertParamExists('retrieveEngine', 'engineId', engineId);
            const localVarPath = `/engines/{engine_id}`
                .replace(`{${"engine_id"}}`, encodeURIComponent(String(engineId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Returns information about a specific file.
         * @param {string} fileId The ID of the file to use for this request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        retrieveFile: (fileId, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'fileId' is not null or undefined
            common_1.assertParamExists('retrieveFile', 'fileId', fileId);
            const localVarPath = `/files/{file_id}`
                .replace(`{${"file_id"}}`, encodeURIComponent(String(fileId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Gets info about the fine-tune job.  [Learn more about Fine-tuning](/docs/guides/fine-tuning)
         * @param {string} fineTuneId The ID of the fine-tune job
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        retrieveFineTune: (fineTuneId, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'fineTuneId' is not null or undefined
            common_1.assertParamExists('retrieveFineTune', 'fineTuneId', fineTuneId);
            const localVarPath = `/fine-tunes/{fine_tune_id}`
                .replace(`{${"fine_tune_id"}}`, encodeURIComponent(String(fineTuneId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Retrieves a model instance, providing basic information about the model such as the owner and permissioning.
         * @param {string} model The ID of the model to use for this request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        retrieveModel: (model, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'model' is not null or undefined
            common_1.assertParamExists('retrieveModel', 'model', model);
            const localVarPath = `/models/{model}`
                .replace(`{${"model"}}`, encodeURIComponent(String(model)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, common_1.DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            common_1.setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: common_1.toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
    };
};
/**
 * OpenAIApi - functional programming interface
 * @export
 */
exports.OpenAIApiFp = function (configuration) {
    const localVarAxiosParamCreator = exports.OpenAIApiAxiosParamCreator(configuration);
    return {
        /**
         *
         * @summary Immediately cancel a fine-tune job.
         * @param {string} fineTuneId The ID of the fine-tune job to cancel
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        cancelFineTune(fineTuneId, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.cancelFineTune(fineTuneId, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Answers the specified question using the provided documents and examples.  The endpoint first [searches](/docs/api-reference/searches) over provided documents or files to find relevant context. The relevant context is combined with the provided examples and question to create the prompt for [completion](/docs/api-reference/completions).
         * @param {CreateAnswerRequest} createAnswerRequest
         * @param {*} [options] Override http request option.
         * @deprecated
         * @throws {RequiredError}
         */
        createAnswer(createAnswerRequest, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.createAnswer(createAnswerRequest, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Creates a model response for the given chat conversation.
         * @param {CreateChatCompletionRequest} createChatCompletionRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createChatCompletion(createChatCompletionRequest, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.createChatCompletion(createChatCompletionRequest, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Classifies the specified `query` using provided examples.  The endpoint first [searches](/docs/api-reference/searches) over the labeled examples to select the ones most relevant for the particular query. Then, the relevant examples are combined with the query to construct a prompt to produce the final label via the [completions](/docs/api-reference/completions) endpoint.  Labeled examples can be provided via an uploaded `file`, or explicitly listed in the request using the `examples` parameter for quick tests and small scale use cases.
         * @param {CreateClassificationRequest} createClassificationRequest
         * @param {*} [options] Override http request option.
         * @deprecated
         * @throws {RequiredError}
         */
        createClassification(createClassificationRequest, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.createClassification(createClassificationRequest, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Creates a completion for the provided prompt and parameters.
         * @param {CreateCompletionRequest} createCompletionRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createCompletion(createCompletionRequest, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.createCompletion(createCompletionRequest, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Creates a new edit for the provided input, instruction, and parameters.
         * @param {CreateEditRequest} createEditRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createEdit(createEditRequest, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.createEdit(createEditRequest, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Creates an embedding vector representing the input text.
         * @param {CreateEmbeddingRequest} createEmbeddingRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createEmbedding(createEmbeddingRequest, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.createEmbedding(createEmbeddingRequest, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Upload a file that contains document(s) to be used across various endpoints/features. Currently, the size of all the files uploaded by one organization can be up to 1 GB. Please contact us if you need to increase the storage limit.
         * @param {File} file Name of the [JSON Lines](https://jsonlines.readthedocs.io/en/latest/) file to be uploaded.  If the &#x60;purpose&#x60; is set to \\\&quot;fine-tune\\\&quot;, each line is a JSON record with \\\&quot;prompt\\\&quot; and \\\&quot;completion\\\&quot; fields representing your [training examples](/docs/guides/fine-tuning/prepare-training-data).
         * @param {string} purpose The intended purpose of the uploaded documents.  Use \\\&quot;fine-tune\\\&quot; for [Fine-tuning](/docs/api-reference/fine-tunes). This allows us to validate the format of the uploaded file.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createFile(file, purpose, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.createFile(file, purpose, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Creates a job that fine-tunes a specified model from a given dataset.  Response includes details of the enqueued job including job status and the name of the fine-tuned models once complete.  [Learn more about Fine-tuning](/docs/guides/fine-tuning)
         * @param {CreateFineTuneRequest} createFineTuneRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createFineTune(createFineTuneRequest, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.createFineTune(createFineTuneRequest, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Creates an image given a prompt.
         * @param {CreateImageRequest} createImageRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createImage(createImageRequest, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.createImage(createImageRequest, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Creates an edited or extended image given an original image and a prompt.
         * @param {File} image The image to edit. Must be a valid PNG file, less than 4MB, and square. If mask is not provided, image must have transparency, which will be used as the mask.
         * @param {string} prompt A text description of the desired image(s). The maximum length is 1000 characters.
         * @param {File} [mask] An additional image whose fully transparent areas (e.g. where alpha is zero) indicate where &#x60;image&#x60; should be edited. Must be a valid PNG file, less than 4MB, and have the same dimensions as &#x60;image&#x60;.
         * @param {number} [n] The number of images to generate. Must be between 1 and 10.
         * @param {string} [size] The size of the generated images. Must be one of &#x60;256x256&#x60;, &#x60;512x512&#x60;, or &#x60;1024x1024&#x60;.
         * @param {string} [responseFormat] The format in which the generated images are returned. Must be one of &#x60;url&#x60; or &#x60;b64_json&#x60;.
         * @param {string} [user] A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids).
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createImageEdit(image, prompt, mask, n, size, responseFormat, user, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.createImageEdit(image, prompt, mask, n, size, responseFormat, user, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Creates a variation of a given image.
         * @param {File} image The image to use as the basis for the variation(s). Must be a valid PNG file, less than 4MB, and square.
         * @param {number} [n] The number of images to generate. Must be between 1 and 10.
         * @param {string} [size] The size of the generated images. Must be one of &#x60;256x256&#x60;, &#x60;512x512&#x60;, or &#x60;1024x1024&#x60;.
         * @param {string} [responseFormat] The format in which the generated images are returned. Must be one of &#x60;url&#x60; or &#x60;b64_json&#x60;.
         * @param {string} [user] A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids).
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createImageVariation(image, n, size, responseFormat, user, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.createImageVariation(image, n, size, responseFormat, user, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Classifies if text violates OpenAI\'s Content Policy
         * @param {CreateModerationRequest} createModerationRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createModeration(createModerationRequest, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.createModeration(createModerationRequest, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary The search endpoint computes similarity scores between provided query and documents. Documents can be passed directly to the API if there are no more than 200 of them.  To go beyond the 200 document limit, documents can be processed offline and then used for efficient retrieval at query time. When `file` is set, the search endpoint searches over all the documents in the given file and returns up to the `max_rerank` number of documents. These documents will be returned along with their search scores.  The similarity score is a positive score that usually ranges from 0 to 300 (but can sometimes go higher), where a score above 200 usually means the document is semantically similar to the query.
         * @param {string} engineId The ID of the engine to use for this request.  You can select one of &#x60;ada&#x60;, &#x60;babbage&#x60;, &#x60;curie&#x60;, or &#x60;davinci&#x60;.
         * @param {CreateSearchRequest} createSearchRequest
         * @param {*} [options] Override http request option.
         * @deprecated
         * @throws {RequiredError}
         */
        createSearch(engineId, createSearchRequest, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.createSearch(engineId, createSearchRequest, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Transcribes audio into the input language.
         * @param {File} file The audio file object (not file name) to transcribe, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.
         * @param {string} model ID of the model to use. Only &#x60;whisper-1&#x60; is currently available.
         * @param {string} [prompt] An optional text to guide the model\\\&#39;s style or continue a previous audio segment. The [prompt](/docs/guides/speech-to-text/prompting) should match the audio language.
         * @param {string} [responseFormat] The format of the transcript output, in one of these options: json, text, srt, verbose_json, or vtt.
         * @param {number} [temperature] The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use [log probability](https://en.wikipedia.org/wiki/Log_probability) to automatically increase the temperature until certain thresholds are hit.
         * @param {string} [language] The language of the input audio. Supplying the input language in [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format will improve accuracy and latency.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createTranscription(file, model, prompt, responseFormat, temperature, language, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.createTranscription(file, model, prompt, responseFormat, temperature, language, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Translates audio into into English.
         * @param {File} file The audio file object (not file name) translate, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.
         * @param {string} model ID of the model to use. Only &#x60;whisper-1&#x60; is currently available.
         * @param {string} [prompt] An optional text to guide the model\\\&#39;s style or continue a previous audio segment. The [prompt](/docs/guides/speech-to-text/prompting) should be in English.
         * @param {string} [responseFormat] The format of the transcript output, in one of these options: json, text, srt, verbose_json, or vtt.
         * @param {number} [temperature] The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use [log probability](https://en.wikipedia.org/wiki/Log_probability) to automatically increase the temperature until certain thresholds are hit.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createTranslation(file, model, prompt, responseFormat, temperature, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.createTranslation(file, model, prompt, responseFormat, temperature, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Delete a file.
         * @param {string} fileId The ID of the file to use for this request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteFile(fileId, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.deleteFile(fileId, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Delete a fine-tuned model. You must have the Owner role in your organization.
         * @param {string} model The model to delete
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteModel(model, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.deleteModel(model, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Returns the contents of the specified file
         * @param {string} fileId The ID of the file to use for this request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        downloadFile(fileId, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.downloadFile(fileId, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Lists the currently available (non-finetuned) models, and provides basic information about each one such as the owner and availability.
         * @param {*} [options] Override http request option.
         * @deprecated
         * @throws {RequiredError}
         */
        listEngines(options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.listEngines(options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Returns a list of files that belong to the user\'s organization.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listFiles(options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.listFiles(options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Get fine-grained status updates for a fine-tune job.
         * @param {string} fineTuneId The ID of the fine-tune job to get events for.
         * @param {boolean} [stream] Whether to stream events for the fine-tune job. If set to true, events will be sent as data-only [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) as they become available. The stream will terminate with a &#x60;data: [DONE]&#x60; message when the job is finished (succeeded, cancelled, or failed).  If set to false, only events generated so far will be returned.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listFineTuneEvents(fineTuneId, stream, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.listFineTuneEvents(fineTuneId, stream, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary List your organization\'s fine-tuning jobs
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listFineTunes(options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.listFineTunes(options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Lists the currently available models, and provides basic information about each one such as the owner and availability.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listModels(options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.listModels(options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Retrieves a model instance, providing basic information about it such as the owner and availability.
         * @param {string} engineId The ID of the engine to use for this request
         * @param {*} [options] Override http request option.
         * @deprecated
         * @throws {RequiredError}
         */
        retrieveEngine(engineId, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.retrieveEngine(engineId, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Returns information about a specific file.
         * @param {string} fileId The ID of the file to use for this request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        retrieveFile(fileId, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.retrieveFile(fileId, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Gets info about the fine-tune job.  [Learn more about Fine-tuning](/docs/guides/fine-tuning)
         * @param {string} fineTuneId The ID of the fine-tune job
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        retrieveFineTune(fineTuneId, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.retrieveFineTune(fineTuneId, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Retrieves a model instance, providing basic information about the model such as the owner and permissioning.
         * @param {string} model The ID of the model to use for this request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        retrieveModel(model, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.retrieveModel(model, options);
                return common_1.createRequestFunction(localVarAxiosArgs, axios_1.default, base_1.BASE_PATH, configuration);
            });
        },
    };
};
/**
 * OpenAIApi - factory interface
 * @export
 */
exports.OpenAIApiFactory = function (configuration, basePath, axios) {
    const localVarFp = exports.OpenAIApiFp(configuration);
    return {
        /**
         *
         * @summary Immediately cancel a fine-tune job.
         * @param {string} fineTuneId The ID of the fine-tune job to cancel
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        cancelFineTune(fineTuneId, options) {
            return localVarFp.cancelFineTune(fineTuneId, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Answers the specified question using the provided documents and examples.  The endpoint first [searches](/docs/api-reference/searches) over provided documents or files to find relevant context. The relevant context is combined with the provided examples and question to create the prompt for [completion](/docs/api-reference/completions).
         * @param {CreateAnswerRequest} createAnswerRequest
         * @param {*} [options] Override http request option.
         * @deprecated
         * @throws {RequiredError}
         */
        createAnswer(createAnswerRequest, options) {
            return localVarFp.createAnswer(createAnswerRequest, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Creates a model response for the given chat conversation.
         * @param {CreateChatCompletionRequest} createChatCompletionRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createChatCompletion(createChatCompletionRequest, options) {
            return localVarFp.createChatCompletion(createChatCompletionRequest, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Classifies the specified `query` using provided examples.  The endpoint first [searches](/docs/api-reference/searches) over the labeled examples to select the ones most relevant for the particular query. Then, the relevant examples are combined with the query to construct a prompt to produce the final label via the [completions](/docs/api-reference/completions) endpoint.  Labeled examples can be provided via an uploaded `file`, or explicitly listed in the request using the `examples` parameter for quick tests and small scale use cases.
         * @param {CreateClassificationRequest} createClassificationRequest
         * @param {*} [options] Override http request option.
         * @deprecated
         * @throws {RequiredError}
         */
        createClassification(createClassificationRequest, options) {
            return localVarFp.createClassification(createClassificationRequest, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Creates a completion for the provided prompt and parameters.
         * @param {CreateCompletionRequest} createCompletionRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createCompletion(createCompletionRequest, options) {
            return localVarFp.createCompletion(createCompletionRequest, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Creates a new edit for the provided input, instruction, and parameters.
         * @param {CreateEditRequest} createEditRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createEdit(createEditRequest, options) {
            return localVarFp.createEdit(createEditRequest, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Creates an embedding vector representing the input text.
         * @param {CreateEmbeddingRequest} createEmbeddingRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createEmbedding(createEmbeddingRequest, options) {
            return localVarFp.createEmbedding(createEmbeddingRequest, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Upload a file that contains document(s) to be used across various endpoints/features. Currently, the size of all the files uploaded by one organization can be up to 1 GB. Please contact us if you need to increase the storage limit.
         * @param {File} file Name of the [JSON Lines](https://jsonlines.readthedocs.io/en/latest/) file to be uploaded.  If the &#x60;purpose&#x60; is set to \\\&quot;fine-tune\\\&quot;, each line is a JSON record with \\\&quot;prompt\\\&quot; and \\\&quot;completion\\\&quot; fields representing your [training examples](/docs/guides/fine-tuning/prepare-training-data).
         * @param {string} purpose The intended purpose of the uploaded documents.  Use \\\&quot;fine-tune\\\&quot; for [Fine-tuning](/docs/api-reference/fine-tunes). This allows us to validate the format of the uploaded file.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createFile(file, purpose, options) {
            return localVarFp.createFile(file, purpose, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Creates a job that fine-tunes a specified model from a given dataset.  Response includes details of the enqueued job including job status and the name of the fine-tuned models once complete.  [Learn more about Fine-tuning](/docs/guides/fine-tuning)
         * @param {CreateFineTuneRequest} createFineTuneRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createFineTune(createFineTuneRequest, options) {
            return localVarFp.createFineTune(createFineTuneRequest, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Creates an image given a prompt.
         * @param {CreateImageRequest} createImageRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createImage(createImageRequest, options) {
            return localVarFp.createImage(createImageRequest, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Creates an edited or extended image given an original image and a prompt.
         * @param {File} image The image to edit. Must be a valid PNG file, less than 4MB, and square. If mask is not provided, image must have transparency, which will be used as the mask.
         * @param {string} prompt A text description of the desired image(s). The maximum length is 1000 characters.
         * @param {File} [mask] An additional image whose fully transparent areas (e.g. where alpha is zero) indicate where &#x60;image&#x60; should be edited. Must be a valid PNG file, less than 4MB, and have the same dimensions as &#x60;image&#x60;.
         * @param {number} [n] The number of images to generate. Must be between 1 and 10.
         * @param {string} [size] The size of the generated images. Must be one of &#x60;256x256&#x60;, &#x60;512x512&#x60;, or &#x60;1024x1024&#x60;.
         * @param {string} [responseFormat] The format in which the generated images are returned. Must be one of &#x60;url&#x60; or &#x60;b64_json&#x60;.
         * @param {string} [user] A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids).
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createImageEdit(image, prompt, mask, n, size, responseFormat, user, options) {
            return localVarFp.createImageEdit(image, prompt, mask, n, size, responseFormat, user, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Creates a variation of a given image.
         * @param {File} image The image to use as the basis for the variation(s). Must be a valid PNG file, less than 4MB, and square.
         * @param {number} [n] The number of images to generate. Must be between 1 and 10.
         * @param {string} [size] The size of the generated images. Must be one of &#x60;256x256&#x60;, &#x60;512x512&#x60;, or &#x60;1024x1024&#x60;.
         * @param {string} [responseFormat] The format in which the generated images are returned. Must be one of &#x60;url&#x60; or &#x60;b64_json&#x60;.
         * @param {string} [user] A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids).
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createImageVariation(image, n, size, responseFormat, user, options) {
            return localVarFp.createImageVariation(image, n, size, responseFormat, user, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Classifies if text violates OpenAI\'s Content Policy
         * @param {CreateModerationRequest} createModerationRequest
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createModeration(createModerationRequest, options) {
            return localVarFp.createModeration(createModerationRequest, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary The search endpoint computes similarity scores between provided query and documents. Documents can be passed directly to the API if there are no more than 200 of them.  To go beyond the 200 document limit, documents can be processed offline and then used for efficient retrieval at query time. When `file` is set, the search endpoint searches over all the documents in the given file and returns up to the `max_rerank` number of documents. These documents will be returned along with their search scores.  The similarity score is a positive score that usually ranges from 0 to 300 (but can sometimes go higher), where a score above 200 usually means the document is semantically similar to the query.
         * @param {string} engineId The ID of the engine to use for this request.  You can select one of &#x60;ada&#x60;, &#x60;babbage&#x60;, &#x60;curie&#x60;, or &#x60;davinci&#x60;.
         * @param {CreateSearchRequest} createSearchRequest
         * @param {*} [options] Override http request option.
         * @deprecated
         * @throws {RequiredError}
         */
        createSearch(engineId, createSearchRequest, options) {
            return localVarFp.createSearch(engineId, createSearchRequest, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Transcribes audio into the input language.
         * @param {File} file The audio file object (not file name) to transcribe, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.
         * @param {string} model ID of the model to use. Only &#x60;whisper-1&#x60; is currently available.
         * @param {string} [prompt] An optional text to guide the model\\\&#39;s style or continue a previous audio segment. The [prompt](/docs/guides/speech-to-text/prompting) should match the audio language.
         * @param {string} [responseFormat] The format of the transcript output, in one of these options: json, text, srt, verbose_json, or vtt.
         * @param {number} [temperature] The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use [log probability](https://en.wikipedia.org/wiki/Log_probability) to automatically increase the temperature until certain thresholds are hit.
         * @param {string} [language] The language of the input audio. Supplying the input language in [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format will improve accuracy and latency.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createTranscription(file, model, prompt, responseFormat, temperature, language, options) {
            return localVarFp.createTranscription(file, model, prompt, responseFormat, temperature, language, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Translates audio into into English.
         * @param {File} file The audio file object (not file name) translate, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.
         * @param {string} model ID of the model to use. Only &#x60;whisper-1&#x60; is currently available.
         * @param {string} [prompt] An optional text to guide the model\\\&#39;s style or continue a previous audio segment. The [prompt](/docs/guides/speech-to-text/prompting) should be in English.
         * @param {string} [responseFormat] The format of the transcript output, in one of these options: json, text, srt, verbose_json, or vtt.
         * @param {number} [temperature] The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use [log probability](https://en.wikipedia.org/wiki/Log_probability) to automatically increase the temperature until certain thresholds are hit.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createTranslation(file, model, prompt, responseFormat, temperature, options) {
            return localVarFp.createTranslation(file, model, prompt, responseFormat, temperature, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Delete a file.
         * @param {string} fileId The ID of the file to use for this request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteFile(fileId, options) {
            return localVarFp.deleteFile(fileId, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Delete a fine-tuned model. You must have the Owner role in your organization.
         * @param {string} model The model to delete
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteModel(model, options) {
            return localVarFp.deleteModel(model, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Returns the contents of the specified file
         * @param {string} fileId The ID of the file to use for this request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        downloadFile(fileId, options) {
            return localVarFp.downloadFile(fileId, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Lists the currently available (non-finetuned) models, and provides basic information about each one such as the owner and availability.
         * @param {*} [options] Override http request option.
         * @deprecated
         * @throws {RequiredError}
         */
        listEngines(options) {
            return localVarFp.listEngines(options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Returns a list of files that belong to the user\'s organization.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listFiles(options) {
            return localVarFp.listFiles(options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Get fine-grained status updates for a fine-tune job.
         * @param {string} fineTuneId The ID of the fine-tune job to get events for.
         * @param {boolean} [stream] Whether to stream events for the fine-tune job. If set to true, events will be sent as data-only [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) as they become available. The stream will terminate with a &#x60;data: [DONE]&#x60; message when the job is finished (succeeded, cancelled, or failed).  If set to false, only events generated so far will be returned.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listFineTuneEvents(fineTuneId, stream, options) {
            return localVarFp.listFineTuneEvents(fineTuneId, stream, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary List your organization\'s fine-tuning jobs
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listFineTunes(options) {
            return localVarFp.listFineTunes(options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Lists the currently available models, and provides basic information about each one such as the owner and availability.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listModels(options) {
            return localVarFp.listModels(options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Retrieves a model instance, providing basic information about it such as the owner and availability.
         * @param {string} engineId The ID of the engine to use for this request
         * @param {*} [options] Override http request option.
         * @deprecated
         * @throws {RequiredError}
         */
        retrieveEngine(engineId, options) {
            return localVarFp.retrieveEngine(engineId, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Returns information about a specific file.
         * @param {string} fileId The ID of the file to use for this request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        retrieveFile(fileId, options) {
            return localVarFp.retrieveFile(fileId, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Gets info about the fine-tune job.  [Learn more about Fine-tuning](/docs/guides/fine-tuning)
         * @param {string} fineTuneId The ID of the fine-tune job
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        retrieveFineTune(fineTuneId, options) {
            return localVarFp.retrieveFineTune(fineTuneId, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Retrieves a model instance, providing basic information about the model such as the owner and permissioning.
         * @param {string} model The ID of the model to use for this request
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        retrieveModel(model, options) {
            return localVarFp.retrieveModel(model, options).then((request) => request(axios, basePath));
        },
    };
};
/**
 * OpenAIApi - object-oriented interface
 * @export
 * @class OpenAIApi
 * @extends {BaseAPI}
 */
class OpenAIApi extends base_1.BaseAPI {
    /**
     *
     * @summary Immediately cancel a fine-tune job.
     * @param {string} fineTuneId The ID of the fine-tune job to cancel
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    cancelFineTune(fineTuneId, options) {
        return exports.OpenAIApiFp(this.configuration).cancelFineTune(fineTuneId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Answers the specified question using the provided documents and examples.  The endpoint first [searches](/docs/api-reference/searches) over provided documents or files to find relevant context. The relevant context is combined with the provided examples and question to create the prompt for [completion](/docs/api-reference/completions).
     * @param {CreateAnswerRequest} createAnswerRequest
     * @param {*} [options] Override http request option.
     * @deprecated
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    createAnswer(createAnswerRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createAnswer(createAnswerRequest, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Creates a model response for the given chat conversation.
     * @param {CreateChatCompletionRequest} createChatCompletionRequest
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    createChatCompletion(createChatCompletionRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createChatCompletion(createChatCompletionRequest, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Classifies the specified `query` using provided examples.  The endpoint first [searches](/docs/api-reference/searches) over the labeled examples to select the ones most relevant for the particular query. Then, the relevant examples are combined with the query to construct a prompt to produce the final label via the [completions](/docs/api-reference/completions) endpoint.  Labeled examples can be provided via an uploaded `file`, or explicitly listed in the request using the `examples` parameter for quick tests and small scale use cases.
     * @param {CreateClassificationRequest} createClassificationRequest
     * @param {*} [options] Override http request option.
     * @deprecated
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    createClassification(createClassificationRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createClassification(createClassificationRequest, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Creates a completion for the provided prompt and parameters.
     * @param {CreateCompletionRequest} createCompletionRequest
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    createCompletion(createCompletionRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createCompletion(createCompletionRequest, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Creates a new edit for the provided input, instruction, and parameters.
     * @param {CreateEditRequest} createEditRequest
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    createEdit(createEditRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createEdit(createEditRequest, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Creates an embedding vector representing the input text.
     * @param {CreateEmbeddingRequest} createEmbeddingRequest
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    createEmbedding(createEmbeddingRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createEmbedding(createEmbeddingRequest, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Upload a file that contains document(s) to be used across various endpoints/features. Currently, the size of all the files uploaded by one organization can be up to 1 GB. Please contact us if you need to increase the storage limit.
     * @param {File} file Name of the [JSON Lines](https://jsonlines.readthedocs.io/en/latest/) file to be uploaded.  If the &#x60;purpose&#x60; is set to \\\&quot;fine-tune\\\&quot;, each line is a JSON record with \\\&quot;prompt\\\&quot; and \\\&quot;completion\\\&quot; fields representing your [training examples](/docs/guides/fine-tuning/prepare-training-data).
     * @param {string} purpose The intended purpose of the uploaded documents.  Use \\\&quot;fine-tune\\\&quot; for [Fine-tuning](/docs/api-reference/fine-tunes). This allows us to validate the format of the uploaded file.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    createFile(file, purpose, options) {
        return exports.OpenAIApiFp(this.configuration).createFile(file, purpose, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Creates a job that fine-tunes a specified model from a given dataset.  Response includes details of the enqueued job including job status and the name of the fine-tuned models once complete.  [Learn more about Fine-tuning](/docs/guides/fine-tuning)
     * @param {CreateFineTuneRequest} createFineTuneRequest
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    createFineTune(createFineTuneRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createFineTune(createFineTuneRequest, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Creates an image given a prompt.
     * @param {CreateImageRequest} createImageRequest
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    createImage(createImageRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createImage(createImageRequest, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Creates an edited or extended image given an original image and a prompt.
     * @param {File} image The image to edit. Must be a valid PNG file, less than 4MB, and square. If mask is not provided, image must have transparency, which will be used as the mask.
     * @param {string} prompt A text description of the desired image(s). The maximum length is 1000 characters.
     * @param {File} [mask] An additional image whose fully transparent areas (e.g. where alpha is zero) indicate where &#x60;image&#x60; should be edited. Must be a valid PNG file, less than 4MB, and have the same dimensions as &#x60;image&#x60;.
     * @param {number} [n] The number of images to generate. Must be between 1 and 10.
     * @param {string} [size] The size of the generated images. Must be one of &#x60;256x256&#x60;, &#x60;512x512&#x60;, or &#x60;1024x1024&#x60;.
     * @param {string} [responseFormat] The format in which the generated images are returned. Must be one of &#x60;url&#x60; or &#x60;b64_json&#x60;.
     * @param {string} [user] A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids).
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    createImageEdit(image, prompt, mask, n, size, responseFormat, user, options) {
        return exports.OpenAIApiFp(this.configuration).createImageEdit(image, prompt, mask, n, size, responseFormat, user, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Creates a variation of a given image.
     * @param {File} image The image to use as the basis for the variation(s). Must be a valid PNG file, less than 4MB, and square.
     * @param {number} [n] The number of images to generate. Must be between 1 and 10.
     * @param {string} [size] The size of the generated images. Must be one of &#x60;256x256&#x60;, &#x60;512x512&#x60;, or &#x60;1024x1024&#x60;.
     * @param {string} [responseFormat] The format in which the generated images are returned. Must be one of &#x60;url&#x60; or &#x60;b64_json&#x60;.
     * @param {string} [user] A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices/end-user-ids).
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    createImageVariation(image, n, size, responseFormat, user, options) {
        return exports.OpenAIApiFp(this.configuration).createImageVariation(image, n, size, responseFormat, user, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Classifies if text violates OpenAI\'s Content Policy
     * @param {CreateModerationRequest} createModerationRequest
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    createModeration(createModerationRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createModeration(createModerationRequest, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary The search endpoint computes similarity scores between provided query and documents. Documents can be passed directly to the API if there are no more than 200 of them.  To go beyond the 200 document limit, documents can be processed offline and then used for efficient retrieval at query time. When `file` is set, the search endpoint searches over all the documents in the given file and returns up to the `max_rerank` number of documents. These documents will be returned along with their search scores.  The similarity score is a positive score that usually ranges from 0 to 300 (but can sometimes go higher), where a score above 200 usually means the document is semantically similar to the query.
     * @param {string} engineId The ID of the engine to use for this request.  You can select one of &#x60;ada&#x60;, &#x60;babbage&#x60;, &#x60;curie&#x60;, or &#x60;davinci&#x60;.
     * @param {CreateSearchRequest} createSearchRequest
     * @param {*} [options] Override http request option.
     * @deprecated
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    createSearch(engineId, createSearchRequest, options) {
        return exports.OpenAIApiFp(this.configuration).createSearch(engineId, createSearchRequest, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Transcribes audio into the input language.
     * @param {File} file The audio file object (not file name) to transcribe, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.
     * @param {string} model ID of the model to use. Only &#x60;whisper-1&#x60; is currently available.
     * @param {string} [prompt] An optional text to guide the model\\\&#39;s style or continue a previous audio segment. The [prompt](/docs/guides/speech-to-text/prompting) should match the audio language.
     * @param {string} [responseFormat] The format of the transcript output, in one of these options: json, text, srt, verbose_json, or vtt.
     * @param {number} [temperature] The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use [log probability](https://en.wikipedia.org/wiki/Log_probability) to automatically increase the temperature until certain thresholds are hit.
     * @param {string} [language] The language of the input audio. Supplying the input language in [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format will improve accuracy and latency.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    createTranscription(file, model, prompt, responseFormat, temperature, language, options) {
        return exports.OpenAIApiFp(this.configuration).createTranscription(file, model, prompt, responseFormat, temperature, language, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Translates audio into into English.
     * @param {File} file The audio file object (not file name) translate, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.
     * @param {string} model ID of the model to use. Only &#x60;whisper-1&#x60; is currently available.
     * @param {string} [prompt] An optional text to guide the model\\\&#39;s style or continue a previous audio segment. The [prompt](/docs/guides/speech-to-text/prompting) should be in English.
     * @param {string} [responseFormat] The format of the transcript output, in one of these options: json, text, srt, verbose_json, or vtt.
     * @param {number} [temperature] The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use [log probability](https://en.wikipedia.org/wiki/Log_probability) to automatically increase the temperature until certain thresholds are hit.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    createTranslation(file, model, prompt, responseFormat, temperature, options) {
        return exports.OpenAIApiFp(this.configuration).createTranslation(file, model, prompt, responseFormat, temperature, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Delete a file.
     * @param {string} fileId The ID of the file to use for this request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    deleteFile(fileId, options) {
        return exports.OpenAIApiFp(this.configuration).deleteFile(fileId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Delete a fine-tuned model. You must have the Owner role in your organization.
     * @param {string} model The model to delete
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    deleteModel(model, options) {
        return exports.OpenAIApiFp(this.configuration).deleteModel(model, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Returns the contents of the specified file
     * @param {string} fileId The ID of the file to use for this request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    downloadFile(fileId, options) {
        return exports.OpenAIApiFp(this.configuration).downloadFile(fileId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Lists the currently available (non-finetuned) models, and provides basic information about each one such as the owner and availability.
     * @param {*} [options] Override http request option.
     * @deprecated
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    listEngines(options) {
        return exports.OpenAIApiFp(this.configuration).listEngines(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Returns a list of files that belong to the user\'s organization.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    listFiles(options) {
        return exports.OpenAIApiFp(this.configuration).listFiles(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Get fine-grained status updates for a fine-tune job.
     * @param {string} fineTuneId The ID of the fine-tune job to get events for.
     * @param {boolean} [stream] Whether to stream events for the fine-tune job. If set to true, events will be sent as data-only [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) as they become available. The stream will terminate with a &#x60;data: [DONE]&#x60; message when the job is finished (succeeded, cancelled, or failed).  If set to false, only events generated so far will be returned.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    listFineTuneEvents(fineTuneId, stream, options) {
        return exports.OpenAIApiFp(this.configuration).listFineTuneEvents(fineTuneId, stream, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary List your organization\'s fine-tuning jobs
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    listFineTunes(options) {
        return exports.OpenAIApiFp(this.configuration).listFineTunes(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Lists the currently available models, and provides basic information about each one such as the owner and availability.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    listModels(options) {
        return exports.OpenAIApiFp(this.configuration).listModels(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Retrieves a model instance, providing basic information about it such as the owner and availability.
     * @param {string} engineId The ID of the engine to use for this request
     * @param {*} [options] Override http request option.
     * @deprecated
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    retrieveEngine(engineId, options) {
        return exports.OpenAIApiFp(this.configuration).retrieveEngine(engineId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Returns information about a specific file.
     * @param {string} fileId The ID of the file to use for this request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    retrieveFile(fileId, options) {
        return exports.OpenAIApiFp(this.configuration).retrieveFile(fileId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Gets info about the fine-tune job.  [Learn more about Fine-tuning](/docs/guides/fine-tuning)
     * @param {string} fineTuneId The ID of the fine-tune job
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    retrieveFineTune(fineTuneId, options) {
        return exports.OpenAIApiFp(this.configuration).retrieveFineTune(fineTuneId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Retrieves a model instance, providing basic information about the model such as the owner and permissioning.
     * @param {string} model The ID of the model to use for this request
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAIApi
     */
    retrieveModel(model, options) {
        return exports.OpenAIApiFp(this.configuration).retrieveModel(model, options).then((request) => request(this.axios, this.basePath));
    }
}
exports.OpenAIApi = OpenAIApi;


/***/ }),

/***/ 8928:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

/* tslint:disable */
/* eslint-disable */
/**
 * OpenAI API
 * APIs for sampling from and fine-tuning language models
 *
 * The version of the OpenAPI document: 1.3.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequiredError = exports.BaseAPI = exports.COLLECTION_FORMATS = exports.BASE_PATH = void 0;
const axios_1 = __nccwpck_require__(6545);
exports.BASE_PATH = "https://api.openai.com/v1".replace(/\/+$/, "");
/**
 *
 * @export
 */
exports.COLLECTION_FORMATS = {
    csv: ",",
    ssv: " ",
    tsv: "\t",
    pipes: "|",
};
/**
 *
 * @export
 * @class BaseAPI
 */
class BaseAPI {
    constructor(configuration, basePath = exports.BASE_PATH, axios = axios_1.default) {
        this.basePath = basePath;
        this.axios = axios;
        if (configuration) {
            this.configuration = configuration;
            this.basePath = configuration.basePath || this.basePath;
        }
    }
}
exports.BaseAPI = BaseAPI;
;
/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
class RequiredError extends Error {
    constructor(field, msg) {
        super(msg);
        this.field = field;
        this.name = "RequiredError";
    }
}
exports.RequiredError = RequiredError;


/***/ }),

/***/ 6478:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* tslint:disable */
/* eslint-disable */
/**
 * OpenAI API
 * APIs for sampling from and fine-tuning language models
 *
 * The version of the OpenAPI document: 1.3.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createRequestFunction = exports.toPathString = exports.serializeDataIfNeeded = exports.setSearchParams = exports.setOAuthToObject = exports.setBearerAuthToObject = exports.setBasicAuthToObject = exports.setApiKeyToObject = exports.assertParamExists = exports.DUMMY_BASE_URL = void 0;
const base_1 = __nccwpck_require__(8928);
/**
 *
 * @export
 */
exports.DUMMY_BASE_URL = 'https://example.com';
/**
 *
 * @throws {RequiredError}
 * @export
 */
exports.assertParamExists = function (functionName, paramName, paramValue) {
    if (paramValue === null || paramValue === undefined) {
        throw new base_1.RequiredError(paramName, `Required parameter ${paramName} was null or undefined when calling ${functionName}.`);
    }
};
/**
 *
 * @export
 */
exports.setApiKeyToObject = function (object, keyParamName, configuration) {
    return __awaiter(this, void 0, void 0, function* () {
        if (configuration && configuration.apiKey) {
            const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                ? yield configuration.apiKey(keyParamName)
                : yield configuration.apiKey;
            object[keyParamName] = localVarApiKeyValue;
        }
    });
};
/**
 *
 * @export
 */
exports.setBasicAuthToObject = function (object, configuration) {
    if (configuration && (configuration.username || configuration.password)) {
        object["auth"] = { username: configuration.username, password: configuration.password };
    }
};
/**
 *
 * @export
 */
exports.setBearerAuthToObject = function (object, configuration) {
    return __awaiter(this, void 0, void 0, function* () {
        if (configuration && configuration.accessToken) {
            const accessToken = typeof configuration.accessToken === 'function'
                ? yield configuration.accessToken()
                : yield configuration.accessToken;
            object["Authorization"] = "Bearer " + accessToken;
        }
    });
};
/**
 *
 * @export
 */
exports.setOAuthToObject = function (object, name, scopes, configuration) {
    return __awaiter(this, void 0, void 0, function* () {
        if (configuration && configuration.accessToken) {
            const localVarAccessTokenValue = typeof configuration.accessToken === 'function'
                ? yield configuration.accessToken(name, scopes)
                : yield configuration.accessToken;
            object["Authorization"] = "Bearer " + localVarAccessTokenValue;
        }
    });
};
function setFlattenedQueryParams(urlSearchParams, parameter, key = "") {
    if (parameter == null)
        return;
    if (typeof parameter === "object") {
        if (Array.isArray(parameter)) {
            parameter.forEach(item => setFlattenedQueryParams(urlSearchParams, item, key));
        }
        else {
            Object.keys(parameter).forEach(currentKey => setFlattenedQueryParams(urlSearchParams, parameter[currentKey], `${key}${key !== '' ? '.' : ''}${currentKey}`));
        }
    }
    else {
        if (urlSearchParams.has(key)) {
            urlSearchParams.append(key, parameter);
        }
        else {
            urlSearchParams.set(key, parameter);
        }
    }
}
/**
 *
 * @export
 */
exports.setSearchParams = function (url, ...objects) {
    const searchParams = new URLSearchParams(url.search);
    setFlattenedQueryParams(searchParams, objects);
    url.search = searchParams.toString();
};
/**
 *
 * @export
 */
exports.serializeDataIfNeeded = function (value, requestOptions, configuration) {
    const nonString = typeof value !== 'string';
    const needsSerialization = nonString && configuration && configuration.isJsonMime
        ? configuration.isJsonMime(requestOptions.headers['Content-Type'])
        : nonString;
    return needsSerialization
        ? JSON.stringify(value !== undefined ? value : {})
        : (value || "");
};
/**
 *
 * @export
 */
exports.toPathString = function (url) {
    return url.pathname + url.search + url.hash;
};
/**
 *
 * @export
 */
exports.createRequestFunction = function (axiosArgs, globalAxios, BASE_PATH, configuration) {
    return (axios = globalAxios, basePath = BASE_PATH) => {
        const axiosRequestArgs = Object.assign(Object.assign({}, axiosArgs.options), { url: ((configuration === null || configuration === void 0 ? void 0 : configuration.basePath) || basePath) + axiosArgs.url });
        return axios.request(axiosRequestArgs);
    };
};


/***/ }),

/***/ 402:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

/* tslint:disable */
/* eslint-disable */
/**
 * OpenAI API
 * APIs for sampling from and fine-tuning language models
 *
 * The version of the OpenAPI document: 1.3.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Configuration = void 0;
const packageJson = __nccwpck_require__(2811);
class Configuration {
    constructor(param = {}) {
        this.apiKey = param.apiKey;
        this.organization = param.organization;
        this.username = param.username;
        this.password = param.password;
        this.accessToken = param.accessToken;
        this.basePath = param.basePath;
        this.baseOptions = param.baseOptions;
        this.formDataCtor = param.formDataCtor;
        if (!this.baseOptions) {
            this.baseOptions = {};
        }
        this.baseOptions.headers = Object.assign({ 'User-Agent': `OpenAI/NodeJS/${packageJson.version}`, 'Authorization': `Bearer ${this.apiKey}` }, this.baseOptions.headers);
        if (this.organization) {
            this.baseOptions.headers['OpenAI-Organization'] = this.organization;
        }
        if (!this.formDataCtor) {
            this.formDataCtor = __nccwpck_require__(4334);
        }
    }
    /**
     * Check if the given MIME is a JSON MIME.
     * JSON MIME examples:
     *   application/json
     *   application/json; charset=UTF8
     *   APPLICATION/JSON
     *   application/vnd.company+json
     * @param mime - MIME (Multipurpose Internet Mail Extensions)
     * @return True if the given MIME is JSON, false otherwise.
     */
    isJsonMime(mime) {
        const jsonMime = new RegExp('^(application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
        return mime !== null && (jsonMime.test(mime) || mime.toLowerCase() === 'application/json-patch+json');
    }
}
exports.Configuration = Configuration;


/***/ }),

/***/ 9211:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* tslint:disable */
/* eslint-disable */
/**
 * OpenAI API
 * APIs for sampling from and fine-tuning language models
 *
 * The version of the OpenAPI document: 1.3.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__nccwpck_require__(2716), exports);
__exportStar(__nccwpck_require__(402), exports);


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 9975:
/***/ ((module) => {

module.exports = eval("require")("debug");


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 2781:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 7310:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 9796:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),

/***/ 4818:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"Abkhazian":{"name":"Abkhazian","names":["Abkhazian"],"iso639-2":"abk","iso639-1":"ab"},"Achinese":{"name":"Achinese","names":["Achinese"],"iso639-2":"ace","iso639-1":null},"Acoli":{"name":"Acoli","names":["Acoli"],"iso639-2":"ach","iso639-1":null},"Adangme":{"name":"Adangme","names":["Adangme"],"iso639-2":"ada","iso639-1":null},"Adygei":{"name":"Adygei","names":["Adyghe","Adygei"],"iso639-2":"ady","iso639-1":null},"Adyghe":{"name":"Adyghe","names":["Adyghe","Adygei"],"iso639-2":"ady","iso639-1":null},"Afar":{"name":"Afar","names":["Afar"],"iso639-2":"aar","iso639-1":"aa"},"Afrihili":{"name":"Afrihili","names":["Afrihili"],"iso639-2":"afh","iso639-1":null},"Afrikaans":{"name":"Afrikaans","names":["Afrikaans"],"iso639-2":"afr","iso639-1":"af"},"Afro-Asiatic languages":{"name":"Afro-Asiatic languages","names":["Afro-Asiatic languages"],"iso639-2":"afa","iso639-1":null},"Ainu":{"name":"Ainu","names":["Ainu"],"iso639-2":"ain","iso639-1":null},"Akan":{"name":"Akan","names":["Akan"],"iso639-2":"aka","iso639-1":"ak"},"Akkadian":{"name":"Akkadian","names":["Akkadian"],"iso639-2":"akk","iso639-1":null},"Albanian":{"name":"Albanian","names":["Albanian"],"iso639-2":"alb/sqi","iso639-1":"sq"},"Alemannic":{"name":"Alemannic","names":["Swiss German","Alemannic","Alsatian"],"iso639-2":"gsw","iso639-1":null},"Aleut":{"name":"Aleut","names":["Aleut"],"iso639-2":"ale","iso639-1":null},"Algonquian languages":{"name":"Algonquian languages","names":["Algonquian languages"],"iso639-2":"alg","iso639-1":null},"Alsatian":{"name":"Alsatian","names":["Swiss German","Alemannic","Alsatian"],"iso639-2":"gsw","iso639-1":null},"Altaic languages":{"name":"Altaic languages","names":["Altaic languages"],"iso639-2":"tut","iso639-1":null},"Amharic":{"name":"Amharic","names":["Amharic"],"iso639-2":"amh","iso639-1":"am"},"Angika":{"name":"Angika","names":["Angika"],"iso639-2":"anp","iso639-1":null},"Apache languages":{"name":"Apache languages","names":["Apache languages"],"iso639-2":"apa","iso639-1":null},"Arabic":{"name":"Arabic","names":["Arabic"],"iso639-2":"ara","iso639-1":"ar"},"Aragonese":{"name":"Aragonese","names":["Aragonese"],"iso639-2":"arg","iso639-1":"an"},"Arapaho":{"name":"Arapaho","names":["Arapaho"],"iso639-2":"arp","iso639-1":null},"Arawak":{"name":"Arawak","names":["Arawak"],"iso639-2":"arw","iso639-1":null},"Armenian":{"name":"Armenian","names":["Armenian"],"iso639-2":"arm/hye","iso639-1":"hy"},"Aromanian":{"name":"Aromanian","names":["Aromanian","Arumanian","Macedo-Romanian"],"iso639-2":"rup","iso639-1":null},"Artificial languages":{"name":"Artificial languages","names":["Artificial languages"],"iso639-2":"art","iso639-1":null},"Arumanian":{"name":"Arumanian","names":["Aromanian","Arumanian","Macedo-Romanian"],"iso639-2":"rup","iso639-1":null},"Assamese":{"name":"Assamese","names":["Assamese"],"iso639-2":"asm","iso639-1":"as"},"Asturian":{"name":"Asturian","names":["Asturian","Bable","Leonese","Asturleonese"],"iso639-2":"ast","iso639-1":null},"Asturleonese":{"name":"Asturleonese","names":["Asturian","Bable","Leonese","Asturleonese"],"iso639-2":"ast","iso639-1":null},"Athapascan languages":{"name":"Athapascan languages","names":["Athapascan languages"],"iso639-2":"ath","iso639-1":null},"Australian languages":{"name":"Australian languages","names":["Australian languages"],"iso639-2":"aus","iso639-1":null},"Austronesian languages":{"name":"Austronesian languages","names":["Austronesian languages"],"iso639-2":"map","iso639-1":null},"Avaric":{"name":"Avaric","names":["Avaric"],"iso639-2":"ava","iso639-1":"av"},"Avestan":{"name":"Avestan","names":["Avestan"],"iso639-2":"ave","iso639-1":"ae"},"Awadhi":{"name":"Awadhi","names":["Awadhi"],"iso639-2":"awa","iso639-1":null},"Aymara":{"name":"Aymara","names":["Aymara"],"iso639-2":"aym","iso639-1":"ay"},"Azerbaijani":{"name":"Azerbaijani","names":["Azerbaijani"],"iso639-2":"aze","iso639-1":"az"},"Bable":{"name":"Bable","names":["Asturian","Bable","Leonese","Asturleonese"],"iso639-2":"ast","iso639-1":null},"Balinese":{"name":"Balinese","names":["Balinese"],"iso639-2":"ban","iso639-1":null},"Baltic languages":{"name":"Baltic languages","names":["Baltic languages"],"iso639-2":"bat","iso639-1":null},"Baluchi":{"name":"Baluchi","names":["Baluchi"],"iso639-2":"bal","iso639-1":null},"Bambara":{"name":"Bambara","names":["Bambara"],"iso639-2":"bam","iso639-1":"bm"},"Bamileke languages":{"name":"Bamileke languages","names":["Bamileke languages"],"iso639-2":"bai","iso639-1":null},"Banda languages":{"name":"Banda languages","names":["Banda languages"],"iso639-2":"bad","iso639-1":null},"Bantu languages":{"name":"Bantu languages","names":["Bantu languages"],"iso639-2":"bnt","iso639-1":null},"Basa":{"name":"Basa","names":["Basa"],"iso639-2":"bas","iso639-1":null},"Bashkir":{"name":"Bashkir","names":["Bashkir"],"iso639-2":"bak","iso639-1":"ba"},"Basque":{"name":"Basque","names":["Basque"],"iso639-2":"baq/eus","iso639-1":"eu"},"Batak languages":{"name":"Batak languages","names":["Batak languages"],"iso639-2":"btk","iso639-1":null},"Bedawiyet":{"name":"Bedawiyet","names":["Beja","Bedawiyet"],"iso639-2":"bej","iso639-1":null},"Beja":{"name":"Beja","names":["Beja","Bedawiyet"],"iso639-2":"bej","iso639-1":null},"Belarusian":{"name":"Belarusian","names":["Belarusian"],"iso639-2":"bel","iso639-1":"be"},"Bemba":{"name":"Bemba","names":["Bemba"],"iso639-2":"bem","iso639-1":null},"Bengali":{"name":"Bengali","names":["Bengali"],"iso639-2":"ben","iso639-1":"bn"},"Berber languages":{"name":"Berber languages","names":["Berber languages"],"iso639-2":"ber","iso639-1":null},"Bhojpuri":{"name":"Bhojpuri","names":["Bhojpuri"],"iso639-2":"bho","iso639-1":null},"Bihari languages":{"name":"Bihari languages","names":["Bihari languages"],"iso639-2":"bih","iso639-1":"bh"},"Bikol":{"name":"Bikol","names":["Bikol"],"iso639-2":"bik","iso639-1":null},"Bilin":{"name":"Bilin","names":["Blin","Bilin"],"iso639-2":"byn","iso639-1":null},"Bini":{"name":"Bini","names":["Bini","Edo"],"iso639-2":"bin","iso639-1":null},"Bislama":{"name":"Bislama","names":["Bislama"],"iso639-2":"bis","iso639-1":"bi"},"Blin":{"name":"Blin","names":["Blin","Bilin"],"iso639-2":"byn","iso639-1":null},"Bliss":{"name":"Bliss","names":["Blissymbols","Blissymbolics","Bliss"],"iso639-2":"zbl","iso639-1":null},"Blissymbolics":{"name":"Blissymbolics","names":["Blissymbols","Blissymbolics","Bliss"],"iso639-2":"zbl","iso639-1":null},"Blissymbols":{"name":"Blissymbols","names":["Blissymbols","Blissymbolics","Bliss"],"iso639-2":"zbl","iso639-1":null},"Bokmål, Norwegian":{"name":"Bokmål, Norwegian","names":["Bokmål, Norwegian","Norwegian Bokmål"],"iso639-2":"nob","iso639-1":"nb"},"Bosnian":{"name":"Bosnian","names":["Bosnian"],"iso639-2":"bos","iso639-1":"bs"},"Braj":{"name":"Braj","names":["Braj"],"iso639-2":"bra","iso639-1":null},"Breton":{"name":"Breton","names":["Breton"],"iso639-2":"bre","iso639-1":"br"},"Buginese":{"name":"Buginese","names":["Buginese"],"iso639-2":"bug","iso639-1":null},"Bulgarian":{"name":"Bulgarian","names":["Bulgarian"],"iso639-2":"bul","iso639-1":"bg"},"Buriat":{"name":"Buriat","names":["Buriat"],"iso639-2":"bua","iso639-1":null},"Burmese":{"name":"Burmese","names":["Burmese"],"iso639-2":"bur/mya","iso639-1":"my"},"Caddo":{"name":"Caddo","names":["Caddo"],"iso639-2":"cad","iso639-1":null},"Castilian":{"name":"Castilian","names":["Spanish","Castilian"],"iso639-2":"spa","iso639-1":"es"},"Catalan":{"name":"Catalan","names":["Catalan","Valencian"],"iso639-2":"cat","iso639-1":"ca"},"Caucasian languages":{"name":"Caucasian languages","names":["Caucasian languages"],"iso639-2":"cau","iso639-1":null},"Cebuano":{"name":"Cebuano","names":["Cebuano"],"iso639-2":"ceb","iso639-1":null},"Celtic languages":{"name":"Celtic languages","names":["Celtic languages"],"iso639-2":"cel","iso639-1":null},"Central American Indian languages":{"name":"Central American Indian languages","names":["Central American Indian languages"],"iso639-2":"cai","iso639-1":null},"Central Khmer":{"name":"Central Khmer","names":["Central Khmer"],"iso639-2":"khm","iso639-1":"km"},"Chagatai":{"name":"Chagatai","names":["Chagatai"],"iso639-2":"chg","iso639-1":null},"Chamic languages":{"name":"Chamic languages","names":["Chamic languages"],"iso639-2":"cmc","iso639-1":null},"Chamorro":{"name":"Chamorro","names":["Chamorro"],"iso639-2":"cha","iso639-1":"ch"},"Chechen":{"name":"Chechen","names":["Chechen"],"iso639-2":"che","iso639-1":"ce"},"Cherokee":{"name":"Cherokee","names":["Cherokee"],"iso639-2":"chr","iso639-1":null},"Chewa":{"name":"Chewa","names":["Chichewa","Chewa","Nyanja"],"iso639-2":"nya","iso639-1":"ny"},"Cheyenne":{"name":"Cheyenne","names":["Cheyenne"],"iso639-2":"chy","iso639-1":null},"Chibcha":{"name":"Chibcha","names":["Chibcha"],"iso639-2":"chb","iso639-1":null},"Chichewa":{"name":"Chichewa","names":["Chichewa","Chewa","Nyanja"],"iso639-2":"nya","iso639-1":"ny"},"Chinese":{"name":"Chinese","names":["Chinese"],"iso639-2":"chi/zho","iso639-1":"zh"},"Chinook jargon":{"name":"Chinook jargon","names":["Chinook jargon"],"iso639-2":"chn","iso639-1":null},"Chipewyan":{"name":"Chipewyan","names":["Chipewyan","Dene Suline"],"iso639-2":"chp","iso639-1":null},"Choctaw":{"name":"Choctaw","names":["Choctaw"],"iso639-2":"cho","iso639-1":null},"Chuang":{"name":"Chuang","names":["Zhuang","Chuang"],"iso639-2":"zha","iso639-1":"za"},"Church Slavic":{"name":"Church Slavic","names":["Church Slavic","Old Slavonic","Church Slavonic","Old Bulgarian","Old Church Slavonic"],"iso639-2":"chu","iso639-1":"cu"},"Church Slavonic":{"name":"Church Slavonic","names":["Church Slavic","Old Slavonic","Church Slavonic","Old Bulgarian","Old Church Slavonic"],"iso639-2":"chu","iso639-1":"cu"},"Chuukese":{"name":"Chuukese","names":["Chuukese"],"iso639-2":"chk","iso639-1":null},"Chuvash":{"name":"Chuvash","names":["Chuvash"],"iso639-2":"chv","iso639-1":"cv"},"Classical Nepal Bhasa":{"name":"Classical Nepal Bhasa","names":["Classical Newari","Old Newari","Classical Nepal Bhasa"],"iso639-2":"nwc","iso639-1":null},"Classical Newari":{"name":"Classical Newari","names":["Classical Newari","Old Newari","Classical Nepal Bhasa"],"iso639-2":"nwc","iso639-1":null},"Classical Syriac":{"name":"Classical Syriac","names":["Classical Syriac"],"iso639-2":"syc","iso639-1":null},"Cook Islands Maori":{"name":"Cook Islands Maori","names":["Rarotongan","Cook Islands Maori"],"iso639-2":"rar","iso639-1":null},"Coptic":{"name":"Coptic","names":["Coptic"],"iso639-2":"cop","iso639-1":null},"Cornish":{"name":"Cornish","names":["Cornish"],"iso639-2":"cor","iso639-1":"kw"},"Corsican":{"name":"Corsican","names":["Corsican"],"iso639-2":"cos","iso639-1":"co"},"Cree":{"name":"Cree","names":["Cree"],"iso639-2":"cre","iso639-1":"cr"},"Creek":{"name":"Creek","names":["Creek"],"iso639-2":"mus","iso639-1":null},"Creoles and pidgins":{"name":"Creoles and pidgins","names":["Creoles and pidgins"],"iso639-2":"crp","iso639-1":null},"Creoles and pidgins, English based":{"name":"Creoles and pidgins, English based","names":["Creoles and pidgins, English based"],"iso639-2":"cpe","iso639-1":null},"Creoles and pidgins, French-based":{"name":"Creoles and pidgins, French-based","names":["Creoles and pidgins, French-based"],"iso639-2":"cpf","iso639-1":null},"Creoles and pidgins, Portuguese-based":{"name":"Creoles and pidgins, Portuguese-based","names":["Creoles and pidgins, Portuguese-based"],"iso639-2":"cpp","iso639-1":null},"Crimean Tatar":{"name":"Crimean Tatar","names":["Crimean Tatar","Crimean Turkish"],"iso639-2":"crh","iso639-1":null},"Crimean Turkish":{"name":"Crimean Turkish","names":["Crimean Tatar","Crimean Turkish"],"iso639-2":"crh","iso639-1":null},"Croatian":{"name":"Croatian","names":["Croatian"],"iso639-2":"hrv","iso639-1":"hr"},"Cushitic languages":{"name":"Cushitic languages","names":["Cushitic languages"],"iso639-2":"cus","iso639-1":null},"Czech":{"name":"Czech","names":["Czech"],"iso639-2":"cze/ces","iso639-1":"cs"},"Dakota":{"name":"Dakota","names":["Dakota"],"iso639-2":"dak","iso639-1":null},"Danish":{"name":"Danish","names":["Danish"],"iso639-2":"dan","iso639-1":"da"},"Dargwa":{"name":"Dargwa","names":["Dargwa"],"iso639-2":"dar","iso639-1":null},"Delaware":{"name":"Delaware","names":["Delaware"],"iso639-2":"del","iso639-1":null},"Dene Suline":{"name":"Dene Suline","names":["Chipewyan","Dene Suline"],"iso639-2":"chp","iso639-1":null},"Dhivehi":{"name":"Dhivehi","names":["Divehi","Dhivehi","Maldivian"],"iso639-2":"div","iso639-1":"dv"},"Dimili":{"name":"Dimili","names":["Zaza","Dimili","Dimli","Kirdki","Kirmanjki","Zazaki"],"iso639-2":"zza","iso639-1":null},"Dimli":{"name":"Dimli","names":["Zaza","Dimili","Dimli","Kirdki","Kirmanjki","Zazaki"],"iso639-2":"zza","iso639-1":null},"Dinka":{"name":"Dinka","names":["Dinka"],"iso639-2":"din","iso639-1":null},"Divehi":{"name":"Divehi","names":["Divehi","Dhivehi","Maldivian"],"iso639-2":"div","iso639-1":"dv"},"Dogri":{"name":"Dogri","names":["Dogri"],"iso639-2":"doi","iso639-1":null},"Dogrib":{"name":"Dogrib","names":["Dogrib"],"iso639-2":"dgr","iso639-1":null},"Dravidian languages":{"name":"Dravidian languages","names":["Dravidian languages"],"iso639-2":"dra","iso639-1":null},"Duala":{"name":"Duala","names":["Duala"],"iso639-2":"dua","iso639-1":null},"Dutch":{"name":"Dutch","names":["Dutch","Flemish"],"iso639-2":"dut/nld","iso639-1":"nl"},"Dutch, Middle (ca.1050-1350)":{"name":"Dutch, Middle (ca.1050-1350)","names":["Dutch, Middle (ca.1050-1350)"],"iso639-2":"dum","iso639-1":null},"Dyula":{"name":"Dyula","names":["Dyula"],"iso639-2":"dyu","iso639-1":null},"Dzongkha":{"name":"Dzongkha","names":["Dzongkha"],"iso639-2":"dzo","iso639-1":"dz"},"Eastern Frisian":{"name":"Eastern Frisian","names":["Eastern Frisian"],"iso639-2":"frs","iso639-1":null},"Edo":{"name":"Edo","names":["Bini","Edo"],"iso639-2":"bin","iso639-1":null},"Efik":{"name":"Efik","names":["Efik"],"iso639-2":"efi","iso639-1":null},"Egyptian (Ancient)":{"name":"Egyptian (Ancient)","names":["Egyptian (Ancient)"],"iso639-2":"egy","iso639-1":null},"Ekajuk":{"name":"Ekajuk","names":["Ekajuk"],"iso639-2":"eka","iso639-1":null},"Elamite":{"name":"Elamite","names":["Elamite"],"iso639-2":"elx","iso639-1":null},"English":{"name":"English","names":["English"],"iso639-2":"eng","iso639-1":"en"},"English, Middle (1100-1500)":{"name":"English, Middle (1100-1500)","names":["English, Middle (1100-1500)"],"iso639-2":"enm","iso639-1":null},"English, Old (ca.450-1100)":{"name":"English, Old (ca.450-1100)","names":["English, Old (ca.450-1100)"],"iso639-2":"ang","iso639-1":null},"Erzya":{"name":"Erzya","names":["Erzya"],"iso639-2":"myv","iso639-1":null},"Esperanto":{"name":"Esperanto","names":["Esperanto"],"iso639-2":"epo","iso639-1":"eo"},"Estonian":{"name":"Estonian","names":["Estonian"],"iso639-2":"est","iso639-1":"et"},"Ewe":{"name":"Ewe","names":["Ewe"],"iso639-2":"ewe","iso639-1":"ee"},"Ewondo":{"name":"Ewondo","names":["Ewondo"],"iso639-2":"ewo","iso639-1":null},"Fang":{"name":"Fang","names":["Fang"],"iso639-2":"fan","iso639-1":null},"Fanti":{"name":"Fanti","names":["Fanti"],"iso639-2":"fat","iso639-1":null},"Faroese":{"name":"Faroese","names":["Faroese"],"iso639-2":"fao","iso639-1":"fo"},"Fijian":{"name":"Fijian","names":["Fijian"],"iso639-2":"fij","iso639-1":"fj"},"Filipino":{"name":"Filipino","names":["Filipino","Pilipino"],"iso639-2":"fil","iso639-1":null},"Finnish":{"name":"Finnish","names":["Finnish"],"iso639-2":"fin","iso639-1":"fi"},"Finno-Ugrian languages":{"name":"Finno-Ugrian languages","names":["Finno-Ugrian languages"],"iso639-2":"fiu","iso639-1":null},"Flemish":{"name":"Flemish","names":["Dutch","Flemish"],"iso639-2":"dut/nld","iso639-1":"nl"},"Fon":{"name":"Fon","names":["Fon"],"iso639-2":"fon","iso639-1":null},"French":{"name":"French","names":["French"],"iso639-2":"fre/fra","iso639-1":"fr"},"French, Middle (ca.1400-1600)":{"name":"French, Middle (ca.1400-1600)","names":["French, Middle (ca.1400-1600)"],"iso639-2":"frm","iso639-1":null},"French, Old (842-ca.1400)":{"name":"French, Old (842-ca.1400)","names":["French, Old (842-ca.1400)"],"iso639-2":"fro","iso639-1":null},"Friulian":{"name":"Friulian","names":["Friulian"],"iso639-2":"fur","iso639-1":null},"Fulah":{"name":"Fulah","names":["Fulah"],"iso639-2":"ful","iso639-1":"ff"},"Ga":{"name":"Ga","names":["Ga"],"iso639-2":"gaa","iso639-1":null},"Gaelic":{"name":"Gaelic","names":["Gaelic","Scottish Gaelic"],"iso639-2":"gla","iso639-1":"gd"},"Galibi Carib":{"name":"Galibi Carib","names":["Galibi Carib"],"iso639-2":"car","iso639-1":null},"Galician":{"name":"Galician","names":["Galician"],"iso639-2":"glg","iso639-1":"gl"},"Ganda":{"name":"Ganda","names":["Ganda"],"iso639-2":"lug","iso639-1":"lg"},"Gayo":{"name":"Gayo","names":["Gayo"],"iso639-2":"gay","iso639-1":null},"Gbaya":{"name":"Gbaya","names":["Gbaya"],"iso639-2":"gba","iso639-1":null},"Geez":{"name":"Geez","names":["Geez"],"iso639-2":"gez","iso639-1":null},"Georgian":{"name":"Georgian","names":["Georgian"],"iso639-2":"geo/kat","iso639-1":"ka"},"German":{"name":"German","names":["German"],"iso639-2":"ger/deu","iso639-1":"de"},"German, Low":{"name":"German, Low","names":["Low German","Low Saxon","German, Low","Saxon, Low"],"iso639-2":"nds","iso639-1":null},"German, Middle High (ca.1050-1500)":{"name":"German, Middle High (ca.1050-1500)","names":["German, Middle High (ca.1050-1500)"],"iso639-2":"gmh","iso639-1":null},"German, Old High (ca.750-1050)":{"name":"German, Old High (ca.750-1050)","names":["German, Old High (ca.750-1050)"],"iso639-2":"goh","iso639-1":null},"Germanic languages":{"name":"Germanic languages","names":["Germanic languages"],"iso639-2":"gem","iso639-1":null},"Gikuyu":{"name":"Gikuyu","names":["Kikuyu","Gikuyu"],"iso639-2":"kik","iso639-1":"ki"},"Gilbertese":{"name":"Gilbertese","names":["Gilbertese"],"iso639-2":"gil","iso639-1":null},"Gondi":{"name":"Gondi","names":["Gondi"],"iso639-2":"gon","iso639-1":null},"Gorontalo":{"name":"Gorontalo","names":["Gorontalo"],"iso639-2":"gor","iso639-1":null},"Gothic":{"name":"Gothic","names":["Gothic"],"iso639-2":"got","iso639-1":null},"Grebo":{"name":"Grebo","names":["Grebo"],"iso639-2":"grb","iso639-1":null},"Greek, Ancient (to 1453)":{"name":"Greek, Ancient (to 1453)","names":["Greek, Ancient (to 1453)"],"iso639-2":"grc","iso639-1":null},"Greek, Modern (1453-)":{"name":"Greek, Modern (1453-)","names":["Greek, Modern (1453-)"],"iso639-2":"gre/ell","iso639-1":"el"},"Greenlandic":{"name":"Greenlandic","names":["Kalaallisut","Greenlandic"],"iso639-2":"kal","iso639-1":"kl"},"Guarani":{"name":"Guarani","names":["Guarani"],"iso639-2":"grn","iso639-1":"gn"},"Gujarati":{"name":"Gujarati","names":["Gujarati"],"iso639-2":"guj","iso639-1":"gu"},"Gwich\'in":{"name":"Gwich\'in","names":["Gwich\'in"],"iso639-2":"gwi","iso639-1":null},"Haida":{"name":"Haida","names":["Haida"],"iso639-2":"hai","iso639-1":null},"Haitian":{"name":"Haitian","names":["Haitian","Haitian Creole"],"iso639-2":"hat","iso639-1":"ht"},"Haitian Creole":{"name":"Haitian Creole","names":["Haitian","Haitian Creole"],"iso639-2":"hat","iso639-1":"ht"},"Hausa":{"name":"Hausa","names":["Hausa"],"iso639-2":"hau","iso639-1":"ha"},"Hawaiian":{"name":"Hawaiian","names":["Hawaiian"],"iso639-2":"haw","iso639-1":null},"Hebrew":{"name":"Hebrew","names":["Hebrew"],"iso639-2":"heb","iso639-1":"he"},"Herero":{"name":"Herero","names":["Herero"],"iso639-2":"her","iso639-1":"hz"},"Hiligaynon":{"name":"Hiligaynon","names":["Hiligaynon"],"iso639-2":"hil","iso639-1":null},"Himachali languages":{"name":"Himachali languages","names":["Himachali languages","Western Pahari languages"],"iso639-2":"him","iso639-1":null},"Hindi":{"name":"Hindi","names":["Hindi"],"iso639-2":"hin","iso639-1":"hi"},"Hiri Motu":{"name":"Hiri Motu","names":["Hiri Motu"],"iso639-2":"hmo","iso639-1":"ho"},"Hittite":{"name":"Hittite","names":["Hittite"],"iso639-2":"hit","iso639-1":null},"Hmong":{"name":"Hmong","names":["Hmong","Mong"],"iso639-2":"hmn","iso639-1":null},"Hungarian":{"name":"Hungarian","names":["Hungarian"],"iso639-2":"hun","iso639-1":"hu"},"Hupa":{"name":"Hupa","names":["Hupa"],"iso639-2":"hup","iso639-1":null},"Iban":{"name":"Iban","names":["Iban"],"iso639-2":"iba","iso639-1":null},"Icelandic":{"name":"Icelandic","names":["Icelandic"],"iso639-2":"ice/isl","iso639-1":"is"},"Ido":{"name":"Ido","names":["Ido"],"iso639-2":"ido","iso639-1":"io"},"Igbo":{"name":"Igbo","names":["Igbo"],"iso639-2":"ibo","iso639-1":"ig"},"Ijo languages":{"name":"Ijo languages","names":["Ijo languages"],"iso639-2":"ijo","iso639-1":null},"Iloko":{"name":"Iloko","names":["Iloko"],"iso639-2":"ilo","iso639-1":null},"Imperial Aramaic (700-300 BCE)":{"name":"Imperial Aramaic (700-300 BCE)","names":["Official Aramaic (700-300 BCE)","Imperial Aramaic (700-300 BCE)"],"iso639-2":"arc","iso639-1":null},"Inari Sami":{"name":"Inari Sami","names":["Inari Sami"],"iso639-2":"smn","iso639-1":null},"Indic languages":{"name":"Indic languages","names":["Indic languages"],"iso639-2":"inc","iso639-1":null},"Indo-European languages":{"name":"Indo-European languages","names":["Indo-European languages"],"iso639-2":"ine","iso639-1":null},"Indonesian":{"name":"Indonesian","names":["Indonesian"],"iso639-2":"ind","iso639-1":"id"},"Ingush":{"name":"Ingush","names":["Ingush"],"iso639-2":"inh","iso639-1":null},"Interlingua (International Auxiliary Language Association)":{"name":"Interlingua (International Auxiliary Language Association)","names":["Interlingua (International Auxiliary Language Association)"],"iso639-2":"ina","iso639-1":"ia"},"Interlingue":{"name":"Interlingue","names":["Interlingue","Occidental"],"iso639-2":"ile","iso639-1":"ie"},"Inuktitut":{"name":"Inuktitut","names":["Inuktitut"],"iso639-2":"iku","iso639-1":"iu"},"Inupiaq":{"name":"Inupiaq","names":["Inupiaq"],"iso639-2":"ipk","iso639-1":"ik"},"Iranian languages":{"name":"Iranian languages","names":["Iranian languages"],"iso639-2":"ira","iso639-1":null},"Irish":{"name":"Irish","names":["Irish"],"iso639-2":"gle","iso639-1":"ga"},"Irish, Middle (900-1200)":{"name":"Irish, Middle (900-1200)","names":["Irish, Middle (900-1200)"],"iso639-2":"mga","iso639-1":null},"Irish, Old (to 900)":{"name":"Irish, Old (to 900)","names":["Irish, Old (to 900)"],"iso639-2":"sga","iso639-1":null},"Iroquoian languages":{"name":"Iroquoian languages","names":["Iroquoian languages"],"iso639-2":"iro","iso639-1":null},"Italian":{"name":"Italian","names":["Italian"],"iso639-2":"ita","iso639-1":"it"},"Japanese":{"name":"Japanese","names":["Japanese"],"iso639-2":"jpn","iso639-1":"ja"},"Javanese":{"name":"Javanese","names":["Javanese"],"iso639-2":"jav","iso639-1":"jv"},"Jingpho":{"name":"Jingpho","names":["Kachin","Jingpho"],"iso639-2":"kac","iso639-1":null},"Judeo-Arabic":{"name":"Judeo-Arabic","names":["Judeo-Arabic"],"iso639-2":"jrb","iso639-1":null},"Judeo-Persian":{"name":"Judeo-Persian","names":["Judeo-Persian"],"iso639-2":"jpr","iso639-1":null},"Kabardian":{"name":"Kabardian","names":["Kabardian"],"iso639-2":"kbd","iso639-1":null},"Kabyle":{"name":"Kabyle","names":["Kabyle"],"iso639-2":"kab","iso639-1":null},"Kachin":{"name":"Kachin","names":["Kachin","Jingpho"],"iso639-2":"kac","iso639-1":null},"Kalaallisut":{"name":"Kalaallisut","names":["Kalaallisut","Greenlandic"],"iso639-2":"kal","iso639-1":"kl"},"Kalmyk":{"name":"Kalmyk","names":["Kalmyk","Oirat"],"iso639-2":"xal","iso639-1":null},"Kamba":{"name":"Kamba","names":["Kamba"],"iso639-2":"kam","iso639-1":null},"Kannada":{"name":"Kannada","names":["Kannada"],"iso639-2":"kan","iso639-1":"kn"},"Kanuri":{"name":"Kanuri","names":["Kanuri"],"iso639-2":"kau","iso639-1":"kr"},"Kapampangan":{"name":"Kapampangan","names":["Pampanga","Kapampangan"],"iso639-2":"pam","iso639-1":null},"Kara-Kalpak":{"name":"Kara-Kalpak","names":["Kara-Kalpak"],"iso639-2":"kaa","iso639-1":null},"Karachay-Balkar":{"name":"Karachay-Balkar","names":["Karachay-Balkar"],"iso639-2":"krc","iso639-1":null},"Karelian":{"name":"Karelian","names":["Karelian"],"iso639-2":"krl","iso639-1":null},"Karen languages":{"name":"Karen languages","names":["Karen languages"],"iso639-2":"kar","iso639-1":null},"Kashmiri":{"name":"Kashmiri","names":["Kashmiri"],"iso639-2":"kas","iso639-1":"ks"},"Kashubian":{"name":"Kashubian","names":["Kashubian"],"iso639-2":"csb","iso639-1":null},"Kawi":{"name":"Kawi","names":["Kawi"],"iso639-2":"kaw","iso639-1":null},"Kazakh":{"name":"Kazakh","names":["Kazakh"],"iso639-2":"kaz","iso639-1":"kk"},"Khasi":{"name":"Khasi","names":["Khasi"],"iso639-2":"kha","iso639-1":null},"Khoisan languages":{"name":"Khoisan languages","names":["Khoisan languages"],"iso639-2":"khi","iso639-1":null},"Khotanese":{"name":"Khotanese","names":["Khotanese","Sakan"],"iso639-2":"kho","iso639-1":null},"Kikuyu":{"name":"Kikuyu","names":["Kikuyu","Gikuyu"],"iso639-2":"kik","iso639-1":"ki"},"Kimbundu":{"name":"Kimbundu","names":["Kimbundu"],"iso639-2":"kmb","iso639-1":null},"Kinyarwanda":{"name":"Kinyarwanda","names":["Kinyarwanda"],"iso639-2":"kin","iso639-1":"rw"},"Kirdki":{"name":"Kirdki","names":["Zaza","Dimili","Dimli","Kirdki","Kirmanjki","Zazaki"],"iso639-2":"zza","iso639-1":null},"Kirghiz":{"name":"Kirghiz","names":["Kirghiz","Kyrgyz"],"iso639-2":"kir","iso639-1":"ky"},"Kirmanjki":{"name":"Kirmanjki","names":["Zaza","Dimili","Dimli","Kirdki","Kirmanjki","Zazaki"],"iso639-2":"zza","iso639-1":null},"Klingon":{"name":"Klingon","names":["Klingon","tlhIngan-Hol"],"iso639-2":"tlh","iso639-1":null},"Komi":{"name":"Komi","names":["Komi"],"iso639-2":"kom","iso639-1":"kv"},"Kongo":{"name":"Kongo","names":["Kongo"],"iso639-2":"kon","iso639-1":"kg"},"Konkani":{"name":"Konkani","names":["Konkani"],"iso639-2":"kok","iso639-1":null},"Korean":{"name":"Korean","names":["Korean"],"iso639-2":"kor","iso639-1":"ko"},"Kosraean":{"name":"Kosraean","names":["Kosraean"],"iso639-2":"kos","iso639-1":null},"Kpelle":{"name":"Kpelle","names":["Kpelle"],"iso639-2":"kpe","iso639-1":null},"Kru languages":{"name":"Kru languages","names":["Kru languages"],"iso639-2":"kro","iso639-1":null},"Kuanyama":{"name":"Kuanyama","names":["Kuanyama","Kwanyama"],"iso639-2":"kua","iso639-1":"kj"},"Kumyk":{"name":"Kumyk","names":["Kumyk"],"iso639-2":"kum","iso639-1":null},"Kurdish":{"name":"Kurdish","names":["Kurdish"],"iso639-2":"kur","iso639-1":"ku"},"Kurukh":{"name":"Kurukh","names":["Kurukh"],"iso639-2":"kru","iso639-1":null},"Kutenai":{"name":"Kutenai","names":["Kutenai"],"iso639-2":"kut","iso639-1":null},"Kwanyama":{"name":"Kwanyama","names":["Kuanyama","Kwanyama"],"iso639-2":"kua","iso639-1":"kj"},"Kyrgyz":{"name":"Kyrgyz","names":["Kirghiz","Kyrgyz"],"iso639-2":"kir","iso639-1":"ky"},"Ladino":{"name":"Ladino","names":["Ladino"],"iso639-2":"lad","iso639-1":null},"Lahnda":{"name":"Lahnda","names":["Lahnda"],"iso639-2":"lah","iso639-1":null},"Lamba":{"name":"Lamba","names":["Lamba"],"iso639-2":"lam","iso639-1":null},"Land Dayak languages":{"name":"Land Dayak languages","names":["Land Dayak languages"],"iso639-2":"day","iso639-1":null},"Lao":{"name":"Lao","names":["Lao"],"iso639-2":"lao","iso639-1":"lo"},"Latin":{"name":"Latin","names":["Latin"],"iso639-2":"lat","iso639-1":"la"},"Latvian":{"name":"Latvian","names":["Latvian"],"iso639-2":"lav","iso639-1":"lv"},"Leonese":{"name":"Leonese","names":["Asturian","Bable","Leonese","Asturleonese"],"iso639-2":"ast","iso639-1":null},"Letzeburgesch":{"name":"Letzeburgesch","names":["Luxembourgish","Letzeburgesch"],"iso639-2":"ltz","iso639-1":"lb"},"Lezghian":{"name":"Lezghian","names":["Lezghian"],"iso639-2":"lez","iso639-1":null},"Limburgan":{"name":"Limburgan","names":["Limburgan","Limburger","Limburgish"],"iso639-2":"lim","iso639-1":"li"},"Limburger":{"name":"Limburger","names":["Limburgan","Limburger","Limburgish"],"iso639-2":"lim","iso639-1":"li"},"Limburgish":{"name":"Limburgish","names":["Limburgan","Limburger","Limburgish"],"iso639-2":"lim","iso639-1":"li"},"Lingala":{"name":"Lingala","names":["Lingala"],"iso639-2":"lin","iso639-1":"ln"},"Lithuanian":{"name":"Lithuanian","names":["Lithuanian"],"iso639-2":"lit","iso639-1":"lt"},"Lojban":{"name":"Lojban","names":["Lojban"],"iso639-2":"jbo","iso639-1":null},"Low German":{"name":"Low German","names":["Low German","Low Saxon","German, Low","Saxon, Low"],"iso639-2":"nds","iso639-1":null},"Low Saxon":{"name":"Low Saxon","names":["Low German","Low Saxon","German, Low","Saxon, Low"],"iso639-2":"nds","iso639-1":null},"Lower Sorbian":{"name":"Lower Sorbian","names":["Lower Sorbian"],"iso639-2":"dsb","iso639-1":null},"Lozi":{"name":"Lozi","names":["Lozi"],"iso639-2":"loz","iso639-1":null},"Luba-Katanga":{"name":"Luba-Katanga","names":["Luba-Katanga"],"iso639-2":"lub","iso639-1":"lu"},"Luba-Lulua":{"name":"Luba-Lulua","names":["Luba-Lulua"],"iso639-2":"lua","iso639-1":null},"Luiseno":{"name":"Luiseno","names":["Luiseno"],"iso639-2":"lui","iso639-1":null},"Lule Sami":{"name":"Lule Sami","names":["Lule Sami"],"iso639-2":"smj","iso639-1":null},"Lunda":{"name":"Lunda","names":["Lunda"],"iso639-2":"lun","iso639-1":null},"Luo (Kenya and Tanzania)":{"name":"Luo (Kenya and Tanzania)","names":["Luo (Kenya and Tanzania)"],"iso639-2":"luo","iso639-1":null},"Lushai":{"name":"Lushai","names":["Lushai"],"iso639-2":"lus","iso639-1":null},"Luxembourgish":{"name":"Luxembourgish","names":["Luxembourgish","Letzeburgesch"],"iso639-2":"ltz","iso639-1":"lb"},"Macedo-Romanian":{"name":"Macedo-Romanian","names":["Aromanian","Arumanian","Macedo-Romanian"],"iso639-2":"rup","iso639-1":null},"Macedonian":{"name":"Macedonian","names":["Macedonian"],"iso639-2":"mac/mkd","iso639-1":"mk"},"Madurese":{"name":"Madurese","names":["Madurese"],"iso639-2":"mad","iso639-1":null},"Magahi":{"name":"Magahi","names":["Magahi"],"iso639-2":"mag","iso639-1":null},"Maithili":{"name":"Maithili","names":["Maithili"],"iso639-2":"mai","iso639-1":null},"Makasar":{"name":"Makasar","names":["Makasar"],"iso639-2":"mak","iso639-1":null},"Malagasy":{"name":"Malagasy","names":["Malagasy"],"iso639-2":"mlg","iso639-1":"mg"},"Malay":{"name":"Malay","names":["Malay"],"iso639-2":"may/msa","iso639-1":"ms"},"Malayalam":{"name":"Malayalam","names":["Malayalam"],"iso639-2":"mal","iso639-1":"ml"},"Maldivian":{"name":"Maldivian","names":["Divehi","Dhivehi","Maldivian"],"iso639-2":"div","iso639-1":"dv"},"Maltese":{"name":"Maltese","names":["Maltese"],"iso639-2":"mlt","iso639-1":"mt"},"Manchu":{"name":"Manchu","names":["Manchu"],"iso639-2":"mnc","iso639-1":null},"Mandar":{"name":"Mandar","names":["Mandar"],"iso639-2":"mdr","iso639-1":null},"Mandingo":{"name":"Mandingo","names":["Mandingo"],"iso639-2":"man","iso639-1":null},"Manipuri":{"name":"Manipuri","names":["Manipuri"],"iso639-2":"mni","iso639-1":null},"Manobo languages":{"name":"Manobo languages","names":["Manobo languages"],"iso639-2":"mno","iso639-1":null},"Manx":{"name":"Manx","names":["Manx"],"iso639-2":"glv","iso639-1":"gv"},"Maori":{"name":"Maori","names":["Maori"],"iso639-2":"mao/mri","iso639-1":"mi"},"Mapuche":{"name":"Mapuche","names":["Mapudungun","Mapuche"],"iso639-2":"arn","iso639-1":null},"Mapudungun":{"name":"Mapudungun","names":["Mapudungun","Mapuche"],"iso639-2":"arn","iso639-1":null},"Marathi":{"name":"Marathi","names":["Marathi"],"iso639-2":"mar","iso639-1":"mr"},"Mari":{"name":"Mari","names":["Mari"],"iso639-2":"chm","iso639-1":null},"Marshallese":{"name":"Marshallese","names":["Marshallese"],"iso639-2":"mah","iso639-1":"mh"},"Marwari":{"name":"Marwari","names":["Marwari"],"iso639-2":"mwr","iso639-1":null},"Masai":{"name":"Masai","names":["Masai"],"iso639-2":"mas","iso639-1":null},"Mayan languages":{"name":"Mayan languages","names":["Mayan languages"],"iso639-2":"myn","iso639-1":null},"Mende":{"name":"Mende","names":["Mende"],"iso639-2":"men","iso639-1":null},"Mi\'kmaq":{"name":"Mi\'kmaq","names":["Mi\'kmaq","Micmac"],"iso639-2":"mic","iso639-1":null},"Micmac":{"name":"Micmac","names":["Mi\'kmaq","Micmac"],"iso639-2":"mic","iso639-1":null},"Minangkabau":{"name":"Minangkabau","names":["Minangkabau"],"iso639-2":"min","iso639-1":null},"Mirandese":{"name":"Mirandese","names":["Mirandese"],"iso639-2":"mwl","iso639-1":null},"Mohawk":{"name":"Mohawk","names":["Mohawk"],"iso639-2":"moh","iso639-1":null},"Moksha":{"name":"Moksha","names":["Moksha"],"iso639-2":"mdf","iso639-1":null},"Moldavian":{"name":"Moldavian","names":["Romanian","Moldavian","Moldovan"],"iso639-2":"rum/ron","iso639-1":"ro"},"Moldovan":{"name":"Moldovan","names":["Romanian","Moldavian","Moldovan"],"iso639-2":"rum/ron","iso639-1":"ro"},"Mon-Khmer languages":{"name":"Mon-Khmer languages","names":["Mon-Khmer languages"],"iso639-2":"mkh","iso639-1":null},"Mong":{"name":"Mong","names":["Hmong","Mong"],"iso639-2":"hmn","iso639-1":null},"Mongo":{"name":"Mongo","names":["Mongo"],"iso639-2":"lol","iso639-1":null},"Mongolian":{"name":"Mongolian","names":["Mongolian"],"iso639-2":"mon","iso639-1":"mn"},"Montenegrin":{"name":"Montenegrin","names":["Montenegrin"],"iso639-2":"cnr","iso639-1":null},"Mossi":{"name":"Mossi","names":["Mossi"],"iso639-2":"mos","iso639-1":null},"Multiple languages":{"name":"Multiple languages","names":["Multiple languages"],"iso639-2":"mul","iso639-1":null},"Munda languages":{"name":"Munda languages","names":["Munda languages"],"iso639-2":"mun","iso639-1":null},"N\'Ko":{"name":"N\'Ko","names":["N\'Ko"],"iso639-2":"nqo","iso639-1":null},"Nahuatl languages":{"name":"Nahuatl languages","names":["Nahuatl languages"],"iso639-2":"nah","iso639-1":null},"Nauru":{"name":"Nauru","names":["Nauru"],"iso639-2":"nau","iso639-1":"na"},"Navaho":{"name":"Navaho","names":["Navajo","Navaho"],"iso639-2":"nav","iso639-1":"nv"},"Navajo":{"name":"Navajo","names":["Navajo","Navaho"],"iso639-2":"nav","iso639-1":"nv"},"Ndebele, North":{"name":"Ndebele, North","names":["Ndebele, North","North Ndebele"],"iso639-2":"nde","iso639-1":"nd"},"Ndebele, South":{"name":"Ndebele, South","names":["Ndebele, South","South Ndebele"],"iso639-2":"nbl","iso639-1":"nr"},"Ndonga":{"name":"Ndonga","names":["Ndonga"],"iso639-2":"ndo","iso639-1":"ng"},"Neapolitan":{"name":"Neapolitan","names":["Neapolitan"],"iso639-2":"nap","iso639-1":null},"Nepal Bhasa":{"name":"Nepal Bhasa","names":["Nepal Bhasa","Newari"],"iso639-2":"new","iso639-1":null},"Nepali":{"name":"Nepali","names":["Nepali"],"iso639-2":"nep","iso639-1":"ne"},"Newari":{"name":"Newari","names":["Nepal Bhasa","Newari"],"iso639-2":"new","iso639-1":null},"Nias":{"name":"Nias","names":["Nias"],"iso639-2":"nia","iso639-1":null},"Niger-Kordofanian languages":{"name":"Niger-Kordofanian languages","names":["Niger-Kordofanian languages"],"iso639-2":"nic","iso639-1":null},"Nilo-Saharan languages":{"name":"Nilo-Saharan languages","names":["Nilo-Saharan languages"],"iso639-2":"ssa","iso639-1":null},"Niuean":{"name":"Niuean","names":["Niuean"],"iso639-2":"niu","iso639-1":null},"No linguistic content":{"name":"No linguistic content","names":["No linguistic content","Not applicable"],"iso639-2":"zxx","iso639-1":null},"Nogai":{"name":"Nogai","names":["Nogai"],"iso639-2":"nog","iso639-1":null},"Norse, Old":{"name":"Norse, Old","names":["Norse, Old"],"iso639-2":"non","iso639-1":null},"North American Indian languages":{"name":"North American Indian languages","names":["North American Indian languages"],"iso639-2":"nai","iso639-1":null},"North Ndebele":{"name":"North Ndebele","names":["Ndebele, North","North Ndebele"],"iso639-2":"nde","iso639-1":"nd"},"Northern Frisian":{"name":"Northern Frisian","names":["Northern Frisian"],"iso639-2":"frr","iso639-1":null},"Northern Sami":{"name":"Northern Sami","names":["Northern Sami"],"iso639-2":"sme","iso639-1":"se"},"Northern Sotho":{"name":"Northern Sotho","names":["Pedi","Sepedi","Northern Sotho"],"iso639-2":"nso","iso639-1":null},"Norwegian":{"name":"Norwegian","names":["Norwegian"],"iso639-2":"nor","iso639-1":"no"},"Norwegian Bokmål":{"name":"Norwegian Bokmål","names":["Bokmål, Norwegian","Norwegian Bokmål"],"iso639-2":"nob","iso639-1":"nb"},"Norwegian Nynorsk":{"name":"Norwegian Nynorsk","names":["Norwegian Nynorsk","Nynorsk, Norwegian"],"iso639-2":"nno","iso639-1":"nn"},"Not applicable":{"name":"Not applicable","names":["No linguistic content","Not applicable"],"iso639-2":"zxx","iso639-1":null},"Nubian languages":{"name":"Nubian languages","names":["Nubian languages"],"iso639-2":"nub","iso639-1":null},"Nuosu":{"name":"Nuosu","names":["Sichuan Yi","Nuosu"],"iso639-2":"iii","iso639-1":"ii"},"Nyamwezi":{"name":"Nyamwezi","names":["Nyamwezi"],"iso639-2":"nym","iso639-1":null},"Nyanja":{"name":"Nyanja","names":["Chichewa","Chewa","Nyanja"],"iso639-2":"nya","iso639-1":"ny"},"Nyankole":{"name":"Nyankole","names":["Nyankole"],"iso639-2":"nyn","iso639-1":null},"Nynorsk, Norwegian":{"name":"Nynorsk, Norwegian","names":["Norwegian Nynorsk","Nynorsk, Norwegian"],"iso639-2":"nno","iso639-1":"nn"},"Nyoro":{"name":"Nyoro","names":["Nyoro"],"iso639-2":"nyo","iso639-1":null},"Nzima":{"name":"Nzima","names":["Nzima"],"iso639-2":"nzi","iso639-1":null},"Occidental":{"name":"Occidental","names":["Interlingue","Occidental"],"iso639-2":"ile","iso639-1":"ie"},"Occitan (post 1500)":{"name":"Occitan (post 1500)","names":["Occitan (post 1500)"],"iso639-2":"oci","iso639-1":"oc"},"Occitan, Old (to 1500)":{"name":"Occitan, Old (to 1500)","names":["Provençal, Old (to 1500)","Occitan, Old (to 1500)"],"iso639-2":"pro","iso639-1":null},"Official Aramaic (700-300 BCE)":{"name":"Official Aramaic (700-300 BCE)","names":["Official Aramaic (700-300 BCE)","Imperial Aramaic (700-300 BCE)"],"iso639-2":"arc","iso639-1":null},"Oirat":{"name":"Oirat","names":["Kalmyk","Oirat"],"iso639-2":"xal","iso639-1":null},"Ojibwa":{"name":"Ojibwa","names":["Ojibwa"],"iso639-2":"oji","iso639-1":"oj"},"Old Bulgarian":{"name":"Old Bulgarian","names":["Church Slavic","Old Slavonic","Church Slavonic","Old Bulgarian","Old Church Slavonic"],"iso639-2":"chu","iso639-1":"cu"},"Old Church Slavonic":{"name":"Old Church Slavonic","names":["Church Slavic","Old Slavonic","Church Slavonic","Old Bulgarian","Old Church Slavonic"],"iso639-2":"chu","iso639-1":"cu"},"Old Newari":{"name":"Old Newari","names":["Classical Newari","Old Newari","Classical Nepal Bhasa"],"iso639-2":"nwc","iso639-1":null},"Old Slavonic":{"name":"Old Slavonic","names":["Church Slavic","Old Slavonic","Church Slavonic","Old Bulgarian","Old Church Slavonic"],"iso639-2":"chu","iso639-1":"cu"},"Oriya":{"name":"Oriya","names":["Oriya"],"iso639-2":"ori","iso639-1":"or"},"Oromo":{"name":"Oromo","names":["Oromo"],"iso639-2":"orm","iso639-1":"om"},"Osage":{"name":"Osage","names":["Osage"],"iso639-2":"osa","iso639-1":null},"Ossetian":{"name":"Ossetian","names":["Ossetian","Ossetic"],"iso639-2":"oss","iso639-1":"os"},"Ossetic":{"name":"Ossetic","names":["Ossetian","Ossetic"],"iso639-2":"oss","iso639-1":"os"},"Otomian languages":{"name":"Otomian languages","names":["Otomian languages"],"iso639-2":"oto","iso639-1":null},"Pahlavi":{"name":"Pahlavi","names":["Pahlavi"],"iso639-2":"pal","iso639-1":null},"Palauan":{"name":"Palauan","names":["Palauan"],"iso639-2":"pau","iso639-1":null},"Pali":{"name":"Pali","names":["Pali"],"iso639-2":"pli","iso639-1":"pi"},"Pampanga":{"name":"Pampanga","names":["Pampanga","Kapampangan"],"iso639-2":"pam","iso639-1":null},"Pangasinan":{"name":"Pangasinan","names":["Pangasinan"],"iso639-2":"pag","iso639-1":null},"Panjabi":{"name":"Panjabi","names":["Panjabi","Punjabi"],"iso639-2":"pan","iso639-1":"pa"},"Papiamento":{"name":"Papiamento","names":["Papiamento"],"iso639-2":"pap","iso639-1":null},"Papuan languages":{"name":"Papuan languages","names":["Papuan languages"],"iso639-2":"paa","iso639-1":null},"Pashto":{"name":"Pashto","names":["Pushto","Pashto"],"iso639-2":"pus","iso639-1":"ps"},"Pedi":{"name":"Pedi","names":["Pedi","Sepedi","Northern Sotho"],"iso639-2":"nso","iso639-1":null},"Persian":{"name":"Persian","names":["Persian"],"iso639-2":"per/fas","iso639-1":"fa"},"Persian, Old (ca.600-400 B.C.)":{"name":"Persian, Old (ca.600-400 B.C.)","names":["Persian, Old (ca.600-400 B.C.)"],"iso639-2":"peo","iso639-1":null},"Philippine languages":{"name":"Philippine languages","names":["Philippine languages"],"iso639-2":"phi","iso639-1":null},"Phoenician":{"name":"Phoenician","names":["Phoenician"],"iso639-2":"phn","iso639-1":null},"Pilipino":{"name":"Pilipino","names":["Filipino","Pilipino"],"iso639-2":"fil","iso639-1":null},"Pohnpeian":{"name":"Pohnpeian","names":["Pohnpeian"],"iso639-2":"pon","iso639-1":null},"Polish":{"name":"Polish","names":["Polish"],"iso639-2":"pol","iso639-1":"pl"},"Portuguese":{"name":"Portuguese","names":["Portuguese"],"iso639-2":"por","iso639-1":"pt"},"Prakrit languages":{"name":"Prakrit languages","names":["Prakrit languages"],"iso639-2":"pra","iso639-1":null},"Provençal, Old (to 1500)":{"name":"Provençal, Old (to 1500)","names":["Provençal, Old (to 1500)","Occitan, Old (to 1500)"],"iso639-2":"pro","iso639-1":null},"Punjabi":{"name":"Punjabi","names":["Panjabi","Punjabi"],"iso639-2":"pan","iso639-1":"pa"},"Pushto":{"name":"Pushto","names":["Pushto","Pashto"],"iso639-2":"pus","iso639-1":"ps"},"Quechua":{"name":"Quechua","names":["Quechua"],"iso639-2":"que","iso639-1":"qu"},"Rajasthani":{"name":"Rajasthani","names":["Rajasthani"],"iso639-2":"raj","iso639-1":null},"Rapanui":{"name":"Rapanui","names":["Rapanui"],"iso639-2":"rap","iso639-1":null},"Rarotongan":{"name":"Rarotongan","names":["Rarotongan","Cook Islands Maori"],"iso639-2":"rar","iso639-1":null},"Reserved for local use":{"name":"Reserved for local use","names":["Reserved for local use"],"iso639-2":"qaa-qtz","iso639-1":null},"Romance languages":{"name":"Romance languages","names":["Romance languages"],"iso639-2":"roa","iso639-1":null},"Romanian":{"name":"Romanian","names":["Romanian","Moldavian","Moldovan"],"iso639-2":"rum/ron","iso639-1":"ro"},"Romansh":{"name":"Romansh","names":["Romansh"],"iso639-2":"roh","iso639-1":"rm"},"Romany":{"name":"Romany","names":["Romany"],"iso639-2":"rom","iso639-1":null},"Rundi":{"name":"Rundi","names":["Rundi"],"iso639-2":"run","iso639-1":"rn"},"Russian":{"name":"Russian","names":["Russian"],"iso639-2":"rus","iso639-1":"ru"},"Sakan":{"name":"Sakan","names":["Khotanese","Sakan"],"iso639-2":"kho","iso639-1":null},"Salishan languages":{"name":"Salishan languages","names":["Salishan languages"],"iso639-2":"sal","iso639-1":null},"Samaritan Aramaic":{"name":"Samaritan Aramaic","names":["Samaritan Aramaic"],"iso639-2":"sam","iso639-1":null},"Sami languages":{"name":"Sami languages","names":["Sami languages"],"iso639-2":"smi","iso639-1":null},"Samoan":{"name":"Samoan","names":["Samoan"],"iso639-2":"smo","iso639-1":"sm"},"Sandawe":{"name":"Sandawe","names":["Sandawe"],"iso639-2":"sad","iso639-1":null},"Sango":{"name":"Sango","names":["Sango"],"iso639-2":"sag","iso639-1":"sg"},"Sanskrit":{"name":"Sanskrit","names":["Sanskrit"],"iso639-2":"san","iso639-1":"sa"},"Santali":{"name":"Santali","names":["Santali"],"iso639-2":"sat","iso639-1":null},"Sardinian":{"name":"Sardinian","names":["Sardinian"],"iso639-2":"srd","iso639-1":"sc"},"Sasak":{"name":"Sasak","names":["Sasak"],"iso639-2":"sas","iso639-1":null},"Saxon, Low":{"name":"Saxon, Low","names":["Low German","Low Saxon","German, Low","Saxon, Low"],"iso639-2":"nds","iso639-1":null},"Scots":{"name":"Scots","names":["Scots"],"iso639-2":"sco","iso639-1":null},"Scottish Gaelic":{"name":"Scottish Gaelic","names":["Gaelic","Scottish Gaelic"],"iso639-2":"gla","iso639-1":"gd"},"Selkup":{"name":"Selkup","names":["Selkup"],"iso639-2":"sel","iso639-1":null},"Semitic languages":{"name":"Semitic languages","names":["Semitic languages"],"iso639-2":"sem","iso639-1":null},"Sepedi":{"name":"Sepedi","names":["Pedi","Sepedi","Northern Sotho"],"iso639-2":"nso","iso639-1":null},"Serbian":{"name":"Serbian","names":["Serbian"],"iso639-2":"srp","iso639-1":"sr"},"Serer":{"name":"Serer","names":["Serer"],"iso639-2":"srr","iso639-1":null},"Shan":{"name":"Shan","names":["Shan"],"iso639-2":"shn","iso639-1":null},"Shona":{"name":"Shona","names":["Shona"],"iso639-2":"sna","iso639-1":"sn"},"Sichuan Yi":{"name":"Sichuan Yi","names":["Sichuan Yi","Nuosu"],"iso639-2":"iii","iso639-1":"ii"},"Sicilian":{"name":"Sicilian","names":["Sicilian"],"iso639-2":"scn","iso639-1":null},"Sidamo":{"name":"Sidamo","names":["Sidamo"],"iso639-2":"sid","iso639-1":null},"Sign Languages":{"name":"Sign Languages","names":["Sign Languages"],"iso639-2":"sgn","iso639-1":null},"Siksika":{"name":"Siksika","names":["Siksika"],"iso639-2":"bla","iso639-1":null},"Sindhi":{"name":"Sindhi","names":["Sindhi"],"iso639-2":"snd","iso639-1":"sd"},"Sinhala":{"name":"Sinhala","names":["Sinhala","Sinhalese"],"iso639-2":"sin","iso639-1":"si"},"Sinhalese":{"name":"Sinhalese","names":["Sinhala","Sinhalese"],"iso639-2":"sin","iso639-1":"si"},"Sino-Tibetan languages":{"name":"Sino-Tibetan languages","names":["Sino-Tibetan languages"],"iso639-2":"sit","iso639-1":null},"Siouan languages":{"name":"Siouan languages","names":["Siouan languages"],"iso639-2":"sio","iso639-1":null},"Skolt Sami":{"name":"Skolt Sami","names":["Skolt Sami"],"iso639-2":"sms","iso639-1":null},"Slave (Athapascan)":{"name":"Slave (Athapascan)","names":["Slave (Athapascan)"],"iso639-2":"den","iso639-1":null},"Slavic languages":{"name":"Slavic languages","names":["Slavic languages"],"iso639-2":"sla","iso639-1":null},"Slovak":{"name":"Slovak","names":["Slovak"],"iso639-2":"slo/slk","iso639-1":"sk"},"Slovenian":{"name":"Slovenian","names":["Slovenian"],"iso639-2":"slv","iso639-1":"sl"},"Sogdian":{"name":"Sogdian","names":["Sogdian"],"iso639-2":"sog","iso639-1":null},"Somali":{"name":"Somali","names":["Somali"],"iso639-2":"som","iso639-1":"so"},"Songhai languages":{"name":"Songhai languages","names":["Songhai languages"],"iso639-2":"son","iso639-1":null},"Soninke":{"name":"Soninke","names":["Soninke"],"iso639-2":"snk","iso639-1":null},"Sorbian languages":{"name":"Sorbian languages","names":["Sorbian languages"],"iso639-2":"wen","iso639-1":null},"Sotho, Northern":{"name":"Sotho, Northern","names":["Pedi","Sepedi","Northern Sotho"],"iso639-2":"nso","iso639-1":null},"Sotho, Southern":{"name":"Sotho, Southern","names":["Sotho, Southern"],"iso639-2":"sot","iso639-1":"st"},"South American Indian languages":{"name":"South American Indian languages","names":["South American Indian languages"],"iso639-2":"sai","iso639-1":null},"South Ndebele":{"name":"South Ndebele","names":["Ndebele, South","South Ndebele"],"iso639-2":"nbl","iso639-1":"nr"},"Southern Altai":{"name":"Southern Altai","names":["Southern Altai"],"iso639-2":"alt","iso639-1":null},"Southern Sami":{"name":"Southern Sami","names":["Southern Sami"],"iso639-2":"sma","iso639-1":null},"Spanish":{"name":"Spanish","names":["Spanish","Castilian"],"iso639-2":"spa","iso639-1":"es"},"Sranan Tongo":{"name":"Sranan Tongo","names":["Sranan Tongo"],"iso639-2":"srn","iso639-1":null},"Standard Moroccan Tamazight":{"name":"Standard Moroccan Tamazight","names":["Standard Moroccan Tamazight"],"iso639-2":"zgh","iso639-1":null},"Sukuma":{"name":"Sukuma","names":["Sukuma"],"iso639-2":"suk","iso639-1":null},"Sumerian":{"name":"Sumerian","names":["Sumerian"],"iso639-2":"sux","iso639-1":null},"Sundanese":{"name":"Sundanese","names":["Sundanese"],"iso639-2":"sun","iso639-1":"su"},"Susu":{"name":"Susu","names":["Susu"],"iso639-2":"sus","iso639-1":null},"Swahili":{"name":"Swahili","names":["Swahili"],"iso639-2":"swa","iso639-1":"sw"},"Swati":{"name":"Swati","names":["Swati"],"iso639-2":"ssw","iso639-1":"ss"},"Swedish":{"name":"Swedish","names":["Swedish"],"iso639-2":"swe","iso639-1":"sv"},"Swiss German":{"name":"Swiss German","names":["Swiss German","Alemannic","Alsatian"],"iso639-2":"gsw","iso639-1":null},"Syriac":{"name":"Syriac","names":["Syriac"],"iso639-2":"syr","iso639-1":null},"Tagalog":{"name":"Tagalog","names":["Tagalog"],"iso639-2":"tgl","iso639-1":"tl"},"Tahitian":{"name":"Tahitian","names":["Tahitian"],"iso639-2":"tah","iso639-1":"ty"},"Tai languages":{"name":"Tai languages","names":["Tai languages"],"iso639-2":"tai","iso639-1":null},"Tajik":{"name":"Tajik","names":["Tajik"],"iso639-2":"tgk","iso639-1":"tg"},"Tamashek":{"name":"Tamashek","names":["Tamashek"],"iso639-2":"tmh","iso639-1":null},"Tamil":{"name":"Tamil","names":["Tamil"],"iso639-2":"tam","iso639-1":"ta"},"Tatar":{"name":"Tatar","names":["Tatar"],"iso639-2":"tat","iso639-1":"tt"},"Telugu":{"name":"Telugu","names":["Telugu"],"iso639-2":"tel","iso639-1":"te"},"Tereno":{"name":"Tereno","names":["Tereno"],"iso639-2":"ter","iso639-1":null},"Tetum":{"name":"Tetum","names":["Tetum"],"iso639-2":"tet","iso639-1":null},"Thai":{"name":"Thai","names":["Thai"],"iso639-2":"tha","iso639-1":"th"},"Tibetan":{"name":"Tibetan","names":["Tibetan"],"iso639-2":"tib/bod","iso639-1":"bo"},"Tigre":{"name":"Tigre","names":["Tigre"],"iso639-2":"tig","iso639-1":null},"Tigrinya":{"name":"Tigrinya","names":["Tigrinya"],"iso639-2":"tir","iso639-1":"ti"},"Timne":{"name":"Timne","names":["Timne"],"iso639-2":"tem","iso639-1":null},"Tiv":{"name":"Tiv","names":["Tiv"],"iso639-2":"tiv","iso639-1":null},"tlhIngan-Hol":{"name":"tlhIngan-Hol","names":["Klingon","tlhIngan-Hol"],"iso639-2":"tlh","iso639-1":null},"Tlingit":{"name":"Tlingit","names":["Tlingit"],"iso639-2":"tli","iso639-1":null},"Tok Pisin":{"name":"Tok Pisin","names":["Tok Pisin"],"iso639-2":"tpi","iso639-1":null},"Tokelau":{"name":"Tokelau","names":["Tokelau"],"iso639-2":"tkl","iso639-1":null},"Tonga (Nyasa)":{"name":"Tonga (Nyasa)","names":["Tonga (Nyasa)"],"iso639-2":"tog","iso639-1":null},"Tonga (Tonga Islands)":{"name":"Tonga (Tonga Islands)","names":["Tonga (Tonga Islands)"],"iso639-2":"ton","iso639-1":"to"},"Tsimshian":{"name":"Tsimshian","names":["Tsimshian"],"iso639-2":"tsi","iso639-1":null},"Tsonga":{"name":"Tsonga","names":["Tsonga"],"iso639-2":"tso","iso639-1":"ts"},"Tswana":{"name":"Tswana","names":["Tswana"],"iso639-2":"tsn","iso639-1":"tn"},"Tumbuka":{"name":"Tumbuka","names":["Tumbuka"],"iso639-2":"tum","iso639-1":null},"Tupi languages":{"name":"Tupi languages","names":["Tupi languages"],"iso639-2":"tup","iso639-1":null},"Turkish":{"name":"Turkish","names":["Turkish"],"iso639-2":"tur","iso639-1":"tr"},"Turkish, Ottoman (1500-1928)":{"name":"Turkish, Ottoman (1500-1928)","names":["Turkish, Ottoman (1500-1928)"],"iso639-2":"ota","iso639-1":null},"Turkmen":{"name":"Turkmen","names":["Turkmen"],"iso639-2":"tuk","iso639-1":"tk"},"Tuvalu":{"name":"Tuvalu","names":["Tuvalu"],"iso639-2":"tvl","iso639-1":null},"Tuvinian":{"name":"Tuvinian","names":["Tuvinian"],"iso639-2":"tyv","iso639-1":null},"Twi":{"name":"Twi","names":["Twi"],"iso639-2":"twi","iso639-1":"tw"},"Udmurt":{"name":"Udmurt","names":["Udmurt"],"iso639-2":"udm","iso639-1":null},"Ugaritic":{"name":"Ugaritic","names":["Ugaritic"],"iso639-2":"uga","iso639-1":null},"Uighur":{"name":"Uighur","names":["Uighur","Uyghur"],"iso639-2":"uig","iso639-1":"ug"},"Ukrainian":{"name":"Ukrainian","names":["Ukrainian"],"iso639-2":"ukr","iso639-1":"uk"},"Umbundu":{"name":"Umbundu","names":["Umbundu"],"iso639-2":"umb","iso639-1":null},"Uncoded languages":{"name":"Uncoded languages","names":["Uncoded languages"],"iso639-2":"mis","iso639-1":null},"Undetermined":{"name":"Undetermined","names":["Undetermined"],"iso639-2":"und","iso639-1":null},"Upper Sorbian":{"name":"Upper Sorbian","names":["Upper Sorbian"],"iso639-2":"hsb","iso639-1":null},"Urdu":{"name":"Urdu","names":["Urdu"],"iso639-2":"urd","iso639-1":"ur"},"Uyghur":{"name":"Uyghur","names":["Uighur","Uyghur"],"iso639-2":"uig","iso639-1":"ug"},"Uzbek":{"name":"Uzbek","names":["Uzbek"],"iso639-2":"uzb","iso639-1":"uz"},"Vai":{"name":"Vai","names":["Vai"],"iso639-2":"vai","iso639-1":null},"Valencian":{"name":"Valencian","names":["Catalan","Valencian"],"iso639-2":"cat","iso639-1":"ca"},"Venda":{"name":"Venda","names":["Venda"],"iso639-2":"ven","iso639-1":"ve"},"Vietnamese":{"name":"Vietnamese","names":["Vietnamese"],"iso639-2":"vie","iso639-1":"vi"},"Volapük":{"name":"Volapük","names":["Volapük"],"iso639-2":"vol","iso639-1":"vo"},"Votic":{"name":"Votic","names":["Votic"],"iso639-2":"vot","iso639-1":null},"Wakashan languages":{"name":"Wakashan languages","names":["Wakashan languages"],"iso639-2":"wak","iso639-1":null},"Walloon":{"name":"Walloon","names":["Walloon"],"iso639-2":"wln","iso639-1":"wa"},"Waray":{"name":"Waray","names":["Waray"],"iso639-2":"war","iso639-1":null},"Washo":{"name":"Washo","names":["Washo"],"iso639-2":"was","iso639-1":null},"Welsh":{"name":"Welsh","names":["Welsh"],"iso639-2":"wel/cym","iso639-1":"cy"},"Western Frisian":{"name":"Western Frisian","names":["Western Frisian"],"iso639-2":"fry","iso639-1":"fy"},"Western Pahari languages":{"name":"Western Pahari languages","names":["Himachali languages","Western Pahari languages"],"iso639-2":"him","iso639-1":null},"Wolaitta":{"name":"Wolaitta","names":["Wolaitta","Wolaytta"],"iso639-2":"wal","iso639-1":null},"Wolaytta":{"name":"Wolaytta","names":["Wolaitta","Wolaytta"],"iso639-2":"wal","iso639-1":null},"Wolof":{"name":"Wolof","names":["Wolof"],"iso639-2":"wol","iso639-1":"wo"},"Xhosa":{"name":"Xhosa","names":["Xhosa"],"iso639-2":"xho","iso639-1":"xh"},"Yakut":{"name":"Yakut","names":["Yakut"],"iso639-2":"sah","iso639-1":null},"Yao":{"name":"Yao","names":["Yao"],"iso639-2":"yao","iso639-1":null},"Yapese":{"name":"Yapese","names":["Yapese"],"iso639-2":"yap","iso639-1":null},"Yiddish":{"name":"Yiddish","names":["Yiddish"],"iso639-2":"yid","iso639-1":"yi"},"Yoruba":{"name":"Yoruba","names":["Yoruba"],"iso639-2":"yor","iso639-1":"yo"},"Yupik languages":{"name":"Yupik languages","names":["Yupik languages"],"iso639-2":"ypk","iso639-1":null},"Zande languages":{"name":"Zande languages","names":["Zande languages"],"iso639-2":"znd","iso639-1":null},"Zapotec":{"name":"Zapotec","names":["Zapotec"],"iso639-2":"zap","iso639-1":null},"Zaza":{"name":"Zaza","names":["Zaza","Dimili","Dimli","Kirdki","Kirmanjki","Zazaki"],"iso639-2":"zza","iso639-1":null},"Zazaki":{"name":"Zazaki","names":["Zaza","Dimili","Dimli","Kirdki","Kirmanjki","Zazaki"],"iso639-2":"zza","iso639-1":null},"Zenaga":{"name":"Zenaga","names":["Zenaga"],"iso639-2":"zen","iso639-1":null},"Zhuang":{"name":"Zhuang","names":["Zhuang","Chuang"],"iso639-2":"zha","iso639-1":"za"},"Zulu":{"name":"Zulu","names":["Zulu"],"iso639-2":"zul","iso639-1":"zu"},"Zuni":{"name":"Zuni","names":["Zuni"],"iso639-2":"zun","iso639-1":null}}');

/***/ }),

/***/ 3765:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"application/1d-interleaved-parityfec":{"source":"iana"},"application/3gpdash-qoe-report+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/3gpp-ims+xml":{"source":"iana","compressible":true},"application/3gpphal+json":{"source":"iana","compressible":true},"application/3gpphalforms+json":{"source":"iana","compressible":true},"application/a2l":{"source":"iana"},"application/ace+cbor":{"source":"iana"},"application/activemessage":{"source":"iana"},"application/activity+json":{"source":"iana","compressible":true},"application/alto-costmap+json":{"source":"iana","compressible":true},"application/alto-costmapfilter+json":{"source":"iana","compressible":true},"application/alto-directory+json":{"source":"iana","compressible":true},"application/alto-endpointcost+json":{"source":"iana","compressible":true},"application/alto-endpointcostparams+json":{"source":"iana","compressible":true},"application/alto-endpointprop+json":{"source":"iana","compressible":true},"application/alto-endpointpropparams+json":{"source":"iana","compressible":true},"application/alto-error+json":{"source":"iana","compressible":true},"application/alto-networkmap+json":{"source":"iana","compressible":true},"application/alto-networkmapfilter+json":{"source":"iana","compressible":true},"application/alto-updatestreamcontrol+json":{"source":"iana","compressible":true},"application/alto-updatestreamparams+json":{"source":"iana","compressible":true},"application/aml":{"source":"iana"},"application/andrew-inset":{"source":"iana","extensions":["ez"]},"application/applefile":{"source":"iana"},"application/applixware":{"source":"apache","extensions":["aw"]},"application/at+jwt":{"source":"iana"},"application/atf":{"source":"iana"},"application/atfx":{"source":"iana"},"application/atom+xml":{"source":"iana","compressible":true,"extensions":["atom"]},"application/atomcat+xml":{"source":"iana","compressible":true,"extensions":["atomcat"]},"application/atomdeleted+xml":{"source":"iana","compressible":true,"extensions":["atomdeleted"]},"application/atomicmail":{"source":"iana"},"application/atomsvc+xml":{"source":"iana","compressible":true,"extensions":["atomsvc"]},"application/atsc-dwd+xml":{"source":"iana","compressible":true,"extensions":["dwd"]},"application/atsc-dynamic-event-message":{"source":"iana"},"application/atsc-held+xml":{"source":"iana","compressible":true,"extensions":["held"]},"application/atsc-rdt+json":{"source":"iana","compressible":true},"application/atsc-rsat+xml":{"source":"iana","compressible":true,"extensions":["rsat"]},"application/atxml":{"source":"iana"},"application/auth-policy+xml":{"source":"iana","compressible":true},"application/bacnet-xdd+zip":{"source":"iana","compressible":false},"application/batch-smtp":{"source":"iana"},"application/bdoc":{"compressible":false,"extensions":["bdoc"]},"application/beep+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/calendar+json":{"source":"iana","compressible":true},"application/calendar+xml":{"source":"iana","compressible":true,"extensions":["xcs"]},"application/call-completion":{"source":"iana"},"application/cals-1840":{"source":"iana"},"application/captive+json":{"source":"iana","compressible":true},"application/cbor":{"source":"iana"},"application/cbor-seq":{"source":"iana"},"application/cccex":{"source":"iana"},"application/ccmp+xml":{"source":"iana","compressible":true},"application/ccxml+xml":{"source":"iana","compressible":true,"extensions":["ccxml"]},"application/cdfx+xml":{"source":"iana","compressible":true,"extensions":["cdfx"]},"application/cdmi-capability":{"source":"iana","extensions":["cdmia"]},"application/cdmi-container":{"source":"iana","extensions":["cdmic"]},"application/cdmi-domain":{"source":"iana","extensions":["cdmid"]},"application/cdmi-object":{"source":"iana","extensions":["cdmio"]},"application/cdmi-queue":{"source":"iana","extensions":["cdmiq"]},"application/cdni":{"source":"iana"},"application/cea":{"source":"iana"},"application/cea-2018+xml":{"source":"iana","compressible":true},"application/cellml+xml":{"source":"iana","compressible":true},"application/cfw":{"source":"iana"},"application/city+json":{"source":"iana","compressible":true},"application/clr":{"source":"iana"},"application/clue+xml":{"source":"iana","compressible":true},"application/clue_info+xml":{"source":"iana","compressible":true},"application/cms":{"source":"iana"},"application/cnrp+xml":{"source":"iana","compressible":true},"application/coap-group+json":{"source":"iana","compressible":true},"application/coap-payload":{"source":"iana"},"application/commonground":{"source":"iana"},"application/conference-info+xml":{"source":"iana","compressible":true},"application/cose":{"source":"iana"},"application/cose-key":{"source":"iana"},"application/cose-key-set":{"source":"iana"},"application/cpl+xml":{"source":"iana","compressible":true,"extensions":["cpl"]},"application/csrattrs":{"source":"iana"},"application/csta+xml":{"source":"iana","compressible":true},"application/cstadata+xml":{"source":"iana","compressible":true},"application/csvm+json":{"source":"iana","compressible":true},"application/cu-seeme":{"source":"apache","extensions":["cu"]},"application/cwt":{"source":"iana"},"application/cybercash":{"source":"iana"},"application/dart":{"compressible":true},"application/dash+xml":{"source":"iana","compressible":true,"extensions":["mpd"]},"application/dash-patch+xml":{"source":"iana","compressible":true,"extensions":["mpp"]},"application/dashdelta":{"source":"iana"},"application/davmount+xml":{"source":"iana","compressible":true,"extensions":["davmount"]},"application/dca-rft":{"source":"iana"},"application/dcd":{"source":"iana"},"application/dec-dx":{"source":"iana"},"application/dialog-info+xml":{"source":"iana","compressible":true},"application/dicom":{"source":"iana"},"application/dicom+json":{"source":"iana","compressible":true},"application/dicom+xml":{"source":"iana","compressible":true},"application/dii":{"source":"iana"},"application/dit":{"source":"iana"},"application/dns":{"source":"iana"},"application/dns+json":{"source":"iana","compressible":true},"application/dns-message":{"source":"iana"},"application/docbook+xml":{"source":"apache","compressible":true,"extensions":["dbk"]},"application/dots+cbor":{"source":"iana"},"application/dskpp+xml":{"source":"iana","compressible":true},"application/dssc+der":{"source":"iana","extensions":["dssc"]},"application/dssc+xml":{"source":"iana","compressible":true,"extensions":["xdssc"]},"application/dvcs":{"source":"iana"},"application/ecmascript":{"source":"iana","compressible":true,"extensions":["es","ecma"]},"application/edi-consent":{"source":"iana"},"application/edi-x12":{"source":"iana","compressible":false},"application/edifact":{"source":"iana","compressible":false},"application/efi":{"source":"iana"},"application/elm+json":{"source":"iana","charset":"UTF-8","compressible":true},"application/elm+xml":{"source":"iana","compressible":true},"application/emergencycalldata.cap+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/emergencycalldata.comment+xml":{"source":"iana","compressible":true},"application/emergencycalldata.control+xml":{"source":"iana","compressible":true},"application/emergencycalldata.deviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.ecall.msd":{"source":"iana"},"application/emergencycalldata.providerinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.serviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.subscriberinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.veds+xml":{"source":"iana","compressible":true},"application/emma+xml":{"source":"iana","compressible":true,"extensions":["emma"]},"application/emotionml+xml":{"source":"iana","compressible":true,"extensions":["emotionml"]},"application/encaprtp":{"source":"iana"},"application/epp+xml":{"source":"iana","compressible":true},"application/epub+zip":{"source":"iana","compressible":false,"extensions":["epub"]},"application/eshop":{"source":"iana"},"application/exi":{"source":"iana","extensions":["exi"]},"application/expect-ct-report+json":{"source":"iana","compressible":true},"application/express":{"source":"iana","extensions":["exp"]},"application/fastinfoset":{"source":"iana"},"application/fastsoap":{"source":"iana"},"application/fdt+xml":{"source":"iana","compressible":true,"extensions":["fdt"]},"application/fhir+json":{"source":"iana","charset":"UTF-8","compressible":true},"application/fhir+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/fido.trusted-apps+json":{"compressible":true},"application/fits":{"source":"iana"},"application/flexfec":{"source":"iana"},"application/font-sfnt":{"source":"iana"},"application/font-tdpfr":{"source":"iana","extensions":["pfr"]},"application/font-woff":{"source":"iana","compressible":false},"application/framework-attributes+xml":{"source":"iana","compressible":true},"application/geo+json":{"source":"iana","compressible":true,"extensions":["geojson"]},"application/geo+json-seq":{"source":"iana"},"application/geopackage+sqlite3":{"source":"iana"},"application/geoxacml+xml":{"source":"iana","compressible":true},"application/gltf-buffer":{"source":"iana"},"application/gml+xml":{"source":"iana","compressible":true,"extensions":["gml"]},"application/gpx+xml":{"source":"apache","compressible":true,"extensions":["gpx"]},"application/gxf":{"source":"apache","extensions":["gxf"]},"application/gzip":{"source":"iana","compressible":false,"extensions":["gz"]},"application/h224":{"source":"iana"},"application/held+xml":{"source":"iana","compressible":true},"application/hjson":{"extensions":["hjson"]},"application/http":{"source":"iana"},"application/hyperstudio":{"source":"iana","extensions":["stk"]},"application/ibe-key-request+xml":{"source":"iana","compressible":true},"application/ibe-pkg-reply+xml":{"source":"iana","compressible":true},"application/ibe-pp-data":{"source":"iana"},"application/iges":{"source":"iana"},"application/im-iscomposing+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/index":{"source":"iana"},"application/index.cmd":{"source":"iana"},"application/index.obj":{"source":"iana"},"application/index.response":{"source":"iana"},"application/index.vnd":{"source":"iana"},"application/inkml+xml":{"source":"iana","compressible":true,"extensions":["ink","inkml"]},"application/iotp":{"source":"iana"},"application/ipfix":{"source":"iana","extensions":["ipfix"]},"application/ipp":{"source":"iana"},"application/isup":{"source":"iana"},"application/its+xml":{"source":"iana","compressible":true,"extensions":["its"]},"application/java-archive":{"source":"apache","compressible":false,"extensions":["jar","war","ear"]},"application/java-serialized-object":{"source":"apache","compressible":false,"extensions":["ser"]},"application/java-vm":{"source":"apache","compressible":false,"extensions":["class"]},"application/javascript":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["js","mjs"]},"application/jf2feed+json":{"source":"iana","compressible":true},"application/jose":{"source":"iana"},"application/jose+json":{"source":"iana","compressible":true},"application/jrd+json":{"source":"iana","compressible":true},"application/jscalendar+json":{"source":"iana","compressible":true},"application/json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["json","map"]},"application/json-patch+json":{"source":"iana","compressible":true},"application/json-seq":{"source":"iana"},"application/json5":{"extensions":["json5"]},"application/jsonml+json":{"source":"apache","compressible":true,"extensions":["jsonml"]},"application/jwk+json":{"source":"iana","compressible":true},"application/jwk-set+json":{"source":"iana","compressible":true},"application/jwt":{"source":"iana"},"application/kpml-request+xml":{"source":"iana","compressible":true},"application/kpml-response+xml":{"source":"iana","compressible":true},"application/ld+json":{"source":"iana","compressible":true,"extensions":["jsonld"]},"application/lgr+xml":{"source":"iana","compressible":true,"extensions":["lgr"]},"application/link-format":{"source":"iana"},"application/load-control+xml":{"source":"iana","compressible":true},"application/lost+xml":{"source":"iana","compressible":true,"extensions":["lostxml"]},"application/lostsync+xml":{"source":"iana","compressible":true},"application/lpf+zip":{"source":"iana","compressible":false},"application/lxf":{"source":"iana"},"application/mac-binhex40":{"source":"iana","extensions":["hqx"]},"application/mac-compactpro":{"source":"apache","extensions":["cpt"]},"application/macwriteii":{"source":"iana"},"application/mads+xml":{"source":"iana","compressible":true,"extensions":["mads"]},"application/manifest+json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["webmanifest"]},"application/marc":{"source":"iana","extensions":["mrc"]},"application/marcxml+xml":{"source":"iana","compressible":true,"extensions":["mrcx"]},"application/mathematica":{"source":"iana","extensions":["ma","nb","mb"]},"application/mathml+xml":{"source":"iana","compressible":true,"extensions":["mathml"]},"application/mathml-content+xml":{"source":"iana","compressible":true},"application/mathml-presentation+xml":{"source":"iana","compressible":true},"application/mbms-associated-procedure-description+xml":{"source":"iana","compressible":true},"application/mbms-deregister+xml":{"source":"iana","compressible":true},"application/mbms-envelope+xml":{"source":"iana","compressible":true},"application/mbms-msk+xml":{"source":"iana","compressible":true},"application/mbms-msk-response+xml":{"source":"iana","compressible":true},"application/mbms-protection-description+xml":{"source":"iana","compressible":true},"application/mbms-reception-report+xml":{"source":"iana","compressible":true},"application/mbms-register+xml":{"source":"iana","compressible":true},"application/mbms-register-response+xml":{"source":"iana","compressible":true},"application/mbms-schedule+xml":{"source":"iana","compressible":true},"application/mbms-user-service-description+xml":{"source":"iana","compressible":true},"application/mbox":{"source":"iana","extensions":["mbox"]},"application/media-policy-dataset+xml":{"source":"iana","compressible":true,"extensions":["mpf"]},"application/media_control+xml":{"source":"iana","compressible":true},"application/mediaservercontrol+xml":{"source":"iana","compressible":true,"extensions":["mscml"]},"application/merge-patch+json":{"source":"iana","compressible":true},"application/metalink+xml":{"source":"apache","compressible":true,"extensions":["metalink"]},"application/metalink4+xml":{"source":"iana","compressible":true,"extensions":["meta4"]},"application/mets+xml":{"source":"iana","compressible":true,"extensions":["mets"]},"application/mf4":{"source":"iana"},"application/mikey":{"source":"iana"},"application/mipc":{"source":"iana"},"application/missing-blocks+cbor-seq":{"source":"iana"},"application/mmt-aei+xml":{"source":"iana","compressible":true,"extensions":["maei"]},"application/mmt-usd+xml":{"source":"iana","compressible":true,"extensions":["musd"]},"application/mods+xml":{"source":"iana","compressible":true,"extensions":["mods"]},"application/moss-keys":{"source":"iana"},"application/moss-signature":{"source":"iana"},"application/mosskey-data":{"source":"iana"},"application/mosskey-request":{"source":"iana"},"application/mp21":{"source":"iana","extensions":["m21","mp21"]},"application/mp4":{"source":"iana","extensions":["mp4s","m4p"]},"application/mpeg4-generic":{"source":"iana"},"application/mpeg4-iod":{"source":"iana"},"application/mpeg4-iod-xmt":{"source":"iana"},"application/mrb-consumer+xml":{"source":"iana","compressible":true},"application/mrb-publish+xml":{"source":"iana","compressible":true},"application/msc-ivr+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/msc-mixer+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/msword":{"source":"iana","compressible":false,"extensions":["doc","dot"]},"application/mud+json":{"source":"iana","compressible":true},"application/multipart-core":{"source":"iana"},"application/mxf":{"source":"iana","extensions":["mxf"]},"application/n-quads":{"source":"iana","extensions":["nq"]},"application/n-triples":{"source":"iana","extensions":["nt"]},"application/nasdata":{"source":"iana"},"application/news-checkgroups":{"source":"iana","charset":"US-ASCII"},"application/news-groupinfo":{"source":"iana","charset":"US-ASCII"},"application/news-transmission":{"source":"iana"},"application/nlsml+xml":{"source":"iana","compressible":true},"application/node":{"source":"iana","extensions":["cjs"]},"application/nss":{"source":"iana"},"application/oauth-authz-req+jwt":{"source":"iana"},"application/oblivious-dns-message":{"source":"iana"},"application/ocsp-request":{"source":"iana"},"application/ocsp-response":{"source":"iana"},"application/octet-stream":{"source":"iana","compressible":false,"extensions":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"]},"application/oda":{"source":"iana","extensions":["oda"]},"application/odm+xml":{"source":"iana","compressible":true},"application/odx":{"source":"iana"},"application/oebps-package+xml":{"source":"iana","compressible":true,"extensions":["opf"]},"application/ogg":{"source":"iana","compressible":false,"extensions":["ogx"]},"application/omdoc+xml":{"source":"apache","compressible":true,"extensions":["omdoc"]},"application/onenote":{"source":"apache","extensions":["onetoc","onetoc2","onetmp","onepkg"]},"application/opc-nodeset+xml":{"source":"iana","compressible":true},"application/oscore":{"source":"iana"},"application/oxps":{"source":"iana","extensions":["oxps"]},"application/p21":{"source":"iana"},"application/p21+zip":{"source":"iana","compressible":false},"application/p2p-overlay+xml":{"source":"iana","compressible":true,"extensions":["relo"]},"application/parityfec":{"source":"iana"},"application/passport":{"source":"iana"},"application/patch-ops-error+xml":{"source":"iana","compressible":true,"extensions":["xer"]},"application/pdf":{"source":"iana","compressible":false,"extensions":["pdf"]},"application/pdx":{"source":"iana"},"application/pem-certificate-chain":{"source":"iana"},"application/pgp-encrypted":{"source":"iana","compressible":false,"extensions":["pgp"]},"application/pgp-keys":{"source":"iana","extensions":["asc"]},"application/pgp-signature":{"source":"iana","extensions":["asc","sig"]},"application/pics-rules":{"source":"apache","extensions":["prf"]},"application/pidf+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/pidf-diff+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/pkcs10":{"source":"iana","extensions":["p10"]},"application/pkcs12":{"source":"iana"},"application/pkcs7-mime":{"source":"iana","extensions":["p7m","p7c"]},"application/pkcs7-signature":{"source":"iana","extensions":["p7s"]},"application/pkcs8":{"source":"iana","extensions":["p8"]},"application/pkcs8-encrypted":{"source":"iana"},"application/pkix-attr-cert":{"source":"iana","extensions":["ac"]},"application/pkix-cert":{"source":"iana","extensions":["cer"]},"application/pkix-crl":{"source":"iana","extensions":["crl"]},"application/pkix-pkipath":{"source":"iana","extensions":["pkipath"]},"application/pkixcmp":{"source":"iana","extensions":["pki"]},"application/pls+xml":{"source":"iana","compressible":true,"extensions":["pls"]},"application/poc-settings+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/postscript":{"source":"iana","compressible":true,"extensions":["ai","eps","ps"]},"application/ppsp-tracker+json":{"source":"iana","compressible":true},"application/problem+json":{"source":"iana","compressible":true},"application/problem+xml":{"source":"iana","compressible":true},"application/provenance+xml":{"source":"iana","compressible":true,"extensions":["provx"]},"application/prs.alvestrand.titrax-sheet":{"source":"iana"},"application/prs.cww":{"source":"iana","extensions":["cww"]},"application/prs.cyn":{"source":"iana","charset":"7-BIT"},"application/prs.hpub+zip":{"source":"iana","compressible":false},"application/prs.nprend":{"source":"iana"},"application/prs.plucker":{"source":"iana"},"application/prs.rdf-xml-crypt":{"source":"iana"},"application/prs.xsf+xml":{"source":"iana","compressible":true},"application/pskc+xml":{"source":"iana","compressible":true,"extensions":["pskcxml"]},"application/pvd+json":{"source":"iana","compressible":true},"application/qsig":{"source":"iana"},"application/raml+yaml":{"compressible":true,"extensions":["raml"]},"application/raptorfec":{"source":"iana"},"application/rdap+json":{"source":"iana","compressible":true},"application/rdf+xml":{"source":"iana","compressible":true,"extensions":["rdf","owl"]},"application/reginfo+xml":{"source":"iana","compressible":true,"extensions":["rif"]},"application/relax-ng-compact-syntax":{"source":"iana","extensions":["rnc"]},"application/remote-printing":{"source":"iana"},"application/reputon+json":{"source":"iana","compressible":true},"application/resource-lists+xml":{"source":"iana","compressible":true,"extensions":["rl"]},"application/resource-lists-diff+xml":{"source":"iana","compressible":true,"extensions":["rld"]},"application/rfc+xml":{"source":"iana","compressible":true},"application/riscos":{"source":"iana"},"application/rlmi+xml":{"source":"iana","compressible":true},"application/rls-services+xml":{"source":"iana","compressible":true,"extensions":["rs"]},"application/route-apd+xml":{"source":"iana","compressible":true,"extensions":["rapd"]},"application/route-s-tsid+xml":{"source":"iana","compressible":true,"extensions":["sls"]},"application/route-usd+xml":{"source":"iana","compressible":true,"extensions":["rusd"]},"application/rpki-ghostbusters":{"source":"iana","extensions":["gbr"]},"application/rpki-manifest":{"source":"iana","extensions":["mft"]},"application/rpki-publication":{"source":"iana"},"application/rpki-roa":{"source":"iana","extensions":["roa"]},"application/rpki-updown":{"source":"iana"},"application/rsd+xml":{"source":"apache","compressible":true,"extensions":["rsd"]},"application/rss+xml":{"source":"apache","compressible":true,"extensions":["rss"]},"application/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"application/rtploopback":{"source":"iana"},"application/rtx":{"source":"iana"},"application/samlassertion+xml":{"source":"iana","compressible":true},"application/samlmetadata+xml":{"source":"iana","compressible":true},"application/sarif+json":{"source":"iana","compressible":true},"application/sarif-external-properties+json":{"source":"iana","compressible":true},"application/sbe":{"source":"iana"},"application/sbml+xml":{"source":"iana","compressible":true,"extensions":["sbml"]},"application/scaip+xml":{"source":"iana","compressible":true},"application/scim+json":{"source":"iana","compressible":true},"application/scvp-cv-request":{"source":"iana","extensions":["scq"]},"application/scvp-cv-response":{"source":"iana","extensions":["scs"]},"application/scvp-vp-request":{"source":"iana","extensions":["spq"]},"application/scvp-vp-response":{"source":"iana","extensions":["spp"]},"application/sdp":{"source":"iana","extensions":["sdp"]},"application/secevent+jwt":{"source":"iana"},"application/senml+cbor":{"source":"iana"},"application/senml+json":{"source":"iana","compressible":true},"application/senml+xml":{"source":"iana","compressible":true,"extensions":["senmlx"]},"application/senml-etch+cbor":{"source":"iana"},"application/senml-etch+json":{"source":"iana","compressible":true},"application/senml-exi":{"source":"iana"},"application/sensml+cbor":{"source":"iana"},"application/sensml+json":{"source":"iana","compressible":true},"application/sensml+xml":{"source":"iana","compressible":true,"extensions":["sensmlx"]},"application/sensml-exi":{"source":"iana"},"application/sep+xml":{"source":"iana","compressible":true},"application/sep-exi":{"source":"iana"},"application/session-info":{"source":"iana"},"application/set-payment":{"source":"iana"},"application/set-payment-initiation":{"source":"iana","extensions":["setpay"]},"application/set-registration":{"source":"iana"},"application/set-registration-initiation":{"source":"iana","extensions":["setreg"]},"application/sgml":{"source":"iana"},"application/sgml-open-catalog":{"source":"iana"},"application/shf+xml":{"source":"iana","compressible":true,"extensions":["shf"]},"application/sieve":{"source":"iana","extensions":["siv","sieve"]},"application/simple-filter+xml":{"source":"iana","compressible":true},"application/simple-message-summary":{"source":"iana"},"application/simplesymbolcontainer":{"source":"iana"},"application/sipc":{"source":"iana"},"application/slate":{"source":"iana"},"application/smil":{"source":"iana"},"application/smil+xml":{"source":"iana","compressible":true,"extensions":["smi","smil"]},"application/smpte336m":{"source":"iana"},"application/soap+fastinfoset":{"source":"iana"},"application/soap+xml":{"source":"iana","compressible":true},"application/sparql-query":{"source":"iana","extensions":["rq"]},"application/sparql-results+xml":{"source":"iana","compressible":true,"extensions":["srx"]},"application/spdx+json":{"source":"iana","compressible":true},"application/spirits-event+xml":{"source":"iana","compressible":true},"application/sql":{"source":"iana"},"application/srgs":{"source":"iana","extensions":["gram"]},"application/srgs+xml":{"source":"iana","compressible":true,"extensions":["grxml"]},"application/sru+xml":{"source":"iana","compressible":true,"extensions":["sru"]},"application/ssdl+xml":{"source":"apache","compressible":true,"extensions":["ssdl"]},"application/ssml+xml":{"source":"iana","compressible":true,"extensions":["ssml"]},"application/stix+json":{"source":"iana","compressible":true},"application/swid+xml":{"source":"iana","compressible":true,"extensions":["swidtag"]},"application/tamp-apex-update":{"source":"iana"},"application/tamp-apex-update-confirm":{"source":"iana"},"application/tamp-community-update":{"source":"iana"},"application/tamp-community-update-confirm":{"source":"iana"},"application/tamp-error":{"source":"iana"},"application/tamp-sequence-adjust":{"source":"iana"},"application/tamp-sequence-adjust-confirm":{"source":"iana"},"application/tamp-status-query":{"source":"iana"},"application/tamp-status-response":{"source":"iana"},"application/tamp-update":{"source":"iana"},"application/tamp-update-confirm":{"source":"iana"},"application/tar":{"compressible":true},"application/taxii+json":{"source":"iana","compressible":true},"application/td+json":{"source":"iana","compressible":true},"application/tei+xml":{"source":"iana","compressible":true,"extensions":["tei","teicorpus"]},"application/tetra_isi":{"source":"iana"},"application/thraud+xml":{"source":"iana","compressible":true,"extensions":["tfi"]},"application/timestamp-query":{"source":"iana"},"application/timestamp-reply":{"source":"iana"},"application/timestamped-data":{"source":"iana","extensions":["tsd"]},"application/tlsrpt+gzip":{"source":"iana"},"application/tlsrpt+json":{"source":"iana","compressible":true},"application/tnauthlist":{"source":"iana"},"application/token-introspection+jwt":{"source":"iana"},"application/toml":{"compressible":true,"extensions":["toml"]},"application/trickle-ice-sdpfrag":{"source":"iana"},"application/trig":{"source":"iana","extensions":["trig"]},"application/ttml+xml":{"source":"iana","compressible":true,"extensions":["ttml"]},"application/tve-trigger":{"source":"iana"},"application/tzif":{"source":"iana"},"application/tzif-leap":{"source":"iana"},"application/ubjson":{"compressible":false,"extensions":["ubj"]},"application/ulpfec":{"source":"iana"},"application/urc-grpsheet+xml":{"source":"iana","compressible":true},"application/urc-ressheet+xml":{"source":"iana","compressible":true,"extensions":["rsheet"]},"application/urc-targetdesc+xml":{"source":"iana","compressible":true,"extensions":["td"]},"application/urc-uisocketdesc+xml":{"source":"iana","compressible":true},"application/vcard+json":{"source":"iana","compressible":true},"application/vcard+xml":{"source":"iana","compressible":true},"application/vemmi":{"source":"iana"},"application/vividence.scriptfile":{"source":"apache"},"application/vnd.1000minds.decision-model+xml":{"source":"iana","compressible":true,"extensions":["1km"]},"application/vnd.3gpp-prose+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-prose-pc3ch+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-v2x-local-service-information":{"source":"iana"},"application/vnd.3gpp.5gnas":{"source":"iana"},"application/vnd.3gpp.access-transfer-events+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.bsf+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.gmop+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.gtpc":{"source":"iana"},"application/vnd.3gpp.interworking-data":{"source":"iana"},"application/vnd.3gpp.lpp":{"source":"iana"},"application/vnd.3gpp.mc-signalling-ear":{"source":"iana"},"application/vnd.3gpp.mcdata-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-payload":{"source":"iana"},"application/vnd.3gpp.mcdata-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-signalling":{"source":"iana"},"application/vnd.3gpp.mcdata-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-floor-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-signed+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-init-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-transmission-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mid-call+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.ngap":{"source":"iana"},"application/vnd.3gpp.pfcp":{"source":"iana"},"application/vnd.3gpp.pic-bw-large":{"source":"iana","extensions":["plb"]},"application/vnd.3gpp.pic-bw-small":{"source":"iana","extensions":["psb"]},"application/vnd.3gpp.pic-bw-var":{"source":"iana","extensions":["pvb"]},"application/vnd.3gpp.s1ap":{"source":"iana"},"application/vnd.3gpp.sms":{"source":"iana"},"application/vnd.3gpp.sms+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-ext+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.state-and-event-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.ussd+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.bcmcsinfo+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.sms":{"source":"iana"},"application/vnd.3gpp2.tcap":{"source":"iana","extensions":["tcap"]},"application/vnd.3lightssoftware.imagescal":{"source":"iana"},"application/vnd.3m.post-it-notes":{"source":"iana","extensions":["pwn"]},"application/vnd.accpac.simply.aso":{"source":"iana","extensions":["aso"]},"application/vnd.accpac.simply.imp":{"source":"iana","extensions":["imp"]},"application/vnd.acucobol":{"source":"iana","extensions":["acu"]},"application/vnd.acucorp":{"source":"iana","extensions":["atc","acutc"]},"application/vnd.adobe.air-application-installer-package+zip":{"source":"apache","compressible":false,"extensions":["air"]},"application/vnd.adobe.flash.movie":{"source":"iana"},"application/vnd.adobe.formscentral.fcdt":{"source":"iana","extensions":["fcdt"]},"application/vnd.adobe.fxp":{"source":"iana","extensions":["fxp","fxpl"]},"application/vnd.adobe.partial-upload":{"source":"iana"},"application/vnd.adobe.xdp+xml":{"source":"iana","compressible":true,"extensions":["xdp"]},"application/vnd.adobe.xfdf":{"source":"iana","extensions":["xfdf"]},"application/vnd.aether.imp":{"source":"iana"},"application/vnd.afpc.afplinedata":{"source":"iana"},"application/vnd.afpc.afplinedata-pagedef":{"source":"iana"},"application/vnd.afpc.cmoca-cmresource":{"source":"iana"},"application/vnd.afpc.foca-charset":{"source":"iana"},"application/vnd.afpc.foca-codedfont":{"source":"iana"},"application/vnd.afpc.foca-codepage":{"source":"iana"},"application/vnd.afpc.modca":{"source":"iana"},"application/vnd.afpc.modca-cmtable":{"source":"iana"},"application/vnd.afpc.modca-formdef":{"source":"iana"},"application/vnd.afpc.modca-mediummap":{"source":"iana"},"application/vnd.afpc.modca-objectcontainer":{"source":"iana"},"application/vnd.afpc.modca-overlay":{"source":"iana"},"application/vnd.afpc.modca-pagesegment":{"source":"iana"},"application/vnd.age":{"source":"iana","extensions":["age"]},"application/vnd.ah-barcode":{"source":"iana"},"application/vnd.ahead.space":{"source":"iana","extensions":["ahead"]},"application/vnd.airzip.filesecure.azf":{"source":"iana","extensions":["azf"]},"application/vnd.airzip.filesecure.azs":{"source":"iana","extensions":["azs"]},"application/vnd.amadeus+json":{"source":"iana","compressible":true},"application/vnd.amazon.ebook":{"source":"apache","extensions":["azw"]},"application/vnd.amazon.mobi8-ebook":{"source":"iana"},"application/vnd.americandynamics.acc":{"source":"iana","extensions":["acc"]},"application/vnd.amiga.ami":{"source":"iana","extensions":["ami"]},"application/vnd.amundsen.maze+xml":{"source":"iana","compressible":true},"application/vnd.android.ota":{"source":"iana"},"application/vnd.android.package-archive":{"source":"apache","compressible":false,"extensions":["apk"]},"application/vnd.anki":{"source":"iana"},"application/vnd.anser-web-certificate-issue-initiation":{"source":"iana","extensions":["cii"]},"application/vnd.anser-web-funds-transfer-initiation":{"source":"apache","extensions":["fti"]},"application/vnd.antix.game-component":{"source":"iana","extensions":["atx"]},"application/vnd.apache.arrow.file":{"source":"iana"},"application/vnd.apache.arrow.stream":{"source":"iana"},"application/vnd.apache.thrift.binary":{"source":"iana"},"application/vnd.apache.thrift.compact":{"source":"iana"},"application/vnd.apache.thrift.json":{"source":"iana"},"application/vnd.api+json":{"source":"iana","compressible":true},"application/vnd.aplextor.warrp+json":{"source":"iana","compressible":true},"application/vnd.apothekende.reservation+json":{"source":"iana","compressible":true},"application/vnd.apple.installer+xml":{"source":"iana","compressible":true,"extensions":["mpkg"]},"application/vnd.apple.keynote":{"source":"iana","extensions":["key"]},"application/vnd.apple.mpegurl":{"source":"iana","extensions":["m3u8"]},"application/vnd.apple.numbers":{"source":"iana","extensions":["numbers"]},"application/vnd.apple.pages":{"source":"iana","extensions":["pages"]},"application/vnd.apple.pkpass":{"compressible":false,"extensions":["pkpass"]},"application/vnd.arastra.swi":{"source":"iana"},"application/vnd.aristanetworks.swi":{"source":"iana","extensions":["swi"]},"application/vnd.artisan+json":{"source":"iana","compressible":true},"application/vnd.artsquare":{"source":"iana"},"application/vnd.astraea-software.iota":{"source":"iana","extensions":["iota"]},"application/vnd.audiograph":{"source":"iana","extensions":["aep"]},"application/vnd.autopackage":{"source":"iana"},"application/vnd.avalon+json":{"source":"iana","compressible":true},"application/vnd.avistar+xml":{"source":"iana","compressible":true},"application/vnd.balsamiq.bmml+xml":{"source":"iana","compressible":true,"extensions":["bmml"]},"application/vnd.balsamiq.bmpr":{"source":"iana"},"application/vnd.banana-accounting":{"source":"iana"},"application/vnd.bbf.usp.error":{"source":"iana"},"application/vnd.bbf.usp.msg":{"source":"iana"},"application/vnd.bbf.usp.msg+json":{"source":"iana","compressible":true},"application/vnd.bekitzur-stech+json":{"source":"iana","compressible":true},"application/vnd.bint.med-content":{"source":"iana"},"application/vnd.biopax.rdf+xml":{"source":"iana","compressible":true},"application/vnd.blink-idb-value-wrapper":{"source":"iana"},"application/vnd.blueice.multipass":{"source":"iana","extensions":["mpm"]},"application/vnd.bluetooth.ep.oob":{"source":"iana"},"application/vnd.bluetooth.le.oob":{"source":"iana"},"application/vnd.bmi":{"source":"iana","extensions":["bmi"]},"application/vnd.bpf":{"source":"iana"},"application/vnd.bpf3":{"source":"iana"},"application/vnd.businessobjects":{"source":"iana","extensions":["rep"]},"application/vnd.byu.uapi+json":{"source":"iana","compressible":true},"application/vnd.cab-jscript":{"source":"iana"},"application/vnd.canon-cpdl":{"source":"iana"},"application/vnd.canon-lips":{"source":"iana"},"application/vnd.capasystems-pg+json":{"source":"iana","compressible":true},"application/vnd.cendio.thinlinc.clientconf":{"source":"iana"},"application/vnd.century-systems.tcp_stream":{"source":"iana"},"application/vnd.chemdraw+xml":{"source":"iana","compressible":true,"extensions":["cdxml"]},"application/vnd.chess-pgn":{"source":"iana"},"application/vnd.chipnuts.karaoke-mmd":{"source":"iana","extensions":["mmd"]},"application/vnd.ciedi":{"source":"iana"},"application/vnd.cinderella":{"source":"iana","extensions":["cdy"]},"application/vnd.cirpack.isdn-ext":{"source":"iana"},"application/vnd.citationstyles.style+xml":{"source":"iana","compressible":true,"extensions":["csl"]},"application/vnd.claymore":{"source":"iana","extensions":["cla"]},"application/vnd.cloanto.rp9":{"source":"iana","extensions":["rp9"]},"application/vnd.clonk.c4group":{"source":"iana","extensions":["c4g","c4d","c4f","c4p","c4u"]},"application/vnd.cluetrust.cartomobile-config":{"source":"iana","extensions":["c11amc"]},"application/vnd.cluetrust.cartomobile-config-pkg":{"source":"iana","extensions":["c11amz"]},"application/vnd.coffeescript":{"source":"iana"},"application/vnd.collabio.xodocuments.document":{"source":"iana"},"application/vnd.collabio.xodocuments.document-template":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation-template":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet-template":{"source":"iana"},"application/vnd.collection+json":{"source":"iana","compressible":true},"application/vnd.collection.doc+json":{"source":"iana","compressible":true},"application/vnd.collection.next+json":{"source":"iana","compressible":true},"application/vnd.comicbook+zip":{"source":"iana","compressible":false},"application/vnd.comicbook-rar":{"source":"iana"},"application/vnd.commerce-battelle":{"source":"iana"},"application/vnd.commonspace":{"source":"iana","extensions":["csp"]},"application/vnd.contact.cmsg":{"source":"iana","extensions":["cdbcmsg"]},"application/vnd.coreos.ignition+json":{"source":"iana","compressible":true},"application/vnd.cosmocaller":{"source":"iana","extensions":["cmc"]},"application/vnd.crick.clicker":{"source":"iana","extensions":["clkx"]},"application/vnd.crick.clicker.keyboard":{"source":"iana","extensions":["clkk"]},"application/vnd.crick.clicker.palette":{"source":"iana","extensions":["clkp"]},"application/vnd.crick.clicker.template":{"source":"iana","extensions":["clkt"]},"application/vnd.crick.clicker.wordbank":{"source":"iana","extensions":["clkw"]},"application/vnd.criticaltools.wbs+xml":{"source":"iana","compressible":true,"extensions":["wbs"]},"application/vnd.cryptii.pipe+json":{"source":"iana","compressible":true},"application/vnd.crypto-shade-file":{"source":"iana"},"application/vnd.cryptomator.encrypted":{"source":"iana"},"application/vnd.cryptomator.vault":{"source":"iana"},"application/vnd.ctc-posml":{"source":"iana","extensions":["pml"]},"application/vnd.ctct.ws+xml":{"source":"iana","compressible":true},"application/vnd.cups-pdf":{"source":"iana"},"application/vnd.cups-postscript":{"source":"iana"},"application/vnd.cups-ppd":{"source":"iana","extensions":["ppd"]},"application/vnd.cups-raster":{"source":"iana"},"application/vnd.cups-raw":{"source":"iana"},"application/vnd.curl":{"source":"iana"},"application/vnd.curl.car":{"source":"apache","extensions":["car"]},"application/vnd.curl.pcurl":{"source":"apache","extensions":["pcurl"]},"application/vnd.cyan.dean.root+xml":{"source":"iana","compressible":true},"application/vnd.cybank":{"source":"iana"},"application/vnd.cyclonedx+json":{"source":"iana","compressible":true},"application/vnd.cyclonedx+xml":{"source":"iana","compressible":true},"application/vnd.d2l.coursepackage1p0+zip":{"source":"iana","compressible":false},"application/vnd.d3m-dataset":{"source":"iana"},"application/vnd.d3m-problem":{"source":"iana"},"application/vnd.dart":{"source":"iana","compressible":true,"extensions":["dart"]},"application/vnd.data-vision.rdz":{"source":"iana","extensions":["rdz"]},"application/vnd.datapackage+json":{"source":"iana","compressible":true},"application/vnd.dataresource+json":{"source":"iana","compressible":true},"application/vnd.dbf":{"source":"iana","extensions":["dbf"]},"application/vnd.debian.binary-package":{"source":"iana"},"application/vnd.dece.data":{"source":"iana","extensions":["uvf","uvvf","uvd","uvvd"]},"application/vnd.dece.ttml+xml":{"source":"iana","compressible":true,"extensions":["uvt","uvvt"]},"application/vnd.dece.unspecified":{"source":"iana","extensions":["uvx","uvvx"]},"application/vnd.dece.zip":{"source":"iana","extensions":["uvz","uvvz"]},"application/vnd.denovo.fcselayout-link":{"source":"iana","extensions":["fe_launch"]},"application/vnd.desmume.movie":{"source":"iana"},"application/vnd.dir-bi.plate-dl-nosuffix":{"source":"iana"},"application/vnd.dm.delegation+xml":{"source":"iana","compressible":true},"application/vnd.dna":{"source":"iana","extensions":["dna"]},"application/vnd.document+json":{"source":"iana","compressible":true},"application/vnd.dolby.mlp":{"source":"apache","extensions":["mlp"]},"application/vnd.dolby.mobile.1":{"source":"iana"},"application/vnd.dolby.mobile.2":{"source":"iana"},"application/vnd.doremir.scorecloud-binary-document":{"source":"iana"},"application/vnd.dpgraph":{"source":"iana","extensions":["dpg"]},"application/vnd.dreamfactory":{"source":"iana","extensions":["dfac"]},"application/vnd.drive+json":{"source":"iana","compressible":true},"application/vnd.ds-keypoint":{"source":"apache","extensions":["kpxx"]},"application/vnd.dtg.local":{"source":"iana"},"application/vnd.dtg.local.flash":{"source":"iana"},"application/vnd.dtg.local.html":{"source":"iana"},"application/vnd.dvb.ait":{"source":"iana","extensions":["ait"]},"application/vnd.dvb.dvbisl+xml":{"source":"iana","compressible":true},"application/vnd.dvb.dvbj":{"source":"iana"},"application/vnd.dvb.esgcontainer":{"source":"iana"},"application/vnd.dvb.ipdcdftnotifaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess2":{"source":"iana"},"application/vnd.dvb.ipdcesgpdd":{"source":"iana"},"application/vnd.dvb.ipdcroaming":{"source":"iana"},"application/vnd.dvb.iptv.alfec-base":{"source":"iana"},"application/vnd.dvb.iptv.alfec-enhancement":{"source":"iana"},"application/vnd.dvb.notif-aggregate-root+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-container+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-generic+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-msglist+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-request+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-response+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-init+xml":{"source":"iana","compressible":true},"application/vnd.dvb.pfr":{"source":"iana"},"application/vnd.dvb.service":{"source":"iana","extensions":["svc"]},"application/vnd.dxr":{"source":"iana"},"application/vnd.dynageo":{"source":"iana","extensions":["geo"]},"application/vnd.dzr":{"source":"iana"},"application/vnd.easykaraoke.cdgdownload":{"source":"iana"},"application/vnd.ecdis-update":{"source":"iana"},"application/vnd.ecip.rlp":{"source":"iana"},"application/vnd.eclipse.ditto+json":{"source":"iana","compressible":true},"application/vnd.ecowin.chart":{"source":"iana","extensions":["mag"]},"application/vnd.ecowin.filerequest":{"source":"iana"},"application/vnd.ecowin.fileupdate":{"source":"iana"},"application/vnd.ecowin.series":{"source":"iana"},"application/vnd.ecowin.seriesrequest":{"source":"iana"},"application/vnd.ecowin.seriesupdate":{"source":"iana"},"application/vnd.efi.img":{"source":"iana"},"application/vnd.efi.iso":{"source":"iana"},"application/vnd.emclient.accessrequest+xml":{"source":"iana","compressible":true},"application/vnd.enliven":{"source":"iana","extensions":["nml"]},"application/vnd.enphase.envoy":{"source":"iana"},"application/vnd.eprints.data+xml":{"source":"iana","compressible":true},"application/vnd.epson.esf":{"source":"iana","extensions":["esf"]},"application/vnd.epson.msf":{"source":"iana","extensions":["msf"]},"application/vnd.epson.quickanime":{"source":"iana","extensions":["qam"]},"application/vnd.epson.salt":{"source":"iana","extensions":["slt"]},"application/vnd.epson.ssf":{"source":"iana","extensions":["ssf"]},"application/vnd.ericsson.quickcall":{"source":"iana"},"application/vnd.espass-espass+zip":{"source":"iana","compressible":false},"application/vnd.eszigno3+xml":{"source":"iana","compressible":true,"extensions":["es3","et3"]},"application/vnd.etsi.aoc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.asic-e+zip":{"source":"iana","compressible":false},"application/vnd.etsi.asic-s+zip":{"source":"iana","compressible":false},"application/vnd.etsi.cug+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvcommand+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-bc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-cod+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-npvr+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvservice+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsync+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvueprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mcid+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mheg5":{"source":"iana"},"application/vnd.etsi.overload-control-policy-dataset+xml":{"source":"iana","compressible":true},"application/vnd.etsi.pstn+xml":{"source":"iana","compressible":true},"application/vnd.etsi.sci+xml":{"source":"iana","compressible":true},"application/vnd.etsi.simservs+xml":{"source":"iana","compressible":true},"application/vnd.etsi.timestamp-token":{"source":"iana"},"application/vnd.etsi.tsl+xml":{"source":"iana","compressible":true},"application/vnd.etsi.tsl.der":{"source":"iana"},"application/vnd.eu.kasparian.car+json":{"source":"iana","compressible":true},"application/vnd.eudora.data":{"source":"iana"},"application/vnd.evolv.ecig.profile":{"source":"iana"},"application/vnd.evolv.ecig.settings":{"source":"iana"},"application/vnd.evolv.ecig.theme":{"source":"iana"},"application/vnd.exstream-empower+zip":{"source":"iana","compressible":false},"application/vnd.exstream-package":{"source":"iana"},"application/vnd.ezpix-album":{"source":"iana","extensions":["ez2"]},"application/vnd.ezpix-package":{"source":"iana","extensions":["ez3"]},"application/vnd.f-secure.mobile":{"source":"iana"},"application/vnd.familysearch.gedcom+zip":{"source":"iana","compressible":false},"application/vnd.fastcopy-disk-image":{"source":"iana"},"application/vnd.fdf":{"source":"iana","extensions":["fdf"]},"application/vnd.fdsn.mseed":{"source":"iana","extensions":["mseed"]},"application/vnd.fdsn.seed":{"source":"iana","extensions":["seed","dataless"]},"application/vnd.ffsns":{"source":"iana"},"application/vnd.ficlab.flb+zip":{"source":"iana","compressible":false},"application/vnd.filmit.zfc":{"source":"iana"},"application/vnd.fints":{"source":"iana"},"application/vnd.firemonkeys.cloudcell":{"source":"iana"},"application/vnd.flographit":{"source":"iana","extensions":["gph"]},"application/vnd.fluxtime.clip":{"source":"iana","extensions":["ftc"]},"application/vnd.font-fontforge-sfd":{"source":"iana"},"application/vnd.framemaker":{"source":"iana","extensions":["fm","frame","maker","book"]},"application/vnd.frogans.fnc":{"source":"iana","extensions":["fnc"]},"application/vnd.frogans.ltf":{"source":"iana","extensions":["ltf"]},"application/vnd.fsc.weblaunch":{"source":"iana","extensions":["fsc"]},"application/vnd.fujifilm.fb.docuworks":{"source":"iana"},"application/vnd.fujifilm.fb.docuworks.binder":{"source":"iana"},"application/vnd.fujifilm.fb.docuworks.container":{"source":"iana"},"application/vnd.fujifilm.fb.jfi+xml":{"source":"iana","compressible":true},"application/vnd.fujitsu.oasys":{"source":"iana","extensions":["oas"]},"application/vnd.fujitsu.oasys2":{"source":"iana","extensions":["oa2"]},"application/vnd.fujitsu.oasys3":{"source":"iana","extensions":["oa3"]},"application/vnd.fujitsu.oasysgp":{"source":"iana","extensions":["fg5"]},"application/vnd.fujitsu.oasysprs":{"source":"iana","extensions":["bh2"]},"application/vnd.fujixerox.art-ex":{"source":"iana"},"application/vnd.fujixerox.art4":{"source":"iana"},"application/vnd.fujixerox.ddd":{"source":"iana","extensions":["ddd"]},"application/vnd.fujixerox.docuworks":{"source":"iana","extensions":["xdw"]},"application/vnd.fujixerox.docuworks.binder":{"source":"iana","extensions":["xbd"]},"application/vnd.fujixerox.docuworks.container":{"source":"iana"},"application/vnd.fujixerox.hbpl":{"source":"iana"},"application/vnd.fut-misnet":{"source":"iana"},"application/vnd.futoin+cbor":{"source":"iana"},"application/vnd.futoin+json":{"source":"iana","compressible":true},"application/vnd.fuzzysheet":{"source":"iana","extensions":["fzs"]},"application/vnd.genomatix.tuxedo":{"source":"iana","extensions":["txd"]},"application/vnd.gentics.grd+json":{"source":"iana","compressible":true},"application/vnd.geo+json":{"source":"iana","compressible":true},"application/vnd.geocube+xml":{"source":"iana","compressible":true},"application/vnd.geogebra.file":{"source":"iana","extensions":["ggb"]},"application/vnd.geogebra.slides":{"source":"iana"},"application/vnd.geogebra.tool":{"source":"iana","extensions":["ggt"]},"application/vnd.geometry-explorer":{"source":"iana","extensions":["gex","gre"]},"application/vnd.geonext":{"source":"iana","extensions":["gxt"]},"application/vnd.geoplan":{"source":"iana","extensions":["g2w"]},"application/vnd.geospace":{"source":"iana","extensions":["g3w"]},"application/vnd.gerber":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt-response":{"source":"iana"},"application/vnd.gmx":{"source":"iana","extensions":["gmx"]},"application/vnd.google-apps.document":{"compressible":false,"extensions":["gdoc"]},"application/vnd.google-apps.presentation":{"compressible":false,"extensions":["gslides"]},"application/vnd.google-apps.spreadsheet":{"compressible":false,"extensions":["gsheet"]},"application/vnd.google-earth.kml+xml":{"source":"iana","compressible":true,"extensions":["kml"]},"application/vnd.google-earth.kmz":{"source":"iana","compressible":false,"extensions":["kmz"]},"application/vnd.gov.sk.e-form+xml":{"source":"iana","compressible":true},"application/vnd.gov.sk.e-form+zip":{"source":"iana","compressible":false},"application/vnd.gov.sk.xmldatacontainer+xml":{"source":"iana","compressible":true},"application/vnd.grafeq":{"source":"iana","extensions":["gqf","gqs"]},"application/vnd.gridmp":{"source":"iana"},"application/vnd.groove-account":{"source":"iana","extensions":["gac"]},"application/vnd.groove-help":{"source":"iana","extensions":["ghf"]},"application/vnd.groove-identity-message":{"source":"iana","extensions":["gim"]},"application/vnd.groove-injector":{"source":"iana","extensions":["grv"]},"application/vnd.groove-tool-message":{"source":"iana","extensions":["gtm"]},"application/vnd.groove-tool-template":{"source":"iana","extensions":["tpl"]},"application/vnd.groove-vcard":{"source":"iana","extensions":["vcg"]},"application/vnd.hal+json":{"source":"iana","compressible":true},"application/vnd.hal+xml":{"source":"iana","compressible":true,"extensions":["hal"]},"application/vnd.handheld-entertainment+xml":{"source":"iana","compressible":true,"extensions":["zmm"]},"application/vnd.hbci":{"source":"iana","extensions":["hbci"]},"application/vnd.hc+json":{"source":"iana","compressible":true},"application/vnd.hcl-bireports":{"source":"iana"},"application/vnd.hdt":{"source":"iana"},"application/vnd.heroku+json":{"source":"iana","compressible":true},"application/vnd.hhe.lesson-player":{"source":"iana","extensions":["les"]},"application/vnd.hl7cda+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.hl7v2+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.hp-hpgl":{"source":"iana","extensions":["hpgl"]},"application/vnd.hp-hpid":{"source":"iana","extensions":["hpid"]},"application/vnd.hp-hps":{"source":"iana","extensions":["hps"]},"application/vnd.hp-jlyt":{"source":"iana","extensions":["jlt"]},"application/vnd.hp-pcl":{"source":"iana","extensions":["pcl"]},"application/vnd.hp-pclxl":{"source":"iana","extensions":["pclxl"]},"application/vnd.httphone":{"source":"iana"},"application/vnd.hydrostatix.sof-data":{"source":"iana","extensions":["sfd-hdstx"]},"application/vnd.hyper+json":{"source":"iana","compressible":true},"application/vnd.hyper-item+json":{"source":"iana","compressible":true},"application/vnd.hyperdrive+json":{"source":"iana","compressible":true},"application/vnd.hzn-3d-crossword":{"source":"iana"},"application/vnd.ibm.afplinedata":{"source":"iana"},"application/vnd.ibm.electronic-media":{"source":"iana"},"application/vnd.ibm.minipay":{"source":"iana","extensions":["mpy"]},"application/vnd.ibm.modcap":{"source":"iana","extensions":["afp","listafp","list3820"]},"application/vnd.ibm.rights-management":{"source":"iana","extensions":["irm"]},"application/vnd.ibm.secure-container":{"source":"iana","extensions":["sc"]},"application/vnd.iccprofile":{"source":"iana","extensions":["icc","icm"]},"application/vnd.ieee.1905":{"source":"iana"},"application/vnd.igloader":{"source":"iana","extensions":["igl"]},"application/vnd.imagemeter.folder+zip":{"source":"iana","compressible":false},"application/vnd.imagemeter.image+zip":{"source":"iana","compressible":false},"application/vnd.immervision-ivp":{"source":"iana","extensions":["ivp"]},"application/vnd.immervision-ivu":{"source":"iana","extensions":["ivu"]},"application/vnd.ims.imsccv1p1":{"source":"iana"},"application/vnd.ims.imsccv1p2":{"source":"iana"},"application/vnd.ims.imsccv1p3":{"source":"iana"},"application/vnd.ims.lis.v2.result+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolconsumerprofile+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy.id+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings.simple+json":{"source":"iana","compressible":true},"application/vnd.informedcontrol.rms+xml":{"source":"iana","compressible":true},"application/vnd.informix-visionary":{"source":"iana"},"application/vnd.infotech.project":{"source":"iana"},"application/vnd.infotech.project+xml":{"source":"iana","compressible":true},"application/vnd.innopath.wamp.notification":{"source":"iana"},"application/vnd.insors.igm":{"source":"iana","extensions":["igm"]},"application/vnd.intercon.formnet":{"source":"iana","extensions":["xpw","xpx"]},"application/vnd.intergeo":{"source":"iana","extensions":["i2g"]},"application/vnd.intertrust.digibox":{"source":"iana"},"application/vnd.intertrust.nncp":{"source":"iana"},"application/vnd.intu.qbo":{"source":"iana","extensions":["qbo"]},"application/vnd.intu.qfx":{"source":"iana","extensions":["qfx"]},"application/vnd.iptc.g2.catalogitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.conceptitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.knowledgeitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsmessage+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.packageitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.planningitem+xml":{"source":"iana","compressible":true},"application/vnd.ipunplugged.rcprofile":{"source":"iana","extensions":["rcprofile"]},"application/vnd.irepository.package+xml":{"source":"iana","compressible":true,"extensions":["irp"]},"application/vnd.is-xpr":{"source":"iana","extensions":["xpr"]},"application/vnd.isac.fcs":{"source":"iana","extensions":["fcs"]},"application/vnd.iso11783-10+zip":{"source":"iana","compressible":false},"application/vnd.jam":{"source":"iana","extensions":["jam"]},"application/vnd.japannet-directory-service":{"source":"iana"},"application/vnd.japannet-jpnstore-wakeup":{"source":"iana"},"application/vnd.japannet-payment-wakeup":{"source":"iana"},"application/vnd.japannet-registration":{"source":"iana"},"application/vnd.japannet-registration-wakeup":{"source":"iana"},"application/vnd.japannet-setstore-wakeup":{"source":"iana"},"application/vnd.japannet-verification":{"source":"iana"},"application/vnd.japannet-verification-wakeup":{"source":"iana"},"application/vnd.jcp.javame.midlet-rms":{"source":"iana","extensions":["rms"]},"application/vnd.jisp":{"source":"iana","extensions":["jisp"]},"application/vnd.joost.joda-archive":{"source":"iana","extensions":["joda"]},"application/vnd.jsk.isdn-ngn":{"source":"iana"},"application/vnd.kahootz":{"source":"iana","extensions":["ktz","ktr"]},"application/vnd.kde.karbon":{"source":"iana","extensions":["karbon"]},"application/vnd.kde.kchart":{"source":"iana","extensions":["chrt"]},"application/vnd.kde.kformula":{"source":"iana","extensions":["kfo"]},"application/vnd.kde.kivio":{"source":"iana","extensions":["flw"]},"application/vnd.kde.kontour":{"source":"iana","extensions":["kon"]},"application/vnd.kde.kpresenter":{"source":"iana","extensions":["kpr","kpt"]},"application/vnd.kde.kspread":{"source":"iana","extensions":["ksp"]},"application/vnd.kde.kword":{"source":"iana","extensions":["kwd","kwt"]},"application/vnd.kenameaapp":{"source":"iana","extensions":["htke"]},"application/vnd.kidspiration":{"source":"iana","extensions":["kia"]},"application/vnd.kinar":{"source":"iana","extensions":["kne","knp"]},"application/vnd.koan":{"source":"iana","extensions":["skp","skd","skt","skm"]},"application/vnd.kodak-descriptor":{"source":"iana","extensions":["sse"]},"application/vnd.las":{"source":"iana"},"application/vnd.las.las+json":{"source":"iana","compressible":true},"application/vnd.las.las+xml":{"source":"iana","compressible":true,"extensions":["lasxml"]},"application/vnd.laszip":{"source":"iana"},"application/vnd.leap+json":{"source":"iana","compressible":true},"application/vnd.liberty-request+xml":{"source":"iana","compressible":true},"application/vnd.llamagraphics.life-balance.desktop":{"source":"iana","extensions":["lbd"]},"application/vnd.llamagraphics.life-balance.exchange+xml":{"source":"iana","compressible":true,"extensions":["lbe"]},"application/vnd.logipipe.circuit+zip":{"source":"iana","compressible":false},"application/vnd.loom":{"source":"iana"},"application/vnd.lotus-1-2-3":{"source":"iana","extensions":["123"]},"application/vnd.lotus-approach":{"source":"iana","extensions":["apr"]},"application/vnd.lotus-freelance":{"source":"iana","extensions":["pre"]},"application/vnd.lotus-notes":{"source":"iana","extensions":["nsf"]},"application/vnd.lotus-organizer":{"source":"iana","extensions":["org"]},"application/vnd.lotus-screencam":{"source":"iana","extensions":["scm"]},"application/vnd.lotus-wordpro":{"source":"iana","extensions":["lwp"]},"application/vnd.macports.portpkg":{"source":"iana","extensions":["portpkg"]},"application/vnd.mapbox-vector-tile":{"source":"iana","extensions":["mvt"]},"application/vnd.marlin.drm.actiontoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.conftoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.license+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.mdcf":{"source":"iana"},"application/vnd.mason+json":{"source":"iana","compressible":true},"application/vnd.maxar.archive.3tz+zip":{"source":"iana","compressible":false},"application/vnd.maxmind.maxmind-db":{"source":"iana"},"application/vnd.mcd":{"source":"iana","extensions":["mcd"]},"application/vnd.medcalcdata":{"source":"iana","extensions":["mc1"]},"application/vnd.mediastation.cdkey":{"source":"iana","extensions":["cdkey"]},"application/vnd.meridian-slingshot":{"source":"iana"},"application/vnd.mfer":{"source":"iana","extensions":["mwf"]},"application/vnd.mfmp":{"source":"iana","extensions":["mfm"]},"application/vnd.micro+json":{"source":"iana","compressible":true},"application/vnd.micrografx.flo":{"source":"iana","extensions":["flo"]},"application/vnd.micrografx.igx":{"source":"iana","extensions":["igx"]},"application/vnd.microsoft.portable-executable":{"source":"iana"},"application/vnd.microsoft.windows.thumbnail-cache":{"source":"iana"},"application/vnd.miele+json":{"source":"iana","compressible":true},"application/vnd.mif":{"source":"iana","extensions":["mif"]},"application/vnd.minisoft-hp3000-save":{"source":"iana"},"application/vnd.mitsubishi.misty-guard.trustweb":{"source":"iana"},"application/vnd.mobius.daf":{"source":"iana","extensions":["daf"]},"application/vnd.mobius.dis":{"source":"iana","extensions":["dis"]},"application/vnd.mobius.mbk":{"source":"iana","extensions":["mbk"]},"application/vnd.mobius.mqy":{"source":"iana","extensions":["mqy"]},"application/vnd.mobius.msl":{"source":"iana","extensions":["msl"]},"application/vnd.mobius.plc":{"source":"iana","extensions":["plc"]},"application/vnd.mobius.txf":{"source":"iana","extensions":["txf"]},"application/vnd.mophun.application":{"source":"iana","extensions":["mpn"]},"application/vnd.mophun.certificate":{"source":"iana","extensions":["mpc"]},"application/vnd.motorola.flexsuite":{"source":"iana"},"application/vnd.motorola.flexsuite.adsi":{"source":"iana"},"application/vnd.motorola.flexsuite.fis":{"source":"iana"},"application/vnd.motorola.flexsuite.gotap":{"source":"iana"},"application/vnd.motorola.flexsuite.kmr":{"source":"iana"},"application/vnd.motorola.flexsuite.ttc":{"source":"iana"},"application/vnd.motorola.flexsuite.wem":{"source":"iana"},"application/vnd.motorola.iprm":{"source":"iana"},"application/vnd.mozilla.xul+xml":{"source":"iana","compressible":true,"extensions":["xul"]},"application/vnd.ms-3mfdocument":{"source":"iana"},"application/vnd.ms-artgalry":{"source":"iana","extensions":["cil"]},"application/vnd.ms-asf":{"source":"iana"},"application/vnd.ms-cab-compressed":{"source":"iana","extensions":["cab"]},"application/vnd.ms-color.iccprofile":{"source":"apache"},"application/vnd.ms-excel":{"source":"iana","compressible":false,"extensions":["xls","xlm","xla","xlc","xlt","xlw"]},"application/vnd.ms-excel.addin.macroenabled.12":{"source":"iana","extensions":["xlam"]},"application/vnd.ms-excel.sheet.binary.macroenabled.12":{"source":"iana","extensions":["xlsb"]},"application/vnd.ms-excel.sheet.macroenabled.12":{"source":"iana","extensions":["xlsm"]},"application/vnd.ms-excel.template.macroenabled.12":{"source":"iana","extensions":["xltm"]},"application/vnd.ms-fontobject":{"source":"iana","compressible":true,"extensions":["eot"]},"application/vnd.ms-htmlhelp":{"source":"iana","extensions":["chm"]},"application/vnd.ms-ims":{"source":"iana","extensions":["ims"]},"application/vnd.ms-lrm":{"source":"iana","extensions":["lrm"]},"application/vnd.ms-office.activex+xml":{"source":"iana","compressible":true},"application/vnd.ms-officetheme":{"source":"iana","extensions":["thmx"]},"application/vnd.ms-opentype":{"source":"apache","compressible":true},"application/vnd.ms-outlook":{"compressible":false,"extensions":["msg"]},"application/vnd.ms-package.obfuscated-opentype":{"source":"apache"},"application/vnd.ms-pki.seccat":{"source":"apache","extensions":["cat"]},"application/vnd.ms-pki.stl":{"source":"apache","extensions":["stl"]},"application/vnd.ms-playready.initiator+xml":{"source":"iana","compressible":true},"application/vnd.ms-powerpoint":{"source":"iana","compressible":false,"extensions":["ppt","pps","pot"]},"application/vnd.ms-powerpoint.addin.macroenabled.12":{"source":"iana","extensions":["ppam"]},"application/vnd.ms-powerpoint.presentation.macroenabled.12":{"source":"iana","extensions":["pptm"]},"application/vnd.ms-powerpoint.slide.macroenabled.12":{"source":"iana","extensions":["sldm"]},"application/vnd.ms-powerpoint.slideshow.macroenabled.12":{"source":"iana","extensions":["ppsm"]},"application/vnd.ms-powerpoint.template.macroenabled.12":{"source":"iana","extensions":["potm"]},"application/vnd.ms-printdevicecapabilities+xml":{"source":"iana","compressible":true},"application/vnd.ms-printing.printticket+xml":{"source":"apache","compressible":true},"application/vnd.ms-printschematicket+xml":{"source":"iana","compressible":true},"application/vnd.ms-project":{"source":"iana","extensions":["mpp","mpt"]},"application/vnd.ms-tnef":{"source":"iana"},"application/vnd.ms-windows.devicepairing":{"source":"iana"},"application/vnd.ms-windows.nwprinting.oob":{"source":"iana"},"application/vnd.ms-windows.printerpairing":{"source":"iana"},"application/vnd.ms-windows.wsd.oob":{"source":"iana"},"application/vnd.ms-wmdrm.lic-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.lic-resp":{"source":"iana"},"application/vnd.ms-wmdrm.meter-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.meter-resp":{"source":"iana"},"application/vnd.ms-word.document.macroenabled.12":{"source":"iana","extensions":["docm"]},"application/vnd.ms-word.template.macroenabled.12":{"source":"iana","extensions":["dotm"]},"application/vnd.ms-works":{"source":"iana","extensions":["wps","wks","wcm","wdb"]},"application/vnd.ms-wpl":{"source":"iana","extensions":["wpl"]},"application/vnd.ms-xpsdocument":{"source":"iana","compressible":false,"extensions":["xps"]},"application/vnd.msa-disk-image":{"source":"iana"},"application/vnd.mseq":{"source":"iana","extensions":["mseq"]},"application/vnd.msign":{"source":"iana"},"application/vnd.multiad.creator":{"source":"iana"},"application/vnd.multiad.creator.cif":{"source":"iana"},"application/vnd.music-niff":{"source":"iana"},"application/vnd.musician":{"source":"iana","extensions":["mus"]},"application/vnd.muvee.style":{"source":"iana","extensions":["msty"]},"application/vnd.mynfc":{"source":"iana","extensions":["taglet"]},"application/vnd.nacamar.ybrid+json":{"source":"iana","compressible":true},"application/vnd.ncd.control":{"source":"iana"},"application/vnd.ncd.reference":{"source":"iana"},"application/vnd.nearst.inv+json":{"source":"iana","compressible":true},"application/vnd.nebumind.line":{"source":"iana"},"application/vnd.nervana":{"source":"iana"},"application/vnd.netfpx":{"source":"iana"},"application/vnd.neurolanguage.nlu":{"source":"iana","extensions":["nlu"]},"application/vnd.nimn":{"source":"iana"},"application/vnd.nintendo.nitro.rom":{"source":"iana"},"application/vnd.nintendo.snes.rom":{"source":"iana"},"application/vnd.nitf":{"source":"iana","extensions":["ntf","nitf"]},"application/vnd.noblenet-directory":{"source":"iana","extensions":["nnd"]},"application/vnd.noblenet-sealer":{"source":"iana","extensions":["nns"]},"application/vnd.noblenet-web":{"source":"iana","extensions":["nnw"]},"application/vnd.nokia.catalogs":{"source":"iana"},"application/vnd.nokia.conml+wbxml":{"source":"iana"},"application/vnd.nokia.conml+xml":{"source":"iana","compressible":true},"application/vnd.nokia.iptv.config+xml":{"source":"iana","compressible":true},"application/vnd.nokia.isds-radio-presets":{"source":"iana"},"application/vnd.nokia.landmark+wbxml":{"source":"iana"},"application/vnd.nokia.landmark+xml":{"source":"iana","compressible":true},"application/vnd.nokia.landmarkcollection+xml":{"source":"iana","compressible":true},"application/vnd.nokia.n-gage.ac+xml":{"source":"iana","compressible":true,"extensions":["ac"]},"application/vnd.nokia.n-gage.data":{"source":"iana","extensions":["ngdat"]},"application/vnd.nokia.n-gage.symbian.install":{"source":"iana","extensions":["n-gage"]},"application/vnd.nokia.ncd":{"source":"iana"},"application/vnd.nokia.pcd+wbxml":{"source":"iana"},"application/vnd.nokia.pcd+xml":{"source":"iana","compressible":true},"application/vnd.nokia.radio-preset":{"source":"iana","extensions":["rpst"]},"application/vnd.nokia.radio-presets":{"source":"iana","extensions":["rpss"]},"application/vnd.novadigm.edm":{"source":"iana","extensions":["edm"]},"application/vnd.novadigm.edx":{"source":"iana","extensions":["edx"]},"application/vnd.novadigm.ext":{"source":"iana","extensions":["ext"]},"application/vnd.ntt-local.content-share":{"source":"iana"},"application/vnd.ntt-local.file-transfer":{"source":"iana"},"application/vnd.ntt-local.ogw_remote-access":{"source":"iana"},"application/vnd.ntt-local.sip-ta_remote":{"source":"iana"},"application/vnd.ntt-local.sip-ta_tcp_stream":{"source":"iana"},"application/vnd.oasis.opendocument.chart":{"source":"iana","extensions":["odc"]},"application/vnd.oasis.opendocument.chart-template":{"source":"iana","extensions":["otc"]},"application/vnd.oasis.opendocument.database":{"source":"iana","extensions":["odb"]},"application/vnd.oasis.opendocument.formula":{"source":"iana","extensions":["odf"]},"application/vnd.oasis.opendocument.formula-template":{"source":"iana","extensions":["odft"]},"application/vnd.oasis.opendocument.graphics":{"source":"iana","compressible":false,"extensions":["odg"]},"application/vnd.oasis.opendocument.graphics-template":{"source":"iana","extensions":["otg"]},"application/vnd.oasis.opendocument.image":{"source":"iana","extensions":["odi"]},"application/vnd.oasis.opendocument.image-template":{"source":"iana","extensions":["oti"]},"application/vnd.oasis.opendocument.presentation":{"source":"iana","compressible":false,"extensions":["odp"]},"application/vnd.oasis.opendocument.presentation-template":{"source":"iana","extensions":["otp"]},"application/vnd.oasis.opendocument.spreadsheet":{"source":"iana","compressible":false,"extensions":["ods"]},"application/vnd.oasis.opendocument.spreadsheet-template":{"source":"iana","extensions":["ots"]},"application/vnd.oasis.opendocument.text":{"source":"iana","compressible":false,"extensions":["odt"]},"application/vnd.oasis.opendocument.text-master":{"source":"iana","extensions":["odm"]},"application/vnd.oasis.opendocument.text-template":{"source":"iana","extensions":["ott"]},"application/vnd.oasis.opendocument.text-web":{"source":"iana","extensions":["oth"]},"application/vnd.obn":{"source":"iana"},"application/vnd.ocf+cbor":{"source":"iana"},"application/vnd.oci.image.manifest.v1+json":{"source":"iana","compressible":true},"application/vnd.oftn.l10n+json":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessdownload+xml":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessstreaming+xml":{"source":"iana","compressible":true},"application/vnd.oipf.cspg-hexbinary":{"source":"iana"},"application/vnd.oipf.dae.svg+xml":{"source":"iana","compressible":true},"application/vnd.oipf.dae.xhtml+xml":{"source":"iana","compressible":true},"application/vnd.oipf.mippvcontrolmessage+xml":{"source":"iana","compressible":true},"application/vnd.oipf.pae.gem":{"source":"iana"},"application/vnd.oipf.spdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.oipf.spdlist+xml":{"source":"iana","compressible":true},"application/vnd.oipf.ueprofile+xml":{"source":"iana","compressible":true},"application/vnd.oipf.userprofile+xml":{"source":"iana","compressible":true},"application/vnd.olpc-sugar":{"source":"iana","extensions":["xo"]},"application/vnd.oma-scws-config":{"source":"iana"},"application/vnd.oma-scws-http-request":{"source":"iana"},"application/vnd.oma-scws-http-response":{"source":"iana"},"application/vnd.oma.bcast.associated-procedure-parameter+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.drm-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.imd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.ltkm":{"source":"iana"},"application/vnd.oma.bcast.notification+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.provisioningtrigger":{"source":"iana"},"application/vnd.oma.bcast.sgboot":{"source":"iana"},"application/vnd.oma.bcast.sgdd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sgdu":{"source":"iana"},"application/vnd.oma.bcast.simple-symbol-container":{"source":"iana"},"application/vnd.oma.bcast.smartcard-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sprov+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.stkm":{"source":"iana"},"application/vnd.oma.cab-address-book+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-feature-handler+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-pcc+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-subs-invite+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-user-prefs+xml":{"source":"iana","compressible":true},"application/vnd.oma.dcd":{"source":"iana"},"application/vnd.oma.dcdc":{"source":"iana"},"application/vnd.oma.dd2+xml":{"source":"iana","compressible":true,"extensions":["dd2"]},"application/vnd.oma.drm.risd+xml":{"source":"iana","compressible":true},"application/vnd.oma.group-usage-list+xml":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+cbor":{"source":"iana"},"application/vnd.oma.lwm2m+json":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+tlv":{"source":"iana"},"application/vnd.oma.pal+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.detailed-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.final-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.groups+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.invocation-descriptor+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.optimized-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.push":{"source":"iana"},"application/vnd.oma.scidm.messages+xml":{"source":"iana","compressible":true},"application/vnd.oma.xcap-directory+xml":{"source":"iana","compressible":true},"application/vnd.omads-email+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omads-file+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omads-folder+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omaloc-supl-init":{"source":"iana"},"application/vnd.onepager":{"source":"iana"},"application/vnd.onepagertamp":{"source":"iana"},"application/vnd.onepagertamx":{"source":"iana"},"application/vnd.onepagertat":{"source":"iana"},"application/vnd.onepagertatp":{"source":"iana"},"application/vnd.onepagertatx":{"source":"iana"},"application/vnd.openblox.game+xml":{"source":"iana","compressible":true,"extensions":["obgx"]},"application/vnd.openblox.game-binary":{"source":"iana"},"application/vnd.openeye.oeb":{"source":"iana"},"application/vnd.openofficeorg.extension":{"source":"apache","extensions":["oxt"]},"application/vnd.openstreetmap.data+xml":{"source":"iana","compressible":true,"extensions":["osm"]},"application/vnd.opentimestamps.ots":{"source":"iana"},"application/vnd.openxmlformats-officedocument.custom-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.customxmlproperties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawing+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chart+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.extended-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presentation":{"source":"iana","compressible":false,"extensions":["pptx"]},"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slide":{"source":"iana","extensions":["sldx"]},"application/vnd.openxmlformats-officedocument.presentationml.slide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideshow":{"source":"iana","extensions":["ppsx"]},"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tags+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.template":{"source":"iana","extensions":["potx"]},"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":{"source":"iana","compressible":false,"extensions":["xlsx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.template":{"source":"iana","extensions":["xltx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.theme+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.themeoverride+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.vmldrawing":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document":{"source":"iana","compressible":false,"extensions":["docx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.template":{"source":"iana","extensions":["dotx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.core-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.relationships+xml":{"source":"iana","compressible":true},"application/vnd.oracle.resource+json":{"source":"iana","compressible":true},"application/vnd.orange.indata":{"source":"iana"},"application/vnd.osa.netdeploy":{"source":"iana"},"application/vnd.osgeo.mapguide.package":{"source":"iana","extensions":["mgp"]},"application/vnd.osgi.bundle":{"source":"iana"},"application/vnd.osgi.dp":{"source":"iana","extensions":["dp"]},"application/vnd.osgi.subsystem":{"source":"iana","extensions":["esa"]},"application/vnd.otps.ct-kip+xml":{"source":"iana","compressible":true},"application/vnd.oxli.countgraph":{"source":"iana"},"application/vnd.pagerduty+json":{"source":"iana","compressible":true},"application/vnd.palm":{"source":"iana","extensions":["pdb","pqa","oprc"]},"application/vnd.panoply":{"source":"iana"},"application/vnd.paos.xml":{"source":"iana"},"application/vnd.patentdive":{"source":"iana"},"application/vnd.patientecommsdoc":{"source":"iana"},"application/vnd.pawaafile":{"source":"iana","extensions":["paw"]},"application/vnd.pcos":{"source":"iana"},"application/vnd.pg.format":{"source":"iana","extensions":["str"]},"application/vnd.pg.osasli":{"source":"iana","extensions":["ei6"]},"application/vnd.piaccess.application-licence":{"source":"iana"},"application/vnd.picsel":{"source":"iana","extensions":["efif"]},"application/vnd.pmi.widget":{"source":"iana","extensions":["wg"]},"application/vnd.poc.group-advertisement+xml":{"source":"iana","compressible":true},"application/vnd.pocketlearn":{"source":"iana","extensions":["plf"]},"application/vnd.powerbuilder6":{"source":"iana","extensions":["pbd"]},"application/vnd.powerbuilder6-s":{"source":"iana"},"application/vnd.powerbuilder7":{"source":"iana"},"application/vnd.powerbuilder7-s":{"source":"iana"},"application/vnd.powerbuilder75":{"source":"iana"},"application/vnd.powerbuilder75-s":{"source":"iana"},"application/vnd.preminet":{"source":"iana"},"application/vnd.previewsystems.box":{"source":"iana","extensions":["box"]},"application/vnd.proteus.magazine":{"source":"iana","extensions":["mgz"]},"application/vnd.psfs":{"source":"iana"},"application/vnd.publishare-delta-tree":{"source":"iana","extensions":["qps"]},"application/vnd.pvi.ptid1":{"source":"iana","extensions":["ptid"]},"application/vnd.pwg-multiplexed":{"source":"iana"},"application/vnd.pwg-xhtml-print+xml":{"source":"iana","compressible":true},"application/vnd.qualcomm.brew-app-res":{"source":"iana"},"application/vnd.quarantainenet":{"source":"iana"},"application/vnd.quark.quarkxpress":{"source":"iana","extensions":["qxd","qxt","qwd","qwt","qxl","qxb"]},"application/vnd.quobject-quoxdocument":{"source":"iana"},"application/vnd.radisys.moml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conn+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-stream+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-base+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-detect+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-sendrecv+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-group+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-speech+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-transform+xml":{"source":"iana","compressible":true},"application/vnd.rainstor.data":{"source":"iana"},"application/vnd.rapid":{"source":"iana"},"application/vnd.rar":{"source":"iana","extensions":["rar"]},"application/vnd.realvnc.bed":{"source":"iana","extensions":["bed"]},"application/vnd.recordare.musicxml":{"source":"iana","extensions":["mxl"]},"application/vnd.recordare.musicxml+xml":{"source":"iana","compressible":true,"extensions":["musicxml"]},"application/vnd.renlearn.rlprint":{"source":"iana"},"application/vnd.resilient.logic":{"source":"iana"},"application/vnd.restful+json":{"source":"iana","compressible":true},"application/vnd.rig.cryptonote":{"source":"iana","extensions":["cryptonote"]},"application/vnd.rim.cod":{"source":"apache","extensions":["cod"]},"application/vnd.rn-realmedia":{"source":"apache","extensions":["rm"]},"application/vnd.rn-realmedia-vbr":{"source":"apache","extensions":["rmvb"]},"application/vnd.route66.link66+xml":{"source":"iana","compressible":true,"extensions":["link66"]},"application/vnd.rs-274x":{"source":"iana"},"application/vnd.ruckus.download":{"source":"iana"},"application/vnd.s3sms":{"source":"iana"},"application/vnd.sailingtracker.track":{"source":"iana","extensions":["st"]},"application/vnd.sar":{"source":"iana"},"application/vnd.sbm.cid":{"source":"iana"},"application/vnd.sbm.mid2":{"source":"iana"},"application/vnd.scribus":{"source":"iana"},"application/vnd.sealed.3df":{"source":"iana"},"application/vnd.sealed.csf":{"source":"iana"},"application/vnd.sealed.doc":{"source":"iana"},"application/vnd.sealed.eml":{"source":"iana"},"application/vnd.sealed.mht":{"source":"iana"},"application/vnd.sealed.net":{"source":"iana"},"application/vnd.sealed.ppt":{"source":"iana"},"application/vnd.sealed.tiff":{"source":"iana"},"application/vnd.sealed.xls":{"source":"iana"},"application/vnd.sealedmedia.softseal.html":{"source":"iana"},"application/vnd.sealedmedia.softseal.pdf":{"source":"iana"},"application/vnd.seemail":{"source":"iana","extensions":["see"]},"application/vnd.seis+json":{"source":"iana","compressible":true},"application/vnd.sema":{"source":"iana","extensions":["sema"]},"application/vnd.semd":{"source":"iana","extensions":["semd"]},"application/vnd.semf":{"source":"iana","extensions":["semf"]},"application/vnd.shade-save-file":{"source":"iana"},"application/vnd.shana.informed.formdata":{"source":"iana","extensions":["ifm"]},"application/vnd.shana.informed.formtemplate":{"source":"iana","extensions":["itp"]},"application/vnd.shana.informed.interchange":{"source":"iana","extensions":["iif"]},"application/vnd.shana.informed.package":{"source":"iana","extensions":["ipk"]},"application/vnd.shootproof+json":{"source":"iana","compressible":true},"application/vnd.shopkick+json":{"source":"iana","compressible":true},"application/vnd.shp":{"source":"iana"},"application/vnd.shx":{"source":"iana"},"application/vnd.sigrok.session":{"source":"iana"},"application/vnd.simtech-mindmapper":{"source":"iana","extensions":["twd","twds"]},"application/vnd.siren+json":{"source":"iana","compressible":true},"application/vnd.smaf":{"source":"iana","extensions":["mmf"]},"application/vnd.smart.notebook":{"source":"iana"},"application/vnd.smart.teacher":{"source":"iana","extensions":["teacher"]},"application/vnd.snesdev-page-table":{"source":"iana"},"application/vnd.software602.filler.form+xml":{"source":"iana","compressible":true,"extensions":["fo"]},"application/vnd.software602.filler.form-xml-zip":{"source":"iana"},"application/vnd.solent.sdkm+xml":{"source":"iana","compressible":true,"extensions":["sdkm","sdkd"]},"application/vnd.spotfire.dxp":{"source":"iana","extensions":["dxp"]},"application/vnd.spotfire.sfs":{"source":"iana","extensions":["sfs"]},"application/vnd.sqlite3":{"source":"iana"},"application/vnd.sss-cod":{"source":"iana"},"application/vnd.sss-dtf":{"source":"iana"},"application/vnd.sss-ntf":{"source":"iana"},"application/vnd.stardivision.calc":{"source":"apache","extensions":["sdc"]},"application/vnd.stardivision.draw":{"source":"apache","extensions":["sda"]},"application/vnd.stardivision.impress":{"source":"apache","extensions":["sdd"]},"application/vnd.stardivision.math":{"source":"apache","extensions":["smf"]},"application/vnd.stardivision.writer":{"source":"apache","extensions":["sdw","vor"]},"application/vnd.stardivision.writer-global":{"source":"apache","extensions":["sgl"]},"application/vnd.stepmania.package":{"source":"iana","extensions":["smzip"]},"application/vnd.stepmania.stepchart":{"source":"iana","extensions":["sm"]},"application/vnd.street-stream":{"source":"iana"},"application/vnd.sun.wadl+xml":{"source":"iana","compressible":true,"extensions":["wadl"]},"application/vnd.sun.xml.calc":{"source":"apache","extensions":["sxc"]},"application/vnd.sun.xml.calc.template":{"source":"apache","extensions":["stc"]},"application/vnd.sun.xml.draw":{"source":"apache","extensions":["sxd"]},"application/vnd.sun.xml.draw.template":{"source":"apache","extensions":["std"]},"application/vnd.sun.xml.impress":{"source":"apache","extensions":["sxi"]},"application/vnd.sun.xml.impress.template":{"source":"apache","extensions":["sti"]},"application/vnd.sun.xml.math":{"source":"apache","extensions":["sxm"]},"application/vnd.sun.xml.writer":{"source":"apache","extensions":["sxw"]},"application/vnd.sun.xml.writer.global":{"source":"apache","extensions":["sxg"]},"application/vnd.sun.xml.writer.template":{"source":"apache","extensions":["stw"]},"application/vnd.sus-calendar":{"source":"iana","extensions":["sus","susp"]},"application/vnd.svd":{"source":"iana","extensions":["svd"]},"application/vnd.swiftview-ics":{"source":"iana"},"application/vnd.sycle+xml":{"source":"iana","compressible":true},"application/vnd.syft+json":{"source":"iana","compressible":true},"application/vnd.symbian.install":{"source":"apache","extensions":["sis","sisx"]},"application/vnd.syncml+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["xsm"]},"application/vnd.syncml.dm+wbxml":{"source":"iana","charset":"UTF-8","extensions":["bdm"]},"application/vnd.syncml.dm+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["xdm"]},"application/vnd.syncml.dm.notification":{"source":"iana"},"application/vnd.syncml.dmddf+wbxml":{"source":"iana"},"application/vnd.syncml.dmddf+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["ddf"]},"application/vnd.syncml.dmtnds+wbxml":{"source":"iana"},"application/vnd.syncml.dmtnds+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.syncml.ds.notification":{"source":"iana"},"application/vnd.tableschema+json":{"source":"iana","compressible":true},"application/vnd.tao.intent-module-archive":{"source":"iana","extensions":["tao"]},"application/vnd.tcpdump.pcap":{"source":"iana","extensions":["pcap","cap","dmp"]},"application/vnd.think-cell.ppttc+json":{"source":"iana","compressible":true},"application/vnd.tmd.mediaflex.api+xml":{"source":"iana","compressible":true},"application/vnd.tml":{"source":"iana"},"application/vnd.tmobile-livetv":{"source":"iana","extensions":["tmo"]},"application/vnd.tri.onesource":{"source":"iana"},"application/vnd.trid.tpt":{"source":"iana","extensions":["tpt"]},"application/vnd.triscape.mxs":{"source":"iana","extensions":["mxs"]},"application/vnd.trueapp":{"source":"iana","extensions":["tra"]},"application/vnd.truedoc":{"source":"iana"},"application/vnd.ubisoft.webplayer":{"source":"iana"},"application/vnd.ufdl":{"source":"iana","extensions":["ufd","ufdl"]},"application/vnd.uiq.theme":{"source":"iana","extensions":["utz"]},"application/vnd.umajin":{"source":"iana","extensions":["umj"]},"application/vnd.unity":{"source":"iana","extensions":["unityweb"]},"application/vnd.uoml+xml":{"source":"iana","compressible":true,"extensions":["uoml"]},"application/vnd.uplanet.alert":{"source":"iana"},"application/vnd.uplanet.alert-wbxml":{"source":"iana"},"application/vnd.uplanet.bearer-choice":{"source":"iana"},"application/vnd.uplanet.bearer-choice-wbxml":{"source":"iana"},"application/vnd.uplanet.cacheop":{"source":"iana"},"application/vnd.uplanet.cacheop-wbxml":{"source":"iana"},"application/vnd.uplanet.channel":{"source":"iana"},"application/vnd.uplanet.channel-wbxml":{"source":"iana"},"application/vnd.uplanet.list":{"source":"iana"},"application/vnd.uplanet.list-wbxml":{"source":"iana"},"application/vnd.uplanet.listcmd":{"source":"iana"},"application/vnd.uplanet.listcmd-wbxml":{"source":"iana"},"application/vnd.uplanet.signal":{"source":"iana"},"application/vnd.uri-map":{"source":"iana"},"application/vnd.valve.source.material":{"source":"iana"},"application/vnd.vcx":{"source":"iana","extensions":["vcx"]},"application/vnd.vd-study":{"source":"iana"},"application/vnd.vectorworks":{"source":"iana"},"application/vnd.vel+json":{"source":"iana","compressible":true},"application/vnd.verimatrix.vcas":{"source":"iana"},"application/vnd.veritone.aion+json":{"source":"iana","compressible":true},"application/vnd.veryant.thin":{"source":"iana"},"application/vnd.ves.encrypted":{"source":"iana"},"application/vnd.vidsoft.vidconference":{"source":"iana"},"application/vnd.visio":{"source":"iana","extensions":["vsd","vst","vss","vsw"]},"application/vnd.visionary":{"source":"iana","extensions":["vis"]},"application/vnd.vividence.scriptfile":{"source":"iana"},"application/vnd.vsf":{"source":"iana","extensions":["vsf"]},"application/vnd.wap.sic":{"source":"iana"},"application/vnd.wap.slc":{"source":"iana"},"application/vnd.wap.wbxml":{"source":"iana","charset":"UTF-8","extensions":["wbxml"]},"application/vnd.wap.wmlc":{"source":"iana","extensions":["wmlc"]},"application/vnd.wap.wmlscriptc":{"source":"iana","extensions":["wmlsc"]},"application/vnd.webturbo":{"source":"iana","extensions":["wtb"]},"application/vnd.wfa.dpp":{"source":"iana"},"application/vnd.wfa.p2p":{"source":"iana"},"application/vnd.wfa.wsc":{"source":"iana"},"application/vnd.windows.devicepairing":{"source":"iana"},"application/vnd.wmc":{"source":"iana"},"application/vnd.wmf.bootstrap":{"source":"iana"},"application/vnd.wolfram.mathematica":{"source":"iana"},"application/vnd.wolfram.mathematica.package":{"source":"iana"},"application/vnd.wolfram.player":{"source":"iana","extensions":["nbp"]},"application/vnd.wordperfect":{"source":"iana","extensions":["wpd"]},"application/vnd.wqd":{"source":"iana","extensions":["wqd"]},"application/vnd.wrq-hp3000-labelled":{"source":"iana"},"application/vnd.wt.stf":{"source":"iana","extensions":["stf"]},"application/vnd.wv.csp+wbxml":{"source":"iana"},"application/vnd.wv.csp+xml":{"source":"iana","compressible":true},"application/vnd.wv.ssp+xml":{"source":"iana","compressible":true},"application/vnd.xacml+json":{"source":"iana","compressible":true},"application/vnd.xara":{"source":"iana","extensions":["xar"]},"application/vnd.xfdl":{"source":"iana","extensions":["xfdl"]},"application/vnd.xfdl.webform":{"source":"iana"},"application/vnd.xmi+xml":{"source":"iana","compressible":true},"application/vnd.xmpie.cpkg":{"source":"iana"},"application/vnd.xmpie.dpkg":{"source":"iana"},"application/vnd.xmpie.plan":{"source":"iana"},"application/vnd.xmpie.ppkg":{"source":"iana"},"application/vnd.xmpie.xlim":{"source":"iana"},"application/vnd.yamaha.hv-dic":{"source":"iana","extensions":["hvd"]},"application/vnd.yamaha.hv-script":{"source":"iana","extensions":["hvs"]},"application/vnd.yamaha.hv-voice":{"source":"iana","extensions":["hvp"]},"application/vnd.yamaha.openscoreformat":{"source":"iana","extensions":["osf"]},"application/vnd.yamaha.openscoreformat.osfpvg+xml":{"source":"iana","compressible":true,"extensions":["osfpvg"]},"application/vnd.yamaha.remote-setup":{"source":"iana"},"application/vnd.yamaha.smaf-audio":{"source":"iana","extensions":["saf"]},"application/vnd.yamaha.smaf-phrase":{"source":"iana","extensions":["spf"]},"application/vnd.yamaha.through-ngn":{"source":"iana"},"application/vnd.yamaha.tunnel-udpencap":{"source":"iana"},"application/vnd.yaoweme":{"source":"iana"},"application/vnd.yellowriver-custom-menu":{"source":"iana","extensions":["cmp"]},"application/vnd.youtube.yt":{"source":"iana"},"application/vnd.zul":{"source":"iana","extensions":["zir","zirz"]},"application/vnd.zzazz.deck+xml":{"source":"iana","compressible":true,"extensions":["zaz"]},"application/voicexml+xml":{"source":"iana","compressible":true,"extensions":["vxml"]},"application/voucher-cms+json":{"source":"iana","compressible":true},"application/vq-rtcpxr":{"source":"iana"},"application/wasm":{"source":"iana","compressible":true,"extensions":["wasm"]},"application/watcherinfo+xml":{"source":"iana","compressible":true,"extensions":["wif"]},"application/webpush-options+json":{"source":"iana","compressible":true},"application/whoispp-query":{"source":"iana"},"application/whoispp-response":{"source":"iana"},"application/widget":{"source":"iana","extensions":["wgt"]},"application/winhlp":{"source":"apache","extensions":["hlp"]},"application/wita":{"source":"iana"},"application/wordperfect5.1":{"source":"iana"},"application/wsdl+xml":{"source":"iana","compressible":true,"extensions":["wsdl"]},"application/wspolicy+xml":{"source":"iana","compressible":true,"extensions":["wspolicy"]},"application/x-7z-compressed":{"source":"apache","compressible":false,"extensions":["7z"]},"application/x-abiword":{"source":"apache","extensions":["abw"]},"application/x-ace-compressed":{"source":"apache","extensions":["ace"]},"application/x-amf":{"source":"apache"},"application/x-apple-diskimage":{"source":"apache","extensions":["dmg"]},"application/x-arj":{"compressible":false,"extensions":["arj"]},"application/x-authorware-bin":{"source":"apache","extensions":["aab","x32","u32","vox"]},"application/x-authorware-map":{"source":"apache","extensions":["aam"]},"application/x-authorware-seg":{"source":"apache","extensions":["aas"]},"application/x-bcpio":{"source":"apache","extensions":["bcpio"]},"application/x-bdoc":{"compressible":false,"extensions":["bdoc"]},"application/x-bittorrent":{"source":"apache","extensions":["torrent"]},"application/x-blorb":{"source":"apache","extensions":["blb","blorb"]},"application/x-bzip":{"source":"apache","compressible":false,"extensions":["bz"]},"application/x-bzip2":{"source":"apache","compressible":false,"extensions":["bz2","boz"]},"application/x-cbr":{"source":"apache","extensions":["cbr","cba","cbt","cbz","cb7"]},"application/x-cdlink":{"source":"apache","extensions":["vcd"]},"application/x-cfs-compressed":{"source":"apache","extensions":["cfs"]},"application/x-chat":{"source":"apache","extensions":["chat"]},"application/x-chess-pgn":{"source":"apache","extensions":["pgn"]},"application/x-chrome-extension":{"extensions":["crx"]},"application/x-cocoa":{"source":"nginx","extensions":["cco"]},"application/x-compress":{"source":"apache"},"application/x-conference":{"source":"apache","extensions":["nsc"]},"application/x-cpio":{"source":"apache","extensions":["cpio"]},"application/x-csh":{"source":"apache","extensions":["csh"]},"application/x-deb":{"compressible":false},"application/x-debian-package":{"source":"apache","extensions":["deb","udeb"]},"application/x-dgc-compressed":{"source":"apache","extensions":["dgc"]},"application/x-director":{"source":"apache","extensions":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"]},"application/x-doom":{"source":"apache","extensions":["wad"]},"application/x-dtbncx+xml":{"source":"apache","compressible":true,"extensions":["ncx"]},"application/x-dtbook+xml":{"source":"apache","compressible":true,"extensions":["dtb"]},"application/x-dtbresource+xml":{"source":"apache","compressible":true,"extensions":["res"]},"application/x-dvi":{"source":"apache","compressible":false,"extensions":["dvi"]},"application/x-envoy":{"source":"apache","extensions":["evy"]},"application/x-eva":{"source":"apache","extensions":["eva"]},"application/x-font-bdf":{"source":"apache","extensions":["bdf"]},"application/x-font-dos":{"source":"apache"},"application/x-font-framemaker":{"source":"apache"},"application/x-font-ghostscript":{"source":"apache","extensions":["gsf"]},"application/x-font-libgrx":{"source":"apache"},"application/x-font-linux-psf":{"source":"apache","extensions":["psf"]},"application/x-font-pcf":{"source":"apache","extensions":["pcf"]},"application/x-font-snf":{"source":"apache","extensions":["snf"]},"application/x-font-speedo":{"source":"apache"},"application/x-font-sunos-news":{"source":"apache"},"application/x-font-type1":{"source":"apache","extensions":["pfa","pfb","pfm","afm"]},"application/x-font-vfont":{"source":"apache"},"application/x-freearc":{"source":"apache","extensions":["arc"]},"application/x-futuresplash":{"source":"apache","extensions":["spl"]},"application/x-gca-compressed":{"source":"apache","extensions":["gca"]},"application/x-glulx":{"source":"apache","extensions":["ulx"]},"application/x-gnumeric":{"source":"apache","extensions":["gnumeric"]},"application/x-gramps-xml":{"source":"apache","extensions":["gramps"]},"application/x-gtar":{"source":"apache","extensions":["gtar"]},"application/x-gzip":{"source":"apache"},"application/x-hdf":{"source":"apache","extensions":["hdf"]},"application/x-httpd-php":{"compressible":true,"extensions":["php"]},"application/x-install-instructions":{"source":"apache","extensions":["install"]},"application/x-iso9660-image":{"source":"apache","extensions":["iso"]},"application/x-iwork-keynote-sffkey":{"extensions":["key"]},"application/x-iwork-numbers-sffnumbers":{"extensions":["numbers"]},"application/x-iwork-pages-sffpages":{"extensions":["pages"]},"application/x-java-archive-diff":{"source":"nginx","extensions":["jardiff"]},"application/x-java-jnlp-file":{"source":"apache","compressible":false,"extensions":["jnlp"]},"application/x-javascript":{"compressible":true},"application/x-keepass2":{"extensions":["kdbx"]},"application/x-latex":{"source":"apache","compressible":false,"extensions":["latex"]},"application/x-lua-bytecode":{"extensions":["luac"]},"application/x-lzh-compressed":{"source":"apache","extensions":["lzh","lha"]},"application/x-makeself":{"source":"nginx","extensions":["run"]},"application/x-mie":{"source":"apache","extensions":["mie"]},"application/x-mobipocket-ebook":{"source":"apache","extensions":["prc","mobi"]},"application/x-mpegurl":{"compressible":false},"application/x-ms-application":{"source":"apache","extensions":["application"]},"application/x-ms-shortcut":{"source":"apache","extensions":["lnk"]},"application/x-ms-wmd":{"source":"apache","extensions":["wmd"]},"application/x-ms-wmz":{"source":"apache","extensions":["wmz"]},"application/x-ms-xbap":{"source":"apache","extensions":["xbap"]},"application/x-msaccess":{"source":"apache","extensions":["mdb"]},"application/x-msbinder":{"source":"apache","extensions":["obd"]},"application/x-mscardfile":{"source":"apache","extensions":["crd"]},"application/x-msclip":{"source":"apache","extensions":["clp"]},"application/x-msdos-program":{"extensions":["exe"]},"application/x-msdownload":{"source":"apache","extensions":["exe","dll","com","bat","msi"]},"application/x-msmediaview":{"source":"apache","extensions":["mvb","m13","m14"]},"application/x-msmetafile":{"source":"apache","extensions":["wmf","wmz","emf","emz"]},"application/x-msmoney":{"source":"apache","extensions":["mny"]},"application/x-mspublisher":{"source":"apache","extensions":["pub"]},"application/x-msschedule":{"source":"apache","extensions":["scd"]},"application/x-msterminal":{"source":"apache","extensions":["trm"]},"application/x-mswrite":{"source":"apache","extensions":["wri"]},"application/x-netcdf":{"source":"apache","extensions":["nc","cdf"]},"application/x-ns-proxy-autoconfig":{"compressible":true,"extensions":["pac"]},"application/x-nzb":{"source":"apache","extensions":["nzb"]},"application/x-perl":{"source":"nginx","extensions":["pl","pm"]},"application/x-pilot":{"source":"nginx","extensions":["prc","pdb"]},"application/x-pkcs12":{"source":"apache","compressible":false,"extensions":["p12","pfx"]},"application/x-pkcs7-certificates":{"source":"apache","extensions":["p7b","spc"]},"application/x-pkcs7-certreqresp":{"source":"apache","extensions":["p7r"]},"application/x-pki-message":{"source":"iana"},"application/x-rar-compressed":{"source":"apache","compressible":false,"extensions":["rar"]},"application/x-redhat-package-manager":{"source":"nginx","extensions":["rpm"]},"application/x-research-info-systems":{"source":"apache","extensions":["ris"]},"application/x-sea":{"source":"nginx","extensions":["sea"]},"application/x-sh":{"source":"apache","compressible":true,"extensions":["sh"]},"application/x-shar":{"source":"apache","extensions":["shar"]},"application/x-shockwave-flash":{"source":"apache","compressible":false,"extensions":["swf"]},"application/x-silverlight-app":{"source":"apache","extensions":["xap"]},"application/x-sql":{"source":"apache","extensions":["sql"]},"application/x-stuffit":{"source":"apache","compressible":false,"extensions":["sit"]},"application/x-stuffitx":{"source":"apache","extensions":["sitx"]},"application/x-subrip":{"source":"apache","extensions":["srt"]},"application/x-sv4cpio":{"source":"apache","extensions":["sv4cpio"]},"application/x-sv4crc":{"source":"apache","extensions":["sv4crc"]},"application/x-t3vm-image":{"source":"apache","extensions":["t3"]},"application/x-tads":{"source":"apache","extensions":["gam"]},"application/x-tar":{"source":"apache","compressible":true,"extensions":["tar"]},"application/x-tcl":{"source":"apache","extensions":["tcl","tk"]},"application/x-tex":{"source":"apache","extensions":["tex"]},"application/x-tex-tfm":{"source":"apache","extensions":["tfm"]},"application/x-texinfo":{"source":"apache","extensions":["texinfo","texi"]},"application/x-tgif":{"source":"apache","extensions":["obj"]},"application/x-ustar":{"source":"apache","extensions":["ustar"]},"application/x-virtualbox-hdd":{"compressible":true,"extensions":["hdd"]},"application/x-virtualbox-ova":{"compressible":true,"extensions":["ova"]},"application/x-virtualbox-ovf":{"compressible":true,"extensions":["ovf"]},"application/x-virtualbox-vbox":{"compressible":true,"extensions":["vbox"]},"application/x-virtualbox-vbox-extpack":{"compressible":false,"extensions":["vbox-extpack"]},"application/x-virtualbox-vdi":{"compressible":true,"extensions":["vdi"]},"application/x-virtualbox-vhd":{"compressible":true,"extensions":["vhd"]},"application/x-virtualbox-vmdk":{"compressible":true,"extensions":["vmdk"]},"application/x-wais-source":{"source":"apache","extensions":["src"]},"application/x-web-app-manifest+json":{"compressible":true,"extensions":["webapp"]},"application/x-www-form-urlencoded":{"source":"iana","compressible":true},"application/x-x509-ca-cert":{"source":"iana","extensions":["der","crt","pem"]},"application/x-x509-ca-ra-cert":{"source":"iana"},"application/x-x509-next-ca-cert":{"source":"iana"},"application/x-xfig":{"source":"apache","extensions":["fig"]},"application/x-xliff+xml":{"source":"apache","compressible":true,"extensions":["xlf"]},"application/x-xpinstall":{"source":"apache","compressible":false,"extensions":["xpi"]},"application/x-xz":{"source":"apache","extensions":["xz"]},"application/x-zmachine":{"source":"apache","extensions":["z1","z2","z3","z4","z5","z6","z7","z8"]},"application/x400-bp":{"source":"iana"},"application/xacml+xml":{"source":"iana","compressible":true},"application/xaml+xml":{"source":"apache","compressible":true,"extensions":["xaml"]},"application/xcap-att+xml":{"source":"iana","compressible":true,"extensions":["xav"]},"application/xcap-caps+xml":{"source":"iana","compressible":true,"extensions":["xca"]},"application/xcap-diff+xml":{"source":"iana","compressible":true,"extensions":["xdf"]},"application/xcap-el+xml":{"source":"iana","compressible":true,"extensions":["xel"]},"application/xcap-error+xml":{"source":"iana","compressible":true},"application/xcap-ns+xml":{"source":"iana","compressible":true,"extensions":["xns"]},"application/xcon-conference-info+xml":{"source":"iana","compressible":true},"application/xcon-conference-info-diff+xml":{"source":"iana","compressible":true},"application/xenc+xml":{"source":"iana","compressible":true,"extensions":["xenc"]},"application/xhtml+xml":{"source":"iana","compressible":true,"extensions":["xhtml","xht"]},"application/xhtml-voice+xml":{"source":"apache","compressible":true},"application/xliff+xml":{"source":"iana","compressible":true,"extensions":["xlf"]},"application/xml":{"source":"iana","compressible":true,"extensions":["xml","xsl","xsd","rng"]},"application/xml-dtd":{"source":"iana","compressible":true,"extensions":["dtd"]},"application/xml-external-parsed-entity":{"source":"iana"},"application/xml-patch+xml":{"source":"iana","compressible":true},"application/xmpp+xml":{"source":"iana","compressible":true},"application/xop+xml":{"source":"iana","compressible":true,"extensions":["xop"]},"application/xproc+xml":{"source":"apache","compressible":true,"extensions":["xpl"]},"application/xslt+xml":{"source":"iana","compressible":true,"extensions":["xsl","xslt"]},"application/xspf+xml":{"source":"apache","compressible":true,"extensions":["xspf"]},"application/xv+xml":{"source":"iana","compressible":true,"extensions":["mxml","xhvml","xvml","xvm"]},"application/yang":{"source":"iana","extensions":["yang"]},"application/yang-data+json":{"source":"iana","compressible":true},"application/yang-data+xml":{"source":"iana","compressible":true},"application/yang-patch+json":{"source":"iana","compressible":true},"application/yang-patch+xml":{"source":"iana","compressible":true},"application/yin+xml":{"source":"iana","compressible":true,"extensions":["yin"]},"application/zip":{"source":"iana","compressible":false,"extensions":["zip"]},"application/zlib":{"source":"iana"},"application/zstd":{"source":"iana"},"audio/1d-interleaved-parityfec":{"source":"iana"},"audio/32kadpcm":{"source":"iana"},"audio/3gpp":{"source":"iana","compressible":false,"extensions":["3gpp"]},"audio/3gpp2":{"source":"iana"},"audio/aac":{"source":"iana"},"audio/ac3":{"source":"iana"},"audio/adpcm":{"source":"apache","extensions":["adp"]},"audio/amr":{"source":"iana","extensions":["amr"]},"audio/amr-wb":{"source":"iana"},"audio/amr-wb+":{"source":"iana"},"audio/aptx":{"source":"iana"},"audio/asc":{"source":"iana"},"audio/atrac-advanced-lossless":{"source":"iana"},"audio/atrac-x":{"source":"iana"},"audio/atrac3":{"source":"iana"},"audio/basic":{"source":"iana","compressible":false,"extensions":["au","snd"]},"audio/bv16":{"source":"iana"},"audio/bv32":{"source":"iana"},"audio/clearmode":{"source":"iana"},"audio/cn":{"source":"iana"},"audio/dat12":{"source":"iana"},"audio/dls":{"source":"iana"},"audio/dsr-es201108":{"source":"iana"},"audio/dsr-es202050":{"source":"iana"},"audio/dsr-es202211":{"source":"iana"},"audio/dsr-es202212":{"source":"iana"},"audio/dv":{"source":"iana"},"audio/dvi4":{"source":"iana"},"audio/eac3":{"source":"iana"},"audio/encaprtp":{"source":"iana"},"audio/evrc":{"source":"iana"},"audio/evrc-qcp":{"source":"iana"},"audio/evrc0":{"source":"iana"},"audio/evrc1":{"source":"iana"},"audio/evrcb":{"source":"iana"},"audio/evrcb0":{"source":"iana"},"audio/evrcb1":{"source":"iana"},"audio/evrcnw":{"source":"iana"},"audio/evrcnw0":{"source":"iana"},"audio/evrcnw1":{"source":"iana"},"audio/evrcwb":{"source":"iana"},"audio/evrcwb0":{"source":"iana"},"audio/evrcwb1":{"source":"iana"},"audio/evs":{"source":"iana"},"audio/flexfec":{"source":"iana"},"audio/fwdred":{"source":"iana"},"audio/g711-0":{"source":"iana"},"audio/g719":{"source":"iana"},"audio/g722":{"source":"iana"},"audio/g7221":{"source":"iana"},"audio/g723":{"source":"iana"},"audio/g726-16":{"source":"iana"},"audio/g726-24":{"source":"iana"},"audio/g726-32":{"source":"iana"},"audio/g726-40":{"source":"iana"},"audio/g728":{"source":"iana"},"audio/g729":{"source":"iana"},"audio/g7291":{"source":"iana"},"audio/g729d":{"source":"iana"},"audio/g729e":{"source":"iana"},"audio/gsm":{"source":"iana"},"audio/gsm-efr":{"source":"iana"},"audio/gsm-hr-08":{"source":"iana"},"audio/ilbc":{"source":"iana"},"audio/ip-mr_v2.5":{"source":"iana"},"audio/isac":{"source":"apache"},"audio/l16":{"source":"iana"},"audio/l20":{"source":"iana"},"audio/l24":{"source":"iana","compressible":false},"audio/l8":{"source":"iana"},"audio/lpc":{"source":"iana"},"audio/melp":{"source":"iana"},"audio/melp1200":{"source":"iana"},"audio/melp2400":{"source":"iana"},"audio/melp600":{"source":"iana"},"audio/mhas":{"source":"iana"},"audio/midi":{"source":"apache","extensions":["mid","midi","kar","rmi"]},"audio/mobile-xmf":{"source":"iana","extensions":["mxmf"]},"audio/mp3":{"compressible":false,"extensions":["mp3"]},"audio/mp4":{"source":"iana","compressible":false,"extensions":["m4a","mp4a"]},"audio/mp4a-latm":{"source":"iana"},"audio/mpa":{"source":"iana"},"audio/mpa-robust":{"source":"iana"},"audio/mpeg":{"source":"iana","compressible":false,"extensions":["mpga","mp2","mp2a","mp3","m2a","m3a"]},"audio/mpeg4-generic":{"source":"iana"},"audio/musepack":{"source":"apache"},"audio/ogg":{"source":"iana","compressible":false,"extensions":["oga","ogg","spx","opus"]},"audio/opus":{"source":"iana"},"audio/parityfec":{"source":"iana"},"audio/pcma":{"source":"iana"},"audio/pcma-wb":{"source":"iana"},"audio/pcmu":{"source":"iana"},"audio/pcmu-wb":{"source":"iana"},"audio/prs.sid":{"source":"iana"},"audio/qcelp":{"source":"iana"},"audio/raptorfec":{"source":"iana"},"audio/red":{"source":"iana"},"audio/rtp-enc-aescm128":{"source":"iana"},"audio/rtp-midi":{"source":"iana"},"audio/rtploopback":{"source":"iana"},"audio/rtx":{"source":"iana"},"audio/s3m":{"source":"apache","extensions":["s3m"]},"audio/scip":{"source":"iana"},"audio/silk":{"source":"apache","extensions":["sil"]},"audio/smv":{"source":"iana"},"audio/smv-qcp":{"source":"iana"},"audio/smv0":{"source":"iana"},"audio/sofa":{"source":"iana"},"audio/sp-midi":{"source":"iana"},"audio/speex":{"source":"iana"},"audio/t140c":{"source":"iana"},"audio/t38":{"source":"iana"},"audio/telephone-event":{"source":"iana"},"audio/tetra_acelp":{"source":"iana"},"audio/tetra_acelp_bb":{"source":"iana"},"audio/tone":{"source":"iana"},"audio/tsvcis":{"source":"iana"},"audio/uemclip":{"source":"iana"},"audio/ulpfec":{"source":"iana"},"audio/usac":{"source":"iana"},"audio/vdvi":{"source":"iana"},"audio/vmr-wb":{"source":"iana"},"audio/vnd.3gpp.iufp":{"source":"iana"},"audio/vnd.4sb":{"source":"iana"},"audio/vnd.audiokoz":{"source":"iana"},"audio/vnd.celp":{"source":"iana"},"audio/vnd.cisco.nse":{"source":"iana"},"audio/vnd.cmles.radio-events":{"source":"iana"},"audio/vnd.cns.anp1":{"source":"iana"},"audio/vnd.cns.inf1":{"source":"iana"},"audio/vnd.dece.audio":{"source":"iana","extensions":["uva","uvva"]},"audio/vnd.digital-winds":{"source":"iana","extensions":["eol"]},"audio/vnd.dlna.adts":{"source":"iana"},"audio/vnd.dolby.heaac.1":{"source":"iana"},"audio/vnd.dolby.heaac.2":{"source":"iana"},"audio/vnd.dolby.mlp":{"source":"iana"},"audio/vnd.dolby.mps":{"source":"iana"},"audio/vnd.dolby.pl2":{"source":"iana"},"audio/vnd.dolby.pl2x":{"source":"iana"},"audio/vnd.dolby.pl2z":{"source":"iana"},"audio/vnd.dolby.pulse.1":{"source":"iana"},"audio/vnd.dra":{"source":"iana","extensions":["dra"]},"audio/vnd.dts":{"source":"iana","extensions":["dts"]},"audio/vnd.dts.hd":{"source":"iana","extensions":["dtshd"]},"audio/vnd.dts.uhd":{"source":"iana"},"audio/vnd.dvb.file":{"source":"iana"},"audio/vnd.everad.plj":{"source":"iana"},"audio/vnd.hns.audio":{"source":"iana"},"audio/vnd.lucent.voice":{"source":"iana","extensions":["lvp"]},"audio/vnd.ms-playready.media.pya":{"source":"iana","extensions":["pya"]},"audio/vnd.nokia.mobile-xmf":{"source":"iana"},"audio/vnd.nortel.vbk":{"source":"iana"},"audio/vnd.nuera.ecelp4800":{"source":"iana","extensions":["ecelp4800"]},"audio/vnd.nuera.ecelp7470":{"source":"iana","extensions":["ecelp7470"]},"audio/vnd.nuera.ecelp9600":{"source":"iana","extensions":["ecelp9600"]},"audio/vnd.octel.sbc":{"source":"iana"},"audio/vnd.presonus.multitrack":{"source":"iana"},"audio/vnd.qcelp":{"source":"iana"},"audio/vnd.rhetorex.32kadpcm":{"source":"iana"},"audio/vnd.rip":{"source":"iana","extensions":["rip"]},"audio/vnd.rn-realaudio":{"compressible":false},"audio/vnd.sealedmedia.softseal.mpeg":{"source":"iana"},"audio/vnd.vmx.cvsd":{"source":"iana"},"audio/vnd.wave":{"compressible":false},"audio/vorbis":{"source":"iana","compressible":false},"audio/vorbis-config":{"source":"iana"},"audio/wav":{"compressible":false,"extensions":["wav"]},"audio/wave":{"compressible":false,"extensions":["wav"]},"audio/webm":{"source":"apache","compressible":false,"extensions":["weba"]},"audio/x-aac":{"source":"apache","compressible":false,"extensions":["aac"]},"audio/x-aiff":{"source":"apache","extensions":["aif","aiff","aifc"]},"audio/x-caf":{"source":"apache","compressible":false,"extensions":["caf"]},"audio/x-flac":{"source":"apache","extensions":["flac"]},"audio/x-m4a":{"source":"nginx","extensions":["m4a"]},"audio/x-matroska":{"source":"apache","extensions":["mka"]},"audio/x-mpegurl":{"source":"apache","extensions":["m3u"]},"audio/x-ms-wax":{"source":"apache","extensions":["wax"]},"audio/x-ms-wma":{"source":"apache","extensions":["wma"]},"audio/x-pn-realaudio":{"source":"apache","extensions":["ram","ra"]},"audio/x-pn-realaudio-plugin":{"source":"apache","extensions":["rmp"]},"audio/x-realaudio":{"source":"nginx","extensions":["ra"]},"audio/x-tta":{"source":"apache"},"audio/x-wav":{"source":"apache","extensions":["wav"]},"audio/xm":{"source":"apache","extensions":["xm"]},"chemical/x-cdx":{"source":"apache","extensions":["cdx"]},"chemical/x-cif":{"source":"apache","extensions":["cif"]},"chemical/x-cmdf":{"source":"apache","extensions":["cmdf"]},"chemical/x-cml":{"source":"apache","extensions":["cml"]},"chemical/x-csml":{"source":"apache","extensions":["csml"]},"chemical/x-pdb":{"source":"apache"},"chemical/x-xyz":{"source":"apache","extensions":["xyz"]},"font/collection":{"source":"iana","extensions":["ttc"]},"font/otf":{"source":"iana","compressible":true,"extensions":["otf"]},"font/sfnt":{"source":"iana"},"font/ttf":{"source":"iana","compressible":true,"extensions":["ttf"]},"font/woff":{"source":"iana","extensions":["woff"]},"font/woff2":{"source":"iana","extensions":["woff2"]},"image/aces":{"source":"iana","extensions":["exr"]},"image/apng":{"compressible":false,"extensions":["apng"]},"image/avci":{"source":"iana","extensions":["avci"]},"image/avcs":{"source":"iana","extensions":["avcs"]},"image/avif":{"source":"iana","compressible":false,"extensions":["avif"]},"image/bmp":{"source":"iana","compressible":true,"extensions":["bmp"]},"image/cgm":{"source":"iana","extensions":["cgm"]},"image/dicom-rle":{"source":"iana","extensions":["drle"]},"image/emf":{"source":"iana","extensions":["emf"]},"image/fits":{"source":"iana","extensions":["fits"]},"image/g3fax":{"source":"iana","extensions":["g3"]},"image/gif":{"source":"iana","compressible":false,"extensions":["gif"]},"image/heic":{"source":"iana","extensions":["heic"]},"image/heic-sequence":{"source":"iana","extensions":["heics"]},"image/heif":{"source":"iana","extensions":["heif"]},"image/heif-sequence":{"source":"iana","extensions":["heifs"]},"image/hej2k":{"source":"iana","extensions":["hej2"]},"image/hsj2":{"source":"iana","extensions":["hsj2"]},"image/ief":{"source":"iana","extensions":["ief"]},"image/jls":{"source":"iana","extensions":["jls"]},"image/jp2":{"source":"iana","compressible":false,"extensions":["jp2","jpg2"]},"image/jpeg":{"source":"iana","compressible":false,"extensions":["jpeg","jpg","jpe"]},"image/jph":{"source":"iana","extensions":["jph"]},"image/jphc":{"source":"iana","extensions":["jhc"]},"image/jpm":{"source":"iana","compressible":false,"extensions":["jpm"]},"image/jpx":{"source":"iana","compressible":false,"extensions":["jpx","jpf"]},"image/jxr":{"source":"iana","extensions":["jxr"]},"image/jxra":{"source":"iana","extensions":["jxra"]},"image/jxrs":{"source":"iana","extensions":["jxrs"]},"image/jxs":{"source":"iana","extensions":["jxs"]},"image/jxsc":{"source":"iana","extensions":["jxsc"]},"image/jxsi":{"source":"iana","extensions":["jxsi"]},"image/jxss":{"source":"iana","extensions":["jxss"]},"image/ktx":{"source":"iana","extensions":["ktx"]},"image/ktx2":{"source":"iana","extensions":["ktx2"]},"image/naplps":{"source":"iana"},"image/pjpeg":{"compressible":false},"image/png":{"source":"iana","compressible":false,"extensions":["png"]},"image/prs.btif":{"source":"iana","extensions":["btif"]},"image/prs.pti":{"source":"iana","extensions":["pti"]},"image/pwg-raster":{"source":"iana"},"image/sgi":{"source":"apache","extensions":["sgi"]},"image/svg+xml":{"source":"iana","compressible":true,"extensions":["svg","svgz"]},"image/t38":{"source":"iana","extensions":["t38"]},"image/tiff":{"source":"iana","compressible":false,"extensions":["tif","tiff"]},"image/tiff-fx":{"source":"iana","extensions":["tfx"]},"image/vnd.adobe.photoshop":{"source":"iana","compressible":true,"extensions":["psd"]},"image/vnd.airzip.accelerator.azv":{"source":"iana","extensions":["azv"]},"image/vnd.cns.inf2":{"source":"iana"},"image/vnd.dece.graphic":{"source":"iana","extensions":["uvi","uvvi","uvg","uvvg"]},"image/vnd.djvu":{"source":"iana","extensions":["djvu","djv"]},"image/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"image/vnd.dwg":{"source":"iana","extensions":["dwg"]},"image/vnd.dxf":{"source":"iana","extensions":["dxf"]},"image/vnd.fastbidsheet":{"source":"iana","extensions":["fbs"]},"image/vnd.fpx":{"source":"iana","extensions":["fpx"]},"image/vnd.fst":{"source":"iana","extensions":["fst"]},"image/vnd.fujixerox.edmics-mmr":{"source":"iana","extensions":["mmr"]},"image/vnd.fujixerox.edmics-rlc":{"source":"iana","extensions":["rlc"]},"image/vnd.globalgraphics.pgb":{"source":"iana"},"image/vnd.microsoft.icon":{"source":"iana","compressible":true,"extensions":["ico"]},"image/vnd.mix":{"source":"iana"},"image/vnd.mozilla.apng":{"source":"iana"},"image/vnd.ms-dds":{"compressible":true,"extensions":["dds"]},"image/vnd.ms-modi":{"source":"iana","extensions":["mdi"]},"image/vnd.ms-photo":{"source":"apache","extensions":["wdp"]},"image/vnd.net-fpx":{"source":"iana","extensions":["npx"]},"image/vnd.pco.b16":{"source":"iana","extensions":["b16"]},"image/vnd.radiance":{"source":"iana"},"image/vnd.sealed.png":{"source":"iana"},"image/vnd.sealedmedia.softseal.gif":{"source":"iana"},"image/vnd.sealedmedia.softseal.jpg":{"source":"iana"},"image/vnd.svf":{"source":"iana"},"image/vnd.tencent.tap":{"source":"iana","extensions":["tap"]},"image/vnd.valve.source.texture":{"source":"iana","extensions":["vtf"]},"image/vnd.wap.wbmp":{"source":"iana","extensions":["wbmp"]},"image/vnd.xiff":{"source":"iana","extensions":["xif"]},"image/vnd.zbrush.pcx":{"source":"iana","extensions":["pcx"]},"image/webp":{"source":"apache","extensions":["webp"]},"image/wmf":{"source":"iana","extensions":["wmf"]},"image/x-3ds":{"source":"apache","extensions":["3ds"]},"image/x-cmu-raster":{"source":"apache","extensions":["ras"]},"image/x-cmx":{"source":"apache","extensions":["cmx"]},"image/x-freehand":{"source":"apache","extensions":["fh","fhc","fh4","fh5","fh7"]},"image/x-icon":{"source":"apache","compressible":true,"extensions":["ico"]},"image/x-jng":{"source":"nginx","extensions":["jng"]},"image/x-mrsid-image":{"source":"apache","extensions":["sid"]},"image/x-ms-bmp":{"source":"nginx","compressible":true,"extensions":["bmp"]},"image/x-pcx":{"source":"apache","extensions":["pcx"]},"image/x-pict":{"source":"apache","extensions":["pic","pct"]},"image/x-portable-anymap":{"source":"apache","extensions":["pnm"]},"image/x-portable-bitmap":{"source":"apache","extensions":["pbm"]},"image/x-portable-graymap":{"source":"apache","extensions":["pgm"]},"image/x-portable-pixmap":{"source":"apache","extensions":["ppm"]},"image/x-rgb":{"source":"apache","extensions":["rgb"]},"image/x-tga":{"source":"apache","extensions":["tga"]},"image/x-xbitmap":{"source":"apache","extensions":["xbm"]},"image/x-xcf":{"compressible":false},"image/x-xpixmap":{"source":"apache","extensions":["xpm"]},"image/x-xwindowdump":{"source":"apache","extensions":["xwd"]},"message/cpim":{"source":"iana"},"message/delivery-status":{"source":"iana"},"message/disposition-notification":{"source":"iana","extensions":["disposition-notification"]},"message/external-body":{"source":"iana"},"message/feedback-report":{"source":"iana"},"message/global":{"source":"iana","extensions":["u8msg"]},"message/global-delivery-status":{"source":"iana","extensions":["u8dsn"]},"message/global-disposition-notification":{"source":"iana","extensions":["u8mdn"]},"message/global-headers":{"source":"iana","extensions":["u8hdr"]},"message/http":{"source":"iana","compressible":false},"message/imdn+xml":{"source":"iana","compressible":true},"message/news":{"source":"iana"},"message/partial":{"source":"iana","compressible":false},"message/rfc822":{"source":"iana","compressible":true,"extensions":["eml","mime"]},"message/s-http":{"source":"iana"},"message/sip":{"source":"iana"},"message/sipfrag":{"source":"iana"},"message/tracking-status":{"source":"iana"},"message/vnd.si.simp":{"source":"iana"},"message/vnd.wfa.wsc":{"source":"iana","extensions":["wsc"]},"model/3mf":{"source":"iana","extensions":["3mf"]},"model/e57":{"source":"iana"},"model/gltf+json":{"source":"iana","compressible":true,"extensions":["gltf"]},"model/gltf-binary":{"source":"iana","compressible":true,"extensions":["glb"]},"model/iges":{"source":"iana","compressible":false,"extensions":["igs","iges"]},"model/mesh":{"source":"iana","compressible":false,"extensions":["msh","mesh","silo"]},"model/mtl":{"source":"iana","extensions":["mtl"]},"model/obj":{"source":"iana","extensions":["obj"]},"model/step":{"source":"iana"},"model/step+xml":{"source":"iana","compressible":true,"extensions":["stpx"]},"model/step+zip":{"source":"iana","compressible":false,"extensions":["stpz"]},"model/step-xml+zip":{"source":"iana","compressible":false,"extensions":["stpxz"]},"model/stl":{"source":"iana","extensions":["stl"]},"model/vnd.collada+xml":{"source":"iana","compressible":true,"extensions":["dae"]},"model/vnd.dwf":{"source":"iana","extensions":["dwf"]},"model/vnd.flatland.3dml":{"source":"iana"},"model/vnd.gdl":{"source":"iana","extensions":["gdl"]},"model/vnd.gs-gdl":{"source":"apache"},"model/vnd.gs.gdl":{"source":"iana"},"model/vnd.gtw":{"source":"iana","extensions":["gtw"]},"model/vnd.moml+xml":{"source":"iana","compressible":true},"model/vnd.mts":{"source":"iana","extensions":["mts"]},"model/vnd.opengex":{"source":"iana","extensions":["ogex"]},"model/vnd.parasolid.transmit.binary":{"source":"iana","extensions":["x_b"]},"model/vnd.parasolid.transmit.text":{"source":"iana","extensions":["x_t"]},"model/vnd.pytha.pyox":{"source":"iana"},"model/vnd.rosette.annotated-data-model":{"source":"iana"},"model/vnd.sap.vds":{"source":"iana","extensions":["vds"]},"model/vnd.usdz+zip":{"source":"iana","compressible":false,"extensions":["usdz"]},"model/vnd.valve.source.compiled-map":{"source":"iana","extensions":["bsp"]},"model/vnd.vtu":{"source":"iana","extensions":["vtu"]},"model/vrml":{"source":"iana","compressible":false,"extensions":["wrl","vrml"]},"model/x3d+binary":{"source":"apache","compressible":false,"extensions":["x3db","x3dbz"]},"model/x3d+fastinfoset":{"source":"iana","extensions":["x3db"]},"model/x3d+vrml":{"source":"apache","compressible":false,"extensions":["x3dv","x3dvz"]},"model/x3d+xml":{"source":"iana","compressible":true,"extensions":["x3d","x3dz"]},"model/x3d-vrml":{"source":"iana","extensions":["x3dv"]},"multipart/alternative":{"source":"iana","compressible":false},"multipart/appledouble":{"source":"iana"},"multipart/byteranges":{"source":"iana"},"multipart/digest":{"source":"iana"},"multipart/encrypted":{"source":"iana","compressible":false},"multipart/form-data":{"source":"iana","compressible":false},"multipart/header-set":{"source":"iana"},"multipart/mixed":{"source":"iana"},"multipart/multilingual":{"source":"iana"},"multipart/parallel":{"source":"iana"},"multipart/related":{"source":"iana","compressible":false},"multipart/report":{"source":"iana"},"multipart/signed":{"source":"iana","compressible":false},"multipart/vnd.bint.med-plus":{"source":"iana"},"multipart/voice-message":{"source":"iana"},"multipart/x-mixed-replace":{"source":"iana"},"text/1d-interleaved-parityfec":{"source":"iana"},"text/cache-manifest":{"source":"iana","compressible":true,"extensions":["appcache","manifest"]},"text/calendar":{"source":"iana","extensions":["ics","ifb"]},"text/calender":{"compressible":true},"text/cmd":{"compressible":true},"text/coffeescript":{"extensions":["coffee","litcoffee"]},"text/cql":{"source":"iana"},"text/cql-expression":{"source":"iana"},"text/cql-identifier":{"source":"iana"},"text/css":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["css"]},"text/csv":{"source":"iana","compressible":true,"extensions":["csv"]},"text/csv-schema":{"source":"iana"},"text/directory":{"source":"iana"},"text/dns":{"source":"iana"},"text/ecmascript":{"source":"iana"},"text/encaprtp":{"source":"iana"},"text/enriched":{"source":"iana"},"text/fhirpath":{"source":"iana"},"text/flexfec":{"source":"iana"},"text/fwdred":{"source":"iana"},"text/gff3":{"source":"iana"},"text/grammar-ref-list":{"source":"iana"},"text/html":{"source":"iana","compressible":true,"extensions":["html","htm","shtml"]},"text/jade":{"extensions":["jade"]},"text/javascript":{"source":"iana","compressible":true},"text/jcr-cnd":{"source":"iana"},"text/jsx":{"compressible":true,"extensions":["jsx"]},"text/less":{"compressible":true,"extensions":["less"]},"text/markdown":{"source":"iana","compressible":true,"extensions":["markdown","md"]},"text/mathml":{"source":"nginx","extensions":["mml"]},"text/mdx":{"compressible":true,"extensions":["mdx"]},"text/mizar":{"source":"iana"},"text/n3":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["n3"]},"text/parameters":{"source":"iana","charset":"UTF-8"},"text/parityfec":{"source":"iana"},"text/plain":{"source":"iana","compressible":true,"extensions":["txt","text","conf","def","list","log","in","ini"]},"text/provenance-notation":{"source":"iana","charset":"UTF-8"},"text/prs.fallenstein.rst":{"source":"iana"},"text/prs.lines.tag":{"source":"iana","extensions":["dsc"]},"text/prs.prop.logic":{"source":"iana"},"text/raptorfec":{"source":"iana"},"text/red":{"source":"iana"},"text/rfc822-headers":{"source":"iana"},"text/richtext":{"source":"iana","compressible":true,"extensions":["rtx"]},"text/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"text/rtp-enc-aescm128":{"source":"iana"},"text/rtploopback":{"source":"iana"},"text/rtx":{"source":"iana"},"text/sgml":{"source":"iana","extensions":["sgml","sgm"]},"text/shaclc":{"source":"iana"},"text/shex":{"source":"iana","extensions":["shex"]},"text/slim":{"extensions":["slim","slm"]},"text/spdx":{"source":"iana","extensions":["spdx"]},"text/strings":{"source":"iana"},"text/stylus":{"extensions":["stylus","styl"]},"text/t140":{"source":"iana"},"text/tab-separated-values":{"source":"iana","compressible":true,"extensions":["tsv"]},"text/troff":{"source":"iana","extensions":["t","tr","roff","man","me","ms"]},"text/turtle":{"source":"iana","charset":"UTF-8","extensions":["ttl"]},"text/ulpfec":{"source":"iana"},"text/uri-list":{"source":"iana","compressible":true,"extensions":["uri","uris","urls"]},"text/vcard":{"source":"iana","compressible":true,"extensions":["vcard"]},"text/vnd.a":{"source":"iana"},"text/vnd.abc":{"source":"iana"},"text/vnd.ascii-art":{"source":"iana"},"text/vnd.curl":{"source":"iana","extensions":["curl"]},"text/vnd.curl.dcurl":{"source":"apache","extensions":["dcurl"]},"text/vnd.curl.mcurl":{"source":"apache","extensions":["mcurl"]},"text/vnd.curl.scurl":{"source":"apache","extensions":["scurl"]},"text/vnd.debian.copyright":{"source":"iana","charset":"UTF-8"},"text/vnd.dmclientscript":{"source":"iana"},"text/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"text/vnd.esmertec.theme-descriptor":{"source":"iana","charset":"UTF-8"},"text/vnd.familysearch.gedcom":{"source":"iana","extensions":["ged"]},"text/vnd.ficlab.flt":{"source":"iana"},"text/vnd.fly":{"source":"iana","extensions":["fly"]},"text/vnd.fmi.flexstor":{"source":"iana","extensions":["flx"]},"text/vnd.gml":{"source":"iana"},"text/vnd.graphviz":{"source":"iana","extensions":["gv"]},"text/vnd.hans":{"source":"iana"},"text/vnd.hgl":{"source":"iana"},"text/vnd.in3d.3dml":{"source":"iana","extensions":["3dml"]},"text/vnd.in3d.spot":{"source":"iana","extensions":["spot"]},"text/vnd.iptc.newsml":{"source":"iana"},"text/vnd.iptc.nitf":{"source":"iana"},"text/vnd.latex-z":{"source":"iana"},"text/vnd.motorola.reflex":{"source":"iana"},"text/vnd.ms-mediapackage":{"source":"iana"},"text/vnd.net2phone.commcenter.command":{"source":"iana"},"text/vnd.radisys.msml-basic-layout":{"source":"iana"},"text/vnd.senx.warpscript":{"source":"iana"},"text/vnd.si.uricatalogue":{"source":"iana"},"text/vnd.sosi":{"source":"iana"},"text/vnd.sun.j2me.app-descriptor":{"source":"iana","charset":"UTF-8","extensions":["jad"]},"text/vnd.trolltech.linguist":{"source":"iana","charset":"UTF-8"},"text/vnd.wap.si":{"source":"iana"},"text/vnd.wap.sl":{"source":"iana"},"text/vnd.wap.wml":{"source":"iana","extensions":["wml"]},"text/vnd.wap.wmlscript":{"source":"iana","extensions":["wmls"]},"text/vtt":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["vtt"]},"text/x-asm":{"source":"apache","extensions":["s","asm"]},"text/x-c":{"source":"apache","extensions":["c","cc","cxx","cpp","h","hh","dic"]},"text/x-component":{"source":"nginx","extensions":["htc"]},"text/x-fortran":{"source":"apache","extensions":["f","for","f77","f90"]},"text/x-gwt-rpc":{"compressible":true},"text/x-handlebars-template":{"extensions":["hbs"]},"text/x-java-source":{"source":"apache","extensions":["java"]},"text/x-jquery-tmpl":{"compressible":true},"text/x-lua":{"extensions":["lua"]},"text/x-markdown":{"compressible":true,"extensions":["mkd"]},"text/x-nfo":{"source":"apache","extensions":["nfo"]},"text/x-opml":{"source":"apache","extensions":["opml"]},"text/x-org":{"compressible":true,"extensions":["org"]},"text/x-pascal":{"source":"apache","extensions":["p","pas"]},"text/x-processing":{"compressible":true,"extensions":["pde"]},"text/x-sass":{"extensions":["sass"]},"text/x-scss":{"extensions":["scss"]},"text/x-setext":{"source":"apache","extensions":["etx"]},"text/x-sfv":{"source":"apache","extensions":["sfv"]},"text/x-suse-ymp":{"compressible":true,"extensions":["ymp"]},"text/x-uuencode":{"source":"apache","extensions":["uu"]},"text/x-vcalendar":{"source":"apache","extensions":["vcs"]},"text/x-vcard":{"source":"apache","extensions":["vcf"]},"text/xml":{"source":"iana","compressible":true,"extensions":["xml"]},"text/xml-external-parsed-entity":{"source":"iana"},"text/yaml":{"compressible":true,"extensions":["yaml","yml"]},"video/1d-interleaved-parityfec":{"source":"iana"},"video/3gpp":{"source":"iana","extensions":["3gp","3gpp"]},"video/3gpp-tt":{"source":"iana"},"video/3gpp2":{"source":"iana","extensions":["3g2"]},"video/av1":{"source":"iana"},"video/bmpeg":{"source":"iana"},"video/bt656":{"source":"iana"},"video/celb":{"source":"iana"},"video/dv":{"source":"iana"},"video/encaprtp":{"source":"iana"},"video/ffv1":{"source":"iana"},"video/flexfec":{"source":"iana"},"video/h261":{"source":"iana","extensions":["h261"]},"video/h263":{"source":"iana","extensions":["h263"]},"video/h263-1998":{"source":"iana"},"video/h263-2000":{"source":"iana"},"video/h264":{"source":"iana","extensions":["h264"]},"video/h264-rcdo":{"source":"iana"},"video/h264-svc":{"source":"iana"},"video/h265":{"source":"iana"},"video/iso.segment":{"source":"iana","extensions":["m4s"]},"video/jpeg":{"source":"iana","extensions":["jpgv"]},"video/jpeg2000":{"source":"iana"},"video/jpm":{"source":"apache","extensions":["jpm","jpgm"]},"video/jxsv":{"source":"iana"},"video/mj2":{"source":"iana","extensions":["mj2","mjp2"]},"video/mp1s":{"source":"iana"},"video/mp2p":{"source":"iana"},"video/mp2t":{"source":"iana","extensions":["ts"]},"video/mp4":{"source":"iana","compressible":false,"extensions":["mp4","mp4v","mpg4"]},"video/mp4v-es":{"source":"iana"},"video/mpeg":{"source":"iana","compressible":false,"extensions":["mpeg","mpg","mpe","m1v","m2v"]},"video/mpeg4-generic":{"source":"iana"},"video/mpv":{"source":"iana"},"video/nv":{"source":"iana"},"video/ogg":{"source":"iana","compressible":false,"extensions":["ogv"]},"video/parityfec":{"source":"iana"},"video/pointer":{"source":"iana"},"video/quicktime":{"source":"iana","compressible":false,"extensions":["qt","mov"]},"video/raptorfec":{"source":"iana"},"video/raw":{"source":"iana"},"video/rtp-enc-aescm128":{"source":"iana"},"video/rtploopback":{"source":"iana"},"video/rtx":{"source":"iana"},"video/scip":{"source":"iana"},"video/smpte291":{"source":"iana"},"video/smpte292m":{"source":"iana"},"video/ulpfec":{"source":"iana"},"video/vc1":{"source":"iana"},"video/vc2":{"source":"iana"},"video/vnd.cctv":{"source":"iana"},"video/vnd.dece.hd":{"source":"iana","extensions":["uvh","uvvh"]},"video/vnd.dece.mobile":{"source":"iana","extensions":["uvm","uvvm"]},"video/vnd.dece.mp4":{"source":"iana"},"video/vnd.dece.pd":{"source":"iana","extensions":["uvp","uvvp"]},"video/vnd.dece.sd":{"source":"iana","extensions":["uvs","uvvs"]},"video/vnd.dece.video":{"source":"iana","extensions":["uvv","uvvv"]},"video/vnd.directv.mpeg":{"source":"iana"},"video/vnd.directv.mpeg-tts":{"source":"iana"},"video/vnd.dlna.mpeg-tts":{"source":"iana"},"video/vnd.dvb.file":{"source":"iana","extensions":["dvb"]},"video/vnd.fvt":{"source":"iana","extensions":["fvt"]},"video/vnd.hns.video":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.ttsavc":{"source":"iana"},"video/vnd.iptvforum.ttsmpeg2":{"source":"iana"},"video/vnd.motorola.video":{"source":"iana"},"video/vnd.motorola.videop":{"source":"iana"},"video/vnd.mpegurl":{"source":"iana","extensions":["mxu","m4u"]},"video/vnd.ms-playready.media.pyv":{"source":"iana","extensions":["pyv"]},"video/vnd.nokia.interleaved-multimedia":{"source":"iana"},"video/vnd.nokia.mp4vr":{"source":"iana"},"video/vnd.nokia.videovoip":{"source":"iana"},"video/vnd.objectvideo":{"source":"iana"},"video/vnd.radgamettools.bink":{"source":"iana"},"video/vnd.radgamettools.smacker":{"source":"iana"},"video/vnd.sealed.mpeg1":{"source":"iana"},"video/vnd.sealed.mpeg4":{"source":"iana"},"video/vnd.sealed.swf":{"source":"iana"},"video/vnd.sealedmedia.softseal.mov":{"source":"iana"},"video/vnd.uvvu.mp4":{"source":"iana","extensions":["uvu","uvvu"]},"video/vnd.vivo":{"source":"iana","extensions":["viv"]},"video/vnd.youtube.yt":{"source":"iana"},"video/vp8":{"source":"iana"},"video/vp9":{"source":"iana"},"video/webm":{"source":"apache","compressible":false,"extensions":["webm"]},"video/x-f4v":{"source":"apache","extensions":["f4v"]},"video/x-fli":{"source":"apache","extensions":["fli"]},"video/x-flv":{"source":"apache","compressible":false,"extensions":["flv"]},"video/x-m4v":{"source":"apache","extensions":["m4v"]},"video/x-matroska":{"source":"apache","compressible":false,"extensions":["mkv","mk3d","mks"]},"video/x-mng":{"source":"apache","extensions":["mng"]},"video/x-ms-asf":{"source":"apache","extensions":["asf","asx"]},"video/x-ms-vob":{"source":"apache","extensions":["vob"]},"video/x-ms-wm":{"source":"apache","extensions":["wm"]},"video/x-ms-wmv":{"source":"apache","compressible":false,"extensions":["wmv"]},"video/x-ms-wmx":{"source":"apache","extensions":["wmx"]},"video/x-ms-wvx":{"source":"apache","extensions":["wvx"]},"video/x-msvideo":{"source":"apache","extensions":["avi"]},"video/x-sgi-movie":{"source":"apache","extensions":["movie"]},"video/x-smv":{"source":"apache","extensions":["smv"]},"x-conference/x-cooltalk":{"source":"apache","extensions":["ice"]},"x-shader/x-fragment":{"compressible":true},"x-shader/x-vertex":{"compressible":true}}');

/***/ }),

/***/ 2811:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"openai","version":"3.3.0","description":"Node.js library for the OpenAI API","repository":{"type":"git","url":"git@github.com:openai/openai-node.git"},"keywords":["openai","open","ai","gpt-3","gpt3"],"author":"OpenAI","license":"MIT","main":"./dist/index.js","types":"./dist/index.d.ts","scripts":{"build":"tsc --outDir dist/"},"dependencies":{"axios":"^0.26.0","form-data":"^4.0.0"},"devDependencies":{"@types/node":"^12.11.5","typescript":"^3.6.4"}}');

/***/ }),

/***/ 7770:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"aa":{"language":"Afar","location":null,"id":4096,"tag":"aa","version":"Release 10"},"aa-dj":{"language":"Afar","location":"Djibouti","id":4096,"tag":"aa-DJ","version":"Release 10"},"aa-er":{"language":"Afar","location":"Eritrea","id":4096,"tag":"aa-ER","version":"Release 10"},"aa-et":{"language":"Afar","location":"Ethiopia","id":4096,"tag":"aa-ET","version":"Release 10"},"af":{"language":"Afrikaans","location":null,"id":54,"tag":"af","version":"Release 7"},"af-na":{"language":"Afrikaans","location":"Namibia","id":4096,"tag":"af-NA","version":"Release 10"},"af-za":{"language":"Afrikaans","location":"South Africa","id":1078,"tag":"af-ZA","version":"Release B"},"agq":{"language":"Aghem","location":null,"id":4096,"tag":"agq","version":"Release 10"},"agq-cm":{"language":"Aghem","location":"Cameroon","id":4096,"tag":"agq-CM","version":"Release 10"},"ak":{"language":"Akan","location":null,"id":4096,"tag":"ak","version":"Release 10"},"ak-gh":{"language":"Akan","location":"Ghana","id":4096,"tag":"ak-GH","version":"Release 10"},"sq":{"language":"Albanian","location":null,"id":28,"tag":"sq","version":"Release 7"},"sq-al":{"language":"Albanian","location":"Albania","id":1052,"tag":"sq-AL","version":"Release B"},"sq-mk":{"language":"Albanian","location":"North Macedonia","id":4096,"tag":"sq-MK","version":"Release 10"},"gsw":{"language":"Alsatian","location":null,"id":132,"tag":"gsw","version":"Release 7"},"gsw-fr":{"language":"Alsatian","location":"France","id":1156,"tag":"gsw-FR","version":"Release V"},"gsw-li":{"language":"Alsatian","location":"Liechtenstein","id":4096,"tag":"gsw-LI","version":"Release 10"},"gsw-ch":{"language":"Alsatian","location":"Switzerland","id":4096,"tag":"gsw-CH","version":"Release 10"},"am":{"language":"Amharic","location":null,"id":94,"tag":"am","version":"Release 7"},"am-et":{"language":"Amharic","location":"Ethiopia","id":1118,"tag":"am-ET","version":"Release V"},"ar":{"language":"Arabic","location":null,"id":1,"tag":"ar","version":"Release 7"},"ar-dz":{"language":"Arabic","location":"Algeria","id":5121,"tag":"ar-DZ","version":"Release B"},"ar-bh":{"language":"Arabic","location":"Bahrain","id":15361,"tag":"ar-BH","version":"Release B"},"ar-td":{"language":"Arabic","location":"Chad","id":4096,"tag":"ar-TD","version":"Release 10"},"ar-km":{"language":"Arabic","location":"Comoros","id":4096,"tag":"ar-KM","version":"Release 10"},"ar-dj":{"language":"Arabic","location":"Djibouti","id":4096,"tag":"ar-DJ","version":"Release 10"},"ar-eg":{"language":"Arabic","location":"Egypt","id":3073,"tag":"ar-EG","version":"Release B"},"ar-er":{"language":"Arabic","location":"Eritrea","id":4096,"tag":"ar-ER","version":"Release 10"},"ar-iq":{"language":"Arabic","location":"Iraq","id":2049,"tag":"ar-IQ","version":"Release B"},"ar-il":{"language":"Arabic","location":"Israel","id":4096,"tag":"ar-IL","version":"Release 10"},"ar-jo":{"language":"Arabic","location":"Jordan","id":11265,"tag":"ar-JO","version":"Release B"},"ar-kw":{"language":"Arabic","location":"Kuwait","id":13313,"tag":"ar-KW","version":"Release B"},"ar-lb":{"language":"Arabic","location":"Lebanon","id":12289,"tag":"ar-LB","version":"Release B"},"ar-ly":{"language":"Arabic","location":"Libya","id":4097,"tag":"ar-LY","version":"Release B"},"ar-mr":{"language":"Arabic","location":"Mauritania","id":4096,"tag":"ar-MR","version":"Release 10"},"ar-ma":{"language":"Arabic","location":"Morocco","id":6145,"tag":"ar-MA","version":"Release B"},"ar-om":{"language":"Arabic","location":"Oman","id":8193,"tag":"ar-OM","version":"Release B"},"ar-ps":{"language":"Arabic","location":"Palestinian Authority","id":4096,"tag":"ar-PS","version":"Release 10"},"ar-qa":{"language":"Arabic","location":"Qatar","id":16385,"tag":"ar-QA","version":"Release B"},"ar-sa":{"language":"Arabic","location":"Saudi Arabia","id":1025,"tag":"ar-SA","version":"Release B"},"ar-so":{"language":"Arabic","location":"Somalia","id":4096,"tag":"ar-SO","version":"Release 10"},"ar-ss":{"language":"Arabic","location":"South Sudan","id":4096,"tag":"ar-SS","version":"Release 10"},"ar-sd":{"language":"Arabic","location":"Sudan","id":4096,"tag":"ar-SD","version":"Release 10"},"ar-sy":{"language":"Arabic","location":"Syria","id":10241,"tag":"ar-SY","version":"Release B"},"ar-tn":{"language":"Arabic","location":"Tunisia","id":7169,"tag":"ar-TN","version":"Release B"},"ar-ae":{"language":"Arabic","location":"U.A.E.","id":14337,"tag":"ar-AE","version":"Release B"},"ar-001":{"language":"Arabic","location":"World","id":4096,"tag":"ar-001","version":"Release 10"},"ar-ye":{"language":"Arabic","location":"Yemen","id":9217,"tag":"ar-YE","version":"Release B"},"hy":{"language":"Armenian","location":null,"id":43,"tag":"hy","version":"Release 7"},"hy-am":{"language":"Armenian","location":"Armenia","id":1067,"tag":"hy-AM","version":"Release C"},"as":{"language":"Assamese","location":null,"id":77,"tag":"as","version":"Release 7"},"as-in":{"language":"Assamese","location":"India","id":1101,"tag":"as-IN","version":"Release V"},"ast":{"language":"Asturian","location":null,"id":4096,"tag":"ast","version":"Release 10"},"ast-es":{"language":"Asturian","location":"Spain","id":4096,"tag":"ast-ES","version":"Release 10"},"asa":{"language":"Asu","location":null,"id":4096,"tag":"asa","version":"Release 10"},"asa-tz":{"language":"Asu","location":"Tanzania","id":4096,"tag":"asa-TZ","version":"Release 10"},"az-cyrl":{"language":"Azerbaijani (Cyrillic)","location":null,"id":29740,"tag":"az-Cyrl","version":"Windows 7"},"az-cyrl-az":{"language":"Azerbaijani (Cyrillic)","location":"Azerbaijan","id":2092,"tag":"az-Cyrl-AZ","version":"Release C"},"az":{"language":"Azerbaijani (Latin)","location":null,"id":44,"tag":"az","version":"Release 7"},"az-latn":{"language":"Azerbaijani (Latin)","location":null,"id":30764,"tag":"az-Latn","version":"Windows 7"},"az-latn-az":{"language":"Azerbaijani (Latin)","location":"Azerbaijan","id":1068,"tag":"az-Latn-AZ","version":"Release C"},"ksf":{"language":"Bafia","location":null,"id":4096,"tag":"ksf","version":"Release 10"},"ksf-cm":{"language":"Bafia","location":"Cameroon","id":4096,"tag":"ksf-CM","version":"Release 10"},"bm":{"language":"Bamanankan","location":null,"id":4096,"tag":"bm","version":"Release 10"},"bm-latn-ml":{"language":"Bamanankan (Latin)","location":"Mali","id":4096,"tag":"bm-Latn-ML","version":"Release 10"},"bn":{"language":"Bangla","location":null,"id":69,"tag":"bn","version":"Release 7"},"bn-bd":{"language":"Bangla","location":"Bangladesh","id":2117,"tag":"bn-BD","version":"Release V"},"bn-in":{"language":"Bangla","location":"India","id":1093,"tag":"bn-IN","version":"Release E1"},"bas":{"language":"Basaa","location":null,"id":4096,"tag":"bas","version":"Release 10"},"bas-cm":{"language":"Basaa","location":"Cameroon","id":4096,"tag":"bas-CM","version":"Release 10"},"ba":{"language":"Bashkir","location":null,"id":109,"tag":"ba","version":"Release 7"},"ba-ru":{"language":"Bashkir","location":"Russia","id":1133,"tag":"ba-RU","version":"Release V"},"eu":{"language":"Basque","location":null,"id":45,"tag":"eu","version":"Release 7"},"eu-es":{"language":"Basque","location":"Spain","id":1069,"tag":"eu-ES","version":"Release B"},"be":{"language":"Belarusian","location":null,"id":35,"tag":"be","version":"Release 7"},"be-by":{"language":"Belarusian","location":"Belarus","id":1059,"tag":"be-BY","version":"Release B"},"bem":{"language":"Bemba","location":null,"id":4096,"tag":"bem","version":"Release 10"},"bem-zm":{"language":"Bemba","location":"Zambia","id":4096,"tag":"bem-ZM","version":"Release 10"},"bez":{"language":"Bena","location":null,"id":4096,"tag":"bez","version":"Release 10"},"bez-tz":{"language":"Bena","location":"Tanzania","id":4096,"tag":"bez-TZ","version":"Release 10"},"byn":{"language":"Blin","location":null,"id":4096,"tag":"byn","version":"Release 10"},"byn-er":{"language":"Blin","location":"Eritrea","id":4096,"tag":"byn-ER","version":"Release 10"},"brx":{"language":"Bodo","location":null,"id":4096,"tag":"brx","version":"Release 10"},"brx-in":{"language":"Bodo","location":"India","id":4096,"tag":"brx-IN","version":"Release 10"},"bs-cyrl":{"language":"Bosnian (Cyrillic)","location":null,"id":25626,"tag":"bs-Cyrl","version":"Windows 7"},"bs-cyrl-ba":{"language":"Bosnian (Cyrillic)","location":"Bosnia and Herzegovina","id":8218,"tag":"bs-Cyrl-BA","version":"Release E1"},"bs-latn":{"language":"Bosnian (Latin)","location":null,"id":26650,"tag":"bs-Latn","version":"Windows 7"},"bs":{"language":"Bosnian (Latin)","location":null,"id":30746,"tag":"bs","version":"Release 7"},"bs-latn-ba":{"language":"Bosnian (Latin)","location":"Bosnia and Herzegovina","id":5146,"tag":"bs-Latn-BA","version":"Release E1"},"br":{"language":"Breton","location":null,"id":126,"tag":"br","version":"Release 7"},"br-fr":{"language":"Breton","location":"France","id":1150,"tag":"br-FR","version":"Release V"},"bg":{"language":"Bulgarian","location":null,"id":2,"tag":"bg","version":"Release 7"},"bg-bg":{"language":"Bulgarian","location":"Bulgaria","id":1026,"tag":"bg-BG","version":"Release B"},"my":{"language":"Burmese","location":null,"id":85,"tag":"my","version":"Release 8.1"},"my-mm":{"language":"Burmese","location":"Myanmar","id":1109,"tag":"my-MM","version":"Release 8.1"},"ca":{"language":"Catalan","location":null,"id":3,"tag":"ca","version":"Release 7"},"ca-ad":{"language":"Catalan","location":"Andorra","id":4096,"tag":"ca-AD","version":"Release 10"},"ca-fr":{"language":"Catalan","location":"France","id":4096,"tag":"ca-FR","version":"Release 10"},"ca-it":{"language":"Catalan","location":"Italy","id":4096,"tag":"ca-IT","version":"Release 10"},"ca-es":{"language":"Catalan","location":"Spain","id":1027,"tag":"ca-ES","version":"Release B"},"ceb":{"language":"Cebuano","location":null,"id":4096,"tag":"ceb","version":"Release 10.5"},"ceb-latn":{"language":"Cebuan (Latin)","location":null,"id":4096,"tag":"ceb-Latn","version":"Release 10.5"},"ceb-latn-ph":{"language":"Cebuan (Latin)","location":"Philippines","id":4096,"tag":"ceb-Latn-PH","version":"Release 10.5"},"tzm-latn-":{"language":"Central Atlas Tamazight (Latin)","location":"Morocco","id":4096,"tag":"tzm-Latn-","version":"Release 10"},"ku":{"language":"Central Kurdish","location":null,"id":146,"tag":"ku","version":"Release 8"},"ku-arab":{"language":"Central Kurdish","location":null,"id":31890,"tag":"ku-Arab","version":"Release 8"},"ku-arab-iq":{"language":"Central Kurdish","location":"Iraq","id":1170,"tag":"ku-Arab-IQ","version":"Release 8"},"ccp":{"language":"Chakma","location":null,"id":4096,"tag":"ccp","version":"Release 10.5"},"ccp-cakm":{"language":"Chakma","location":"Chakma","id":4096,"tag":"ccp-Cakm","version":"Release 10.5"},"ccp-cakm-":{"language":"Chakma","location":"India","id":4096,"tag":"ccp-Cakm-","version":"Release 10.5"},"cd-ru":{"language":"Chechen","location":"Russia","id":4096,"tag":"cd-RU","version":"Release 10.1"},"chr":{"language":"Cherokee","location":null,"id":92,"tag":"chr","version":"Release 8"},"chr-cher":{"language":"Cherokee","location":null,"id":31836,"tag":"chr-Cher","version":"Release 8"},"chr-cher-us":{"language":"Cherokee","location":"United States","id":1116,"tag":"chr-Cher-US","version":"Release 8"},"cgg":{"language":"Chiga","location":null,"id":4096,"tag":"cgg","version":"Release 10"},"cgg-ug":{"language":"Chiga","location":"Uganda","id":4096,"tag":"cgg-UG","version":"Release 10"},"zh-hans":{"language":"Chinese (Simplified)","location":null,"id":4,"tag":"zh-Hans","version":"Release A"},"zh":{"language":"Chinese (Simplified)","location":null,"id":30724,"tag":"zh","version":"Windows 7"},"zh-cn":{"language":"Chinese (Simplified)","location":"People\'s Republic of China","id":2052,"tag":"zh-CN","version":"Release A"},"zh-sg":{"language":"Chinese (Simplified)","location":"Singapore","id":4100,"tag":"zh-SG","version":"Release A"},"zh-hant":{"language":"Chinese (Traditional)","location":null,"id":31748,"tag":"zh-Hant","version":"Release A"},"zh-hk":{"language":"Chinese (Traditional)","location":"Hong Kong S.A.R.","id":3076,"tag":"zh-HK","version":"Release A"},"zh-mo":{"language":"Chinese (Traditional)","location":"Macao S.A.R.","id":5124,"tag":"zh-MO","version":"Release D"},"zh-tw":{"language":"Chinese (Traditional)","location":"Taiwan","id":1028,"tag":"zh-TW","version":"Release A"},"cu-ru":{"language":"Church Slavic","location":"Russia","id":4096,"tag":"cu-RU","version":"Release 10.1"},"swc":{"language":"Congo Swahili","location":null,"id":4096,"tag":"swc","version":"Release 10"},"swc-cd":{"language":"Congo Swahili","location":"Congo DRC","id":4096,"tag":"swc-CD","version":"Release 10"},"kw":{"language":"Cornish","location":null,"id":4096,"tag":"kw","version":"Release 10"},"kw-gb":{"language":"Cornish","location":"United Kingdom","id":4096,"tag":"kw-GB","version":"Release 10"},"co":{"language":"Corsican","location":null,"id":131,"tag":"co","version":"Release 7"},"co-fr":{"language":"Corsican","location":"France","id":1155,"tag":"co-FR","version":"Release V"},"hr":{"language":"Croatian","location":null,"id":26,"tag":"hr","version":"Release 7"},"hr-hr":{"language":"Croatian","location":"Croatia","id":1050,"tag":"hr-HR","version":"Release A"},"hr-ba":{"language":"Croatian (Latin)","location":"Bosnia and Herzegovina","id":4122,"tag":"hr-BA","version":"Release E1"},"cs":{"language":"Czech","location":null,"id":5,"tag":"cs","version":"Release 7"},"cs-cz":{"language":"Czech","location":"Czech Republic","id":1029,"tag":"cs-CZ","version":"Release A"},"da":{"language":"Danish","location":null,"id":6,"tag":"da","version":"Release 7"},"da-dk":{"language":"Danish","location":"Denmark","id":1030,"tag":"da-DK","version":"Release A"},"da-gl":{"language":"Danish","location":"Greenland","id":4096,"tag":"da-GL","version":"Release 10"},"prs":{"language":"Dari","location":null,"id":140,"tag":"prs","version":"Release 7"},"prs-af":{"language":"Dari","location":"Afghanistan","id":1164,"tag":"prs-AF","version":"Release V"},"dv":{"language":"Divehi","location":null,"id":101,"tag":"dv","version":"Release 7"},"dv-mv":{"language":"Divehi","location":"Maldives","id":1125,"tag":"dv-MV","version":"Release D"},"dua":{"language":"Duala","location":null,"id":4096,"tag":"dua","version":"Release 10"},"dua-cm":{"language":"Duala","location":"Cameroon","id":4096,"tag":"dua-CM","version":"Release 10"},"nl":{"language":"Dutch","location":null,"id":19,"tag":"nl","version":"Release 7"},"nl-aw":{"language":"Dutch","location":"Aruba","id":4096,"tag":"nl-AW","version":"Release 10"},"nl-be":{"language":"Dutch","location":"Belgium","id":2067,"tag":"nl-BE","version":"Release A"},"nl-bq":{"language":"Dutch","location":"Bonaire, Sint Eustatius and Saba","id":4096,"tag":"nl-BQ","version":"Release 10"},"nl-cw":{"language":"Dutch","location":"Curaçao","id":4096,"tag":"nl-CW","version":"Release 10"},"nl-nl":{"language":"Dutch","location":"Netherlands","id":1043,"tag":"nl-NL","version":"Release A"},"nl-sx":{"language":"Dutch","location":"Sint Maarten","id":4096,"tag":"nl-SX","version":"Release 10"},"nl-sr":{"language":"Dutch","location":"Suriname","id":4096,"tag":"nl-SR","version":"Release 10"},"dz":{"language":"Dzongkha","location":null,"id":4096,"tag":"dz","version":"Release 10"},"dz-bt":{"language":"Dzongkha","location":"Bhutan","id":3153,"tag":"dz-BT","version":"Release 10"},"ebu":{"language":"Embu","location":null,"id":4096,"tag":"ebu","version":"Release 10"},"ebu-ke":{"language":"Embu","location":"Kenya","id":4096,"tag":"ebu-KE","version":"Release 10"},"en":{"language":"English","location":null,"id":9,"tag":"en","version":"Release 7"},"en-as":{"language":"English","location":"American Samoa","id":4096,"tag":"en-AS","version":"Release 10"},"en-ai":{"language":"English","location":"Anguilla","id":4096,"tag":"en-AI","version":"Release 10"},"en-ag":{"language":"English","location":"Antigua and Barbuda","id":4096,"tag":"en-AG","version":"Release 10"},"en-au":{"language":"English","location":"Australia","id":3081,"tag":"en-AU","version":"Release A"},"en-at":{"language":"English","location":"Austria","id":4096,"tag":"en-AT","version":"Release 10.1"},"en-bs":{"language":"English","location":"Bahamas","id":4096,"tag":"en-BS","version":"Release 10"},"en-bb":{"language":"English","location":"Barbados","id":4096,"tag":"en-BB","version":"Release 10"},"en-be":{"language":"English","location":"Belgium","id":4096,"tag":"en-BE","version":"Release 10"},"en-bz":{"language":"English","location":"Belize","id":10249,"tag":"en-BZ","version":"Release B"},"en-bm":{"language":"English","location":"Bermuda","id":4096,"tag":"en-BM","version":"Release 10"},"en-bw":{"language":"English","location":"Botswana","id":4096,"tag":"en-BW","version":"Release 10"},"en-io":{"language":"English","location":"British Indian Ocean Territory","id":4096,"tag":"en-IO","version":"Release 10"},"en-vg":{"language":"English","location":"British Virgin Islands","id":4096,"tag":"en-VG","version":"Release 10"},"en-bi":{"language":"English","location":"Burundi","id":4096,"tag":"en-BI","version":"Release 10.1"},"en-cm":{"language":"English","location":"Cameroon","id":4096,"tag":"en-CM","version":"Release 10"},"en-ca":{"language":"English","location":"Canada","id":4105,"tag":"en-CA","version":"Release A"},"en-029":{"language":"English","location":"Caribbean","id":9225,"tag":"en-029","version":"Release B"},"en-ky":{"language":"English","location":"Cayman Islands","id":4096,"tag":"en-KY","version":"Release 10"},"en-cx":{"language":"English","location":"Christmas Island","id":4096,"tag":"en-CX","version":"Release 10"},"en-cc":{"language":"English","location":"Cocos [Keeling] Islands","id":4096,"tag":"en-CC","version":"Release 10"},"en-ck":{"language":"English","location":"Cook Islands","id":4096,"tag":"en-CK","version":"Release 10"},"en-cy":{"language":"English","location":"Cyprus","id":4096,"tag":"en-CY","version":"Release 10.1"},"en-dk":{"language":"English","location":"Denmark","id":4096,"tag":"en-DK","version":"Release 10.1"},"en-dm":{"language":"English","location":"Dominica","id":4096,"tag":"en-DM","version":"Release 10"},"en-er":{"language":"English","location":"Eritrea","id":4096,"tag":"en-ER","version":"Release 10"},"en-150":{"language":"English","location":"Europe","id":4096,"tag":"en-150","version":"Release 10"},"en-fk":{"language":"English","location":"Falkland Islands","id":4096,"tag":"en-FK","version":"Release 10"},"en-fi":{"language":"English","location":"Finland","id":4096,"tag":"en-FI","version":"Release 10.1"},"en-fj":{"language":"English","location":"Fiji","id":4096,"tag":"en-FJ","version":"Release 10"},"en-gm":{"language":"English","location":"Gambia","id":4096,"tag":"en-GM","version":"Release 10"},"en-de":{"language":"English","location":"Germany","id":4096,"tag":"en-DE","version":"Release 10.1"},"en-gh":{"language":"English","location":"Ghana","id":4096,"tag":"en-GH","version":"Release 10"},"en-gi":{"language":"English","location":"Gibraltar","id":4096,"tag":"en-GI","version":"Release 10"},"en-gd":{"language":"English","location":"Grenada","id":4096,"tag":"en-GD","version":"Release 10"},"en-gu":{"language":"English","location":"Guam","id":4096,"tag":"en-GU","version":"Release 10"},"en-gg":{"language":"English","location":"Guernsey","id":4096,"tag":"en-GG","version":"Release 10"},"en-gy":{"language":"English","location":"Guyana","id":4096,"tag":"en-GY","version":"Release 10"},"en-hk":{"language":"English","location":"Hong Kong","id":15369,"tag":"en-HK","version":"Release 8.1"},"en-in":{"language":"English","location":"India","id":16393,"tag":"en-IN","version":"Release V"},"en-ie":{"language":"English","location":"Ireland","id":6153,"tag":"en-IE","version":"Release A"},"en-im":{"language":"English","location":"Isle of Man","id":4096,"tag":"en-IM","version":"Release 10"},"en-il":{"language":"English","location":"Israel","id":4096,"tag":"en-IL","version":"Release 10.1"},"en-jm":{"language":"English","location":"Jamaica","id":8201,"tag":"en-JM","version":"Release B"},"en-je":{"language":"English","location":"Jersey","id":4096,"tag":"en-JE","version":"Release 10"},"en-ke":{"language":"English","location":"Kenya","id":4096,"tag":"en-KE","version":"Release 10"},"en-ki":{"language":"English","location":"Kiribati","id":4096,"tag":"en-KI","version":"Release 10"},"en-ls":{"language":"English","location":"Lesotho","id":4096,"tag":"en-LS","version":"Release 10"},"en-lr":{"language":"English","location":"Liberia","id":4096,"tag":"en-LR","version":"Release 10"},"en-mo":{"language":"English","location":"Macao SAR","id":4096,"tag":"en-MO","version":"Release 10"},"en-mg":{"language":"English","location":"Madagascar","id":4096,"tag":"en-MG","version":"Release 10"},"en-mw":{"language":"English","location":"Malawi","id":4096,"tag":"en-MW","version":"Release 10"},"en-my":{"language":"English","location":"Malaysia","id":17417,"tag":"en-MY","version":"Release V"},"en-mt":{"language":"English","location":"Malta","id":4096,"tag":"en-MT","version":"Release 10"},"en-mh":{"language":"English","location":"Marshall Islands","id":4096,"tag":"en-MH","version":"Release 10"},"en-mu":{"language":"English","location":"Mauritius","id":4096,"tag":"en-MU","version":"Release 10"},"en-fm":{"language":"English","location":"Micronesia","id":4096,"tag":"en-FM","version":"Release 10"},"en-ms":{"language":"English","location":"Montserrat","id":4096,"tag":"en-MS","version":"Release 10"},"en-na":{"language":"English","location":"Namibia","id":4096,"tag":"en-NA","version":"Release 10"},"en-nr":{"language":"English","location":"Nauru","id":4096,"tag":"en-NR","version":"Release 10"},"en-nl":{"language":"English","location":"Netherlands","id":4096,"tag":"en-NL","version":"Release 10.1"},"en-nz":{"language":"English","location":"New Zealand","id":5129,"tag":"en-NZ","version":"Release A"},"en-ng":{"language":"English","location":"Nigeria","id":4096,"tag":"en-NG","version":"Release 10"},"en-nu":{"language":"English","location":"Niue","id":4096,"tag":"en-NU","version":"Release 10"},"en-nf":{"language":"English","location":"Norfolk Island","id":4096,"tag":"en-NF","version":"Release 10"},"en-mp":{"language":"English","location":"Northern Mariana Islands","id":4096,"tag":"en-MP","version":"Release 10"},"en-pk":{"language":"English","location":"Pakistan","id":4096,"tag":"en-PK","version":"Release 10"},"en-pw":{"language":"English","location":"Palau","id":4096,"tag":"en-PW","version":"Release 10"},"en-pg":{"language":"English","location":"Papua New Guinea","id":4096,"tag":"en-PG","version":"Release 10"},"en-pn":{"language":"English","location":"Pitcairn Islands","id":4096,"tag":"en-PN","version":"Release 10"},"en-pr":{"language":"English","location":"Puerto Rico","id":4096,"tag":"en-PR","version":"Release 10"},"en-ph":{"language":"English","location":"Republic of the Philippines","id":13321,"tag":"en-PH","version":"Release C"},"en-rw":{"language":"English","location":"Rwanda","id":4096,"tag":"en-RW","version":"Release 10"},"en-kn":{"language":"English","location":"Saint Kitts and Nevis","id":4096,"tag":"en-KN","version":"Release 10"},"en-lc":{"language":"English","location":"Saint Lucia","id":4096,"tag":"en-LC","version":"Release 10"},"en-vc":{"language":"English","location":"Saint Vincent and the Grenadines","id":4096,"tag":"en-VC","version":"Release 10"},"en-ws":{"language":"English","location":"Samoa","id":4096,"tag":"en-WS","version":"Release 10"},"en-sc":{"language":"English","location":"Seychelles","id":4096,"tag":"en-SC","version":"Release 10"},"en-sl":{"language":"English","location":"Sierra Leone","id":4096,"tag":"en-SL","version":"Release 10"},"en-sg":{"language":"English","location":"Singapore","id":18441,"tag":"en-SG","version":"Release V"},"en-sx":{"language":"English","location":"Sint Maarten","id":4096,"tag":"en-SX","version":"Release 10"},"en-si":{"language":"English","location":"Slovenia","id":4096,"tag":"en-SI","version":"Release 10.1"},"en-sb":{"language":"English","location":"Solomon Islands","id":4096,"tag":"en-SB","version":"Release 10"},"en-za":{"language":"English","location":"South Africa","id":7177,"tag":"en-ZA","version":"Release B"},"en-ss":{"language":"English","location":"South Sudan","id":4096,"tag":"en-SS","version":"Release 10"},"en-sh":{"language":"English","location":"St Helena, Ascension,  Tristan da Cunha","id":4096,"tag":"en-SH","version":"Release 10"},"en-sd":{"language":"English","location":"Sudan","id":4096,"tag":"en-SD","version":"Release 10"},"en-sz":{"language":"English","location":"Swaziland","id":4096,"tag":"en-SZ","version":"Release 10"},"en-se":{"language":"English","location":"Sweden","id":4096,"tag":"en-SE","version":"Release 10.1"},"en-ch":{"language":"English","location":"Switzerland","id":4096,"tag":"en-CH","version":"Release 10.1"},"en-tz":{"language":"English","location":"Tanzania","id":4096,"tag":"en-TZ","version":"Release 10"},"en-tk":{"language":"English","location":"Tokelau","id":4096,"tag":"en-TK","version":"Release 10"},"en-to":{"language":"English","location":"Tonga","id":4096,"tag":"en-TO","version":"Release 10"},"en-tt":{"language":"English","location":"Trinidad and Tobago","id":11273,"tag":"en-TT","version":"Release B"},"en-tc":{"language":"English","location":"Turks and Caicos Islands","id":4096,"tag":"en-TC","version":"Release 10"},"en-tv":{"language":"English","location":"Tuvalu","id":4096,"tag":"en-TV","version":"Release 10"},"en-ug":{"language":"English","location":"Uganda","id":4096,"tag":"en-UG","version":"Release 10"},"en-ae":{"language":"English","location":"United Arab Emirates","id":19465,"tag":"en-AE","version":"Release 10.5"},"en-gb":{"language":"English","location":"United Kingdom","id":2057,"tag":"en-GB","version":"Release A"},"en-us":{"language":"English","location":"United States","id":1033,"tag":"en-US","version":"Release A"},"en-um":{"language":"English","location":"US Minor Outlying Islands","id":4096,"tag":"en-UM","version":"Release 10"},"en-vi":{"language":"English","location":"US Virgin Islands","id":4096,"tag":"en-VI","version":"Release 10"},"en-vu":{"language":"English","location":"Vanuatu","id":4096,"tag":"en-VU","version":"Release 10"},"en-001":{"language":"English","location":"World","id":4096,"tag":"en-001","version":"Release 10"},"en-zm":{"language":"English","location":"Zambia","id":4096,"tag":"en-ZM","version":"Release 10"},"en-zw":{"language":"English","location":"Zimbabwe","id":12297,"tag":"en-ZW","version":"Release C"},"eo":{"language":"Esperanto","location":null,"id":4096,"tag":"eo","version":"Release 10"},"eo-001":{"language":"Esperanto","location":"World","id":4096,"tag":"eo-001","version":"Release 10"},"et":{"language":"Estonian","location":null,"id":37,"tag":"et","version":"Release 7"},"et-ee":{"language":"Estonian","location":"Estonia","id":1061,"tag":"et-EE","version":"Release B"},"ee":{"language":"Ewe","location":null,"id":4096,"tag":"ee","version":"Release 10"},"ee-gh":{"language":"Ewe","location":"Ghana","id":4096,"tag":"ee-GH","version":"Release 10"},"ee-tg":{"language":"Ewe","location":"Togo","id":4096,"tag":"ee-TG","version":"Release 10"},"ewo":{"language":"Ewondo","location":null,"id":4096,"tag":"ewo","version":"Release 10"},"ewo-cm":{"language":"Ewondo","location":"Cameroon","id":4096,"tag":"ewo-CM","version":"Release 10"},"fo":{"language":"Faroese","location":null,"id":56,"tag":"fo","version":"Release 7"},"fo-dk":{"language":"Faroese","location":"Denmark","id":4096,"tag":"fo-DK","version":"Release 10.1"},"fo-fo":{"language":"Faroese","location":"Faroe Islands","id":1080,"tag":"fo-FO","version":"Release B"},"fil":{"language":"Filipino","location":null,"id":100,"tag":"fil","version":"Release 7"},"fil-ph":{"language":"Filipino","location":"Philippines","id":1124,"tag":"fil-PH","version":"Release E2"},"fi":{"language":"Finnish","location":null,"id":11,"tag":"fi","version":"Release 7"},"fi-fi":{"language":"Finnish","location":"Finland","id":1035,"tag":"fi-FI","version":"Release A"},"fr":{"language":"French","location":null,"id":12,"tag":"fr","version":"Release 7"},"fr-dz":{"language":"French","location":"Algeria","id":4096,"tag":"fr-DZ","version":"Release 10"},"fr-be":{"language":"French","location":"Belgium","id":2060,"tag":"fr-BE","version":"Release A"},"fr-bj":{"language":"French","location":"Benin","id":4096,"tag":"fr-BJ","version":"Release 10"},"fr-bf":{"language":"French","location":"Burkina Faso","id":4096,"tag":"fr-BF","version":"Release 10"},"fr-bi":{"language":"French","location":"Burundi","id":4096,"tag":"fr-BI","version":"Release 10"},"fr-cm":{"language":"French","location":"Cameroon","id":11276,"tag":"fr-CM","version":"Release 8.1"},"fr-ca":{"language":"French","location":"Canada","id":3084,"tag":"fr-CA","version":"Release A"},"fr-cf":{"language":"French","location":"Central African Republic","id":4096,"tag":"fr-CF","version":"Release10"},"fr-td":{"language":"French","location":"Chad","id":4096,"tag":"fr-TD","version":"Release 10"},"fr-km":{"language":"French","location":"Comoros","id":4096,"tag":"fr-KM","version":"Release 10"},"fr-cg":{"language":"French","location":"Congo","id":4096,"tag":"fr-CG","version":"Release 10"},"fr-cd":{"language":"French","location":"Congo, DRC","id":9228,"tag":"fr-CD","version":"Release 8.1"},"fr-ci":{"language":"French","location":"Côte d\'Ivoire","id":12300,"tag":"fr-CI","version":"Release 8.1"},"fr-dj":{"language":"French","location":"Djibouti","id":4096,"tag":"fr-DJ","version":"Release 10"},"fr-gq":{"language":"French","location":"Equatorial Guinea","id":4096,"tag":"fr-GQ","version":"Release 10"},"fr-fr":{"language":"French","location":"France","id":1036,"tag":"fr-FR","version":"Release A"},"fr-gf":{"language":"French","location":"French Guiana","id":4096,"tag":"fr-GF","version":"Release 10"},"fr-pf":{"language":"French","location":"French Polynesia","id":4096,"tag":"fr-PF","version":"Release 10"},"fr-ga":{"language":"French","location":"Gabon","id":4096,"tag":"fr-GA","version":"Release 10"},"fr-gp":{"language":"French","location":"Guadeloupe","id":4096,"tag":"fr-GP","version":"Release 10"},"fr-gn":{"language":"French","location":"Guinea","id":4096,"tag":"fr-GN","version":"Release 10"},"fr-ht":{"language":"French","location":"Haiti","id":15372,"tag":"fr-HT","version":"Release 8.1"},"fr-lu":{"language":"French","location":"Luxembourg","id":5132,"tag":"fr-LU","version":"Release A"},"fr-mg":{"language":"French","location":"Madagascar","id":4096,"tag":"fr-MG","version":"Release 10"},"fr-ml":{"language":"French","location":"Mali","id":13324,"tag":"fr-ML","version":"Release 8.1"},"fr-mq":{"language":"French","location":"Martinique","id":4096,"tag":"fr-MQ","version":"Release 10"},"fr-mr":{"language":"French","location":"Mauritania","id":4096,"tag":"fr-MR","version":"Release 10"},"fr-mu":{"language":"French","location":"Mauritius","id":4096,"tag":"fr-MU","version":"Release 10"},"fr-yt":{"language":"French","location":"Mayotte","id":4096,"tag":"fr-YT","version":"Release 10"},"fr-ma":{"language":"French","location":"Morocco","id":14348,"tag":"fr-MA","version":"Release 8.1"},"fr-nc":{"language":"French","location":"New Caledonia","id":4096,"tag":"fr-NC","version":"Release 10"},"fr-ne":{"language":"French","location":"Niger","id":4096,"tag":"fr-NE","version":"Release 10"},"fr-mc":{"language":"French","location":"Principality of Monaco","id":6156,"tag":"fr-MC","version":"Release A"},"fr-re":{"language":"French","location":"Reunion","id":8204,"tag":"fr-RE","version":"Release 8.1"},"fr-rw":{"language":"French","location":"Rwanda","id":4096,"tag":"fr-RW","version":"Release 10"},"fr-bl":{"language":"French","location":"Saint Barthélemy","id":4096,"tag":"fr-BL","version":"Release 10"},"fr-mf":{"language":"French","location":"Saint Martin","id":4096,"tag":"fr-MF","version":"Release 10"},"fr-pm":{"language":"French","location":"Saint Pierre and Miquelon","id":4096,"tag":"fr-PM","version":"Release 10"},"fr-sn":{"language":"French","location":"Senegal","id":10252,"tag":"fr-SN","version":"Release 8.1"},"fr-sc":{"language":"French","location":"Seychelles","id":4096,"tag":"fr-SC","version":"Release 10"},"fr-ch":{"language":"French","location":"Switzerland","id":4108,"tag":"fr-CH","version":"Release A"},"fr-sy":{"language":"French","location":"Syria","id":4096,"tag":"fr-SY","version":"Release 10"},"fr-tg":{"language":"French","location":"Togo","id":4096,"tag":"fr-TG","version":"Release 10"},"fr-tn":{"language":"French","location":"Tunisia","id":4096,"tag":"fr-TN","version":"Release 10"},"fr-vu":{"language":"French","location":"Vanuatu","id":4096,"tag":"fr-VU","version":"Release 10"},"fr-wf":{"language":"French","location":"Wallis and Futuna","id":4096,"tag":"fr-WF","version":"Release 10"},"fy":{"language":"Frisian","location":null,"id":98,"tag":"fy","version":"Release 7"},"fy-nl":{"language":"Frisian","location":"Netherlands","id":1122,"tag":"fy-NL","version":"Release E2"},"fur":{"language":"Friulian","location":null,"id":4096,"tag":"fur","version":"Release 10"},"fur-it":{"language":"Friulian","location":"Italy","id":4096,"tag":"fur-IT","version":"Release 10"},"ff":{"language":"Fulah","location":null,"id":103,"tag":"ff","version":"Release 8"},"ff-latn":{"language":"Fulah (Latin)","location":null,"id":31847,"tag":"ff-Latn","version":"Release 8"},"ff-latn-bf":{"language":"Fulah (Latin)","location":"Burkina Faso","id":4096,"tag":"ff-Latn-BF","version":"Release 10.4"},"ff-cm":{"language":"Fulah","location":"Cameroon","id":4096,"tag":"ff-CM","version":"Release 10"},"ff-latn-cm":{"language":"Fulah (Latin)","location":"Cameroon","id":4096,"tag":"ff-Latn-CM","version":"Release 10.4"},"ff-latn-gm":{"language":"Fulah (Latin)","location":"Gambia","id":4096,"tag":"ff-Latn-GM","version":"Release 10.4"},"ff-latn-gh":{"language":"Fulah (Latin)","location":"Ghana","id":4096,"tag":"ff-Latn-GH","version":"Release 10.4"},"ff-gn":{"language":"Fulah","location":"Guinea","id":4096,"tag":"ff-GN","version":"Release 10"},"ff-latn-gn":{"language":"Fulah (Latin)","location":"Guinea","id":4096,"tag":"ff-Latn-GN","version":"Release 10.4"},"ff-latn-gw":{"language":"Fulah (Latin)","location":"Guinea-Bissau","id":4096,"tag":"ff-Latn-GW","version":"Release 10.4"},"ff-latn-lr":{"language":"Fulah (Latin)","location":"Liberia","id":4096,"tag":"ff-Latn-LR","version":"Release 10.4"},"ff-mr":{"language":"Fulah","location":"Mauritania","id":4096,"tag":"ff-MR","version":"Release 10"},"ff-latn-mr":{"language":"Fulah (Latin)","location":"Mauritania","id":4096,"tag":"ff-Latn-MR","version":"Release 10.4"},"ff-latn-ne":{"language":"Fulah (Latin)","location":"Niger","id":4096,"tag":"ff-Latn-NE","version":"Release 10.4"},"ff-ng":{"language":"Fulah","location":"Nigeria","id":4096,"tag":"ff-NG","version":"Release 10"},"ff-latn-ng":{"language":"Fulah (Latin)","location":"Nigeria","id":4096,"tag":"ff-Latn-NG","version":"Release 10.4"},"ff-latn-sn":{"language":"Fulah","location":"Senegal","id":2151,"tag":"ff-Latn-SN","version":"Release 8"},"ff-latn-sl":{"language":"Fulah (Latin)","location":"Sierra Leone","id":4096,"tag":"ff-Latn-SL","version":"Release 10.4"},"gl":{"language":"Galician","location":null,"id":86,"tag":"gl","version":"Release 7"},"gl-es":{"language":"Galician","location":"Spain","id":1110,"tag":"gl-ES","version":"Release D"},"lg":{"language":"Ganda","location":null,"id":4096,"tag":"lg","version":"Release 10"},"lg-ug":{"language":"Ganda","location":"Uganda","id":4096,"tag":"lg-UG","version":"Release 10"},"ka":{"language":"Georgian","location":null,"id":55,"tag":"ka","version":"Release 7"},"ka-ge":{"language":"Georgian","location":"Georgia","id":1079,"tag":"ka-GE","version":"Release C"},"de":{"language":"German","location":null,"id":7,"tag":"de","version":"Release 7"},"de-at":{"language":"German","location":"Austria","id":3079,"tag":"de-AT","version":"Release A"},"de-be":{"language":"German","location":"Belgium","id":4096,"tag":"de-BE","version":"Release 10"},"de-de":{"language":"German","location":"Germany","id":1031,"tag":"de-DE","version":"Release A"},"de-it":{"language":"German","location":"Italy","id":4096,"tag":"de-IT","version":"Release 10.2"},"de-li":{"language":"German","location":"Liechtenstein","id":5127,"tag":"de-LI","version":"Release B"},"de-lu":{"language":"German","location":"Luxembourg","id":4103,"tag":"de-LU","version":"Release B"},"de-ch":{"language":"German","location":"Switzerland","id":2055,"tag":"de-CH","version":"Release A"},"el":{"language":"Greek","location":null,"id":8,"tag":"el","version":"Release 7"},"el-cy":{"language":"Greek","location":"Cyprus","id":4096,"tag":"el-CY","version":"Release 10"},"el-gr":{"language":"Greek","location":"Greece","id":1032,"tag":"el-GR","version":"Release A"},"kl":{"language":"Greenlandic","location":null,"id":111,"tag":"kl","version":"Release 7"},"kl-gl":{"language":"Greenlandic","location":"Greenland","id":1135,"tag":"kl-GL","version":"Release V"},"gn":{"language":"Guarani","location":null,"id":116,"tag":"gn","version":"Release 8.1"},"gn-py":{"language":"Guarani","location":"Paraguay","id":1140,"tag":"gn-PY","version":"Release 8.1"},"gu":{"language":"Gujarati","location":null,"id":71,"tag":"gu","version":"Release 7"},"gu-in":{"language":"Gujarati","location":"India","id":1095,"tag":"gu-IN","version":"Release D"},"guz":{"language":"Gusii","location":null,"id":4096,"tag":"guz","version":"Release 10"},"guz-ke":{"language":"Gusii","location":"Kenya","id":4096,"tag":"guz-KE","version":"Release 10"},"ha":{"language":"Hausa (Latin)","location":null,"id":104,"tag":"ha","version":"Release 7"},"ha-latn":{"language":"Hausa (Latin)","location":null,"id":31848,"tag":"ha-Latn","version":"Windows 7"},"ha-latn-gh":{"language":"Hausa (Latin)","location":"Ghana","id":4096,"tag":"ha-Latn-GH","version":"Release 10"},"ha-latn-ne":{"language":"Hausa (Latin)","location":"Niger","id":4096,"tag":"ha-Latn-NE","version":"Release 10"},"ha-latn-ng":{"language":"Hausa (Latin)","location":"Nigeria","id":1128,"tag":"ha-Latn-NG","version":"Release V"},"haw":{"language":"Hawaiian","location":null,"id":117,"tag":"haw","version":"Release 8"},"haw-us":{"language":"Hawaiian","location":"United States","id":1141,"tag":"haw-US","version":"Release 8"},"he":{"language":"Hebrew","location":null,"id":13,"tag":"he","version":"Release 7"},"he-il":{"language":"Hebrew","location":"Israel","id":1037,"tag":"he-IL","version":"Release B"},"hi":{"language":"Hindi","location":null,"id":57,"tag":"hi","version":"Release 7"},"hi-in":{"language":"Hindi","location":"India","id":1081,"tag":"hi-IN","version":"Release C"},"hu":{"language":"Hungarian","location":null,"id":14,"tag":"hu","version":"Release 7"},"hu-hu":{"language":"Hungarian","location":"Hungary","id":1038,"tag":"hu-HU","version":"Release A"},"is":{"language":"Icelandic","location":null,"id":15,"tag":"is","version":"Release 7"},"is-is":{"language":"Icelandic","location":"Iceland","id":1039,"tag":"is-IS","version":"Release A"},"ig":{"language":"Igbo","location":null,"id":112,"tag":"ig","version":"Release 7"},"ig-ng":{"language":"Igbo","location":"Nigeria","id":1136,"tag":"ig-NG","version":"Release V"},"id":{"language":"Indonesian","location":null,"id":33,"tag":"id","version":"Release 7"},"id-id":{"language":"Indonesian","location":"Indonesia","id":1057,"tag":"id-ID","version":"Release B"},"ia":{"language":"Interlingua","location":null,"id":4096,"tag":"ia","version":"Release 10"},"ia-fr":{"language":"Interlingua","location":"France","id":4096,"tag":"ia-FR","version":"Release 10"},"ia-001":{"language":"Interlingua","location":"World","id":4096,"tag":"ia-001","version":"Release 10"},"iu":{"language":"Inuktitut (Latin)","location":null,"id":93,"tag":"iu","version":"Release 7"},"iu-latn":{"language":"Inuktitut (Latin)","location":null,"id":31837,"tag":"iu-Latn","version":"Windows 7"},"iu-latn-ca":{"language":"Inuktitut (Latin)","location":"Canada","id":2141,"tag":"iu-Latn-CA","version":"Release E2"},"iu-cans":{"language":"Inuktitut (Syllabics)","location":null,"id":30813,"tag":"iu-Cans","version":"Windows 7"},"iu-cans-ca":{"language":"Inuktitut (Syllabics)","location":"Canada","id":1117,"tag":"iu-Cans-CA","version":"Release V"},"ga":{"language":"Irish","location":null,"id":60,"tag":"ga","version":"Windows 7"},"ga-ie":{"language":"Irish","location":"Ireland","id":2108,"tag":"ga-IE","version":"Release E2"},"it":{"language":"Italian","location":null,"id":16,"tag":"it","version":"Release 7"},"it-it":{"language":"Italian","location":"Italy","id":1040,"tag":"it-IT","version":"Release A"},"it-sm":{"language":"Italian","location":"San Marino","id":4096,"tag":"it-SM","version":"Release 10"},"it-ch":{"language":"Italian","location":"Switzerland","id":2064,"tag":"it-CH","version":"Release A"},"it-va":{"language":"Italian","location":"Vatican City","id":4096,"tag":"it-VA","version":"Release 10.3"},"ja":{"language":"Japanese","location":null,"id":17,"tag":"ja","version":"Release 7"},"ja-jp":{"language":"Japanese","location":"Japan","id":1041,"tag":"ja-JP","version":"Release A"},"jv":{"language":"Javanese","location":null,"id":4096,"tag":"jv","version":"Release 8.1"},"jv-latn":{"language":"Javanese","location":"Latin","id":4096,"tag":"jv-Latn","version":"Release 8.1"},"jv-latn-id":{"language":"Javanese","location":"Latin, Indonesia","id":4096,"tag":"jv-Latn-ID","version":"Release 8.1"},"dyo":{"language":"Jola-Fonyi","location":null,"id":4096,"tag":"dyo","version":"Release 10"},"dyo-sn":{"language":"Jola-Fonyi","location":"Senegal","id":4096,"tag":"dyo-SN","version":"Release 10"},"kea":{"language":"Kabuverdianu","location":null,"id":4096,"tag":"kea","version":"Release 10"},"kea-cv":{"language":"Kabuverdianu","location":"Cabo Verde","id":4096,"tag":"kea-CV","version":"Release 10"},"kab":{"language":"Kabyle","location":null,"id":4096,"tag":"kab","version":"Release 10"},"kab-dz":{"language":"Kabyle","location":"Algeria","id":4096,"tag":"kab-DZ","version":"Release 10"},"kkj":{"language":"Kako","location":null,"id":4096,"tag":"kkj","version":"Release 10"},"kkj-cm":{"language":"Kako","location":"Cameroon","id":4096,"tag":"kkj-CM","version":"Release 10"},"kln":{"language":"Kalenjin","location":null,"id":4096,"tag":"kln","version":"Release 10"},"kln-ke":{"language":"Kalenjin","location":"Kenya","id":4096,"tag":"kln-KE","version":"Release 10"},"kam":{"language":"Kamba","location":null,"id":4096,"tag":"kam","version":"Release 10"},"kam-ke":{"language":"Kamba","location":"Kenya","id":4096,"tag":"kam-KE","version":"Release 10"},"kn":{"language":"Kannada","location":null,"id":75,"tag":"kn","version":"Release 7"},"kn-in":{"language":"Kannada","location":"India","id":1099,"tag":"kn-IN","version":"Release D"},"ks":{"language":"Kashmiri","location":null,"id":96,"tag":"ks","version":"Release 10"},"ks-arab":{"language":"Kashmiri","location":"Perso-Arabic","id":1120,"tag":"ks-Arab","version":"Release 10"},"ks-arab-in":{"language":"Kashmiri","location":"Perso-Arabic","id":4096,"tag":"ks-Arab-IN","version":"Release 10"},"kk":{"language":"Kazakh","location":null,"id":63,"tag":"kk","version":"Release 7"},"kk-kz":{"language":"Kazakh","location":"Kazakhstan","id":1087,"tag":"kk-KZ","version":"Release C"},"km":{"language":"Khmer","location":null,"id":83,"tag":"km","version":"Release 7"},"km-kh":{"language":"Khmer","location":"Cambodia","id":1107,"tag":"km-KH","version":"Release V"},"quc":{"language":"K\'iche","location":null,"id":134,"tag":"quc","version":"Release 10"},"quc-latn-gt":{"language":"K\'iche","location":"Guatemala","id":1158,"tag":"quc-Latn-GT","version":"Release 10"},"ki":{"language":"Kikuyu","location":null,"id":4096,"tag":"ki","version":"Release 10"},"ki-ke":{"language":"Kikuyu","location":"Kenya","id":4096,"tag":"ki-KE","version":"Release 10"},"rw":{"language":"Kinyarwanda","location":null,"id":135,"tag":"rw","version":"Release 7"},"rw-rw":{"language":"Kinyarwanda","location":"Rwanda","id":1159,"tag":"rw-RW","version":"Release V"},"sw":{"language":"Kiswahili","location":null,"id":65,"tag":"sw","version":"Release 7"},"sw-ke":{"language":"Kiswahili","location":"Kenya","id":1089,"tag":"sw-KE","version":"Release C"},"sw-tz":{"language":"Kiswahili","location":"Tanzania","id":4096,"tag":"sw-TZ","version":"Release 10"},"sw-ug":{"language":"Kiswahili","location":"Uganda","id":4096,"tag":"sw-UG","version":"Release 10"},"kok":{"language":"Konkani","location":null,"id":87,"tag":"kok","version":"Release 7"},"kok-in":{"language":"Konkani","location":"India","id":1111,"tag":"kok-IN","version":"Release C"},"ko":{"language":"Korean","location":null,"id":18,"tag":"ko","version":"Release 7"},"ko-kr":{"language":"Korean","location":"Korea","id":1042,"tag":"ko-KR","version":"Release A"},"ko-kp":{"language":"Korean","location":"North Korea","id":4096,"tag":"ko-KP","version":"Release 10.1"},"khq":{"language":"Koyra Chiini","location":null,"id":4096,"tag":"khq","version":"Release 10"},"khq-ml":{"language":"Koyra Chiini","location":"Mali","id":4096,"tag":"khq-ML","version":"Release 10"},"ses":{"language":"Koyraboro Senni","location":null,"id":4096,"tag":"ses","version":"Release 10"},"ses-ml":{"language":"Koyraboro Senni","location":"Mali","id":4096,"tag":"ses-ML","version":"Release 10"},"nmg":{"language":"Kwasio","location":null,"id":4096,"tag":"nmg","version":"Release 10"},"nmg-cm":{"language":"Kwasio","location":"Cameroon","id":4096,"tag":"nmg-CM","version":"Release 10"},"ky":{"language":"Kyrgyz","location":null,"id":64,"tag":"ky","version":"Release 7"},"ky-kg":{"language":"Kyrgyz","location":"Kyrgyzstan","id":1088,"tag":"ky-KG","version":"Release D"},"ku-arab-ir":{"language":"Kurdish","location":"Perso-Arabic, Iran","id":4096,"tag":"ku-Arab-IR","version":"Release 10.1"},"lkt":{"language":"Lakota","location":null,"id":4096,"tag":"lkt","version":"Release 10"},"lkt-us":{"language":"Lakota","location":"United States","id":4096,"tag":"lkt-US","version":"Release 10"},"lag":{"language":"Langi","location":null,"id":4096,"tag":"lag","version":"Release 10"},"lag-tz":{"language":"Langi","location":"Tanzania","id":4096,"tag":"lag-TZ","version":"Release 10"},"lo":{"language":"Lao","location":null,"id":84,"tag":"lo","version":"Release 7"},"lo-la":{"language":"Lao","location":"Lao P.D.R.","id":1108,"tag":"lo-LA","version":"Release V"},"lv":{"language":"Latvian","location":null,"id":38,"tag":"lv","version":"Release 7"},"lv-lv":{"language":"Latvian","location":"Latvia","id":1062,"tag":"lv-LV","version":"Release B"},"ln":{"language":"Lingala","location":null,"id":4096,"tag":"ln","version":"Release 10"},"ln-ao":{"language":"Lingala","location":"Angola","id":4096,"tag":"ln-AO","version":"Release 10"},"ln-cf":{"language":"Lingala","location":"Central African Republic","id":4096,"tag":"ln-CF","version":"Release 10"},"ln-cg":{"language":"Lingala","location":"Congo","id":4096,"tag":"ln-CG","version":"Release 10"},"ln-cd":{"language":"Lingala","location":"Congo DRC","id":4096,"tag":"ln-CD","version":"Release 10"},"lt":{"language":"Lithuanian","location":null,"id":39,"tag":"lt","version":"Release 7"},"lt-lt":{"language":"Lithuanian","location":"Lithuania","id":1063,"tag":"lt-LT","version":"Release B"},"nds":{"language":"Low German","location":null,"id":4096,"tag":"nds","version":"Release 10.2"},"nds-de":{"language":"Low German","location":"Germany","id":4096,"tag":"nds-DE","version":"Release 10.2"},"nds-nl":{"language":"Low German","location":"Netherlands","id":4096,"tag":"nds-NL","version":"Release 10.2"},"dsb":{"language":"Lower Sorbian","location":null,"id":31790,"tag":"dsb","version":"Windows 7"},"dsb-de":{"language":"Lower Sorbian","location":"Germany","id":2094,"tag":"dsb-DE","version":"Release V"},"lu":{"language":"Luba-Katanga","location":null,"id":4096,"tag":"lu","version":"Release 10"},"lu-cd":{"language":"Luba-Katanga","location":"Congo DRC","id":4096,"tag":"lu-CD","version":"Release 10"},"luo":{"language":"Luo","location":null,"id":4096,"tag":"luo","version":"Release 10"},"luo-ke":{"language":"Luo","location":"Kenya","id":4096,"tag":"luo-KE","version":"Release 10"},"lb":{"language":"Luxembourgish","location":null,"id":110,"tag":"lb","version":"Release 7"},"lb-lu":{"language":"Luxembourgish","location":"Luxembourg","id":1134,"tag":"lb-LU","version":"Release E2"},"luy":{"language":"Luyia","location":null,"id":4096,"tag":"luy","version":"Release 10"},"luy-ke":{"language":"Luyia","location":"Kenya","id":4096,"tag":"luy-KE","version":"Release 10"},"mk":{"language":"Macedonian","location":null,"id":47,"tag":"mk","version":"Release 7"},"mk-mk":{"language":"Macedonian","location":"North Macedonia","id":1071,"tag":"mk-MK","version":"Release C"},"jmc":{"language":"Machame","location":null,"id":4096,"tag":"jmc","version":"Release 10"},"jmc-tz":{"language":"Machame","location":"Tanzania","id":4096,"tag":"jmc-TZ","version":"Release 10"},"mgh":{"language":"Makhuwa-Meetto","location":null,"id":4096,"tag":"mgh","version":"Release 10"},"mgh-mz":{"language":"Makhuwa-Meetto","location":"Mozambique","id":4096,"tag":"mgh-MZ","version":"Release 10"},"kde":{"language":"Makonde","location":null,"id":4096,"tag":"kde","version":"Release 10"},"kde-tz":{"language":"Makonde","location":"Tanzania","id":4096,"tag":"kde-TZ","version":"Release 10"},"mg":{"language":"Malagasy","location":null,"id":4096,"tag":"mg","version":"Release 8.1"},"mg-mg":{"language":"Malagasy","location":"Madagascar","id":4096,"tag":"mg-MG","version":"Release 8.1"},"ms":{"language":"Malay","location":null,"id":62,"tag":"ms","version":"Release 7"},"ms-bn":{"language":"Malay","location":"Brunei Darussalam","id":2110,"tag":"ms-BN","version":"Release C"},"ms-my":{"language":"Malay","location":"Malaysia","id":1086,"tag":"ms-MY","version":"Release C"},"ml":{"language":"Malayalam","location":null,"id":76,"tag":"ml","version":"Release 7"},"ml-in":{"language":"Malayalam","location":"India","id":1100,"tag":"ml-IN","version":"Release E1"},"mt":{"language":"Maltese","location":null,"id":58,"tag":"mt","version":"Release 7"},"mt-mt":{"language":"Maltese","location":"Malta","id":1082,"tag":"mt-MT","version":"Release E1"},"gv":{"language":"Manx","location":null,"id":4096,"tag":"gv","version":"Release 10"},"gv-im":{"language":"Manx","location":"Isle of Man","id":4096,"tag":"gv-IM","version":"Release 10"},"mi":{"language":"Maori","location":null,"id":129,"tag":"mi","version":"Release 7"},"mi-nz":{"language":"Maori","location":"New Zealand","id":1153,"tag":"mi-NZ","version":"Release E1"},"arn":{"language":"Mapudungun","location":null,"id":122,"tag":"arn","version":"Release 7"},"arn-cl":{"language":"Mapudungun","location":"Chile","id":1146,"tag":"arn-CL","version":"Release E2"},"mr":{"language":"Marathi","location":null,"id":78,"tag":"mr","version":"Release 7"},"mr-in":{"language":"Marathi","location":"India","id":1102,"tag":"mr-IN","version":"Release C"},"mas":{"language":"Masai","location":null,"id":4096,"tag":"mas","version":"Release 10"},"mas-ke":{"language":"Masai","location":"Kenya","id":4096,"tag":"mas-KE","version":"Release 10"},"mas-tz":{"language":"Masai","location":"Tanzania","id":4096,"tag":"mas-TZ","version":"Release 10"},"mzn-ir":{"language":"Mazanderani","location":"Iran","id":4096,"tag":"mzn-IR","version":"Release 10.1"},"mer":{"language":"Meru","location":null,"id":4096,"tag":"mer","version":"Release 10"},"mer-ke":{"language":"Meru","location":"Kenya","id":4096,"tag":"mer-KE","version":"Release 10"},"mgo":{"language":"Meta\'","location":null,"id":4096,"tag":"mgo","version":"Release 10"},"mgo-cm":{"language":"Meta\'","location":"Cameroon","id":4096,"tag":"mgo-CM","version":"Release 10"},"moh":{"language":"Mohawk","location":null,"id":124,"tag":"moh","version":"Release 7"},"moh-ca":{"language":"Mohawk","location":"Canada","id":1148,"tag":"moh-CA","version":"Release E2"},"mn":{"language":"Mongolian (Cyrillic)","location":null,"id":80,"tag":"mn","version":"Release 7"},"mn-cyrl":{"language":"Mongolian (Cyrillic)","location":null,"id":30800,"tag":"mn-Cyrl","version":"Windows 7"},"mn-mn":{"language":"Mongolian (Cyrillic)","location":"Mongolia","id":1104,"tag":"mn-MN","version":"Release D"},"mn-mong":{"language":"Mongolian (Traditional Mongolian)","location":null,"id":31824,"tag":"mn-Mong","version":"Windows 7"},"mn-mong-cn":{"language":"Mongolian (Traditional Mongolian)","location":"People\'s Republic of China","id":2128,"tag":"mn-Mong-CN","version":"Windows V"},"mn-mong-mn":{"language":"Mongolian (Traditional Mongolian)","location":"Mongolia","id":3152,"tag":"mn-Mong-MN","version":"Windows 7"},"mfe":{"language":"Morisyen","location":null,"id":4096,"tag":"mfe","version":"Release 10"},"mfe-mu":{"language":"Morisyen","location":"Mauritius","id":4096,"tag":"mfe-MU","version":"Release 10"},"mua":{"language":"Mundang","location":null,"id":4096,"tag":"mua","version":"Release 10"},"mua-cm":{"language":"Mundang","location":"Cameroon","id":4096,"tag":"mua-CM","version":"Release 10"},"nqo":{"language":"N\'ko","location":null,"id":4096,"tag":"nqo","version":"Release 8.1"},"nqo-gn":{"language":"N\'ko","location":"Guinea","id":4096,"tag":"nqo-GN","version":"Release 8.1"},"naq":{"language":"Nama","location":null,"id":4096,"tag":"naq","version":"Release 10"},"naq-na":{"language":"Nama","location":"Namibia","id":4096,"tag":"naq-NA","version":"Release 10"},"ne":{"language":"Nepali","location":null,"id":97,"tag":"ne","version":"Release 7"},"ne-in":{"language":"Nepali","location":"India","id":2145,"tag":"ne-IN","version":"Release 8.1"},"ne-np":{"language":"Nepali","location":"Nepal","id":1121,"tag":"ne-NP","version":"Release E2"},"nnh":{"language":"Ngiemboon","location":null,"id":4096,"tag":"nnh","version":"Release 10"},"nnh-cm":{"language":"Ngiemboon","location":"Cameroon","id":4096,"tag":"nnh-CM","version":"Release 10"},"jgo":{"language":"Ngomba","location":null,"id":4096,"tag":"jgo","version":"Release 10"},"jgo-cm":{"language":"Ngomba","location":"Cameroon","id":4096,"tag":"jgo-CM","version":"Release 10"},"lrc-iq":{"language":"Northern Luri","location":"Iraq","id":4096,"tag":"lrc-IQ","version":"Release 10.1"},"lrc-ir":{"language":"Northern Luri","location":"Iran","id":4096,"tag":"lrc-IR","version":"Release 10.1"},"nd":{"language":"North Ndebele","location":null,"id":4096,"tag":"nd","version":"Release 10"},"nd-zw":{"language":"North Ndebele","location":"Zimbabwe","id":4096,"tag":"nd-ZW","version":"Release 10"},"no":{"language":"Norwegian (Bokmal)","location":null,"id":20,"tag":"no","version":"Release 7"},"nb":{"language":"Norwegian (Bokmal)","location":null,"id":31764,"tag":"nb","version":"Release 7"},"nb-no":{"language":"Norwegian (Bokmal)","location":"Norway","id":1044,"tag":"nb-NO","version":"Release A"},"nn":{"language":"Norwegian (Nynorsk)","location":null,"id":30740,"tag":"nn","version":"Release 7"},"nn-no":{"language":"Norwegian (Nynorsk)","location":"Norway","id":2068,"tag":"nn-NO","version":"Release A"},"nb-sj":{"language":"Norwegian Bokmål","location":"Svalbard and Jan Mayen","id":4096,"tag":"nb-SJ","version":"Release 10"},"nus":{"language":"Nuer","location":null,"id":4096,"tag":"nus","version":"Release 10"},"nus-sd":{"language":"Nuer","location":"Sudan","id":4096,"tag":"nus-SD","version":"Release 10"},"nus-ss":{"language":"Nuer","location":"South Sudan","id":4096,"tag":"nus-SS","version":"Release 10.1"},"nyn":{"language":"Nyankole","location":null,"id":4096,"tag":"nyn","version":"Release 10"},"nyn-ug":{"language":"Nyankole","location":"Uganda","id":4096,"tag":"nyn-UG","version":"Release 10"},"oc":{"language":"Occitan","location":null,"id":130,"tag":"oc","version":"Release 7"},"oc-fr":{"language":"Occitan","location":"France","id":1154,"tag":"oc-FR","version":"Release V"},"or":{"language":"Odia","location":null,"id":72,"tag":"or","version":"Release 7"},"or-in":{"language":"Odia","location":"India","id":1096,"tag":"or-IN","version":"Release V"},"om":{"language":"Oromo","location":null,"id":114,"tag":"om","version":"Release 8.1"},"om-et":{"language":"Oromo","location":"Ethiopia","id":1138,"tag":"om-ET","version":"Release 8.1"},"om-ke":{"language":"Oromo","location":"Kenya","id":4096,"tag":"om-KE","version":"Release 10"},"os":{"language":"Ossetian","location":null,"id":4096,"tag":"os","version":"Release 10"},"os-ge":{"language":"Ossetian","location":"Cyrillic, Georgia","id":4096,"tag":"os-GE","version":"Release 10"},"os-ru":{"language":"Ossetian","location":"Cyrillic, Russia","id":4096,"tag":"os-RU","version":"Release 10"},"ps":{"language":"Pashto","location":null,"id":99,"tag":"ps","version":"Release 7"},"ps-af":{"language":"Pashto","location":"Afghanistan","id":1123,"tag":"ps-AF","version":"Release E2"},"ps-pk":{"language":"Pashto","location":"Pakistan","id":4096,"tag":"ps-PK","version":"Release 10.5"},"fa":{"language":"Persian","location":null,"id":41,"tag":"fa","version":"Release 7"},"fa-af":{"language":"Persian","location":"Afghanistan","id":4096,"tag":"fa-AF","version":"Release 10"},"fa-ir":{"language":"Persian","location":"Iran","id":1065,"tag":"fa-IR","version":"Release B"},"pl":{"language":"Polish","location":null,"id":21,"tag":"pl","version":"Release 7"},"pl-pl":{"language":"Polish","location":"Poland","id":1045,"tag":"pl-PL","version":"Release A"},"pt":{"language":"Portuguese","location":null,"id":22,"tag":"pt","version":"Release 7"},"pt-ao":{"language":"Portuguese","location":"Angola","id":4096,"tag":"pt-AO","version":"Release 8.1"},"pt-br":{"language":"Portuguese","location":"Brazil","id":1046,"tag":"pt-BR","version":"Release A"},"pt-cv":{"language":"Portuguese","location":"Cabo Verde","id":4096,"tag":"pt-CV","version":"Release 10"},"pt-gq":{"language":"Portuguese","location":"Equatorial Guinea","id":4096,"tag":"pt-GQ","version":"Release 10.2"},"pt-gw":{"language":"Portuguese","location":"Guinea-Bissau","id":4096,"tag":"pt-GW","version":"Release 10"},"pt-lu":{"language":"Portuguese","location":"Luxembourg","id":4096,"tag":"pt-LU","version":"Release 10.2"},"pt-mo":{"language":"Portuguese","location":"Macao SAR","id":4096,"tag":"pt-MO","version":"Release 10"},"pt-mz":{"language":"Portuguese","location":"Mozambique","id":4096,"tag":"pt-MZ","version":"Release 10"},"pt-pt":{"language":"Portuguese","location":"Portugal","id":2070,"tag":"pt-PT","version":"Release A"},"pt-st":{"language":"Portuguese","location":"São Tomé and Príncipe","id":4096,"tag":"pt-ST","version":"Release 10"},"pt-ch":{"language":"Portuguese","location":"Switzerland","id":4096,"tag":"pt-CH","version":"Release 10.2"},"pt-tl":{"language":"Portuguese","location":"Timor-Leste","id":4096,"tag":"pt-TL","version":"Release 10"},"prg-001":{"language":"Prussian","location":null,"id":4096,"tag":"prg-001","version":"Release 10.1"},"qps-ploca":{"language":"Pseudo Language","location":"Pseudo locale for east Asian/complex script localization testing","id":1534,"tag":"qps-ploca","version":"Release 7"},"qps-ploc":{"language":"Pseudo Language","location":"Pseudo locale used for localization testing","id":1281,"tag":"qps-ploc","version":"Release 7"},"qps-plocm":{"language":"Pseudo Language","location":"Pseudo locale used for localization testing of mirrored locales","id":2559,"tag":"qps-plocm","version":"Release 7"},"pa":{"language":"Punjabi","location":null,"id":70,"tag":"pa","version":"Release 7"},"pa-arab":{"language":"Punjabi","location":null,"id":31814,"tag":"pa-Arab","version":"Release 8"},"pa-in":{"language":"Punjabi","location":"India","id":1094,"tag":"pa-IN","version":"Release D"},"pa-arab-pk":{"language":"Punjabi","location":"Islamic Republic of Pakistan","id":2118,"tag":"pa-Arab-PK","version":"Release 8"},"quz":{"language":"Quechua","location":null,"id":107,"tag":"quz","version":"Release 7"},"quz-bo":{"language":"Quechua","location":"Bolivia","id":1131,"tag":"quz-BO","version":"Release E1"},"quz-ec":{"language":"Quechua","location":"Ecuador","id":2155,"tag":"quz-EC","version":"Release E1"},"quz-pe":{"language":"Quechua","location":"Peru","id":3179,"tag":"quz-PE","version":"Release E1"},"ksh":{"language":"Ripuarian","location":null,"id":4096,"tag":"ksh","version":"Release 10"},"ksh-de":{"language":"Ripuarian","location":"Germany","id":4096,"tag":"ksh-DE","version":"Release 10"},"ro":{"language":"Romanian","location":null,"id":24,"tag":"ro","version":"Release 7"},"ro-md":{"language":"Romanian","location":"Moldova","id":2072,"tag":"ro-MD","version":"Release 8.1"},"ro-ro":{"language":"Romanian","location":"Romania","id":1048,"tag":"ro-RO","version":"Release A"},"rm":{"language":"Romansh","location":null,"id":23,"tag":"rm","version":"Release 7"},"rm-ch":{"language":"Romansh","location":"Switzerland","id":1047,"tag":"rm-CH","version":"Release E2"},"rof":{"language":"Rombo","location":null,"id":4096,"tag":"rof","version":"Release 10"},"rof-tz":{"language":"Rombo","location":"Tanzania","id":4096,"tag":"rof-TZ","version":"Release 10"},"rn":{"language":"Rundi","location":null,"id":4096,"tag":"rn","version":"Release 10"},"rn-bi":{"language":"Rundi","location":"Burundi","id":4096,"tag":"rn-BI","version":"Release 10"},"ru":{"language":"Russian","location":null,"id":25,"tag":"ru","version":"Release 7"},"ru-by":{"language":"Russian","location":"Belarus","id":4096,"tag":"ru-BY","version":"Release 10"},"ru-kz":{"language":"Russian","location":"Kazakhstan","id":4096,"tag":"ru-KZ","version":"Release 10"},"ru-kg":{"language":"Russian","location":"Kyrgyzstan","id":4096,"tag":"ru-KG","version":"Release 10"},"ru-md":{"language":"Russian","location":"Moldova","id":2073,"tag":"ru-MD","version":"Release 10"},"ru-ru":{"language":"Russian","location":"Russia","id":1049,"tag":"ru-RU","version":"Release A"},"ru-ua":{"language":"Russian","location":"Ukraine","id":4096,"tag":"ru-UA","version":"Release 10"},"rwk":{"language":"Rwa","location":null,"id":4096,"tag":"rwk","version":"Release 10"},"rwk-tz":{"language":"Rwa","location":"Tanzania","id":4096,"tag":"rwk-TZ","version":"Release 10"},"ssy":{"language":"Saho","location":null,"id":4096,"tag":"ssy","version":"Release 10"},"ssy-er":{"language":"Saho","location":"Eritrea","id":4096,"tag":"ssy-ER","version":"Release 10"},"sah":{"language":"Sakha","location":null,"id":133,"tag":"sah","version":"Release 7"},"sah-ru":{"language":"Sakha","location":"Russia","id":1157,"tag":"sah-RU","version":"Release V"},"saq":{"language":"Samburu","location":null,"id":4096,"tag":"saq","version":"Release 10"},"saq-ke":{"language":"Samburu","location":"Kenya","id":4096,"tag":"saq-KE","version":"Release 10"},"smn":{"language":"Sami (Inari)","location":null,"id":28731,"tag":"smn","version":"Windows 7"},"smn-fi":{"language":"Sami (Inari)","location":"Finland","id":9275,"tag":"smn-FI","version":"Release E1"},"smj":{"language":"Sami (Lule)","location":null,"id":31803,"tag":"smj","version":"Windows 7"},"smj-no":{"language":"Sami (Lule)","location":"Norway","id":4155,"tag":"smj-NO","version":"Release E1"},"smj-se":{"language":"Sami (Lule)","location":"Sweden","id":5179,"tag":"smj-SE","version":"Release E1"},"se":{"language":"Sami (Northern)","location":null,"id":59,"tag":"se","version":"Release 7"},"se-fi":{"language":"Sami (Northern)","location":"Finland","id":3131,"tag":"se-FI","version":"Release E1"},"se-no":{"language":"Sami (Northern)","location":"Norway","id":1083,"tag":"se-NO","version":"Release E1"},"se-se":{"language":"Sami (Northern)","location":"Sweden","id":2107,"tag":"se-SE","version":"Release E1"},"sms":{"language":"Sami (Skolt)","location":null,"id":29755,"tag":"sms","version":"Windows 7"},"sms-fi":{"language":"Sami (Skolt)","location":"Finland","id":8251,"tag":"sms-FI","version":"Release E1"},"sma":{"language":"Sami (Southern)","location":null,"id":30779,"tag":"sma","version":"Windows 7"},"sma-no":{"language":"Sami (Southern)","location":"Norway","id":6203,"tag":"sma-NO","version":"Release E1"},"sma-se":{"language":"Sami (Southern)","location":"Sweden","id":7227,"tag":"sma-SE","version":"Release E1"},"sg":{"language":"Sango","location":null,"id":4096,"tag":"sg","version":"Release 10"},"sg-cf":{"language":"Sango","location":"Central African Republic","id":4096,"tag":"sg-CF","version":"Release 10"},"sbp":{"language":"Sangu","location":null,"id":4096,"tag":"sbp","version":"Release 10"},"sbp-tz":{"language":"Sangu","location":"Tanzania","id":4096,"tag":"sbp-TZ","version":"Release 10"},"sa":{"language":"Sanskrit","location":null,"id":79,"tag":"sa","version":"Release 7"},"sa-in":{"language":"Sanskrit","location":"India","id":1103,"tag":"sa-IN","version":"Release C"},"gd":{"language":"Scottish Gaelic","location":null,"id":145,"tag":"gd","version":"Windows 7"},"gd-gb":{"language":"Scottish Gaelic","location":"United Kingdom","id":1169,"tag":"gd-GB","version":"Release 7"},"seh":{"language":"Sena","location":null,"id":4096,"tag":"seh","version":"Release 10"},"seh-mz":{"language":"Sena","location":"Mozambique","id":4096,"tag":"seh-MZ","version":"Release 10"},"sr-cyrl":{"language":"Serbian (Cyrillic)","location":null,"id":27674,"tag":"sr-Cyrl","version":"Windows 7"},"sr-cyrl-ba":{"language":"Serbian (Cyrillic)","location":"Bosnia and Herzegovina","id":7194,"tag":"sr-Cyrl-BA","version":"Release E1"},"sr-cyrl-me":{"language":"Serbian (Cyrillic)","location":"Montenegro","id":12314,"tag":"sr-Cyrl-ME","version":"Release 7"},"sr-cyrl-rs":{"language":"Serbian (Cyrillic)","location":"Serbia","id":10266,"tag":"sr-Cyrl-RS","version":"Release 7"},"sr-cyrl-cs":{"language":"Serbian (Cyrillic)","location":"Serbia and Montenegro (Former)","id":3098,"tag":"sr-Cyrl-CS","version":"Release B"},"sr-latn":{"language":"Serbian (Latin)","location":null,"id":28698,"tag":"sr-Latn","version":"Windows 7"},"sr":{"language":"Serbian (Latin)","location":null,"id":31770,"tag":"sr","version":"Release 7"},"sr-latn-ba":{"language":"Serbian (Latin)","location":"Bosnia and Herzegovina","id":6170,"tag":"sr-Latn-BA","version":"Release E1"},"sr-latn-me":{"language":"Serbian (Latin)","location":"Montenegro","id":11290,"tag":"sr-Latn-ME","version":"Release 7"},"sr-latn-rs":{"language":"Serbian (Latin)","location":"Serbia","id":9242,"tag":"sr-Latn-RS","version":"Release 7"},"sr-latn-cs":{"language":"Serbian (Latin)","location":"Serbia and Montenegro (Former)","id":2074,"tag":"sr-Latn-CS","version":"Release B"},"nso":{"language":"Sesotho sa Leboa","location":null,"id":108,"tag":"nso","version":"Release 7"},"nso-za":{"language":"Sesotho sa Leboa","location":"South Africa","id":1132,"tag":"nso-ZA","version":"Release E1"},"tn":{"language":"Setswana","location":null,"id":50,"tag":"tn","version":"Release 7"},"tn-bw":{"language":"Setswana","location":"Botswana","id":2098,"tag":"tn-BW","version":"Release 8"},"tn-za":{"language":"Setswana","location":"South Africa","id":1074,"tag":"tn-ZA","version":"Release E1"},"ksb":{"language":"Shambala","location":null,"id":4096,"tag":"ksb","version":"Release 10"},"ksb-tz":{"language":"Shambala","location":"Tanzania","id":4096,"tag":"ksb-TZ","version":"Release 10"},"sn":{"language":"Shona","location":null,"id":4096,"tag":"sn","version":"Release 8.1"},"sn-latn":{"language":"Shona","location":"Latin","id":4096,"tag":"sn-Latn","version":"Release 8.1"},"sn-latn-zw":{"language":"Shona","location":"Zimbabwe","id":4096,"tag":"sn-Latn-ZW","version":"Release 8.1"},"sd":{"language":"Sindhi","location":null,"id":89,"tag":"sd","version":"Release 8"},"sd-arab":{"language":"Sindhi","location":null,"id":31833,"tag":"sd-Arab","version":"Release 8"},"sd-arab-pk":{"language":"Sindhi","location":"Islamic Republic of Pakistan","id":2137,"tag":"sd-Arab-PK","version":"Release 8"},"si":{"language":"Sinhala","location":null,"id":91,"tag":"si","version":"Release 7"},"si-lk":{"language":"Sinhala","location":"Sri Lanka","id":1115,"tag":"si-LK","version":"Release V"},"sk":{"language":"Slovak","location":null,"id":27,"tag":"sk","version":"Release 7"},"sk-sk":{"language":"Slovak","location":"Slovakia","id":1051,"tag":"sk-SK","version":"Release A"},"sl":{"language":"Slovenian","location":null,"id":36,"tag":"sl","version":"Release 7"},"sl-si":{"language":"Slovenian","location":"Slovenia","id":1060,"tag":"sl-SI","version":"Release A"},"xog":{"language":"Soga","location":null,"id":4096,"tag":"xog","version":"Release 10"},"xog-ug":{"language":"Soga","location":"Uganda","id":4096,"tag":"xog-UG","version":"Release 10"},"so":{"language":"Somali","location":null,"id":119,"tag":"so","version":"Release 8.1"},"so-dj":{"language":"Somali","location":"Djibouti","id":4096,"tag":"so-DJ","version":"Release 10"},"so-et":{"language":"Somali","location":"Ethiopia","id":4096,"tag":"so-ET","version":"Release 10"},"so-ke":{"language":"Somali","location":"Kenya","id":4096,"tag":"so-KE","version":"Release 10"},"so-so":{"language":"Somali","location":"Somalia","id":1143,"tag":"so-SO","version":"Release 8.1"},"st":{"language":"Sotho","location":null,"id":48,"tag":"st","version":"Release 8.1"},"st-za":{"language":"Sotho","location":"South Africa","id":1072,"tag":"st-ZA","version":"Release 8.1"},"nr":{"language":"South Ndebele","location":null,"id":4096,"tag":"nr","version":"Release 10"},"nr-za":{"language":"South Ndebele","location":"South Africa","id":4096,"tag":"nr-ZA","version":"Release 10"},"st-ls":{"language":"Southern Sotho","location":"Lesotho","id":4096,"tag":"st-LS","version":"Release 10"},"es":{"language":"Spanish","location":null,"id":10,"tag":"es","version":"Release 7"},"es-ar":{"language":"Spanish","location":"Argentina","id":11274,"tag":"es-AR","version":"Release B"},"es-bz":{"language":"Spanish","location":"Belize","id":4096,"tag":"es-BZ","version":"Release 10.3"},"es-ve":{"language":"Spanish","location":"Bolivarian Republic of Venezuela","id":8202,"tag":"es-VE","version":"Release B"},"es-bo":{"language":"Spanish","location":"Bolivia","id":16394,"tag":"es-BO","version":"Release B"},"es-br":{"language":"Spanish","location":"Brazil","id":4096,"tag":"es-BR","version":"Release 10.2"},"es-cl":{"language":"Spanish","location":"Chile","id":13322,"tag":"es-CL","version":"Release B"},"es-co":{"language":"Spanish","location":"Colombia","id":9226,"tag":"es-CO","version":"Release B"},"es-cr":{"language":"Spanish","location":"Costa Rica","id":5130,"tag":"es-CR","version":"Release B"},"es-cu":{"language":"Spanish","location":"Cuba","id":23562,"tag":"es-CU","version":"Release 10"},"es-do":{"language":"Spanish","location":"Dominican Republic","id":7178,"tag":"es-DO","version":"Release B"},"es-ec":{"language":"Spanish","location":"Ecuador","id":12298,"tag":"es-EC","version":"Release B"},"es-sv":{"language":"Spanish","location":"El Salvador","id":17418,"tag":"es-SV","version":"Release B"},"es-gq":{"language":"Spanish","location":"Equatorial Guinea","id":4096,"tag":"es-GQ","version":"Release 10"},"es-gt":{"language":"Spanish","location":"Guatemala","id":4106,"tag":"es-GT","version":"Release B"},"es-hn":{"language":"Spanish","location":"Honduras","id":18442,"tag":"es-HN","version":"Release B"},"es-419":{"language":"Spanish","location":"Latin America","id":22538,"tag":"es-419","version":"Release 8.1"},"es-mx":{"language":"Spanish","location":"Mexico","id":2058,"tag":"es-MX","version":"Release A"},"es-ni":{"language":"Spanish","location":"Nicaragua","id":19466,"tag":"es-NI","version":"Release B"},"es-pa":{"language":"Spanish","location":"Panama","id":6154,"tag":"es-PA","version":"Release B"},"es-py":{"language":"Spanish","location":"Paraguay","id":15370,"tag":"es-PY","version":"Release B"},"es-pe":{"language":"Spanish","location":"Peru","id":10250,"tag":"es-PE","version":"Release B"},"es-ph":{"language":"Spanish","location":"Philippines","id":4096,"tag":"es-PH","version":"Release 10"},"es-pr":{"language":"Spanish","location":"Puerto Rico","id":20490,"tag":"es-PR","version":"Release B"},"es-es_tradnl":{"language":"Spanish","location":"Spain","id":1034,"tag":"es-ES_tradnl","version":"Release A"},"es-es":{"language":"Spanish","location":"Spain","id":3082,"tag":"es-ES","version":"Release A"},"es-us":{"language":"Spanish","location":"UnitedStates","id":21514,"tag":"es-US","version":"Release V"},"es-uy":{"language":"Spanish","location":"Uruguay","id":14346,"tag":"es-UY","version":"Release B"},"zgh":{"language":"Standard Moroccan Tamazight","location":null,"id":4096,"tag":"zgh","version":"Release 8.1"},"zgh-tfng-ma":{"language":"Standard Moroccan Tamazight","location":"Morocco","id":4096,"tag":"zgh-Tfng-MA","version":"Release 8.1"},"zgh-tfng":{"language":"Standard Moroccan Tamazight","location":"Tifinagh","id":4096,"tag":"zgh-Tfng","version":"Release 8.1"},"ss":{"language":"Swati","location":null,"id":4096,"tag":"ss","version":"Release 10"},"ss-za":{"language":"Swati","location":"South Africa","id":4096,"tag":"ss-ZA","version":"Release 10"},"ss-sz":{"language":"Swati","location":"Swaziland","id":4096,"tag":"ss-SZ","version":"Release 10"},"sv":{"language":"Swedish","location":null,"id":29,"tag":"sv","version":"Release 7"},"sv-ax":{"language":"Swedish","location":"Åland Islands","id":4096,"tag":"sv-AX","version":"Release 10"},"sv-fi":{"language":"Swedish","location":"Finland","id":2077,"tag":"sv-FI","version":"Release B"},"sv-se":{"language":"Swedish","location":"Sweden","id":1053,"tag":"sv-SE","version":"Release A"},"syr":{"language":"Syriac","location":null,"id":90,"tag":"syr","version":"Release 7"},"syr-sy":{"language":"Syriac","location":"Syria","id":1114,"tag":"syr-SY","version":"Release D"},"shi":{"language":"Tachelhit","location":null,"id":4096,"tag":"shi","version":"Release 10"},"shi-tfng":{"language":"Tachelhit","location":"Tifinagh","id":4096,"tag":"shi-Tfng","version":"Release 10"},"shi-tfng-ma":{"language":"Tachelhit","location":"Tifinagh, Morocco","id":4096,"tag":"shi-Tfng-MA","version":"Release 10"},"shi-latn":{"language":"Tachelhit (Latin)","location":null,"id":4096,"tag":"shi-Latn","version":"Release 10"},"shi-latn-ma":{"language":"Tachelhit (Latin)","location":"Morocco","id":4096,"tag":"shi-Latn-MA","version":"Release 10"},"dav":{"language":"Taita","location":null,"id":4096,"tag":"dav","version":"Release 10"},"dav-ke":{"language":"Taita","location":"Kenya","id":4096,"tag":"dav-KE","version":"Release 10"},"tg":{"language":"Tajik (Cyrillic)","location":null,"id":40,"tag":"tg","version":"Release 7"},"tg-cyrl":{"language":"Tajik (Cyrillic)","location":null,"id":31784,"tag":"tg-Cyrl","version":"Windows 7"},"tg-cyrl-tj":{"language":"Tajik (Cyrillic)","location":"Tajikistan","id":1064,"tag":"tg-Cyrl-TJ","version":"Release V"},"tzm":{"language":"Tamazight (Latin)","location":null,"id":95,"tag":"tzm","version":"Release 7"},"tzm-latn":{"language":"Tamazight (Latin)","location":null,"id":31839,"tag":"tzm-Latn","version":"Windows 7"},"tzm-latn-dz":{"language":"Tamazight (Latin)","location":"Algeria","id":2143,"tag":"tzm-Latn-DZ","version":"Release V"},"ta":{"language":"Tamil","location":null,"id":73,"tag":"ta","version":"Release 7"},"ta-in":{"language":"Tamil","location":"India","id":1097,"tag":"ta-IN","version":"Release C"},"ta-my":{"language":"Tamil","location":"Malaysia","id":4096,"tag":"ta-MY","version":"Release 10"},"ta-sg":{"language":"Tamil","location":"Singapore","id":4096,"tag":"ta-SG","version":"Release 10"},"ta-lk":{"language":"Tamil","location":"Sri Lanka","id":2121,"tag":"ta-LK","version":"Release 8"},"twq":{"language":"Tasawaq","location":null,"id":4096,"tag":"twq","version":"Release 10"},"twq-ne":{"language":"Tasawaq","location":"Niger","id":4096,"tag":"twq-NE","version":"Release 10"},"tt":{"language":"Tatar","location":null,"id":68,"tag":"tt","version":"Release 7"},"tt-ru":{"language":"Tatar","location":"Russia","id":1092,"tag":"tt-RU","version":"Release D"},"te":{"language":"Telugu","location":null,"id":74,"tag":"te","version":"Release 7"},"te-in":{"language":"Telugu","location":"India","id":1098,"tag":"te-IN","version":"Release D"},"teo":{"language":"Teso","location":null,"id":4096,"tag":"teo","version":"Release 10"},"teo-ke":{"language":"Teso","location":"Kenya","id":4096,"tag":"teo-KE","version":"Release 10"},"teo-ug":{"language":"Teso","location":"Uganda","id":4096,"tag":"teo-UG","version":"Release 10"},"th":{"language":"Thai","location":null,"id":30,"tag":"th","version":"Release 7"},"th-th":{"language":"Thai","location":"Thailand","id":1054,"tag":"th-TH","version":"Release B"},"bo":{"language":"Tibetan","location":null,"id":81,"tag":"bo","version":"Release 7"},"bo-in":{"language":"Tibetan","location":"India","id":4096,"tag":"bo-IN","version":"Release 10"},"bo-cn":{"language":"Tibetan","location":"People\'s Republic of China","id":1105,"tag":"bo-CN","version":"Release V"},"tig":{"language":"Tigre","location":null,"id":4096,"tag":"tig","version":"Release 10"},"tig-er":{"language":"Tigre","location":"Eritrea","id":4096,"tag":"tig-ER","version":"Release 10"},"ti":{"language":"Tigrinya","location":null,"id":115,"tag":"ti","version":"Release 8"},"ti-er":{"language":"Tigrinya","location":"Eritrea","id":2163,"tag":"ti-ER","version":"Release 8"},"ti-et":{"language":"Tigrinya","location":"Ethiopia","id":1139,"tag":"ti-ET","version":"Release 8"},"to":{"language":"Tongan","location":null,"id":4096,"tag":"to","version":"Release 10"},"to-to":{"language":"Tongan","location":"Tonga","id":4096,"tag":"to-TO","version":"Release 10"},"ts":{"language":"Tsonga","location":null,"id":49,"tag":"ts","version":"Release 8.1"},"ts-za":{"language":"Tsonga","location":"South Africa","id":1073,"tag":"ts-ZA","version":"Release 8.1"},"tr":{"language":"Turkish","location":null,"id":31,"tag":"tr","version":"Release 7"},"tr-cy":{"language":"Turkish","location":"Cyprus","id":4096,"tag":"tr-CY","version":"Release 10"},"tr-tr":{"language":"Turkish","location":"Turkey","id":1055,"tag":"tr-TR","version":"Release A"},"tk":{"language":"Turkmen","location":null,"id":66,"tag":"tk","version":"Release 7"},"tk-tm":{"language":"Turkmen","location":"Turkmenistan","id":1090,"tag":"tk-TM","version":"Release V"},"uk":{"language":"Ukrainian","location":null,"id":34,"tag":"uk","version":"Release 7"},"uk-ua":{"language":"Ukrainian","location":"Ukraine","id":1058,"tag":"uk-UA","version":"Release B"},"hsb":{"language":"Upper Sorbian","location":null,"id":46,"tag":"hsb","version":"Release 7"},"hsb-de":{"language":"Upper Sorbian","location":"Germany","id":1070,"tag":"hsb-DE","version":"Release V"},"ur":{"language":"Urdu","location":null,"id":32,"tag":"ur","version":"Release 7"},"ur-in":{"language":"Urdu","location":"India","id":2080,"tag":"ur-IN","version":"Release 8.1"},"ur-pk":{"language":"Urdu","location":"Islamic Republic of Pakistan","id":1056,"tag":"ur-PK","version":"Release C"},"ug":{"language":"Uyghur","location":null,"id":128,"tag":"ug","version":"Release 7"},"ug-cn":{"language":"Uyghur","location":"People\'s Republic of China","id":1152,"tag":"ug-CN","version":"Release V"},"uz-arab":{"language":"Uzbek","location":"Perso-Arabic","id":4096,"tag":"uz-Arab","version":"Release 10"},"uz-arab-af":{"language":"Uzbek","location":"Perso-Arabic, Afghanistan","id":4096,"tag":"uz-Arab-AF","version":"Release 10"},"uz-cyrl":{"language":"Uzbek (Cyrillic)","location":null,"id":30787,"tag":"uz-Cyrl","version":"Windows 7"},"uz-cyrl-uz":{"language":"Uzbek (Cyrillic)","location":"Uzbekistan","id":2115,"tag":"uz-Cyrl-UZ","version":"Release C"},"uz":{"language":"Uzbek (Latin)","location":null,"id":67,"tag":"uz","version":"Release 7"},"uz-latn":{"language":"Uzbek (Latin)","location":null,"id":31811,"tag":"uz-Latn","version":"Windows7"},"uz-latn-uz":{"language":"Uzbek (Latin)","location":"Uzbekistan","id":1091,"tag":"uz-Latn-UZ","version":"Release C"},"vai":{"language":"Vai","location":null,"id":4096,"tag":"vai","version":"Release 10"},"vai-vaii":{"language":"Vai","location":null,"id":4096,"tag":"vai-Vaii","version":"Release 10"},"vai-vaii-lr":{"language":"Vai","location":"Liberia","id":4096,"tag":"vai-Vaii-LR","version":"Release 10"},"vai-latn-lr":{"language":"Vai (Latin)","location":"Liberia","id":4096,"tag":"vai-Latn-LR","version":"Release 10"},"vai-latn":{"language":"Vai (Latin)","location":null,"id":4096,"tag":"vai-Latn","version":"Release 10"},"ca-es-":{"language":"Valencian","location":"Spain","id":2051,"tag":"ca-ES-","version":"Release 8"},"ve":{"language":"Venda","location":null,"id":51,"tag":"ve","version":"Release 10"},"ve-za":{"language":"Venda","location":"South Africa","id":1075,"tag":"ve-ZA","version":"Release 10"},"vi":{"language":"Vietnamese","location":null,"id":42,"tag":"vi","version":"Release 7"},"vi-vn":{"language":"Vietnamese","location":"Vietnam","id":1066,"tag":"vi-VN","version":"Release B"},"vo":{"language":"Volapük","location":null,"id":4096,"tag":"vo","version":"Release 10"},"vo-001":{"language":"Volapük","location":"World","id":4096,"tag":"vo-001","version":"Release 10"},"vun":{"language":"Vunjo","location":null,"id":4096,"tag":"vun","version":"Release 10"},"vun-tz":{"language":"Vunjo","location":"Tanzania","id":4096,"tag":"vun-TZ","version":"Release 10"},"wae":{"language":"Walser","location":null,"id":4096,"tag":"wae","version":"Release 10"},"wae-ch":{"language":"Walser","location":"Switzerland","id":4096,"tag":"wae-CH","version":"Release 10"},"cy":{"language":"Welsh","location":null,"id":82,"tag":"cy","version":"Release 7"},"cy-gb":{"language":"Welsh","location":"United Kingdom","id":1106,"tag":"cy-GB","version":"ReleaseE1"},"wal":{"language":"Wolaytta","location":null,"id":4096,"tag":"wal","version":"Release 10"},"wal-et":{"language":"Wolaytta","location":"Ethiopia","id":4096,"tag":"wal-ET","version":"Release 10"},"wo":{"language":"Wolof","location":null,"id":136,"tag":"wo","version":"Release 7"},"wo-sn":{"language":"Wolof","location":"Senegal","id":1160,"tag":"wo-SN","version":"Release V"},"xh":{"language":"Xhosa","location":null,"id":52,"tag":"xh","version":"Release 7"},"xh-za":{"language":"Xhosa","location":"South Africa","id":1076,"tag":"xh-ZA","version":"Release E1"},"yav":{"language":"Yangben","location":null,"id":4096,"tag":"yav","version":"Release 10"},"yav-cm":{"language":"Yangben","location":"Cameroon","id":4096,"tag":"yav-CM","version":"Release 10"},"ii":{"language":"Yi","location":null,"id":120,"tag":"ii","version":"Release 7"},"ii-cn":{"language":"Yi","location":"People\'s Republic of China","id":1144,"tag":"ii-CN","version":"Release V"},"yo":{"language":"Yoruba","location":null,"id":106,"tag":"yo","version":"Release 7"},"yo-bj":{"language":"Yoruba","location":"Benin","id":4096,"tag":"yo-BJ","version":"Release 10"},"yo-ng":{"language":"Yoruba","location":"Nigeria","id":1130,"tag":"yo-NG","version":"Release V"},"dje":{"language":"Zarma","location":null,"id":4096,"tag":"dje","version":"Release 10"},"dje-ne":{"language":"Zarma","location":"Niger","id":4096,"tag":"dje-NE","version":"Release 10"},"zu":{"language":"Zulu","location":null,"id":53,"tag":"zu","version":"Release 7"},"zu-za":{"language":"Zulu","location":"South Africa","id":1077,"tag":"zu-ZA","version":"Release E1"}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const fs = __nccwpck_require__(7147);
const path = __nccwpck_require__(1017);
const { Configuration, OpenAIApi } = __nccwpck_require__(9211);
const core = __nccwpck_require__(2186);

const apiKey = core.getInput('openai-token');
const mainLocale =  core.getInput('main-locale');
const model = core.getInput('model');
const dir = core.toPlatformPath(core.getInput('locales-path'));
const localeCodes = __nccwpck_require__(3188);
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

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map