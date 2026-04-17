import { err, ok, type Result } from "neverthrow";

export const divide = (a: number, b: number): Result<number, string> => {
  if (b === 0) return err("ゼロ除算エラー");
  return ok(a / b);
};

export const sqrt = (result: Result<number, string>): Result<number, string> =>
  result.andThen((n) =>
    n < 0 ? err("負の数の平方根は計算できません") : ok(Math.sqrt(n)),
  );

export const divideAndSqrt = (a: number, b: number): Result<number, string> =>
  divide(a, b).andThen((n) =>
    n < 0 ? err("負の数の平方根は計算できません") : ok(Math.sqrt(n)),
  );
