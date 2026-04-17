import { describe, expect, it } from "bun:test";
import { err, ok } from "neverthrow";
import { addErrorPrefix, toErrorCode, wrapInErrorObject } from "./neverthrow";

describe("05: mapErr() — エラーの変換", () => {
  describe("addErrorPrefix", () => {
    it("Errのメッセージにprefixを追加する", () => {
      const result = addErrorPrefix(err("見つかりません"), "[エラー] ");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBe("[エラー] 見つかりません");
      }
    });

    it("OkはそのままOkで返る", () => {
      const result = addErrorPrefix(ok(42), "[エラー] ");
      expect(result.isOk()).toBe(true);
      if (result.isOk()) expect(result.value).toBe(42);
    });
  });

  describe("toErrorCode", () => {
    it("'not_found' → 404", () => {
      const result = toErrorCode(err("not_found"));
      expect(result.isErr()).toBe(true);
      if (result.isErr()) expect(result.error).toBe(404);
    });

    it("'unauthorized' → 401", () => {
      const result = toErrorCode(err("unauthorized"));
      expect(result.isErr()).toBe(true);
      if (result.isErr()) expect(result.error).toBe(401);
    });

    it("その他 → 500", () => {
      const result = toErrorCode(err("unknown"));
      expect(result.isErr()).toBe(true);
      if (result.isErr()) expect(result.error).toBe(500);
    });

    it("OkはそのままOkで返る", () => {
      const result = toErrorCode(ok("success"));
      expect(result.isOk()).toBe(true);
    });
  });

  describe("wrapInErrorObject", () => {
    it("文字列エラーを構造化オブジェクトに変換する", () => {
      const before = Date.now();
      const result = wrapInErrorObject(err("失敗しました"));
      const after = Date.now();
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.message).toBe("失敗しました");
        expect(result.error.timestamp).toBeGreaterThanOrEqual(before);
        expect(result.error.timestamp).toBeLessThanOrEqual(after);
      }
    });
  });
});
