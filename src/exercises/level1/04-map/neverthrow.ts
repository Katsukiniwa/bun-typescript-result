import { err, ok, type Result } from "neverthrow";

/**
 * Resultの数値を2倍にする
 * @hint result.map(n => n * 2) の形で使います
 */
export const double = (result: Result<number, string>): Result<number, string> => {
  return result.map(n => n * 2);
};

/**
 * Resultの文字列を大文字にする
 */
export const toUpperCase = (result: Result<string, string>): Result<string, string> => {
  return result.map(s => s.toUpperCase());
};

/**
 * Resultの文字列にprefixを追加する
 * @hint クロージャでprefixを参照できます
 */
export const addPrefix = (
  result: Result<string, string>,
  prefix: string,
): Result<string, string> => {
  return result.map(s => prefix + s);
};

/**
 * Result内の文字列をparseIntする
 * 変換できない場合はErrを返す
 * @hint .map() の中でandThen相当の処理をするか、
 *       数値チェックをして err() を返す方法を考えましょう
 * @hint Number.isNaN(parseInt("abc")) === true です
 */
export const parseNumber = (result: Result<string, string>): Result<number, string> => {
  return result.andThen((s) => {
    const n = parseInt(s, 10);
    return Number.isNaN(n) ? err("数値に変換できません") : ok(n);
  });
};
