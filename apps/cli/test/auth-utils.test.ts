import { Printer, chalk } from "@codemod-com/printer";
import inquirer from "inquirer";
import { describe, expect, it, vi } from "vitest";
import { getUserData } from "#api.js";
import {
  getCurrentUserData,
  getCurrentUserOrLogin,
  getOrgsNames,
  requestGithubPermissions,
} from "../src/auth-utils.js";
import {
  CredentialsStorageType,
  credentialsStorage,
} from "../src/credentials-storage.js";

vi.mock("#credentials-storage.js");
const mockedCredentialStorage = credentialsStorage as jest.Mocked<
  typeof credentialsStorage
>;

vi.mock("#api.js");
const mockedGetUserData = getUserData as jest.MockedFunction<
  typeof getUserData
>;

vi.mock("inquirer");
const mockedInquirer = inquirer as jest.Mocked<typeof inquirer>;

describe("getCurrentUserData", () => {
  it("should return null if token is not available", async () => {
    mockedCredentialStorage.get.mockResolvedValue(null);
    const result = await getCurrentUserData();
    expect(result).toBeNull();
  });

  it("should return null and delete token if user data is null", async () => {
    mockedCredentialStorage.get.mockResolvedValue("token");
    mockedGetUserData.mockResolvedValue(null);
    const result = await getCurrentUserData();
    expect(result).toBeNull();
    expect(mockedCredentialStorage.delete).toHaveBeenCalledWith(
      CredentialsStorageType.ACCOUNT,
    );
  });

  it("should return user data if token and user data are available", async () => {
    const userData = { id: 1, name: "test" } as any;
    mockedCredentialStorage.get.mockResolvedValue("token");
    mockedGetUserData.mockResolvedValue(userData);
    const result = await getCurrentUserData();
    expect(result).toEqual({ ...userData, token: "token" });
  });
});

describe("getCurrentUserOrLogin", () => {
  const printer = new Printer();

  it("should return current user data if available", async () => {
    const userData = { id: 1, name: "test", token: "token" } as any;
    mockedGetUserData.mockResolvedValue(userData);
    const result = await getCurrentUserOrLogin({ message: "message", printer });
    expect(result).toEqual(userData);
  });

  it("should throw an error if login is refused", async () => {
    mockedGetUserData.mockResolvedValue(null);
    mockedInquirer.prompt.mockResolvedValue({ login: false });
    await expect(
      getCurrentUserOrLogin({ message: "message", printer }),
    ).rejects.toThrow(
      "Refused to login for a command that requires authentication. Aborting...",
    );
  });
});

describe("getOrgsNames", () => {
  const userData = {
    organizations: [
      { organization: { slug: "org1", name: "Organization 1" } },
      { organization: { slug: "org2", name: "Organization 2" } },
    ],
  } as any;

  it("should return organization slugs", () => {
    const result = getOrgsNames(userData, "slug");
    expect(result).toEqual(["org1", "org2"]);
  });

  it("should return organization names", () => {
    const result = getOrgsNames(userData, "name");
    expect(result).toEqual(["Organization 1", "Organization 2"]);
  });

  it("should return organization names and slugs", () => {
    const result = getOrgsNames(userData, "slug-and-name");
    expect(result).toEqual(["Organization 1 (org1)", "Organization 2 (org2)"]);
  });
});

describe("requestGithubPermissions", () => {
  const printer = new Printer();

  it("should print a message if user is not logged in", async () => {
    mockedGetUserData.mockResolvedValue(null);
    const printConsoleMessage = vi.spyOn(printer, "printConsoleMessage");
    await requestGithubPermissions({ scopes: ["repo"], printer });
    expect(printConsoleMessage).toHaveBeenCalledWith(
      "info",
      chalk.bold.cyan("You aren't logged in."),
    );
  });
});
