import { err, type Result } from "neverthrow";

type InternalError = {
  code: string;
  detail: string;
};

type HttpError = {
  statusCode: number;
  message: string;
};

// テスト用: 常にInternalErrorのErrを返すヘルパー
const makeError = (error: InternalError): Result<never, InternalError> => err(error);

/**
 * InternalError を HttpError に変換する
 * @hint result.mapErr(e => ({ statusCode: ..., message: e.detail })) を使ってください
 * @hint mapErr は Err の中身だけを変換します。Ok はそのまま通過します
 */
export const toHttpError = (error: InternalError): Result<never, HttpError> => {
  // TODO: makeError(error).mapErr(e => ...) でエラーを変換してください
  // NOT_FOUND → 404, UNAUTHORIZED → 401, その他 → 500
  throw new Error("TODO: .mapErr() を使って実装してください");
};

/**
 * InternalError をユーザー向けのメッセージ文字列に変換する
 */
export const toUserFacingMessage = (error: InternalError): Result<never, string> => {
  // TODO: makeError(error).mapErr(e => `エラーが発生しました: ${e.detail}`) のように変換してください
  throw new Error("TODO: .mapErr() を使って実装してください");
};
