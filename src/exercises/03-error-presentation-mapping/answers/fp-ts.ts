import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { match } from "ts-pattern";

type AppError =
  | { type: "NotFound"; resource: string }
  | { type: "ValidationError"; message: string }
  | { type: "Unauthorized" }
  | { type: "Conflict"; detail: string };

type ErrorBody = { code: string; message: string };
type HttpResponse = { status: number; body: unknown };

export { E };

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

// Either を HTTP レスポンスに変換する（Right→200、Left→エラーステータス）
export const handleResult = <T>(result: E.Either<AppError, T>): HttpResponse =>
  pipe(
    result,
    E.match(
      (e): HttpResponse => ({ status: toStatus(e), body: toErrorBody(e) }),
      (v): HttpResponse => ({ status: 200, body: v }),
    ),
  );
