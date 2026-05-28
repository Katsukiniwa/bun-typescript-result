import type * as E from "fp-ts/Either";
import type * as TE from "fp-ts/TaskEither";

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

/**
 * JSON.parse の throw を ParseError に変換して返す（Either<E, A> は E が先・A が後）。
 * @hint E.tryCatch(() => JSON.parse(json) as User, (e) => ({ ... }))
 * 実装するときは型のみの import を値の import（import * as E from "fp-ts/Either" 等）に変えること。
 */
export const safeParseUser = (json: string): E.Either<RepoError, User> => {
  throw new Error(
    `TODO: E.tryCatch で JSON.parse を ParseError に変換してください (input=${json})`,
  );
};

/**
 * throw する rawFindUser を境界で Either 化する。
 * @hint E.tryCatch(() => rawFindUser(id), () => ({ type: "NotFound", id }))
 */
export const findUser = (id: number): E.Either<RepoError, User> => {
  throw new Error(`TODO: E.tryCatch で rawFindUser(${id}) を包み NotFound に変換してください`);
};

/**
 * findUser の成功値から email だけを取り出す。
 * @hint pipe(findUser(id), E.map((user) => user.email))
 */
export const getUserEmail = (id: number): E.Either<RepoError, string> => {
  throw new Error(`TODO: pipe + E.map で findUser(${id}) から email を取り出してください`);
};

/**
 * reject する rawFetchUser を TaskEither 化する。
 * @hint TE.tryCatch(() => rawFetchUser(id), () => ({ type: "NotFound", id }))
 */
export const fetchUser = (id: number): TE.TaskEither<RepoError, User> => {
  throw new Error(`TODO: TE.tryCatch で rawFetchUser(${id}) を包んでください`);
};
