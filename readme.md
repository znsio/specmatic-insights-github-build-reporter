# Specmatic Insights Github Build Reporter

This package runs as part of your CI pipeline to ship [Specmatic](https://specmatic.io/) reports to [Specmatic Insights](https://insights.specmatic.io/).

Please contact [Specmatic team](https://specmatic.io/contact-us/) for more info.

## Fetching the Workflow Definition ID
```yaml
- name: Get Workflow Definition ID
  id: get_workflow_id
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_ACCESS_TOKEN }}
  run: |
    api_url="https://api.github.com/repos/${{ github.repository }}/actions/workflows"
    workflow_name="${{ github.workflow }}"
    response=$(curl -s -H "Authorization: token $GITHUB_TOKEN" $api_url)
    workflow_id=$(echo "$response" | jq -r --arg workflow_name "$workflow_name" '.workflows[] | select(.name == $workflow_name) | .id')
    echo "Workflow ID: $workflow_id" # Debug print
    echo "workflow_id=$workflow_id" >> "$GITHUB_OUTPUT"
```
Note:
  - The workflow ID is used to send the build report to Specmatic Insights.
  - Please set up `GITHUB_ACCESS_TOKEN` as a fine grained personal access token with `Read access to actions and metadata` for `Repository permissions`. More details [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

## Docker Usage in GitHub Actions
```yaml
- name: Run Specmatic Insights Github Build Reporter
  run: |
    docker run \
      -v ${{ github.workspace }}:/workspace \
      znsio/specmatic-insights-github-build-reporter:latest \
        --specmatic-insights-host https://insights.specmatic.io \
        --specmatic-reports-dir /workspace/build/reports/specmatic \
        --org-id ${{ secrets.SPECMATIC_ORG_ID }} \
        --branch-ref ${{ github.ref }} \
        --branch-name ${{ github.ref_name }} \
        --build-definition-id ${{ steps.get_workflow_id.outputs.workflow_id }} \
        --build-id ${{ github.run_id }} \
        --repo-name ${{ github.event.repository.name }} \
        --repo-id ${{ github.repository_id }} \
        --repo-url ${{ github.event.repository.html_url }}
```

## Direct NPM Usage in GitHub Actions
```yaml
- name: Run Specmatic Insights Github Build Reporter
  run: |
    npx specmatic-insights-github-build-reporter \
      --org-id ${{ secrets.SPECMATIC_ORG_ID }} \
      --branch-ref ${{ github.ref }} \
      --branch-name ${{ github.ref_name }} \
      --build-definition-id ${{ steps.get_workflow_id.outputs.workflow_id }} \
      --build-id ${{ github.run_id }} \
      --repo-name ${{ github.event.repository.name }} \
      --repo-id ${{ github.repository_id }} \
      --repo-url ${{ github.event.repository.html_url }}
```

## Testing locally

Before you're able to test locally, you'll have to link the `specmatic-insights-github-build-reporter` package to your local `npm` registry.

Run the following command in the root directory of the `specmatic-insights-github-build-reporter` package:
```bash
npm link
```

Next, link the `specmatic-insights-github-build-reporter` package to your local `npm` registry in the root directory of your specmatic project, e.g. `specmatic-order-api-java`:
```bash
npm link specmatic-insights-github-build-reporter
```

Now you can run the build reporter locally to send builds to your local insights server using the following command:
```bash
npx specmatic-insights-github-build-reporter \
  --specmatic-insights-host=http://localhost:8080 \
  --org-id <org-id> \
  --branch-ref <branch-ref> \
  --branch-name <branch-name> \
  --build-definition-id <build-definition-id> \
  --build-id <build-id> \
  --repo-name <repo-name> \
  --repo-id <repo-id> \
  --repo-url <repo-url>
```

To revert the changes, run the following commands:
```bash
npm unlink specmatic-insights-github-build-reporter
npm unlink
```
