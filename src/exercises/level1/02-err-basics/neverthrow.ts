import { err, ok, type Result } from "neverthrow";

/**
 * 常に失敗Resultを返す
 * @hint err(msg) を返してください
 */
export const alwaysFail = (msg: string): Result<never, string> => {
  return err(msg);
};

/**
 * コードとメッセージを持つエラーで失敗する
 * @hint err({ code, message }) のようにオブジェクトを渡せます
 */
export const failWithCode = (
  code: number,
  message: string,
): Result<never, { code: number; message: string }> => {
  return err({ code, message });
};

/**
 * 正の数なら成功、0以下なら失敗
 * @hint if で分岐して ok() と err() を使い分けましょう
 */
export const validatePositive = (n: number): Result<number, string> => {
  if (n > 0) {
    return ok(n);
  } else {
    return err("正の数が必要です");
  }
};
