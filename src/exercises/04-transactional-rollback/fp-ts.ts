import type * as E from "fp-ts/Either";

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
 * Either<E, A> は E が先・A が後。
 * @hint name === "dup" → E.left({ type: "DuplicateError", name }); それ以外は push して E.right(user)
 * 実装するときは型のみ import を値の import（import * as E from "fp-ts/Either"）に変えること。
 */
export const createUser = (name: string): E.Either<AppError, User> => {
  throw new Error(
    `TODO: name が "dup" なら E.left(DuplicateError)、それ以外は db.users に追加して E.right を返す (name=${name})`,
  );
};

/**
 * アカウントを作成して db.accounts に追加する（常に成功する）。
 * @hint { id: db.accounts.length + 1, ownerId } を push して E.right(account)
 */
export const createAccount = (ownerId: number): E.Either<AppError, Account> => {
  throw new Error(`TODO: db.accounts に追加して E.right を返す (ownerId=${ownerId})`);
};

/**
 * ユーザーとアカウントをトランザクション的に作成する。
 * いずれかのステップが失敗したら補償（ロールバック）して同じエラーを再返却する。
 * @hint const before = { u: db.users.length, a: db.accounts.length };
 *   pipe(createUser(name), E.chain(...), E.chain(deposit 検証), E.orElse(e => { rollback; return E.left(e); }))
 */
export const createUserWithAccount = (
  name: string,
  deposit: number,
): E.Either<AppError, { user: User; account: Account }> => {
  throw new Error(
    `TODO: createUser → createAccount → deposit 検証 → 失敗時ロールバック (name=${name}, deposit=${deposit})`,
  );
};
