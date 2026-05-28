import type { Result, ResultAsync } from "neverthrow";

type User = { id: number; name: string };
type Account = { id: number; ownerId: number; balance: number };

type AppError =
  | { type: "ValidationError"; message: string }
  | { type: "DuplicateError"; name: string }
  | { type: "NegativeDeposit"; amount: number };

/**
 * ユーザーを登録する。バリデーション → 重複チェック → ユーザー生成 を andThen でチェーンする。
 * name.length < 3 → ValidationError / name === "taken" → DuplicateError / それ以外 → { id: 1, name }
 * @hint ok(name).andThen(...).andThen(...) のように ROP チェーンで実装する
 */
export const registerUser = (name: string): Result<User, AppError> => {
  throw new Error(
    `TODO: andThen チェーンで validate → checkDuplicate → build を繋いでください (name=${name})`,
  );
};

/**
 * アカウントを開設する（同期）。registerUser で User を取得してから deposit を検証する。
 * deposit < 0 → NegativeDeposit / それ以外 → { id: 100, ownerId: user.id, balance: deposit }
 * @hint registerUser(name).andThen((user) => deposit < 0 ? err(...) : ok(...))
 */
export const openAccount = (name: string, deposit: number): Result<Account, AppError> => {
  throw new Error(
    `TODO: registerUser(${name}) に andThen で deposit=${deposit} を検証してください`,
  );
};

/**
 * アカウントを開設する（非同期）。openAccount と同じロジックを ResultAsync で返す。
 * @hint okAsync / errAsync で openAccount の結果を ResultAsync に変換する
 */
export const openAccountAsync = (name: string, deposit: number): ResultAsync<Account, AppError> => {
  throw new Error(
    `TODO: openAccount(${name}, ${deposit}) の結果を okAsync/errAsync で ResultAsync に変換してください`,
  );
};
