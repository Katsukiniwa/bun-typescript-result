import { describe, expect, it } from "bun:test";
import { Result } from "@praha/byethrow";
import { createUser as createUserByethrow } from "./byethrow";
import { createUser as createUserNeverthrow } from "./neverthrow";

describe("neverthrow", () => {
  describe("createUser", () => {
    it("全て有効な入力 → Ok(User)", () => {
      const result = createUserNeverthrow({ name: "Alice", email: "alice@example.com", age: 30 });
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual({ name: "Alice", email: "alice@example.com", age: 30 });
      }
    });

    it("名前が短すぎる → Err (field: 'name')", () => {
      const result = createUserNeverthrow({ name: "A", email: "alice@example.com", age: 30 });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) expect(result.error.field).toBe("name");
    });

    it("メール形式が不正 → Err (field: 'email')", () => {
      const result = createUserNeverthrow({ name: "Alice", email: "invalid-email", age: 30 });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) expect(result.error.field).toBe("email");
    });

    it("年齢が範囲外 → Err (field: 'age')", () => {
      const result = createUserNeverthrow({ name: "Alice", email: "alice@example.com", age: -1 });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) expect(result.error.field).toBe("age");
    });

    it("名前が短すぎる場合、最初のエラーで止まる（短絡評価）", () => {
      const result = createUserNeverthrow({ name: "A", email: "invalid", age: -1 });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) expect(result.error.field).toBe("name");
    });
  });
});

describe("byethrow", () => {
  describe("createUser", () => {
    it("全て有効な入力 → Success(User)", () => {
      const result = createUserByethrow({ name: "Alice", email: "alice@example.com", age: 30 });
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value).toEqual({ name: "Alice", email: "alice@example.com", age: 30 });
      }
    });

    it("名前が短すぎる → Failure (field: 'name')", () => {
      const result = createUserByethrow({ name: "A", email: "alice@example.com", age: 30 });
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) expect(result.error.field).toBe("name");
    });

    it("メール形式が不正 → Failure (field: 'email')", () => {
      const result = createUserByethrow({ name: "Alice", email: "invalid-email", age: 30 });
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) expect(result.error.field).toBe("email");
    });

    it("年齢が範囲外 → Failure (field: 'age')", () => {
      const result = createUserByethrow({ name: "Alice", email: "alice@example.com", age: -1 });
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) expect(result.error.field).toBe("age");
    });

    it("名前が短すぎる場合、最初のエラーで止まる（短絡評価）", () => {
      const result = createUserByethrow({ name: "A", email: "invalid", age: -1 });
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) expect(result.error.field).toBe("name");
    });
  });
});
