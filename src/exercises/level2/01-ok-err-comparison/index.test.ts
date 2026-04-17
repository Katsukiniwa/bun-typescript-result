import { describe, expect, it } from "bun:test";
import { Result } from "@praha/byethrow";
import { wrapError as errorByethrow, wrapValue as wrapByethrow } from "./byethrow";
import { wrapError as errorNeverthrow, wrapValue as wrapNeverthrow } from "./neverthrow";

describe("neverthrow", () => {
  describe("wrapValue", () => {
    it("数値42をOkでラップする", () => {
      const result = wrapNeverthrow(42);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(42);
      }
    });

    it("文字列をOkでラップする", () => {
      const result = wrapNeverthrow("hello");
      expect(result.isOk()).toBe(true);
    });
  });

  describe("wrapError", () => {
    it("エラーをErrでラップする", () => {
      const result = errorNeverthrow("エラーメッセージ");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("エラーメッセージ");
      }
    });
  });
});

describe("byethrow", () => {
  describe("wrapValue", () => {
    it("数値42をSuccessでラップする", () => {
      const result = wrapByethrow(42);
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value).toBe(42);
      }
    });

    it("文字列をSuccessでラップする", () => {
      const result = wrapByethrow("hello");
      expect(Result.isSuccess(result)).toBe(true);
    });
  });

  describe("wrapError", () => {
    it("エラーをFailureでラップする", () => {
      const result = errorByethrow("エラーメッセージ");
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error).toBe("エラーメッセージ");
      }
    });
  });
});
