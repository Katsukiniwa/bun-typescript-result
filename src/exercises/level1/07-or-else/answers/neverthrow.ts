import { err, ok, type Result } from "neverthrow";

export const withDefault = (
  result: Result<number, string>,
  defaultValue: number,
): Result<number, string> => result.orElse(() => ok(defaultValue));

export const retryWithFallback = (
  primary: Result<string, string>,
  fallback: Result<string, string>,
): Result<string, string> => primary.orElse(() => fallback);

export const escalateError = (result: Result<number, string>): Result<number, string> =>
  result.orElse((e) => (e === "軽微エラー" ? ok(0) : err("重大エラー")));
