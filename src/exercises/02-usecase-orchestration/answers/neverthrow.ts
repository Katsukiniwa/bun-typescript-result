import { err, errAsync, ok, okAsync, type Result, type ResultAsync } from "neverthrow";

type User = { id: number; name: string };
type Account = { id: number; ownerId: number; balance: number };

type AppError =
  | { type: "ValidationError"; message: string }
  | { type: "DuplicateError"; name: string }
  | { type: "NegativeDeposit"; amount: number };

// 名前のバリデーション: 3文字未満は ValidationError
const validateName = (name: string): Result<string, AppError> =>
  name.length < 3
    ? err({ type: "ValidationError", message: `名前は3文字以上必要です: "${name}"` })
    : ok(name);

// 重複チェック: "taken" は DuplicateError
const checkDuplicate = (name: string): Result<string, AppError> =>
  name === "taken" ? err({ type: "DuplicateError", name }) : ok(name);

// ユーザー登録: ROP チェーンで validate → checkDuplicate → build
export const registerUser = (name: string): Result<User, AppError> =>
  validateName(name)
    .andThen(checkDuplicate)
    .andThen((n) => ok({ id: 1, name: n }));

// アカウント開設（同期）: registerUser → 残高チェック → Account 生成
export const openAccount = (name: string, deposit: number): Result<Account, AppError> =>
  registerUser(name).andThen((user) =>
    deposit < 0
      ? err<Account, AppError>({ type: "NegativeDeposit", amount: deposit })
      : ok<Account, AppError>({ id: 100, ownerId: user.id, balance: deposit }),
  );

// アカウント開設（非同期）: 同じロジックを ResultAsync で包む
export const openAccountAsync = (name: string, deposit: number): ResultAsync<Account, AppError> => {
  const result = openAccount(name, deposit);
  return result.isOk() ? okAsync(result.value) : errAsync(result.error);
};
