import { R } from "@praha/byethrow";

/**
 * 値をSuccess(成功)でラップする
 * @hint Result.succeed(value) を使ってください
 * @note neverthrow の ok() に相当します
 */
export const wrapValue = <T>(value: T): R.ResultFor<T, Awaited<T>, never> => {
  return R.succeed(value)
};

/**
 * エラーをFailure(失敗)でラップする
 * @hint Result.fail(error) を使ってください
 * @note neverthrow の err() に相当します
 */
export const wrapError = <E>(error: E): R.ResultFor<E, never, Awaited<E>> => {
  return R.fail(error)
};
