import { Result } from "@praha/byethrow";

export const parseInt_ = (s: string): Result.Result<number, string> => {
  const n = Number.parseInt(s, 10);
  return Number.isNaN(n) ? Result.fail(`"${s}" は整数に変換できません`) : Result.succeed(n);
};

export const requirePositive = (result: Result.Result<number, string>): Result.Result<number, string> =>
  Result.pipe(
    result,
    Result.andThen((n) => (n > 0 ? Result.succeed(n) : Result.fail(`${n} は正の数ではありません`))),
  );
