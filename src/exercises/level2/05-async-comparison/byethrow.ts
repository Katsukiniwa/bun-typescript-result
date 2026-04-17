import { Result } from "@praha/byethrow";

type User = { id: string; name: string };
type AppError = { type: "NotFoundError"; id: string } | { type: "DatabaseError"; message: string };

const mockDb: Record<string, User> = {
  "1": { id: "1", name: "Alice" },
  "2": { id: "2", name: "Bob" },
};

/**
 * IDでユーザーを取得する
 * @hint Result.fn({ try: async (id) => ..., catch: (e) => ... }) を使ってください
 * @note Result.fn は Promise<Result.Result<T,E>> を返します
 * @note ユーザーが存在しない場合は throw でエラーを投げ、catch でキャッチしてください
 */
export const fetchUser = (id: string): Result.ResultAsync<User, AppError> => {
  throw new Error("TODO: Result.fn() を使って実装してください");
};
