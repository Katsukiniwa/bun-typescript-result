import { describe, expect, it } from "bun:test";
import { parseJson, toNumber } from "./neverthrow";

describe("10: fromThrowable() — throwをResult化する", () => {
  describe("parseJson", () => {
    it("正しいJSON文字列を解析してOkを返す", () => {
      const result = parseJson('{"name":"Alice"}');
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual({ name: "Alice" });
      }
    });

    it("配列JSONも解析できる", () => {
      const result = parseJson("[1, 2, 3]");
      expect(result.isOk()).toBe(true);
    });

    it("不正なJSON文字列でErrを返す", () => {
      const result = parseJson("invalid json");
      expect(result.isErr()).toBe(true);
    });

    it("空文字列でErrを返す", () => {
      const result = parseJson("");
      expect(result.isErr()).toBe(true);
    });
  });

  describe("toNumber", () => {
    it("数値文字列 '42' をOk(42)として返す", () => {
      const result = toNumber("42");
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(42);
      }
    });

    it("小数 '3.14' をOk(3.14)として返す", () => {
      const result = toNumber("3.14");
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(3.14);
      }
    });

    it("数値でない文字列 'abc' でErrを返す", () => {
      const result = toNumber("abc");
      expect(result.isErr()).toBe(true);
    });

    it("空文字列でErrを返す", () => {
      const result = toNumber("");
      expect(result.isErr()).toBe(true);
    });
  });
});
