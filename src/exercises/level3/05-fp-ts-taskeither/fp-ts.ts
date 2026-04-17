import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

type User = { id: string; name: string };
type AppError = { type: "NotFoundError"; id: string } | { type: "DatabaseError"; message: string };

const mockDb: Record<string, User> = {
  "1": { id: "1", name: "Alice" },
  "2": { id: "2", name: "Bob" },
};

/**
 * IDでユーザーを取得する（非同期）
 * @hint TE.tryCatch(tryFn, catchFn) を使ってください
 * @hint tryFn の中で mockDb[id] が undefined なら throw してください
 * @hint catchFn は throw された値を AppError に変換してください
 * @note TaskEither は「関数」です。実行するには await fetchUser("1")() と末尾に () が必要です
 */
export const fetchUser = (id: string): TE.TaskEither<AppError, User> => {
  throw new Error("TODO: TE.tryCatch() を使って実装してください");
};

/**
 * ユーザーIDからユーザーを取得してメッセージを生成する
 * @hint pipe(fetchUser(id), TE.map(user => `こんにちは、${user.name}さん！`)) を使ってください
 */
export const fetchUserMessage = (id: string): TE.TaskEither<AppError, string> => {
  throw new Error("TODO: pipe() と TE.map() を使って実装してください");
};
