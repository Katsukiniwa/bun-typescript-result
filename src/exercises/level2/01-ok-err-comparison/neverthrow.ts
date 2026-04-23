import { err, ok, type Result } from "neverthrow";

/**
 * 値をOk(成功)でラップする
 * @hint ok(value) を使ってください
 */
export const wrapValue = <T>(value: T): Result<T, never> => {
  return ok(value)
};

/**
 * エラーをErr(失敗)でラップする
 * @hint err(error) を使ってください
 */
export const wrapError = <E>(error: E): Result<never, E> => {
  return err(error)
};
