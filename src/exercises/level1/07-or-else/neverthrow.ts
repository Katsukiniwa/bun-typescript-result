import { type Result } from "neverthrow";

/**
 * Errのときdefault値でOkとして回復する
 * @hint result.orElse(() => ok(defaultValue))
 */
export const withDefault = (
  result: Result<number, string>,
  defaultValue: number,
): Result<number, string> => {
  // TODO: .orElse() を使って実装してください
  throw new Error("TODO: .orElse(() => ok(defaultValue)) を試してください");
};

/**
 * primaryが失敗したらfallbackを使う
 * @hint primary.orElse(() => fallback)
 */
export const retryWithFallback = (
  primary: Result<string, string>,
  fallback: Result<string, string>,
): Result<string, string> => {
  // TODO: .orElse() を使って実装してください
  throw new Error("TODO: primary.orElse(() => fallback) を試してください");
};

/**
 * '軽微エラー' → Ok(0)、それ以外 → Err('重大エラー')
 * @hint .orElse(e => e === "軽微エラー" ? ok(0) : err("重大エラー"))
 */
export const escalateError = (result: Result<number, string>): Result<number, string> => {
  // TODO: .orElse() を使って実装してください
  throw new Error("TODO: .orElse() でエラーを見て分岐してください");
};
