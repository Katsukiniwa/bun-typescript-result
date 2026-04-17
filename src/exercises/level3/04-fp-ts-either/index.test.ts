import { describe, expect, it } from "bun:test";
import * as E from "fp-ts/Either";
import { double, toInt, validateUser, wrapError, wrapValue } from "./answers/fp-ts";

describe("fp-ts Either", () => {
  describe("wrapValue", () => {
    it("数値42をRightでラップする", () => {
      const result = wrapValue(42);
      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right).toBe(42);
      }
    });

    it("文字列をRightでラップする", () => {
      const result = wrapValue("hello");
      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right).toBe("hello");
      }
    });
  });

  describe("wrapError", () => {
    it("エラーをLeftでラップする", () => {
      const result = wrapError("エラーメッセージ");
      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) {
        expect(result.left).toBe("エラーメッセージ");
      }
    });
  });

  describe("double", () => {
    it("Right(5) → Right(10)", () => {
      const result = double(E.right(5));
      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right).toBe(10);
      }
    });

    it("Left('err') → Left('err')（変換されない）", () => {
      const result = double(E.left("err"));
      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) {
        expect(result.left).toBe("err");
      }
    });
  });

  describe("toInt", () => {
    it('"42" → Right(42)', () => {
      const result = toInt("42");
      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right).toBe(42);
      }
    });

    it('"0" → Right(0)', () => {
      const result = toInt("0");
      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right).toBe(0);
      }
    });

    it('"abc" → Left（変換できない）', () => {
      const result = toInt("abc");
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe("validateUser", () => {
    it("有効な入力 → Right({ name, email })", () => {
      const result = validateUser({ name: "Alice", email: "alice@example.com" });
      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right).toEqual({ name: "Alice", email: "alice@example.com" });
      }
    });

    it("名前が2文字以下 → Left（名前エラー）", () => {
      const result = validateUser({ name: "Al", email: "alice@example.com" });
      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) {
        expect(result.left).toContain("名前");
      }
    });

    it("メールに@なし → Left（メールエラー）", () => {
      const result = validateUser({ name: "Alice", email: "notanemail" });
      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) {
        expect(result.left).toContain("メール");
      }
    });

    it("名前とメール両方不正 → Left（名前エラーが優先）", () => {
      const result = validateUser({ name: "Al", email: "notanemail" });
      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) {
        expect(result.left).toContain("名前");
      }
    });
  });
});
