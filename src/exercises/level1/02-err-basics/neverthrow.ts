import { type Result } from "neverthrow";

/**
 * 常に失敗Resultを返す
 * @hint err(msg) を返してください
 */
export const alwaysFail = (msg: string): Result<never, string> => {
  // TODO: 実装してください
  throw new Error("TODO: err() を使って実装してください");
};

/**
 * コードとメッセージを持つエラーで失敗する
 * @hint err({ code, message }) のようにオブジェクトを渡せます
 */
export const failWithCode = (
  code: number,
  message: string,
): Result<never, { code: number; message: string }> => {
  // TODO: 実装してください
  throw new Error("TODO: err() を使って実装してください");
};

/**
 * 正の数なら成功、0以下なら失敗
 * @hint if で分岐して ok() と err() を使い分けましょう
 */
export const validatePositive = (n: number): Result<number, string> => {
  // TODO: 実装してください
  throw new Error("TODO: ok() / err() を条件分岐して使ってください");
};
