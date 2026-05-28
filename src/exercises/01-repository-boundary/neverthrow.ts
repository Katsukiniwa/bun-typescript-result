import type { Result, ResultAsync } from "neverthrow";

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
 * JSON.parse の throw を ParseError に変換して返す。
 * @hint fromThrowable(() => JSON.parse(json) as User, (e) => ({ ... }))() のように生成した関数を即時実行する
 */
export const safeParseUser = (json: string): Result<User, RepoError> => {
  throw new Error(
    `TODO: fromThrowable で JSON.parse を ParseError に変換してください (input=${json})`,
  );
};

/**
 * throw する rawFindUser を境界で Result 化する。
 * @hint fromThrowable で包み、catch 側で { type: "NotFound", id } を返す
 */
export const findUser = (id: number): Result<User, RepoError> => {
  throw new Error(`TODO: fromThrowable で rawFindUser(${id}) を包み NotFound に変換してください`);
};

/**
 * findUser の成功値から email だけを取り出す。
 * @hint findUser(id).map(...)
 */
export const getUserEmail = (id: number): Result<string, RepoError> => {
  throw new Error(`TODO: findUser(${id}) を .map で email に変換してください`);
};

/**
 * reject する rawFetchUser を ResultAsync 化する。
 * @hint fromPromise(rawFetchUser(id), (e) => ({ type: "NotFound", id }))
 */
export const fetchUser = (id: number): ResultAsync<User, RepoError> => {
  throw new Error(`TODO: fromPromise で rawFetchUser(${id}) を包んでください`);
};
