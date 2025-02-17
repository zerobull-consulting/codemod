import { describe, expect, it } from "vitest";
import type { NamedFileCommand } from "#types/commands.js";
import { getDiff } from "../src/dryrun-diff.js";

describe("getDiff", () => {
  it("should return diff for deleteFile command", () => {
    const command: NamedFileCommand = {
      kind: "deleteFile",
      oldPath: "old-file.ts",
      codemodName: "test-codemod",
    };

    const result = getDiff(command);

    expect(result).toEqual({
      filename: "old-file.ts",
      codemodName: "test-codemod",
      diff: "",
    });
  });

  it("should return diff for moveFile command", () => {
    const command: NamedFileCommand = {
      kind: "moveFile",
      oldPath: "old-file.ts",
      newPath: "new-file.ts",
      codemodName: "test-codemod",
    };

    const result = getDiff(command);

    expect(result).toEqual({
      filename: "old-file.ts -> new-file.ts",
      codemodName: "test-codemod",
      diff: "",
    });
  });

  it("should return diff for copyFile command", () => {
    const command: NamedFileCommand = {
      kind: "copyFile",
      oldPath: "old-file.ts",
      newPath: "new-file.ts",
      codemodName: "test-codemod",
    };

    const result = getDiff(command);

    expect(result).toEqual({
      filename: "COPIED: old-file.ts -> new-file.ts",
      codemodName: "test-codemod",
      diff: "",
    });
  });
});
