import { Result } from "@praha/byethrow";

export const double = (result: Result.Result<number, string>): Result.Result<number, string> =>
  Result.pipe(result, Result.map((n) => n * 2));

export const toUpperCase = (result: Result.Result<string, string>): Result.Result<string, string> =>
  Result.pipe(result, Result.map((s) => s.toUpperCase()));
