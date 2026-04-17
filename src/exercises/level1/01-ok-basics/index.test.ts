import { describe, expect, it } from "bun:test";
import { wrapNumber, wrapObject, wrapString } from "./neverthrow";

describe("01: ok() の基本", () => {
  describe("wrapNumber", () => {
    it("数値をOk(数値)でラップする", () => {
      const result = wrapNumber(42);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(42);
      }
    });

    it("0もOk(0)でラップする", () => {
      const result = wrapNumber(0);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(0);
      }
    });

    it("負の数もOk(-1)でラップする", () => {
      const result = wrapNumber(-1);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(-1);
      }
    });
  });

  describe("wrapString", () => {
    it("文字列をOk(文字列)でラップする", () => {
      const result = wrapString("hello");
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe("hello");
      }
    });

    it("空文字もOk('')でラップする", () => {
      const result = wrapString("");
      expect(result.isOk()).toBe(true);
    });
  });

  describe("wrapObject", () => {
    it("オブジェクトをOk(オブジェクト)でラップする", () => {
      const obj = { id: 1, name: "Alice" };
      const result = wrapObject(obj);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual({ id: 1, name: "Alice" });
      }
    });
  });
});
