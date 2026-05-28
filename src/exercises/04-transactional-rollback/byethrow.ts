import type { Result } from "@praha/byethrow";

type User = { id: number; name: string };
type Account = { id: number; ownerId: number };

type AppError =
  | { type: "DuplicateError"; name: string }
  | { type: "NegativeDeposit"; amount: number };

// モジュールレベルのインメモリストア（副作用あり）
export const db = { users: [] as User[], accounts: [] as Account[] };

// テスト間でストアをリセットする
export const resetDb = (): void => {
  db.users.length = 0;
  db.accounts.length = 0;
};

// 現在のレコード数を返すヘルパー
export const getCounts = (): { users: number; accounts: number } => ({
  users: db.users.length,
  accounts: db.accounts.length,
});

/**
 * ユーザーを作成して db.users に追加する。name === "dup" のときは DuplicateError を返す。
 * @hint name === "dup" → Result.fail({ type: "DuplicateError", name }); それ以外は push して Result.succeed(user)
 * 実装するときは `import type { Result }` を `import { Result }` に変えて値として使うこと。
 */
export const createUser = (name: string): Result.Result<User, AppError> => {
  throw new Error(
    `TODO: name が "dup" なら DuplicateError、それ以外は db.users に追加して succeed を返す (name=${name})`,
  );
};

/**
 * アカウントを作成して db.accounts に追加する（常に成功する）。
 * @hint { id: db.accounts.length + 1, ownerId } を push して Result.succeed(account)
 */
export const createAccount = (ownerId: number): Result.Result<Account, AppError> => {
  throw new Error(`TODO: db.accounts に追加して Result.succeed を返す (ownerId=${ownerId})`);
};

/**
 * ユーザーとアカウントをトランザクション的に作成する。
 * いずれかのステップが失敗したら補償（ロールバック）して同じエラーを再返却する。
 * @hint const before = { u: db.users.length, a: db.accounts.length };
 *   Result.pipe(createUser(name), Result.andThen(...), Result.andThen(deposit 検証), Result.orElse(e => { rollback; return Result.fail(e); }))
 */
export const createUserWithAccount = (
  name: string,
  deposit: number,
): Result.Result<{ user: User; account: Account }, AppError> => {
  throw new Error(
    `TODO: createUser → createAccount → deposit 検証 → 失敗時ロールバック (name=${name}, deposit=${deposit})`,
  );
};
