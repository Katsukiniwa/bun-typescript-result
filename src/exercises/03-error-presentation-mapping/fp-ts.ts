import type * as E from "fp-ts/Either";

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
 * Either を HTTP レスポンスに変換する（Right→200、Left→toStatus/toErrorBody で変換）。
 * @hint pipe(result, E.match(e => ({ status: toStatus(e), body: toErrorBody(e) }), v => ({ status: 200, body: v })))
 * 実装するときは型のみの import を値の import（import * as E from "fp-ts/Either"、import { pipe } from "fp-ts/function"）に変えること。
 */
export const handleResult = <T>(result: E.Either<AppError, T>): HttpResponse => {
  throw new Error(
    `TODO: pipe + E.match で Either を HttpResponse にたたみ込んでください (result=${JSON.stringify(result)})`,
  );
};
