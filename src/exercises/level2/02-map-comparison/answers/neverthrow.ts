import { type Result } from "neverthrow";

export const double = (result: Result<number, string>): Result<number, string> =>
  result.map((n) => n * 2);

export const toUpperCase = (result: Result<string, string>): Result<string, string> =>
  result.map((s) => s.toUpperCase());
