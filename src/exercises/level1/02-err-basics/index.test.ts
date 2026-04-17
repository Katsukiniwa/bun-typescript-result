import { describe, expect, it } from "bun:test";
import { alwaysFail, failWithCode, validatePositive } from "./neverthrow";

describe("02: err() の基本", () => {
  describe("alwaysFail", () => {
    it("常にErrを返す", () => {
      const result = alwaysFail("失敗しました");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("失敗しました");
      }
    });

    it("メッセージがそのままエラーになる", () => {
      const result = alwaysFail("エラー");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("エラー");
      }
    });
  });

  describe("failWithCode", () => {
    it("コードとメッセージを持つエラーオブジェクトで失敗する", () => {
      const result = failWithCode(404, "見つかりません");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.code).toBe(404);
        expect(result.error.message).toBe("見つかりません");
      }
    });
  });

  describe("validatePositive", () => {
    it("正の数は成功する", () => {
      const result = validatePositive(5);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe(5);
      }
    });

    it("0は失敗する", () => {
      const result = validatePositive(0);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("正の数が必要です");
      }
    });

    it("負の数は失敗する", () => {
      const result = validatePositive(-1);
      expect(result.isErr()).toBe(true);
    });
  });
});
