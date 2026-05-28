import type * as E from "fp-ts/Either";
import type * as TE from "fp-ts/TaskEither";

// 実装するときは以下も追加: import * as A from "fp-ts/Array"; import { pipe } from "fp-ts/function";

type AppError = { type: "ParseError"; input: string };

/**
 * 文字列を数値にパースする。NaN なら ParseError を返す（Either<E, A> は E が先・A が後）。
 * @hint E.left({ type: "ParseError", input: raw }) / E.right(n)
 * 実装するときは import type を値の import（import * as E from "fp-ts/Either" 等）に変えること。
 */
export const parseOne = (raw: string): E.Either<AppError, number> => {
  throw new Error(`TODO: Number(raw) でパースし NaN なら E.left を返してください (raw=${raw})`);
};

/**
 * 全要素をパースし、成功と失敗に分離する（パーシャル失敗許容）。
 * @hint pipe(raws, A.partitionMap(parseOne)) → { left, right }
 */
export const partition = (raws: string[]): { ok: number[]; errors: AppError[] } => {
  throw new Error(
    `TODO: A.partitionMap(parseOne) で Left/Right に振り分けてください (raws.length=${raws.length})`,
  );
};

/**
 * 全要素のパースが成功した場合のみ Right を返す（all-or-nothing）。
 * @hint pipe(raws, A.traverse(E.Applicative)(parseOne))
 */
export const combineAll = (raws: string[]): E.Either<AppError, number[]> => {
  throw new Error(
    `TODO: A.traverse(E.Applicative)(parseOne) で全件を合成してください (raws.length=${raws.length})`,
  );
};

/**
 * 全要素を並列非同期でパースし、全成功なら Right を返す（all-or-nothing）。
 * @hint pipe(raws, A.traverse(TE.ApplicativePar)(raw => TE.fromEither(parseOne(raw))))
 */
export const combineAllAsync = (raws: string[]): TE.TaskEither<AppError, number[]> => {
  throw new Error(
    `TODO: A.traverse(TE.ApplicativePar) で並列合成してください (raws.length=${raws.length})`,
  );
};
