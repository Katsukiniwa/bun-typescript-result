import { err, ok, type Result } from "neverthrow";

/**
 * 文字列を整数に変換する（変換できない場合はErr）
 * @hint ok() と err() で結果を作り、andThen() でチェーンしてください
 */
export const parseInt_ = (s: string): Result<number, string> => {
  throw new Error("TODO: ok() と err() と .andThen() を使って実装してください");
};

/**
 * 正の数のみ受け付ける（負の数はErr）
 * @hint result.andThen(n => n > 0 ? ok(n) : err(...)) を使ってください
 */
export const requirePositive = (result: Result<number, string>): Result<number, string> => {
  throw new Error("TODO: .andThen() を使って実装してください");
};
