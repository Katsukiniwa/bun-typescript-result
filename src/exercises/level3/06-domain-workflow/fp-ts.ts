import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

type AppError =
  | { _tag: "ValidationError"; field: string; message: string }
  | { _tag: "DuplicateError"; email: string }
  | { _tag: "DatabaseError"; cause: string };

type User = { id: string; name: string; email: string; age: number };
type UserInput = { name: string; email: string; age: number };

const existingEmails = new Set(["admin@example.com"]);

/**
 * ユーザー登録ワークフロー（fp-ts版）
 *
 * 以下の処理を順番に実行してください:
 * 1. バリデーション（name: 3文字以上、email: @含む、age: 0-150）
 * 2. メール重複チェック（existingEmails に含まれる場合は DuplicateError）
 * 3. ユーザー保存（固定IDでユーザーを生成）
 *
 * @hint TE.left({ _tag: "ValidationError", ... }) でバリデーションエラー
 * @hint pipe(validateInput(input), TE.chain(checkDuplicate), TE.chain(saveUser)) で連鎖
 * @note registerUser は TaskEither を返すので、実行するには await registerUser(input)() と末尾に () が必要
 */
export const registerUser = (input: UserInput): TE.TaskEither<AppError, User> => {
  throw new Error("TODO: pipe() と TE.chain() を使って3ステップのワークフローを実装してください");
};
