import { z } from "zod";
import type { BuildReportCore } from "./build-report-core";
import type {
  SpecmaticCentralRepoReportSpec,
  SpecmaticCoverageReport,
  SpecmaticStubUsageReport,
} from "./specmatic/types";
import { logErrorStep, readEnvVar } from "./utils";

// This is only partially validating the response, but it's good enough for now
const githubRunResponseParser = z.object({
  id: z.number(),
  name: z.string(),
  head_branch: z.string(),
  path: z.string(),
  event: z.string(), // https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows
  workflow_id: z.number(),
  url: z.string(),
  html_url: z.string(),
  created_at: z.string().pipe(z.coerce.date()),
  updated_at: z.string().pipe(z.coerce.date()),
  repository: z.object({
    id: z.number(),
    name: z.string(),
    full_name: z.string(),
    html_url: z.string(),
    url: z.string(),
  }),
});

const getWorkflowDetails = async () => {
  const url = `https://api.github.com/repos/${readEnvVar(
    "GITHUB_REPOSITORY"
  )}/actions/runs/${readEnvVar("GITHUB_RUN_ID")}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${readEnvVar("GITHUB_TOKEN")}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.log("ERROR", response.status, await response.text());
    return "Failed to fetch workflow details from GitHub API";
  }

  const responseJson = await response.json();

  return githubRunResponseParser.parse(responseJson);
};

export default async ({
  specmaticCentralRepoReport,
  specmaticStubUsage,
  specmaticCoverage,
}: {
  specmaticCentralRepoReport?: SpecmaticCentralRepoReportSpec | undefined;
  specmaticStubUsage?: SpecmaticStubUsageReport | undefined;
  specmaticCoverage?: SpecmaticCoverageReport | undefined;
}): Promise<BuildReportCore> => {
  const workflowDetails = await getWorkflowDetails();

  if (typeof workflowDetails === "string") {
    logErrorStep(workflowDetails);
    throw new Error(workflowDetails);
  }

  return {
    orgId: readEnvVar("GITHUB_ORG_ID"),
    branch: workflowDetails.head_branch,
    branchName: workflowDetails.head_branch,
    buildDefinitionId: workflowDetails.workflow_id.toString(),
    buildId: workflowDetails.id.toString(),
    repo: workflowDetails.repository.name,
    repoId: workflowDetails.repository.id.toString(),
    repoUrl: workflowDetails.repository.html_url,
    createdAt: new Date(workflowDetails.created_at),
    specmaticConfigPath:
      specmaticStubUsage?.specmaticConfigPath ||
      specmaticCoverage?.specmaticConfigPath,
    specmaticCoverage: specmaticCoverage?.apiCoverage.map(
      ({ branch, ...rest }) =>
        branch === null ? { ...rest } : { branch, ...rest }
    ),

    specmaticStubUsage: specmaticStubUsage?.stubUsage,
    specmaticCentralRepoReport: specmaticCentralRepoReport?.specifications,
  };
};
