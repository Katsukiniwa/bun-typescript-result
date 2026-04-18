import { err, ok, type Result } from "neverthrow";

/**
 * a ÷ b を計算。b=0のとき失敗する
 * @hint if (b === 0) return err(...) else return ok(a / b)
 */
export const divide = (a: number, b: number): Result<number, string> => {
  if (b === 0) return err("ゼロ除算エラー");
  return ok(a / b);
};

/**
 * Resultの数値の平方根を計算。負の数はエラー
 * @hint result.andThen(n => n < 0 ? err(...) : ok(Math.sqrt(n)))
 */
export const sqrt = (result: Result<number, string>): Result<number, string> => {
  return result.andThen((n) =>
    n < 0 ? err("負の数の平方根は計算できません") : ok(Math.sqrt(n)),
  );
};

/**
 * divide と sqrt を andThen で連鎖する
 * @hint divide(a, b).andThen(n => sqrt(ok(n))) のように連鎖できます
 */
export const divideAndSqrt = (a: number, b: number): Result<number, string> => {
  return divide(a, b).andThen((n) =>
    n < 0 ? err("負の数の平方根は計算できません") : ok(Math.sqrt(n)),
  );
};
