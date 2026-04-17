import { Result } from "@praha/byethrow";

/**
 * 数値を2倍にする
 * @hint Result.pipe(result, Result.map(n => n * 2)) を使ってください
 * @note byethrow の map はカリー化されています: Result.map(fn) は変換関数を受け取り、(result) => result を返します
 */
export const double = (result: Result.Result<number, string>): Result.Result<number, string> => {
  throw new Error("TODO: Result.pipe() と Result.map() を使って実装してください");
};

/**
 * 文字列を大文字にする
 */
export const toUpperCase = (result: Result.Result<string, string>): Result.Result<string, string> => {
  throw new Error("TODO: Result.pipe() と Result.map() を使って実装してください");
};
