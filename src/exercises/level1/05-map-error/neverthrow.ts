import { type Result } from "neverthrow";

/**
 * エラーメッセージにprefixを追加する
 * @hint result.mapErr(e => prefix + e) の形で使います
 */
export const addErrorPrefix = (
  result: Result<number, string>,
  prefix: string,
): Result<number, string> => {
  // TODO: .mapErr() を使って実装してください
  throw new Error("TODO: .mapErr() を使って実装してください");
};

/**
 * エラー文字列をHTTPステータスコードに変換する
 * @hint .mapErr() の中でswitch/ifを使いましょう
 */
export const toErrorCode = (result: Result<string, string>): Result<string, number> => {
  // TODO: .mapErr() を使って実装してください
  throw new Error("TODO: .mapErr(e => { switch(e) {...} }) を試してみてください");
};

/**
 * 文字列エラーを構造化エラーオブジェクトに変換する
 * @hint Date.now() でタイムスタンプを取得できます
 */
export const wrapInErrorObject = (
  result: Result<string, string>,
): Result<string, { message: string; timestamp: number }> => {
  // TODO: .mapErr() を使って実装してください
  throw new Error("TODO: .mapErr(e => ({ message: e, timestamp: Date.now() })) を試してみてください");
};
