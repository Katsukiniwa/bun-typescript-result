import { err, ok, type Result } from "neverthrow";

/**
 * Errのときdefault値でOkとして回復する
 * @hint result.orElse(() => ok(defaultValue))
 */
export const withDefault = (
  result: Result<number, string>,
  defaultValue: number,
): Result<number, string> => {
  return result.orElse(() => ok(defaultValue))
};

/**
 * primaryが失敗したらfallbackを使う
 * @hint primary.orElse(() => fallback)
 */
export const retryWithFallback = (
  primary: Result<string, string>,
  fallback: Result<string, string>,
): Result<string, string> => {
  return primary.orElse(() => fallback)
};

/**
 * '軽微エラー' → Ok(0)、それ以外 → Err('重大エラー')
 * @hint .orElse(e => e === "軽微エラー" ? ok(0) : err("重大エラー"))
 */
export const escalateError = (result: Result<number, string>): Result<number, string> => {
  return result.orElse((e) => e === "軽微エラー" ? ok(0) : err("重大エラー"))
};
