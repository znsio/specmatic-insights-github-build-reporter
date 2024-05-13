import { z } from "zod";
import {
  coverageValidator,
  specmaticCentralRepoReportSpecForProtocol,
  stubUsageValidator,
} from "./specmatic/types";

export const buildReportCoreValidator = z.object({
  repo: z.string(),
  repoId: z.string(),
  repoUrl: z.string(),
  branch: z.string(),
  branchName: z.string(),
  buildId: z.string(),
  buildDefinitionId: z.string(),
  createdAt: z.date(),
  specmaticConfigPath: z.string().optional(),
  // specmaticCoverage: specmaticCoverageReportValidator.optional(),
  specmaticCoverage: coverageValidator.optional(),
  // specmaticStubUsage: specmaticStubUsageReportValidator.optional(),
  specmaticStubUsage: stubUsageValidator.optional(),
  // specmaticCentralRepoReport: specmaticCentralRepoReportValidator.optional(),
  specmaticCentralRepoReport: z
    .array(
      specmaticCentralRepoReportSpecForProtocol.extend({
        specification: z.string(),
      })
    )
    .optional(),
});

export type BuildReportCore = z.infer<typeof buildReportCoreValidator>;
