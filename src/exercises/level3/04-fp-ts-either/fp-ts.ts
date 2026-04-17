import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

// fp-ts Either<E, A> は E がエラー型、A が成功値型（neverthrow とは逆順！）
// Right = 成功（ok相当）、Left = エラー（err相当）

/**
 * 値を Right（成功）でラップする
 * @hint E.right(value) を使ってください
 */
export const wrapValue = <A>(value: A): E.Either<never, A> => {
  throw new Error("TODO: E.right(value) を使って実装してください");
};

/**
 * エラーを Left（失敗）でラップする
 * @hint E.left(error) を使ってください
 */
export const wrapError = <L>(error: L): E.Either<L, never> => {
  throw new Error("TODO: E.left(error) を使って実装してください");
};

/**
 * 数値を2倍にする（Right の場合のみ変換）
 * @hint pipe(result, E.map(n => n * 2)) を使ってください
 * @hint Left の場合は何もせずそのまま通過します
 */
export const double = (result: E.Either<string, number>): E.Either<string, number> => {
  throw new Error("TODO: pipe() と E.map() を使って実装してください");
};

/**
 * 文字列を整数に変換する
 * @hint pipe(E.right(s), E.chain(str => ...)) を使ってください
 * @hint Number.parseInt(str, 10) でパースし、NaN なら E.left("...") を返してください
 */
export const toInt = (s: string): E.Either<string, number> => {
  throw new Error("TODO: E.chain() を使って実装してください");
};

/**
 * バリデーション: 名前（3文字以上）とメール（@を含む）
 * @hint pipe() の中で E.chain() を2回使ってください
 * @hint 名前が短い場合は E.left("名前は3文字以上にしてください") を返してください
 * @hint メールが不正の場合は E.left("メールアドレスの形式が正しくありません") を返してください
 */
export const validateUser = (input: {
  name: string;
  email: string;
}): E.Either<string, { name: string; email: string }> => {
  throw new Error("TODO: pipe() と E.chain() を使って実装してください");
};
