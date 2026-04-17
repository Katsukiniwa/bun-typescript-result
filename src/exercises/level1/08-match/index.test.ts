import { describe, expect, it } from "bun:test";
import { err, ok } from "neverthrow";
import { formatUserResult, toMessage, toNumber } from "./neverthrow";

describe("08: match() — パターンマッチング", () => {
  describe("toMessage", () => {
    it("Ok(42) → '成功: 42'", () => {
      expect(toMessage(ok(42))).toBe("成功: 42");
    });

    it("Err('エラー') → '失敗: エラー'", () => {
      expect(toMessage(err("エラー"))).toBe("失敗: エラー");
    });
  });

  describe("toNumber", () => {
    it("Ok(5) → 5", () => {
      expect(toNumber(ok(5))).toBe(5);
    });

    it("Err(_) → -1", () => {
      expect(toNumber(err("任意のエラー"))).toBe(-1);
    });
  });

  describe("formatUserResult", () => {
    it("Ok({name:'Alice', age:25}) → 'Aliceさん(25歳)'", () => {
      const result = ok({ name: "Alice", age: 25 });
      expect(formatUserResult(result)).toBe("Aliceさん(25歳)");
    });

    it("Err({message:'見つかりません'}) → 'エラー: 見つかりません'", () => {
      const result = err({ message: "見つかりません" });
      expect(formatUserResult(result)).toBe("エラー: 見つかりません");
    });
  });
});
