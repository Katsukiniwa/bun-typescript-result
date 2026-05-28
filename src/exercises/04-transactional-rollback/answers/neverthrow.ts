import { err, ok, type Result } from "neverthrow";

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

// "dup" は重複エラー、それ以外は db.users に追加して返す
export const createUser = (name: string): Result<User, AppError> => {
  if (name === "dup") {
    return err({ type: "DuplicateError", name });
  }
  const user: User = { id: db.users.length + 1, name };
  db.users.push(user);
  return ok(user);
};

// 常に成功し db.accounts に追加して返す
export const createAccount = (ownerId: number): Result<Account, AppError> => {
  const account: Account = { id: db.accounts.length + 1, ownerId };
  db.accounts.push(account);
  return ok(account);
};

// ユーザー作成 → アカウント作成 → deposit 検証を連鎖し、失敗時はロールバックする
export const createUserWithAccount = (
  name: string,
  deposit: number,
): Result<{ user: User; account: Account }, AppError> => {
  // 開始時点のサイズを記録しておくことでロールバック先を決める
  const before = { u: db.users.length, a: db.accounts.length };

  return createUser(name)
    .andThen((user) => createAccount(user.id).map((account) => ({ user, account })))
    .andThen(({ user, account }) =>
      deposit < 0
        ? err({ type: "NegativeDeposit", amount: deposit } as AppError)
        : ok({ user, account }),
    )
    .orElse((e) => {
      // 補償: 書き込み済みのレコードを切り捨てて元に戻す
      db.users.length = before.u;
      db.accounts.length = before.a;
      return err(e);
    });
};
