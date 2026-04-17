import { Result } from "@praha/byethrow";

type AppError =
  | { _tag: "ValidationError"; field: string; message: string }
  | { _tag: "DuplicateError"; email: string }
  | { _tag: "DatabaseError"; cause: string };

type User = { id: string; name: string; email: string; age: number };
type UserInput = { name: string; email: string; age: number };

const existingEmails = new Set(["admin@example.com"]);

/**
 * ユーザー登録ワークフロー（byethrow版）
 *
 * 以下の処理を順番に実行してください:
 * 1. バリデーション（name: 3文字以上、email: @含む、age: 0-150）
 * 2. メール重複チェック（existingEmails に含まれる場合は DuplicateError）
 * 3. ユーザー保存（固定IDまたはcrypto.randomUUID()でIDを生成）
 *
 * @hint Result.fail({ _tag: "ValidationError", field: "name", message: "..." }) でバリデーションエラー
 * @hint async/await で各ステップを順番に実行し、Result.isFailure() でエラーチェック
 */
export const registerUser = async (input: UserInput): Result.ResultAsync<User, AppError> => {
  throw new Error("TODO: 3ステップのワークフローを実装してください");
};
