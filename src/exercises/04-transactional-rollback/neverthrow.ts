import type { Result } from "neverthrow";

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
 * @hint name === "dup" → err({ type: "DuplicateError", name }); それ以外は { id: db.users.length + 1, name } を push して ok(user)
 */
export const createUser = (name: string): Result<User, AppError> => {
  throw new Error(
    `TODO: name が "dup" なら DuplicateError、それ以外は db.users に追加して ok を返す (name=${name})`,
  );
};

/**
 * アカウントを作成して db.accounts に追加する（常に成功する）。
 * @hint { id: db.accounts.length + 1, ownerId } を push して ok(account)
 */
export const createAccount = (ownerId: number): Result<Account, AppError> => {
  throw new Error(`TODO: db.accounts に追加して ok を返す (ownerId=${ownerId})`);
};

/**
 * ユーザーとアカウントをトランザクション的に作成する。
 * いずれかのステップが失敗したら補償（ロールバック）して同じエラーを再返却する。
 * @hint const before = { u: db.users.length, a: db.accounts.length };
 *   createUser(name).andThen(...).andThen(deposit 検証).orElse(e => { rollback; return err(e); })
 */
export const createUserWithAccount = (
  name: string,
  deposit: number,
): Result<{ user: User; account: Account }, AppError> => {
  throw new Error(
    `TODO: createUser → createAccount → deposit 検証 → 失敗時ロールバック (name=${name}, deposit=${deposit})`,
  );
};
