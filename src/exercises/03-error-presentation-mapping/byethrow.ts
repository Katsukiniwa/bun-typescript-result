import type { Result } from "@praha/byethrow";

// match は実装時に ts-pattern から import する: import { match } from "ts-pattern";

type AppError =
  | { type: "NotFound"; resource: string }
  | { type: "ValidationError"; message: string }
  | { type: "Unauthorized" }
  | { type: "Conflict"; detail: string };

type ErrorBody = { code: string; message: string };
type HttpResponse = { status: number; body: unknown };

/**
 * AppError を HTTP ステータスコードに変換する（ts-pattern で網羅的にマッチ）。
 * @hint match(error).with({ type: "NotFound" }, () => 404). ... .exhaustive()
 */
export const toStatus = (error: AppError): number => {
  throw new Error(
    `TODO: match(error) で全バリアントを網羅し HTTP ステータスを返してください (type=${error.type})`,
  );
};

/**
 * AppError をクライアント向けエラーボディに変換する。
 * @hint match(error).with({ type: "NotFound" }, (e) => ({ code: "NOT_FOUND", message: `${e.resource} not found` }))...exhaustive()
 */
export const toErrorBody = (error: AppError): ErrorBody => {
  throw new Error(
    `TODO: match(error) で全バリアントを網羅し ErrorBody を返してください (type=${error.type})`,
  );
};

/**
 * Result を HTTP レスポンスに変換する（成功→200、失敗→toStatus/toErrorBody で変換）。
 * @hint Result.isSuccess(result) ? { status: 200, body: result.value } : { status: toStatus(result.error), ... }
 * 実装するときは `import type { Result }` を `import { Result }` に変えて値として使うこと。
 */
export const handleResult = <T>(result: Result.Result<T, AppError>): HttpResponse => {
  throw new Error(
    `TODO: Result.isSuccess で成功/失敗を分岐し HttpResponse を返してください (result=${JSON.stringify(result)})`,
  );
};
