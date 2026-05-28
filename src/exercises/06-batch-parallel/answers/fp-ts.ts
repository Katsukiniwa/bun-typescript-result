import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";

type AppError = { type: "ParseError"; input: string };

// 文字列を数値にパースし、NaN なら ParseError を返す（Either<E, A> は E が先・A が後）
export const parseOne = (raw: string): E.Either<AppError, number> => {
  const n = Number(raw);
  return Number.isNaN(n) ? E.left({ type: "ParseError", input: raw }) : E.right(n);
};

// パーシャル失敗を許容して成功と失敗を分離する（partitionMap で Left/Right に振り分け）
export const partition = (raws: string[]): { ok: number[]; errors: AppError[] } => {
  const { left, right } = pipe(raws, A.partitionMap(parseOne));
  return { ok: right, errors: left };
};

// 全件成功しなければ最初のエラーで止める（A.traverse で短絡）
export const combineAll = (raws: string[]): E.Either<AppError, number[]> => {
  return pipe(raws, A.traverse(E.Applicative)(parseOne));
};

// 並列非同期版の all-or-nothing（TaskEither.ApplicativePar で並列実行）
export const combineAllAsync = (raws: string[]): TE.TaskEither<AppError, number[]> => {
  return pipe(
    raws,
    A.traverse(TE.ApplicativePar)((raw) => TE.fromEither(parseOne(raw))),
  );
};
