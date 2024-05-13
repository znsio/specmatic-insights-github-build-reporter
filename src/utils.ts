import fs from "fs";
import { resolve } from "path/posix";

export const logInfoStep = (...details: unknown[]) => {
  // eslint-disable-next-line no-console
  console.log("\x1b[36m%s\x1b[0m", "  •", ...details);
};

export const logSuccessStep = (...details: unknown[]) => {
  // eslint-disable-next-line no-console
  console.log("\x1b[32m%s\x1b[0m", "  ✓", ...details);
};

export const logErrorStep = (...details: unknown[]) => {
  // eslint-disable-next-line no-console
  console.log("\x1b[31m%s\x1b[0m", "  ×", ...details);
};

const readFile = (path: string) =>
  fs.readFileSync(resolve(process.cwd(), path), "utf-8");

export const safelyReadFile = (description: string, path?: string) => {
  if (!path) return undefined;

  try {
    return readFile(path);
  } catch (e) {
    logErrorStep(`Error reading ${description}: ${path}`, e);
  }
};
