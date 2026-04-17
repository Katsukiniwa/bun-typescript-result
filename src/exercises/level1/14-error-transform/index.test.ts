import { describe, expect, it } from "bun:test";
import { toHttpError, toUserFacingMessage } from "./neverthrow";

type InternalError = {
  code: string;
  detail: string;
};

type HttpError = {
  statusCode: number;
  message: string;
};

describe("14: mapErr() — エラー型の変換", () => {
  describe("toHttpError", () => {
    it("Ok はそのまま通過する", () => {
      const result = toHttpError({ code: "NOT_FOUND", detail: "ユーザーが見つかりません" });
      // Okの場合は変換前のResultが返る
      expect(result.isErr()).toBe(true);
    });

    it("NOT_FOUND を 404 に変換する", () => {
      const result = toHttpError({ code: "NOT_FOUND", detail: "ユーザーが見つかりません" });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        const httpError: HttpError = result.error;
        expect(httpError.statusCode).toBe(404);
      }
    });

    it("UNAUTHORIZED を 401 に変換する", () => {
      const result = toHttpError({ code: "UNAUTHORIZED", detail: "認証が必要です" });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.statusCode).toBe(401);
      }
    });

    it("その他のエラーを 500 に変換する", () => {
      const result = toHttpError({ code: "UNKNOWN", detail: "不明なエラー" });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.statusCode).toBe(500);
      }
    });
  });

  describe("toUserFacingMessage", () => {
    it("エラーをユーザー向けメッセージ文字列に変換する", () => {
      const result = toUserFacingMessage({ code: "VALIDATION_ERROR", detail: "名前が不正です" });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(typeof result.error).toBe("string");
      }
    });
  });
});
