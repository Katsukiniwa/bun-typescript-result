import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

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

// "dup" は重複エラー、それ以外は db.users に追加して返す（Either<E, A> は E が先・A が後）
export const createUser = (name: string): E.Either<AppError, User> => {
  if (name === "dup") {
    return E.left({ type: "DuplicateError", name });
  }
  const user: User = { id: db.users.length + 1, name };
  db.users.push(user);
  return E.right(user);
};

// 常に成功し db.accounts に追加して返す
export const createAccount = (ownerId: number): E.Either<AppError, Account> => {
  const account: Account = { id: db.accounts.length + 1, ownerId };
  db.accounts.push(account);
  return E.right(account);
};

// ユーザー作成 → アカウント作成 → deposit 検証を連鎖し、失敗時はロールバックする
export const createUserWithAccount = (
  name: string,
  deposit: number,
): E.Either<AppError, { user: User; account: Account }> => {
  // 開始時点のサイズを記録しておくことでロールバック先を決める
  const before = { u: db.users.length, a: db.accounts.length };

  return pipe(
    createUser(name),
    E.chain((user) =>
      pipe(
        createAccount(user.id),
        E.map((account) => ({ user, account })),
      ),
    ),
    E.chain(({ user, account }) =>
      deposit < 0
        ? E.left({ type: "NegativeDeposit", amount: deposit } as AppError)
        : E.right({ user, account }),
    ),
    E.orElse((e) => {
      // 補償: 書き込み済みのレコードを切り捨てて元に戻す
      db.users.length = before.u;
      db.accounts.length = before.a;
      return E.left(e);
    }),
  );
};
