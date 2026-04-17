import { err, ok, type Result } from "neverthrow";

export const parseInt_ = (s: string): Result<number, string> => {
  const n = Number.parseInt(s, 10);
  return Number.isNaN(n) ? err(`"${s}" は整数に変換できません`) : ok(n);
};

export const requirePositive = (result: Result<number, string>): Result<number, string> =>
  result.andThen((n) => (n > 0 ? ok(n) : err(`${n} は正の数ではありません`)));
