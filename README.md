# localize-ai
Localize your services without pain 🕺 

GPT-4 + OpenAI API under the hood 🤖

[Example repository](https://github.com/voloshinskii/localize-ai-example)

Localize AI is a powerful GitHub Action that automates the localization process of your apps using the state-of-the-art GPT-4 language model. It seamlessly translates your app's content into multiple languages with a simple configuration setup, saving you time and resources.

Main features:

🌍 Multilingual Support: Translate your app's content into various languages to reach a broader user base.
🤖 GPT-4 AI Integration: Leverage OpenAI's powerful GPT-4 language model for accurate and natural translations.
⚡ Real-time Localization: Automatically localize new content as you update your app, ensuring a consistent user experience.
📦 Seamless Integration: Integrate Action Localize AI with your existing CI/CD pipelines and workflows with ease.

### Usage

Create a workflow file in your repository, for example `workflow.yaml`:

```yaml
name: Localize strings
on:
  push:
    paths:
      - locales/**
jobs:
  localize:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Localize strings
        uses: voloshinskii/localize-ai@v1.0.1
        with: 
          model: gpt-4
          openai-token: ${{ secrets.OPENAI_TOKEN }}
          locales-path: ./locales
          main-locale: en

      - name: commit and push all changed files
        env:
          CI_COMMIT_MESSAGE: Localize new strings
          CI_COMMIT_AUTHOR: CI
        run: |
          git config --global user.name "${{ env.CI_COMMIT_AUTHOR }}"
          git config --global user.email "username@users.noreply.github.com"
          git commit -a -m "${{ env.CI_COMMIT_MESSAGE }}"
          git push
```

### Known limitations
    - Only supports .json
    - Pluralization is not supported now
    - Huge changes in the file can lead to 429 error from OpenAI API. GPT-4 has 200 RPM limits right now. I should batch prompts in future.
