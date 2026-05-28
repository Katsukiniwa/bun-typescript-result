import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";

type User = { id: number; name: string; email: string };

type RepoError = { type: "NotFound"; id: number } | { type: "ParseError"; message: string };

const USERS: Record<number, User> = {
  1: { id: 1, name: "Alice", email: "alice@example.com" },
  2: { id: 2, name: "Bob", email: "bob@example.com" },
};

// 見つからなければ throw する同期Repository（レガシー実装の想定）
export const rawFindUser = (id: number): User => {
  const user = USERS[id];
  if (!user) {
    throw new Error(`User ${id} not found`);
  }
  return user;
};

// reject する非同期Repository（外部API想定）
export const rawFetchUser = (id: number): Promise<User> => {
  const user = USERS[id];
  return user ? Promise.resolve(user) : Promise.reject(new Error(`User ${id} not found`));
};

// JSON.parse の throw を ParseError に変換する（Either<E, A> は E が先・A が後）
export const safeParseUser = (json: string): E.Either<RepoError, User> =>
  E.tryCatch(
    () => JSON.parse(json) as User,
    (e): RepoError => ({
      type: "ParseError",
      message: e instanceof Error ? e.message : String(e),
    }),
  );

// throw するレガシー関数を境界で Either 化する
export const findUser = (id: number): E.Either<RepoError, User> =>
  E.tryCatch(
    () => rawFindUser(id),
    (): RepoError => ({ type: "NotFound", id }),
  );

// 境界アダプタ + map の合成
export const getUserEmail = (id: number): E.Either<RepoError, string> =>
  pipe(
    findUser(id),
    E.map((user) => user.email),
  );

// reject する非同期を TaskEither 化する
export const fetchUser = (id: number): TE.TaskEither<RepoError, User> =>
  TE.tryCatch(
    () => rawFetchUser(id),
    (): RepoError => ({ type: "NotFound", id }),
  );
