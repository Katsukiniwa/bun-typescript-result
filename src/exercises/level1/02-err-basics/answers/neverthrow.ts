import { err, ok, type Result } from "neverthrow";

export const alwaysFail = (msg: string): Result<never, string> => err(msg);

export const failWithCode = (
  code: number,
  message: string,
): Result<never, { code: number; message: string }> => err({ code, message });

export const validatePositive = (n: number): Result<number, string> => {
  if (n <= 0) return err("正の数が必要です");
  return ok(n);
};
