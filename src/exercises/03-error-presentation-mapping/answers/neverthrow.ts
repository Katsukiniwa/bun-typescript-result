import { err, ok, type Result } from "neverthrow";
import { match } from "ts-pattern";

type AppError =
  | { type: "NotFound"; resource: string }
  | { type: "ValidationError"; message: string }
  | { type: "Unauthorized" }
  | { type: "Conflict"; detail: string };

type ErrorBody = { code: string; message: string };
type HttpResponse = { status: number; body: unknown };

export { err, ok };

// ドメインエラーを HTTP ステータスコードにマップする
export const toStatus = (error: AppError): number =>
  match(error)
    .with({ type: "NotFound" }, () => 404)
    .with({ type: "ValidationError" }, () => 400)
    .with({ type: "Unauthorized" }, () => 401)
    .with({ type: "Conflict" }, () => 409)
    .exhaustive();

// ドメインエラーをクライアント向けエラーボディにマップする
export const toErrorBody = (error: AppError): ErrorBody =>
  match(error)
    .with({ type: "NotFound" }, (e) => ({
      code: "NOT_FOUND",
      message: `${e.resource} not found`,
    }))
    .with({ type: "ValidationError" }, (e) => ({
      code: "VALIDATION",
      message: e.message,
    }))
    .with({ type: "Unauthorized" }, () => ({
      code: "UNAUTHORIZED",
      message: "認証が必要です",
    }))
    .with({ type: "Conflict" }, (e) => ({
      code: "CONFLICT",
      message: e.detail,
    }))
    .exhaustive();

// Result を HTTP レスポンスに変換する（成功→200、失敗→エラーステータス）
export const handleResult = <T>(result: Result<T, AppError>): HttpResponse =>
  result.match(
    (v) => ({ status: 200, body: v }),
    (e) => ({ status: toStatus(e), body: toErrorBody(e) }),
  );
