import type { BuildReportCore } from "./build-report-core";
import type {
  BuildMetaData,
  SpecmaticCentralRepoReportSpec,
  SpecmaticCoverageReport,
  SpecmaticStubUsageReport,
} from "./specmatic/types";

export default async ({
  specmaticCentralRepoReport,
  specmaticStubUsage,
  specmaticCoverage,
  buildMetaData
}: {
  specmaticCentralRepoReport?: SpecmaticCentralRepoReportSpec | undefined;
  specmaticStubUsage?: SpecmaticStubUsageReport | undefined;
  specmaticCoverage?: SpecmaticCoverageReport | undefined;
  buildMetaData: BuildMetaData;
}): Promise<BuildReportCore> => ({
    orgId: buildMetaData.org_id, 
    branch: buildMetaData.branch_ref,
    branchName: buildMetaData.branch_name,
    buildDefinitionId: buildMetaData.build_definition_id,
    buildId: buildMetaData.build_id,
    repo: buildMetaData.repo_name,
    repoId: buildMetaData.repo_id,
    repoUrl: buildMetaData.repo_url,
    createdAt: new Date(),
    specmaticConfigPath:
      specmaticStubUsage?.specmaticConfigPath ||
      specmaticCoverage?.specmaticConfigPath,
    specmaticCoverage: specmaticCoverage?.apiCoverage,
    specmaticStubUsage: specmaticStubUsage?.stubUsage,
    specmaticCentralRepoReport: specmaticCentralRepoReport?.specifications,
});
