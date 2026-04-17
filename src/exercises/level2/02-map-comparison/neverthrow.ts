import { type Result } from "neverthrow";

/**
 * 数値を2倍にする
 * @hint result.map(n => n * 2) を使ってください
 */
export const double = (result: Result<number, string>): Result<number, string> => {
  throw new Error("TODO: .map() を使って実装してください");
};

/**
 * 文字列を大文字にする
 */
export const toUpperCase = (result: Result<string, string>): Result<string, string> => {
  throw new Error("TODO: .map() を使って実装してください");
};
