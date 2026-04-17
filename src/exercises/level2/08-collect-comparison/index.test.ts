import { describe, expect, it } from "bun:test";
import { Result } from "@praha/byethrow";
import {
  validateForm as validateFormByethrow,
  validateFormAllErrors as validateFormAllErrorsByethrow,
} from "./byethrow";
import {
  validateForm as validateFormNeverthrow,
  validateFormAllErrors as validateFormAllErrorsNeverthrow,
} from "./neverthrow";

const validInput = { name: "Alice", email: "alice@example.com", age: 30 };
const allInvalidInput = { name: "Al", email: "invalid-email", age: -1 };

describe("neverthrow", () => {
  describe("validateForm (combine - 短絡評価)", () => {
    it("全て有効 → Ok([name, email, age])", () => {
      const result = validateFormNeverthrow(validInput);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual(["Alice", "alice@example.com", 30]);
      }
    });

    it("名前が無効 → Err(最初のエラーのみ)", () => {
      const result = validateFormNeverthrow(allInvalidInput);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.field).toBe("name");
      }
    });

    it("名前は有効、メールが無効 → Err(emailのエラーのみ)", () => {
      const result = validateFormNeverthrow({ name: "Alice", email: "invalid", age: -1 });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.field).toBe("email");
      }
    });
  });

  describe("validateFormAllErrors (combineWithAllErrors - 全エラー収集)", () => {
    it("全て有効 → Ok([name, email, age])", () => {
      const result = validateFormAllErrorsNeverthrow(validInput);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual(["Alice", "alice@example.com", 30]);
      }
    });

    it("全て無効 → Err([3つのエラー])", () => {
      const result = validateFormAllErrorsNeverthrow(allInvalidInput);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toHaveLength(3);
        const fields = result.error.map((e) => e.field);
        expect(fields).toContain("name");
        expect(fields).toContain("email");
        expect(fields).toContain("age");
      }
    });

    it("名前とメールが無効 → Err([2つのエラー])", () => {
      const result = validateFormAllErrorsNeverthrow({ name: "Al", email: "invalid", age: 30 });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toHaveLength(2);
      }
    });
  });
});

describe("byethrow", () => {
  describe("validateForm (sequence - 短絡評価)", () => {
    it("全て有効 → Success([name, email, age])", () => {
      const result = validateFormByethrow(validInput);
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value).toEqual(["Alice", "alice@example.com", 30]);
      }
    });

    it("名前が無効 → Failure(最初のエラーのみ)", () => {
      const result = validateFormByethrow(allInvalidInput);
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error.field).toBe("name");
      }
    });

    it("名前は有効、メールが無効 → Failure(emailのエラーのみ)", () => {
      const result = validateFormByethrow({ name: "Alice", email: "invalid", age: -1 });
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error.field).toBe("email");
      }
    });
  });

  describe("validateFormAllErrors (collect - 全エラー収集)", () => {
    it("全て有効 → Success([name, email, age])", () => {
      const result = validateFormAllErrorsByethrow(validInput);
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value).toEqual(["Alice", "alice@example.com", 30]);
      }
    });

    it("全て無効 → Failure([3つのエラー])", () => {
      const result = validateFormAllErrorsByethrow(allInvalidInput);
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error).toHaveLength(3);
        const fields = result.error.map((e) => e.field);
        expect(fields).toContain("name");
        expect(fields).toContain("email");
        expect(fields).toContain("age");
      }
    });

    it("名前とメールが無効 → Failure([2つのエラー])", () => {
      const result = validateFormAllErrorsByethrow({ name: "Al", email: "invalid", age: 30 });
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error).toHaveLength(2);
      }
    });
  });
});
