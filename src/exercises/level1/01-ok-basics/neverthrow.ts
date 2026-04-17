import { type Result } from "neverthrow";

/**
 * 数値をResult型でラップする
 * @hint ok(n) を返してください
 */
export const wrapNumber = (n: number): Result<number, never> => {
  // TODO: 実装してください
  throw new Error("TODO: ok() を使って実装してください");
};

/**
 * 文字列をResult型でラップする
 */
export const wrapString = (s: string): Result<string, never> => {
  // TODO: 実装してください
  throw new Error("TODO: ok() を使って実装してください");
};

/**
 * オブジェクトをResult型でラップする
 */
export const wrapObject = (obj: {
  id: number;
  name: string;
}): Result<{ id: number; name: string }, never> => {
  // TODO: 実装してください
  throw new Error("TODO: ok() を使って実装してください");
};
