import { describe, expect, it } from "bun:test";
import { Result } from "@praha/byethrow";
import { err, ok } from "neverthrow";
import {
  resultToStatusCode as resultToStatusCodeByethrow,
  toStatusCode as toStatusCodeByethrow,
  toUserMessage as toUserMessageByethrow,
} from "./byethrow";
import {
  resultToStatusCode as resultToStatusCodeNeverthrow,
  toStatusCode as toStatusCodeNeverthrow,
  toUserMessage as toUserMessageNeverthrow,
} from "./neverthrow";

describe("neverthrow", () => {
  describe("toStatusCode", () => {
    it("ValidationError → 400", () => {
      expect(toStatusCodeNeverthrow({ _tag: "ValidationError", field: "name", message: "必須" })).toBe(400);
    });

    it("NotFoundError → 404", () => {
      expect(toStatusCodeNeverthrow({ _tag: "NotFoundError", id: "123" })).toBe(404);
    });

    it("DuplicateError → 409", () => {
      expect(toStatusCodeNeverthrow({ _tag: "DuplicateError", email: "a@b.com" })).toBe(409);
    });

    it("DatabaseError → 500", () => {
      expect(toStatusCodeNeverthrow({ _tag: "DatabaseError", cause: "connection failed" })).toBe(500);
    });
  });

  describe("toUserMessage", () => {
    it("ValidationError → フィールド名とメッセージを含む", () => {
      const msg = toUserMessageNeverthrow({ _tag: "ValidationError", field: "name", message: "必須項目です" });
      expect(msg).toContain("name");
      expect(msg).toContain("必須項目です");
    });

    it("NotFoundError → IDを含む", () => {
      const msg = toUserMessageNeverthrow({ _tag: "NotFoundError", id: "abc123" });
      expect(msg).toContain("abc123");
    });

    it("DuplicateError → メールアドレスを含む", () => {
      const msg = toUserMessageNeverthrow({ _tag: "DuplicateError", email: "test@example.com" });
      expect(msg).toContain("test@example.com");
    });
  });

  describe("resultToStatusCode", () => {
    it("Err(ValidationError) → 400", () => {
      const result = err<unknown, { _tag: "ValidationError"; field: string; message: string }>({
        _tag: "ValidationError",
        field: "name",
        message: "必須",
      });
      expect(resultToStatusCodeNeverthrow(result)).toBe(400);
    });

    it("Ok → null", () => {
      expect(resultToStatusCodeNeverthrow(ok("success"))).toBeNull();
    });
  });
});

describe("byethrow", () => {
  describe("toStatusCode", () => {
    it("ValidationError → 400", () => {
      expect(toStatusCodeByethrow({ _tag: "ValidationError", field: "name", message: "必須" })).toBe(400);
    });

    it("NotFoundError → 404", () => {
      expect(toStatusCodeByethrow({ _tag: "NotFoundError", id: "123" })).toBe(404);
    });

    it("DuplicateError → 409", () => {
      expect(toStatusCodeByethrow({ _tag: "DuplicateError", email: "a@b.com" })).toBe(409);
    });

    it("DatabaseError → 500", () => {
      expect(toStatusCodeByethrow({ _tag: "DatabaseError", cause: "connection failed" })).toBe(500);
    });
  });

  describe("toUserMessage", () => {
    it("ValidationError → フィールド名とメッセージを含む", () => {
      const msg = toUserMessageByethrow({ _tag: "ValidationError", field: "name", message: "必須項目です" });
      expect(msg).toContain("name");
      expect(msg).toContain("必須項目です");
    });

    it("NotFoundError → IDを含む", () => {
      const msg = toUserMessageByethrow({ _tag: "NotFoundError", id: "abc123" });
      expect(msg).toContain("abc123");
    });

    it("DuplicateError → メールアドレスを含む", () => {
      const msg = toUserMessageByethrow({ _tag: "DuplicateError", email: "test@example.com" });
      expect(msg).toContain("test@example.com");
    });
  });

  describe("resultToStatusCode", () => {
    it("Failure(ValidationError) → 400", () => {
      const result = Result.fail<{ _tag: "ValidationError"; field: string; message: string }>({
        _tag: "ValidationError",
        field: "name",
        message: "必須",
      });
      expect(resultToStatusCodeByethrow(result)).toBe(400);
    });

    it("Success → null", () => {
      expect(resultToStatusCodeByethrow(Result.succeed("success"))).toBeNull();
    });
  });
});
