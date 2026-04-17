import { describe, expect, it } from "bun:test";
import { err, ok } from "neverthrow";
import { addPrefix, double, parseNumber, toUpperCase } from "./neverthrow";

describe("04: map() — 成功値の変換", () => {
  describe("double", () => {
    it("Ok(5) → Ok(10)", () => {
      const result = double(ok(5));
      expect(result.isOk()).toBe(true);
      if (result.isOk()) expect(result.value).toBe(10);
    });

    it("Errはそのまま通過する", () => {
      const result = double(err("エラー"));
      expect(result.isErr()).toBe(true);
      if (result.isErr()) expect(result.error).toBe("エラー");
    });
  });

  describe("toUpperCase", () => {
    it("Ok('hello') → Ok('HELLO')", () => {
      const result = toUpperCase(ok("hello"));
      expect(result.isOk()).toBe(true);
      if (result.isOk()) expect(result.value).toBe("HELLO");
    });

    it("Errはそのまま通過する", () => {
      const result = toUpperCase(err("エラー"));
      expect(result.isErr()).toBe(true);
    });
  });

  describe("addPrefix", () => {
    it("Ok('world') に 'Hello, ' を追加する", () => {
      const result = addPrefix(ok("world"), "Hello, ");
      expect(result.isOk()).toBe(true);
      if (result.isOk()) expect(result.value).toBe("Hello, world");
    });
  });

  describe("parseNumber", () => {
    it("'42' → Ok(42)", () => {
      const result = parseNumber(ok("42"));
      expect(result.isOk()).toBe(true);
      if (result.isOk()) expect(result.value).toBe(42);
    });

    it("'abc' → Err", () => {
      const result = parseNumber(ok("abc"));
      expect(result.isErr()).toBe(true);
    });

    it("既にErrの場合はそのまま通過する", () => {
      const result = parseNumber(err("元のエラー"));
      expect(result.isErr()).toBe(true);
      if (result.isErr()) expect(result.error).toBe("元のエラー");
    });
  });
});
