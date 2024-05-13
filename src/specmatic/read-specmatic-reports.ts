import type { ZodType } from "zod";
import { safelyReadFile } from "../utils";
import {
  specmaticCentralRepoReportValidator,
  specmaticCoverageReportValidator,
  specmaticStubUsageReportValidator,
} from "./types";

const parseFile = <T>(
  name: string,
  path: string | undefined,
  validator: ZodType<T>
) => {
  const json = safelyReadFile(name, path);
  if (!json) return undefined;

  try {
    return validator.parse(JSON.parse(json));
  } catch (e) {
    throw new Error(`Failed to parse ${name} as valid JSON: ${e}`);
  }
};

export const specmaticProperties = ({
  specmaticCoverage,
  specmaticStubUsage,
  specmaticCentralRepoReport,
}: {
  specmaticCoverage?: string;
  specmaticStubUsage?: string;
  specmaticCentralRepoReport?: string;
}) => ({
  specmaticCoverage: parseFile(
    "specmatic coverage report",
    specmaticCoverage,
    specmaticCoverageReportValidator
  ),
  specmaticStubUsage: parseFile(
    "specmatic stub usage report",
    specmaticStubUsage,
    specmaticStubUsageReportValidator
  ),
  specmaticCentralRepoReport: parseFile(
    "specmatic central repository report",
    specmaticCentralRepoReport,
    specmaticCentralRepoReportValidator
  ),
});
