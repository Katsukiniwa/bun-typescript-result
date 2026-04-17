import { describe, expect, it } from "bun:test";
import { Result } from "@praha/byethrow";
import * as E from "fp-ts/Either";
import { registerUser as registerUserByethrow } from "./answers/byethrow";
import { registerUser as registerUserFpts } from "./answers/fp-ts";
import { registerUser as registerUserNeverthrow } from "./answers/neverthrow";

const validInput = { name: "Alice", email: "alice@example.com", age: 30 };
const duplicateInput = { name: "Admin", email: "admin@example.com", age: 40 };

describe("neverthrow", () => {
  describe("registerUser", () => {
    it("有効な入力 → Ok(User)", async () => {
      const result = await registerUserNeverthrow(validInput);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.name).toBe("Alice");
        expect(result.value.email).toBe("alice@example.com");
        expect(result.value.age).toBe(30);
        expect(result.value.id).toBeTruthy();
      }
    });

    it("名前が2文字以下 → Err(ValidationError: name)", async () => {
      const result = await registerUserNeverthrow({ ...validInput, name: "Al" });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error._tag).toBe("ValidationError");
        expect((result.error as { _tag: "ValidationError"; field: string }).field).toBe("name");
      }
    });

    it("メールに@なし → Err(ValidationError: email)", async () => {
      const result = await registerUserNeverthrow({ ...validInput, email: "notanemail" });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error._tag).toBe("ValidationError");
        expect((result.error as { _tag: "ValidationError"; field: string }).field).toBe("email");
      }
    });

    it("年齢が範囲外（-1）→ Err(ValidationError: age)", async () => {
      const result = await registerUserNeverthrow({ ...validInput, age: -1 });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error._tag).toBe("ValidationError");
        expect((result.error as { _tag: "ValidationError"; field: string }).field).toBe("age");
      }
    });

    it("重複メール → Err(DuplicateError)", async () => {
      const result = await registerUserNeverthrow(duplicateInput);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error._tag).toBe("DuplicateError");
      }
    });
  });
});

describe("byethrow", () => {
  describe("registerUser", () => {
    it("有効な入力 → Success(User)", async () => {
      const result = await registerUserByethrow(validInput);
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value.name).toBe("Alice");
        expect(result.value.email).toBe("alice@example.com");
        expect(result.value.age).toBe(30);
        expect(result.value.id).toBeTruthy();
      }
    });

    it("名前が2文字以下 → Failure(ValidationError: name)", async () => {
      const result = await registerUserByethrow({ ...validInput, name: "Al" });
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error._tag).toBe("ValidationError");
        expect((result.error as { _tag: "ValidationError"; field: string }).field).toBe("name");
      }
    });

    it("メールに@なし → Failure(ValidationError: email)", async () => {
      const result = await registerUserByethrow({ ...validInput, email: "notanemail" });
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error._tag).toBe("ValidationError");
        expect((result.error as { _tag: "ValidationError"; field: string }).field).toBe("email");
      }
    });

    it("重複メール → Failure(DuplicateError)", async () => {
      const result = await registerUserByethrow(duplicateInput);
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error._tag).toBe("DuplicateError");
      }
    });
  });
});

describe("fp-ts", () => {
  describe("registerUser", () => {
    it("有効な入力 → Right(User)", async () => {
      // fp-ts の TaskEither は関数なので末尾に () が必要
      const result = await registerUserFpts(validInput)();
      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right.name).toBe("Alice");
        expect(result.right.email).toBe("alice@example.com");
        expect(result.right.age).toBe(30);
        expect(result.right.id).toBeTruthy();
      }
    });

    it("名前が2文字以下 → Left(ValidationError: name)", async () => {
      const result = await registerUserFpts({ ...validInput, name: "Al" })();
      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) {
        expect(result.left._tag).toBe("ValidationError");
        expect((result.left as { _tag: "ValidationError"; field: string }).field).toBe("name");
      }
    });

    it("メールに@なし → Left(ValidationError: email)", async () => {
      const result = await registerUserFpts({ ...validInput, email: "notanemail" })();
      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) {
        expect(result.left._tag).toBe("ValidationError");
        expect((result.left as { _tag: "ValidationError"; field: string }).field).toBe("email");
      }
    });

    it("重複メール → Left(DuplicateError)", async () => {
      const result = await registerUserFpts(duplicateInput)();
      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) {
        expect(result.left._tag).toBe("DuplicateError");
      }
    });
  });
});
