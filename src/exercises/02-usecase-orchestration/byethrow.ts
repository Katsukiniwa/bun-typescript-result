import type { Result } from "@praha/byethrow";

type User = { id: number; name: string };
type Account = { id: number; ownerId: number; balance: number };

type AppError =
  | { type: "ValidationError"; message: string }
  | { type: "DuplicateError"; name: string }
  | { type: "NegativeDeposit"; amount: number };

/**
 * ユーザーを登録する。バリデーション → 重複チェック → ユーザー生成 を andThen でチェーンする。
 * name.length < 3 → ValidationError / name === "taken" → DuplicateError / それ以外 → { id: 1, name }
 * @hint Result.pipe(validateName(name), Result.andThen(...), Result.andThen(...))
 * 実装するときは `import type { Result }` を `import { Result }` に変えて値として使うこと。
 */
export const registerUser = (name: string): Result.Result<User, AppError> => {
  throw new Error(
    `TODO: Result.pipe + Result.andThen チェーンで validate → checkDuplicate → build を繋いでください (name=${name})`,
  );
};

/**
 * アカウントを開設する（同期）。registerUser で User を取得してから deposit を検証する。
 * deposit < 0 → NegativeDeposit / それ以外 → { id: 100, ownerId: user.id, balance: deposit }
 * @hint Result.pipe(registerUser(name), Result.andThen((user) => deposit < 0 ? Result.fail(...) : Result.succeed(...)))
 */
export const openAccount = (name: string, deposit: number): Result.Result<Account, AppError> => {
  throw new Error(
    `TODO: Result.pipe + Result.andThen で registerUser(${name}) に deposit=${deposit} を検証してください`,
  );
};

/**
 * アカウントを開設する（非同期）。openAccount と同じロジックを async 関数で ResultAsync として返す。
 * @hint async 関数内で openAccount を呼び出し Promise<Result.Result<...>> を返す
 */
export const openAccountAsync = async (
  name: string,
  deposit: number,
): Promise<Result.Result<Account, AppError>> => {
  throw new Error(
    `TODO: async 関数で openAccount(${name}, ${deposit}) を呼び出して Promise<Result.Result<...>> を返してください`,
  );
};
