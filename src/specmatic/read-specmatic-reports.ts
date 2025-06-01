import type { ZodType } from "zod";
import * as yaml from "yaml";
import { safelyReadFile, logInfoStep } from "../utils";
import {
  specmaticCentralRepoReportValidator,
  specmaticCoverageReportValidator,
  specmaticStubUsageReportValidator,
} from "./types";

// Read specmatic config - parses the file based on extension (YAML or JSON)
const readSpecmaticConfig = (configPath?: string): Record<string, any> | undefined => {
  if (!configPath) {
    logInfoStep("No specmatic config path provided");
    return undefined;
  }
  
  // Read the file content
  const content = safelyReadFile("specmatic configuration", configPath);
  if (!content) {
    logInfoStep(`Could not read specmatic config from ${configPath}`);
    return undefined;
  }

  // Parse based on file extension with fallbacks
  try {
    // Prefer YAML parsing for .yaml/.yml files
    if (configPath.endsWith('.yaml') || configPath.endsWith('.yml')) {
      try {
        const parsed = yaml.parse(content);
        logInfoStep(`Parsed YAML config from ${configPath}`);
        return parsed;
      } catch (yamlError) {
        // Fallback to JSON in case it's actually JSON with a YAML extension
        logInfoStep(`Failed to parse as YAML, trying JSON: ${yamlError}`);
        return JSON.parse(content);
      }
    } else {
      // For .json or any other extension, try JSON first
      try {
        const parsed = JSON.parse(content);
        logInfoStep(`Parsed JSON config from ${configPath}`);
        return parsed;
      } catch (jsonError) {
        // Fallback to YAML in case it's actually YAML with a JSON extension
        logInfoStep(`Failed to parse as JSON, trying YAML: ${jsonError}`);
        return yaml.parse(content);
      }
    }
  } catch (e) {
    logInfoStep(`Failed to parse specmatic config from ${configPath} as either JSON or YAML:`, e);
    return undefined;
  }
};

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

// Read and parse JSON file content
const parseJsonFile = (name: string, path: string | undefined) => {
  const content = safelyReadFile(name, path);
  if (!content) return undefined;
  
  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error(`Failed to parse ${name} as valid JSON: ${e}`);
  }
};

export const specmaticProperties = ({
  specmaticCoverage,
  specmaticStubUsage,
  specmaticCentralRepoReport,
  specmaticTestData,
  specmaticConfig,
}: {
  specmaticCoverage?: string;
  specmaticStubUsage?: string;
  specmaticCentralRepoReport?: string;
  specmaticTestData?: string;
  specmaticConfig?: string;
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
  // Parse JSON for test data instead of returning raw string
  specmaticTestData: parseJsonFile(
    "specmatic test data",
    specmaticTestData
  ),
  specmaticConfig: readSpecmaticConfig(specmaticConfig),
});
