import { z } from "zod";

const specmaticSourceGit = z.object({
  type: z.literal("git"),
  repository: z.string().optional(),
  specification: z.string(),
  branch: z.string().nullable().optional(),
});

const specmaticSource = specmaticSourceGit; // Add more here

const specmaticHTTPOperationBase = z.object({
  path: z.string(),
  method: z.string(),
  responseCode: z.number(),
});

const specmaticHTTPOperation = specmaticHTTPOperationBase.extend({
  count: z.number(),
});

const specmaticCoverageReportForHTTP = z.object({
  serviceType: z.literal("HTTP"),
  operations: z.array(
    specmaticHTTPOperation.extend({
      coverageStatus: z.enum(["covered", "missing in spec", "not implemented"]),
    })
  ),
});

const specmaticCoverageForProtocol =
  specmaticCoverageReportForHTTP; /* Add more here */
// .extend({
//   specId: z.string(), // Not coming from the report, we're adding this for easy querying
// });

export const coverageValidator = z.array(
  specmaticSource.merge(specmaticCoverageForProtocol)
);

export const specmaticCoverageReport = z.object({
  specmaticConfigPath: z.string(),
  apiCoverage: coverageValidator,
});

export const specmaticCoverageReportValidator = specmaticCoverageReport;

export type SpecmaticCoverageReport = z.infer<typeof specmaticCoverageReport>;

const specmaticStubUsageForHTTP = z.object({
  serviceType: z.string(),
  operations: z.array(specmaticHTTPOperation),
});

const specmaticStubUsageForProtocol =
  specmaticStubUsageForHTTP; /* Add more here */
// .extend({
//   specId: z.string(), // Not coming from the report, we're adding this for easy querying
// });

export const stubUsageValidator = z.array(
  specmaticSource.merge(specmaticStubUsageForProtocol)
);

export const specmaticStubUsageReport = z.object({
  specmaticConfigPath: z.string(),
  stubUsage: stubUsageValidator,
});

export const specmaticStubUsageReportValidator = specmaticStubUsageReport;

export type SpecmaticStubUsageReport = z.infer<typeof specmaticStubUsageReport>;

const specmaticCentralRepoReportSpecForHTTP = z.object({
  serviceType: z.literal("HTTP"),
  operations: z.array(specmaticHTTPOperationBase),
});

export const specmaticCentralRepoReportSpecForProtocol =
  specmaticCentralRepoReportSpecForHTTP; /* Add more here */
// .extend({
//   specId: z.string(), // Not coming from the report, we're adding this for easy querying
// });

const specmaticCentralRepoReportSpec = z.object({
  specifications: z.array(
    specmaticCentralRepoReportSpecForProtocol.extend({
      specification: z.string(),
    })
  ),
});

export const specmaticCentralRepoReportValidator =
  specmaticCentralRepoReportSpec;

export type SpecmaticCentralRepoReportSpec = z.infer<
  typeof specmaticCentralRepoReportSpec
>;
