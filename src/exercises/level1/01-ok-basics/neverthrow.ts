import { ok, Result } from "neverthrow";

/**
 * 数値をResult型でラップする
 * @hint ok(n) を返してください
 */
export const wrapNumber = (n: number): Result<number, never> => {
  return ok(n);
};

/**
 * 文字列をResult型でラップする
 */
export const wrapString = (s: string): Result<string, never> => {
  return ok(s);
};

/**
 * オブジェクトをResult型でラップする
 */
export const wrapObject = (obj: {
  id: number;
  name: string;
}): Result<{ id: number; name: string }, never> => {
  return ok(obj);
};
