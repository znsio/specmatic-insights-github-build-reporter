import yargs from "yargs/yargs";
// eslint-disable-next-line @typescript-eslint/no-redeclare
import { URL } from "url";

const ensureValidUrl = (url: string, key: string) => {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
  } catch (e) {
    throw new Error(`Invalid URL for "${key}": "${url}"`);
  }
};

const parseCliArgs = (cliArgs: string[]) => {
  const parsed = yargs(cliArgs)
    .option("sih", {
      alias: "specmatic-insights-host",
      type: "string",
      demandOption: true,
      description: "Specmatic Insights host",
      group: "Specmatic Insights",
    })
    .option("sc", {
      alias: "specmatic-coverage",
      type: "string",
      description: "The path to the Specmatic coverage report",
      group: "Specmatic",
    })
    .option("ss", {
      alias: "specmatic-stub-usage",
      type: "string",
      description: "The path to the Specmatic stub usage report",
      group: "Specmatic",
    })
    .option("scr", {
      alias: "specmatic-central-repo-report",
      type: "string",
      description: "The path to the Specmatic central repository report",
      group: "Specmatic",
    })
    .option("dr", {
      alias: "dry-run",
      type: "boolean",
      description: "Do not post to Specmatic Insights",
      group: "Specmatic Insights",
    })
    .option("nv", {
      alias: "no-verify",
      type: "boolean",
      description: "Do not verify the SSL certificate (not-recommended)",
      group: "Specmatic Insights",
    })
    .example([
      [
        "npx specmatic-insights-build-reporter --specmatic-insights-host=<SPECMATIC_INSIGHTS_HOST_HTTP_URL>",
      ],
      [
        "npx specmatic-insights-build-reporter --specmatic-insights-host=<SPECMATIC_INSIGHTS_HOST_HTTP_URL>" +
          " --specmatic-coverage=<SPECMATIC_COVERAGE_REPORT_PATH>",
      ],
      [
        "npx specmatic-insights-build-reporter --specmatic-insights-host=<SPECMATIC_INSIGHTS_HOST_HTTP_URL>" +
          " --specmatic-central-repo-report=<SPECMATIC_CENTRAL_REPO_REPORT_PATH>",
      ],
    ])
    .check((parsedArgs) => {
      ensureValidUrl(parsedArgs.sih, "specmatic-insights-host");
      return true;
    }).argv;

  return {
    specmaticInsightsHost: parsed.sih,
    ...(parsed.sc ? { specmaticCoverage: parsed.sc } : {}),
    ...(parsed.ss ? { specmaticStubUsage: parsed.ss } : {}),
    ...(parsed.scr ? { specmaticCentralRepoReport: parsed.scr } : {}),
    dryRun: parsed.dr,
    noVerify: Boolean(parsed.nv),
  } as const;
};

export default () => parseCliArgs(process.argv);
