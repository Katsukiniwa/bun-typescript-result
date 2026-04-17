import { describe, expect, it } from "bun:test";
import { Result } from "@praha/byethrow";
import {
  createAmount as createAmountByethrow,
  createEmail as createEmailByethrow,
  createUserId as createUserIdByethrow,
} from "./answers/byethrow";
import {
  createAmount as createAmountNeverthrow,
  createEmail as createEmailNeverthrow,
  createUserId as createUserIdNeverthrow,
} from "./answers/neverthrow";

describe("neverthrow", () => {
  describe("createUserId", () => {
    it("空でない文字列 → Ok(UserId)", () => {
      const result = createUserIdNeverthrow("user-1");
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe("user-1");
      }
    });

    it("空文字列 → Err(field: 'userId')", () => {
      const result = createUserIdNeverthrow("");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.field).toBe("userId");
      }
    });
  });

  describe("createEmail", () => {
    it("@を含む文字列 → Ok(Email)", () => {
      const result = createEmailNeverthrow("alice@example.com");
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe("alice@example.com");
      }
    });

    it("@を含まない文字列 → Err(field: 'email')", () => {
      const result = createEmailNeverthrow("notanemail");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.field).toBe("email");
      }
    });
  });

  describe("createAmount", () => {
    it("正の数値 → Ok(Amount)", () => {
      const result = createAmountNeverthrow(100);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(100);
      }
    });

    it("0 → Ok(Amount)", () => {
      const result = createAmountNeverthrow(0);
      expect(result.isOk()).toBe(true);
    });

    it("負の数値 → Err(field: 'amount')", () => {
      const result = createAmountNeverthrow(-1);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.field).toBe("amount");
      }
    });
  });
});

describe("byethrow", () => {
  describe("createUserId", () => {
    it("空でない文字列 → Success(UserId)", () => {
      const result = createUserIdByethrow("user-1");
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value).toBe("user-1");
      }
    });

    it("空文字列 → Failure(field: 'userId')", () => {
      const result = createUserIdByethrow("");
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error.field).toBe("userId");
      }
    });
  });

  describe("createEmail", () => {
    it("@を含む文字列 → Success(Email)", () => {
      const result = createEmailByethrow("alice@example.com");
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value).toBe("alice@example.com");
      }
    });

    it("@を含まない文字列 → Failure(field: 'email')", () => {
      const result = createEmailByethrow("notanemail");
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error.field).toBe("email");
      }
    });
  });

  describe("createAmount", () => {
    it("正の数値 → Success(Amount)", () => {
      const result = createAmountByethrow(100);
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value).toBe(100);
      }
    });

    it("0 → Success(Amount)", () => {
      const result = createAmountByethrow(0);
      expect(Result.isSuccess(result)).toBe(true);
    });

    it("負の数値 → Failure(field: 'amount')", () => {
      const result = createAmountByethrow(-1);
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error.field).toBe("amount");
      }
    });
  });
});
