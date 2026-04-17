import { type Result } from "neverthrow";

/**
 * a ÷ b を計算。b=0のとき失敗する
 * @hint if (b === 0) return err(...) else return ok(a / b)
 */
export const divide = (a: number, b: number): Result<number, string> => {
  // TODO: 実装してください
  throw new Error("TODO: ゼロ除算チェックして ok() / err() を返してください");
};

/**
 * Resultの数値の平方根を計算。負の数はエラー
 * @hint result.andThen(n => n < 0 ? err(...) : ok(Math.sqrt(n)))
 */
export const sqrt = (result: Result<number, string>): Result<number, string> => {
  // TODO: .andThen() を使って実装してください
  throw new Error("TODO: .andThen() を使って実装してください");
};

/**
 * divide と sqrt を andThen で連鎖する
 * @hint divide(a, b).andThen(n => sqrt(ok(n))) のように連鎖できます
 */
export const divideAndSqrt = (a: number, b: number): Result<number, string> => {
  // TODO: divide() と sqrt() を andThen() で連鎖してください
  throw new Error("TODO: andThen で divide と sqrt を連鎖してください");
};
