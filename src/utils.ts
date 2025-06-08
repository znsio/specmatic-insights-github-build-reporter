import fs from "fs";
import { resolve } from "path/posix";
import { z } from "zod";

export const logInfoStep = (...details: unknown[]) => {
  console.log("\x1b[36m%s\x1b[0m", "  •", ...details);
};

export const logSuccessStep = (...details: unknown[]) => {
  console.log("\x1b[32m%s\x1b[0m", "  ✓", ...details);
};

export const logErrorStep = (...details: unknown[]) => {
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

export const readEnvVar = (name: string) => {
  const value = process.env[name];
  try {
    return z.string().parse(value);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    logErrorStep(`Couldn't read environment variable: ${name}`);
    throw new Error(`Couldn't read environment variable: ${name}`);
  }
};
