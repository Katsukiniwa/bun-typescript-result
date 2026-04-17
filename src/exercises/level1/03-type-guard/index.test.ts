import { describe, expect, it } from "bun:test";
import { err, ok } from "neverthrow";
import { countResults, doubleIfOk, getStatus } from "./neverthrow";

describe("03: isOk() / isErr() の型ガード", () => {
  describe("getStatus", () => {
    it("Okのとき'ok'を返す", () => {
      expect(getStatus(ok(42))).toBe("ok");
    });

    it("Errのとき'err'を返す", () => {
      expect(getStatus(err("失敗"))).toBe("err");
    });
  });

  describe("doubleIfOk", () => {
    it("Okなら値を2倍にする", () => {
      expect(doubleIfOk(ok(5))).toBe(10);
    });

    it("Errならエラーの数値をそのまま返す", () => {
      expect(doubleIfOk(err(3))).toBe(3);
    });
  });

  describe("countResults", () => {
    it("成功と失敗の数を数える", () => {
      const results = [ok(1), err("a"), ok(2), err("b"), ok(3)];
      const count = countResults(results);
      expect(count.ok).toBe(3);
      expect(count.err).toBe(2);
    });

    it("全て成功の場合", () => {
      const count = countResults([ok(1), ok(2)]);
      expect(count.ok).toBe(2);
      expect(count.err).toBe(0);
    });

    it("空配列の場合", () => {
      const count = countResults([]);
      expect(count.ok).toBe(0);
      expect(count.err).toBe(0);
    });
  });
});
