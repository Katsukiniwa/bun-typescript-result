import { Result } from "@praha/byethrow";

type User = { id: number; name: string };
type Account = { id: number; ownerId: number; balance: number };

type AppError =
  | { type: "ValidationError"; message: string }
  | { type: "DuplicateError"; name: string }
  | { type: "NegativeDeposit"; amount: number };

// 名前のバリデーション: 3文字未満は ValidationError
const validateName = (name: string): Result.Result<string, AppError> =>
  name.length < 3
    ? Result.fail({ type: "ValidationError", message: `名前は3文字以上必要です: "${name}"` })
    : Result.succeed(name);

// 重複チェック: "taken" は DuplicateError
const checkDuplicate = (name: string): Result.Result<string, AppError> =>
  name === "taken" ? Result.fail({ type: "DuplicateError", name }) : Result.succeed(name);

// ユーザー登録: ROP チェーンで validate → checkDuplicate → build
export const registerUser = (name: string): Result.Result<User, AppError> =>
  Result.pipe(
    validateName(name),
    Result.andThen(checkDuplicate),
    Result.andThen((n): Result.Result<User, AppError> => Result.succeed({ id: 1, name: n })),
  );

// アカウント開設（同期）: registerUser → 残高チェック → Account 生成
export const openAccount = (name: string, deposit: number): Result.Result<Account, AppError> =>
  Result.pipe(
    registerUser(name),
    Result.andThen(
      (user): Result.Result<Account, AppError> =>
        deposit < 0
          ? Result.fail({ type: "NegativeDeposit", amount: deposit })
          : Result.succeed({ id: 100, ownerId: user.id, balance: deposit }),
    ),
  );

// アカウント開設（非同期）: async 関数として同じロジックを ResultAsync で返す
export const openAccountAsync = async (
  name: string,
  deposit: number,
): Promise<Result.Result<Account, AppError>> => {
  return openAccount(name, deposit);
};
