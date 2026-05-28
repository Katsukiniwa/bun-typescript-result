import { Result } from "@praha/byethrow";

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

// JSON.parse の throw を ParseError に変換する
export const safeParseUser = (json: string): Result.Result<User, RepoError> =>
  Result.try({
    try: (): User => JSON.parse(json) as User,
    catch: (e): RepoError => ({
      type: "ParseError",
      message: e instanceof Error ? e.message : String(e),
    }),
  });

// throw するレガシー関数を境界で Result 化する
export const findUser = (id: number): Result.Result<User, RepoError> =>
  Result.try({
    try: (): User => rawFindUser(id),
    catch: (): RepoError => ({ type: "NotFound", id }),
  });

// 境界アダプタ + map の合成（byethrow はカリー化 + pipe）
export const getUserEmail = (id: number): Result.Result<string, RepoError> =>
  Result.pipe(
    findUser(id),
    Result.map((user: User) => user.email),
  );

// reject する非同期を ResultAsync 化する（try が async を返すと ResultAsync になる）
export const fetchUser = (id: number): Result.ResultAsync<User, RepoError> =>
  Result.try({
    try: () => rawFetchUser(id),
    catch: (): RepoError => ({ type: "NotFound", id }),
  });
