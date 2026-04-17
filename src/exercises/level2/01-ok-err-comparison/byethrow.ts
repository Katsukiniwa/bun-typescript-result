import { Result } from "@praha/byethrow";

/**
 * 値をSuccess(成功)でラップする
 * @hint Result.succeed(value) を使ってください
 * @note neverthrow の ok() に相当します
 */
export const wrapValue = <T>(value: T): Result.Result<T, never> => {
  // TODO: Result.succeed() を使って実装してください
  throw new Error("TODO: Result.succeed(value) を使って実装してください");
};

/**
 * エラーをFailure(失敗)でラップする
 * @hint Result.fail(error) を使ってください
 * @note neverthrow の err() に相当します
 */
export const wrapError = <E>(error: E): Result.Result<never, E> => {
  // TODO: Result.fail() を使って実装してください
  throw new Error("TODO: Result.fail(error) を使って実装してください");
};
