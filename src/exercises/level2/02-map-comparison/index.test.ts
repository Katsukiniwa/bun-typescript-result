import { describe, expect, it } from "bun:test";
import { Result } from "@praha/byethrow";
import { err, ok } from "neverthrow";
import { double as doubleByethrow, toUpperCase as upperByethrow } from "./byethrow";
import { double as doubleNeverthrow, toUpperCase as upperNeverthrow } from "./neverthrow";

describe("neverthrow", () => {
  describe("double", () => {
    it("Ok(5) → Ok(10)", () => {
      const result = doubleNeverthrow(ok(5));
      expect(result.isOk()).toBe(true);
      if (result.isOk()) expect(result.value).toBe(10);
    });

    it("Err はそのまま通過する", () => {
      const result = doubleNeverthrow(err("エラー"));
      expect(result.isErr()).toBe(true);
    });
  });

  describe("toUpperCase", () => {
    it("Ok('hello') → Ok('HELLO')", () => {
      const result = upperNeverthrow(ok("hello"));
      expect(result.isOk()).toBe(true);
      if (result.isOk()) expect(result.value).toBe("HELLO");
    });

    it("Err はそのまま通過する", () => {
      const result = upperNeverthrow(err("エラー"));
      expect(result.isErr()).toBe(true);
    });
  });
});

describe("byethrow", () => {
  describe("double", () => {
    it("Success(5) → Success(10)", () => {
      const result = doubleByethrow(Result.succeed(5));
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) expect(result.value).toBe(10);
    });

    it("Failure はそのまま通過する", () => {
      const result = doubleByethrow(Result.fail("エラー"));
      expect(Result.isFailure(result)).toBe(true);
    });
  });

  describe("toUpperCase", () => {
    it("Success('hello') → Success('HELLO')", () => {
      const result = upperByethrow(Result.succeed("hello"));
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) expect(result.value).toBe("HELLO");
    });

    it("Failure はそのまま通過する", () => {
      const result = upperByethrow(Result.fail("エラー"));
      expect(Result.isFailure(result)).toBe(true);
    });
  });
});
