import { err, ok, type Result } from "neverthrow";

/**
 * 値をOk(成功)でラップする
 * @hint ok(value) を使ってください
 */
export const wrapValue = <T>(value: T): Result<T, never> => {
  // TODO: ok() を使って実装してください
  throw new Error("TODO: ok(value) を使って実装してください");
};

/**
 * エラーをErr(失敗)でラップする
 * @hint err(error) を使ってください
 */
export const wrapError = <E>(error: E): Result<never, E> => {
  // TODO: err() を使って実装してください
  throw new Error("TODO: err(error) を使って実装してください");
};
