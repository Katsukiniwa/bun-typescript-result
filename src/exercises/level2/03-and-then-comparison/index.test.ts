import { describe, expect, it } from "bun:test";
import { Result } from "@praha/byethrow";
import { err, ok } from "neverthrow";
import { parseInt_ as parseIntByethrow, requirePositive as requirePositiveByethrow } from "./byethrow";
import { parseInt_ as parseIntNeverthrow, requirePositive as requirePositiveNeverthrow } from "./neverthrow";

describe("neverthrow", () => {
  describe("parseInt_", () => {
    it("'42' → Ok(42)", () => {
      const result = parseIntNeverthrow("42");
      expect(result.isOk()).toBe(true);
      if (result.isOk()) expect(result.value).toBe(42);
    });

    it("'abc' → Err", () => {
      const result = parseIntNeverthrow("abc");
      expect(result.isErr()).toBe(true);
    });

    it("'-10' → Ok(-10)", () => {
      const result = parseIntNeverthrow("-10");
      expect(result.isOk()).toBe(true);
      if (result.isOk()) expect(result.value).toBe(-10);
    });
  });

  describe("requirePositive", () => {
    it("Ok(5) → Ok(5)", () => {
      const result = requirePositiveNeverthrow(ok(5));
      expect(result.isOk()).toBe(true);
      if (result.isOk()) expect(result.value).toBe(5);
    });

    it("Ok(-3) → Err", () => {
      const result = requirePositiveNeverthrow(ok(-3));
      expect(result.isErr()).toBe(true);
    });

    it("Err はそのまま通過する", () => {
      const result = requirePositiveNeverthrow(err("既存エラー"));
      expect(result.isErr()).toBe(true);
    });
  });
});

describe("byethrow", () => {
  describe("parseInt_", () => {
    it("'42' → Success(42)", () => {
      const result = parseIntByethrow("42");
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) expect(result.value).toBe(42);
    });

    it("'abc' → Failure", () => {
      const result = parseIntByethrow("abc");
      expect(Result.isFailure(result)).toBe(true);
    });

    it("'-10' → Success(-10)", () => {
      const result = parseIntByethrow("-10");
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) expect(result.value).toBe(-10);
    });
  });

  describe("requirePositive", () => {
    it("Success(5) → Success(5)", () => {
      const result = requirePositiveByethrow(Result.succeed(5));
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) expect(result.value).toBe(5);
    });

    it("Success(-3) → Failure", () => {
      const result = requirePositiveByethrow(Result.succeed(-3));
      expect(Result.isFailure(result)).toBe(true);
    });

    it("Failure はそのまま通過する", () => {
      const result = requirePositiveByethrow(Result.fail("既存エラー"));
      expect(Result.isFailure(result)).toBe(true);
    });
  });
});
