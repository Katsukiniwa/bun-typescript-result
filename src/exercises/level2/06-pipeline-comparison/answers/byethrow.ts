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

export const registerUser = async (name: string, email: string): Result.ResultAsync<User, AppError> => {
  const validated = await validateInput({ name, email });
  if (Result.isFailure(validated)) return validated;
  const checked = await checkDuplicate(validated.value);
  if (Result.isFailure(checked)) return checked;
  return saveUser(checked.value);
};
