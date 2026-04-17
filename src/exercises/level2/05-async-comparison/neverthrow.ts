import { type ResultAsync, errAsync, fromPromise } from "neverthrow";

type User = { id: string; name: string };
type AppError = { type: "NotFoundError"; id: string } | { type: "DatabaseError"; message: string };

const mockDb: Record<string, User> = {
  "1": { id: "1", name: "Alice" },
  "2": { id: "2", name: "Bob" },
};

/**
 * IDでユーザーを取得する
 * @hint ユーザーが存在しない場合は errAsync({ type: "NotFoundError", id }) を返してください
 * @hint ユーザーが存在する場合は fromPromise(Promise.resolve(user), errorMapper) を使ってください
 */
export const fetchUser = (id: string): ResultAsync<User, AppError> => {
  throw new Error("TODO: fromPromise() を使って実装してください");
};
