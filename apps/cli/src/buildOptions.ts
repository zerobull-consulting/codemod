import {
  DEFAULT_CACHE,
  DEFAULT_DISABLE_PRETTIER,
  DEFAULT_DRY_RUN,
  DEFAULT_EXCLUDE_PATTERNS,
  DEFAULT_INSTALL,
  DEFAULT_THREAD_COUNT,
  DEFAULT_USE_JSON,
} from "@codemod-com/runner";
import type { Argv } from "yargs";

export const buildGlobalOptions = <T>(y: Argv<T>) =>
  y
    .option("telemetryDisable", {
      type: "boolean",
      description: "Disable telemetry",
    })
    .option("clientIdentifier", {
      type: "string",
      description: "Telemetry client ID",
    })
    .option("json", {
      alias: "j",
      type: "boolean",
      description: "Respond with JSON",
      default: DEFAULT_USE_JSON,
    })
    .option("cache", {
      type: "boolean",
      description: "Disable cache for HTTP(S) requests",
      default: DEFAULT_CACHE,
    });

type RunArgvOptions = Awaited<
  ReturnType<ReturnType<typeof buildRunOptions>>["argv"]
>;

export const buildRunOptions = <T>(y: Argv<T>) => {
  return buildGlobalOptions(
    y
      .option("include", {
        alias: "i",
        type: "string",
        array: true,
        description: "Glob pattern(s) for files to include",
      })
      .option("exclude", {
        alias: "e",
        type: "string",
        array: true,
        description: "Glob pattern(s) for files to exclude",
        default: DEFAULT_EXCLUDE_PATTERNS,
      })
      .option("target", {
        alias: "t",
        type: "string",
        description: "Input directory path",
      })
      .option("source", {
        alias: "s",
        type: "string",
        description: "Source path of the local codemod to run",
      })
      .option("engine", {
        type: "string",
        description:
          'The engine to use with the local codemod: "jscodeshift", "ts-morph", "filemod", "ast-grep"',
      })
      .option("raw", {
        alias: "r",
        type: "boolean",
        description: "Disable formatting output with Prettier",
        default: DEFAULT_DISABLE_PRETTIER,
      })
      .option("threads", {
        alias: "n",
        type: "number",
        description: "Number of worker threads",
        default: DEFAULT_THREAD_COUNT,
      })
      .option("dry", {
        alias: "d",
        type: "boolean",
        description: "Perform a dry run",
        default: DEFAULT_DRY_RUN,
      })
      .option("install", {
        type: "boolean",
        description:
          "Disable packages installation for the codemod run if there is `deps` field declared in its configuration.",
        default: DEFAULT_INSTALL,
      }),
  );
};
