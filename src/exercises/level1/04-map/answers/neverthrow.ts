import { err, ok, type Result } from "neverthrow";

export const double = (result: Result<number, string>): Result<number, string> =>
  result.map((n) => n * 2);

export const toUpperCase = (result: Result<string, string>): Result<string, string> =>
  result.map((s) => s.toUpperCase());

export const addPrefix = (
  result: Result<string, string>,
  prefix: string,
): Result<string, string> => result.map((s) => `${prefix}${s}`);

export const parseNumber = (result: Result<string, string>): Result<number, string> =>
  result.andThen((s) => {
    const n = parseInt(s, 10);
    return Number.isNaN(n) ? err("数値に変換できません") : ok(n);
  });
