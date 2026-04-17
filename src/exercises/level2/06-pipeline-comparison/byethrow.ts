import { Result } from "@praha/byethrow";

type AppError =
  | { type: "ValidationError"; message: string }
  | { type: "DuplicateError"; email: string }
  | { type: "DatabaseError"; message: string };

type User = { id: string; name: string; email: string };

const validateInput = Result.fn({
  try: async (input: { name: string; email: string }) => {
    if (input.name.length < 3) throw { type: "ValidationError", message: "名前は3文字以上" } as AppError;
    if (!input.email.includes("@")) throw { type: "ValidationError", message: "メール形式が不正" } as AppError;
    return input;
  },
  catch: (e: unknown): AppError =>
    typeof e === "object" && e !== null && "type" in e
      ? (e as AppError)
      : { type: "DatabaseError", message: String(e) },
});

const checkDuplicate = Result.fn({
  try: async (input: { name: string; email: string }) => {
    if (input.email === "alice@test.com") throw { type: "DuplicateError", email: input.email } as AppError;
    return input;
  },
  catch: (e: unknown): AppError =>
    typeof e === "object" && e !== null && "type" in e
      ? (e as AppError)
      : { type: "DatabaseError", message: String(e) },
});

const saveUser = Result.fn({
  try: async (input: { name: string; email: string }): Promise<User> => ({ id: "new-id", ...input }),
  catch: (e: unknown): AppError => ({ type: "DatabaseError", message: String(e) }),
});

/**
 * ユーザー登録パイプライン
 * @hint await で各ステップの Result を取り出し、Result.isFailure() でエラーチェックしてください
 * @note byethrow の ResultAsync は Promise<Result.Result<T,E>> なので await が必要です
 */
export const registerUser = async (name: string, email: string): Result.ResultAsync<User, AppError> => {
  throw new Error("TODO: await + Result.isFailure() を使ったパイプラインを実装してください");
};
