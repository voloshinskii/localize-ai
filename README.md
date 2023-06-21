# localize-ai
Localize your services without pain 🕺

### Usage

Create workflow file in your repository, for example `workflow.yaml`:

```yaml
name: Localize strings
on: [push]
jobs:
  localize:
    runs-on: ubuntu-latest
    steps:
      - name: Localize strings
        env:
          OPENAI_TOKEN: ${{ secrets.API_TOKEN }}
          LOCALES_PATH: ../locales
          MODEL: gpt-4
          MAIN_LOCALE: en
        uses: voloshinskii/localize-ai@v1.2.1

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
