import type { Result } from "@praha/byethrow";

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
 * @hint Result.try({ try: () => JSON.parse(json) as User, catch: (e) => ({ ... }) })
 * 実装するときは `import type { Result }` を `import { Result }` に変えて値として使うこと。
 */
export const safeParseUser = (json: string): Result.Result<User, RepoError> => {
  throw new Error(
    `TODO: Result.try で JSON.parse を ParseError に変換してください (input=${json})`,
  );
};

/**
 * throw する rawFindUser を境界で Result 化する。
 * @hint Result.try で包み、catch 側で { type: "NotFound", id } を返す
 */
export const findUser = (id: number): Result.Result<User, RepoError> => {
  throw new Error(`TODO: Result.try で rawFindUser(${id}) を包み NotFound に変換してください`);
};

/**
 * findUser の成功値から email だけを取り出す。
 * @hint Result.pipe(findUser(id), Result.map((user) => user.email))
 */
export const getUserEmail = (id: number): Result.Result<string, RepoError> => {
  throw new Error(
    `TODO: Result.pipe + Result.map で findUser(${id}) から email を取り出してください`,
  );
};

/**
 * reject する rawFetchUser を ResultAsync 化する（try が async を返すと ResultAsync になる）。
 * @hint Result.try({ try: () => rawFetchUser(id), catch: (e) => ({ ... }) })
 */
export const fetchUser = (id: number): Result.ResultAsync<User, RepoError> => {
  throw new Error(`TODO: Result.try で async な rawFetchUser(${id}) を包んでください`);
};
