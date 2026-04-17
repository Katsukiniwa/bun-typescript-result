import { errAsync, fromSafePromise, okAsync, type ResultAsync } from "neverthrow";

type AppError =
  | { _tag: "ValidationError"; field: string; message: string }
  | { _tag: "DuplicateError"; email: string }
  | { _tag: "DatabaseError"; cause: string };

type User = { id: string; name: string; email: string; age: number };
type UserInput = { name: string; email: string; age: number };

const existingEmails = new Set(["admin@example.com"]);

/**
 * ユーザー登録ワークフロー（neverthrow版）
 *
 * 以下の処理を順番に実行してください:
 * 1. バリデーション（name: 3文字以上、email: @含む、age: 0-150）
 * 2. メール重複チェック（existingEmails に含まれる場合は DuplicateError）
 * 3. ユーザー保存（crypto.randomUUID() でIDを生成）
 *
 * @hint errAsync({ _tag: "ValidationError", field: "name", message: "..." }) でバリデーションエラー
 * @hint .andThen() でステップを連鎖してください
 * @hint fromSafePromise(Promise.resolve({ id: crypto.randomUUID(), ...input })) で保存
 */
export const registerUser = (input: UserInput): ResultAsync<User, AppError> => {
  throw new Error("TODO: 3ステップのワークフローを実装してください");
};
