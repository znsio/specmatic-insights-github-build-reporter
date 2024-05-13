# Specmatic Insights Github Build Reporter

This package provides functionality for reporting Specmatic coverage, stub usage, and central repository metrics for Github workflow build and send it to Insights.

## Installation

```bash
npm install specmatic-insights-github-build-reporter
```

## Usage

```bash
specmatic-insights-github-build-reporter --help
```

## Examples

### 1. Report Specmatic coverage to Insights

```bash
  npx specmatic-insights-build-reporter
  --specmatic-insights-host=<SPECMATIC_INSIGHTS_HOST_HTTP_URL>
  --specmatic-coverage=<SPECMATIC_COVERAGE_REPORT_PATH>
```

### 2. Report Specmatic stub usage to Insights

```bash
  npx specmatic-insights-build-reporter
  --specmatic-insights-host=<SPECMATIC_INSIGHTS_HOST_HTTP_URL>
  --specmatic-stub-usage=<SPECMATIC_STUB_USAGE_REPORT_PATH>
```

### 3. Report Specmatic central repository metrics to Insights

```bash
  npx specmatic-insights-build-reporter
  --specmatic-insights-host=<SPECMATIC_INSIGHTS_HOST_HTTP_URL>
  --specmatic-central-repo-report=<SPECMATIC_CENTRAL_REPO_REPORT_PATH>
```

## CI Configuration

### Github Action Environment Variables

1. `GITHUB_RUN_ID` - Github workflow run id
2. `GITHUB_REPOSITORY` - Github repository name
3. `GITHUB_TOKEN` - Fine grained personal access Github token with repo scope. This token also must have read access to the repository where repository metrics are stored. In addition to this, token should also have permission to read actions.
