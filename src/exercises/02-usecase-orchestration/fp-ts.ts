import type * as E from "fp-ts/Either";
import type * as TE from "fp-ts/TaskEither";

type User = { id: number; name: string };
type Account = { id: number; ownerId: number; balance: number };

type AppError =
  | { type: "ValidationError"; message: string }
  | { type: "DuplicateError"; name: string }
  | { type: "NegativeDeposit"; amount: number };

/**
 * ユーザーを登録する。バリデーション → 重複チェック → ユーザー生成 を E.chain でチェーンする。
 * name.length < 3 → ValidationError / name === "taken" → DuplicateError / それ以外 → { id: 1, name }
 * Either<E, A> は E が先・A が後。pipe(e, E.chain(...), E.chain(...)) で繋ぐ。
 * @hint pipe(validateName(name), E.chain(checkDuplicate), E.chain((n) => E.right({ id: 1, name: n })))
 * 実装するときは型のみの import を値の import に変えること。
 */
export const registerUser = (name: string): E.Either<AppError, User> => {
  throw new Error(
    `TODO: pipe + E.chain チェーンで validate → checkDuplicate → build を繋いでください (name=${name})`,
  );
};

/**
 * アカウントを開設する（同期）。registerUser で User を取得してから deposit を検証する。
 * deposit < 0 → NegativeDeposit / それ以外 → { id: 100, ownerId: user.id, balance: deposit }
 * @hint pipe(registerUser(name), E.chain((user) => deposit < 0 ? E.left(...) : E.right(...)))
 */
export const openAccount = (name: string, deposit: number): E.Either<AppError, Account> => {
  throw new Error(
    `TODO: pipe + E.chain で registerUser(${name}) に deposit=${deposit} を検証してください`,
  );
};

/**
 * アカウントを開設する（非同期）。TaskEither は () => Promise<Either> のサンク。
 * @hint pipe(TE.fromEither(registerUser(name)), TE.chain((user) => deposit < 0 ? TE.left(...) : TE.right(...)))
 * テストでは await fn(name, deposit)() のように呼び出す。
 */
export const openAccountAsync = (
  name: string,
  deposit: number,
): TE.TaskEither<AppError, Account> => {
  throw new Error(
    `TODO: TE.fromEither + TE.chain で registerUser(${name}) を TaskEither に変換し deposit=${deposit} を検証してください`,
  );
};
