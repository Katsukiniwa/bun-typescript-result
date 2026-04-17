import { describe, expect, it } from "bun:test";
import { Result } from "@praha/byethrow";
import { registerUser as registerByethrow } from "./byethrow";
import { registerUser as registerNeverthrow } from "./neverthrow";

describe("neverthrow", () => {
  describe("registerUser", () => {
    it("正常な入力 → Ok(User)", async () => {
      const result = await registerNeverthrow("Alice", "alice@example.com");
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.name).toBe("Alice");
        expect(result.value.email).toBe("alice@example.com");
        expect(result.value.id).toBe("new-id");
      }
    });

    it("名前が短すぎる → Err(ValidationError)", async () => {
      const result = await registerNeverthrow("Ab", "test@example.com");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) expect(result.error.type).toBe("ValidationError");
    });

    it("メール形式が不正 → Err(ValidationError)", async () => {
      const result = await registerNeverthrow("Alice", "invalid-email");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) expect(result.error.type).toBe("ValidationError");
    });

    it("重複メール → Err(DuplicateError)", async () => {
      const result = await registerNeverthrow("Alice", "alice@test.com");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe("DuplicateError");
        expect((result.error as { type: "DuplicateError"; email: string }).email).toBe("alice@test.com");
      }
    });
  });
});

describe("byethrow", () => {
  describe("registerUser", () => {
    it("正常な入力 → Success(User)", async () => {
      const result = await registerByethrow("Alice", "alice@example.com");
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value.name).toBe("Alice");
        expect(result.value.email).toBe("alice@example.com");
        expect(result.value.id).toBe("new-id");
      }
    });

    it("名前が短すぎる → Failure(ValidationError)", async () => {
      const result = await registerByethrow("Ab", "test@example.com");
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) expect(result.error.type).toBe("ValidationError");
    });

    it("メール形式が不正 → Failure(ValidationError)", async () => {
      const result = await registerByethrow("Alice", "invalid-email");
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) expect(result.error.type).toBe("ValidationError");
    });

    it("重複メール → Failure(DuplicateError)", async () => {
      const result = await registerByethrow("Alice", "alice@test.com");
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error.type).toBe("DuplicateError");
        expect((result.error as { type: "DuplicateError"; email: string }).email).toBe("alice@test.com");
      }
    });
  });
});
