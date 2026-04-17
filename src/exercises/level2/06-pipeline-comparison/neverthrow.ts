import { type ResultAsync, errAsync, fromPromise, okAsync } from "neverthrow";

type AppError =
  | { type: "ValidationError"; message: string }
  | { type: "DuplicateError"; email: string }
  | { type: "DatabaseError"; message: string };

type User = { id: string; name: string; email: string };

const validateInput = (name: string, email: string): ResultAsync<{ name: string; email: string }, AppError> => {
  if (name.length < 3) return errAsync({ type: "ValidationError", message: "名前は3文字以上" });
  if (!email.includes("@")) return errAsync({ type: "ValidationError", message: "メール形式が不正" });
  return okAsync({ name, email });
};

const checkDuplicate = (input: { name: string; email: string }): ResultAsync<typeof input, AppError> =>
  input.email === "alice@test.com"
    ? errAsync({ type: "DuplicateError", email: input.email })
    : okAsync(input);

const saveUser = (input: { name: string; email: string }): ResultAsync<User, AppError> =>
  fromPromise(
    Promise.resolve({ id: "new-id", ...input }),
    (e) => ({ type: "DatabaseError", message: String(e) }),
  );

/**
 * ユーザー登録パイプライン
 * @hint validateInput(...).andThen(checkDuplicate).andThen(saveUser) のようにチェーンしてください
 * @note ResultAsync も .andThen() でチェーンできます
 */
export const registerUser = (name: string, email: string): ResultAsync<User, AppError> => {
  throw new Error("TODO: ResultAsync の .andThen() チェーンを使って実装してください");
};
