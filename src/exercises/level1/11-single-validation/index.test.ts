import { describe, expect, it } from "bun:test";
import { validateAge, validateEmail, validateName } from "./neverthrow";

describe("11: 単一バリデーション — Result型で検証する", () => {
  describe("validateName", () => {
    it("3文字以上の名前でOkを返す", () => {
      const result = validateName("Alice");
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe("Alice");
      }
    });

    it("ちょうど3文字でOkを返す", () => {
      const result = validateName("Bob");
      expect(result.isOk()).toBe(true);
    });

    it("空文字でErrを返す", () => {
      const result = validateName("");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.field).toBe("name");
      }
    });

    it("2文字以下でErrを返す", () => {
      const result = validateName("Ab");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.field).toBe("name");
      }
    });
  });

  describe("validateEmail", () => {
    it("正しい形式のメールでOkを返す", () => {
      const result = validateEmail("alice@example.com");
      expect(result.isOk()).toBe(true);
    });

    it("@がないメールでErrを返す", () => {
      const result = validateEmail("invalid-email");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.field).toBe("email");
      }
    });

    it("空文字でErrを返す", () => {
      const result = validateEmail("");
      expect(result.isErr()).toBe(true);
    });
  });

  describe("validateAge", () => {
    it("正の整数でOkを返す", () => {
      const result = validateAge(25);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(25);
      }
    });

    it("0でOkを返す", () => {
      const result = validateAge(0);
      expect(result.isOk()).toBe(true);
    });

    it("負の数でErrを返す", () => {
      const result = validateAge(-1);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.field).toBe("age");
      }
    });

    it("150より大きい数でErrを返す", () => {
      const result = validateAge(151);
      expect(result.isErr()).toBe(true);
    });
  });
});
