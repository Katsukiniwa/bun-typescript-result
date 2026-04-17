import { describe, expect, it } from "bun:test";
import { err, ok } from "neverthrow";
import { getValueOr, getUserName } from "./neverthrow";

describe("09: unwrapOr() — デフォルト値の取り出し", () => {
  describe("getValueOr", () => {
    it("Ok(10) のとき 10 を返す", () => {
      expect(getValueOr(ok(10), 0)).toBe(10);
    });

    it("Err のとき defaultValue(0) を返す", () => {
      expect(getValueOr(err("エラー"), 0)).toBe(0);
    });

    it("Err のとき defaultValue(99) を返す", () => {
      expect(getValueOr(err("エラー"), 99)).toBe(99);
    });
  });

  describe("getUserName", () => {
    it("Ok({name:'Alice'}) のとき 'Alice' を返す", () => {
      expect(getUserName(ok({ name: "Alice" }))).toBe("Alice");
    });

    it("Err のとき '匿名' を返す", () => {
      expect(getUserName(err("ユーザーが見つかりません"))).toBe("匿名");
    });
  });
});
