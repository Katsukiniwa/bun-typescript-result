import { Result } from "@praha/byethrow";

type AppError =
  | { _tag: "ValidationError"; field: string; message: string }
  | { _tag: "DuplicateError"; email: string }
  | { _tag: "DatabaseError"; cause: string };

type User = { id: string; name: string; email: string; age: number };
type UserInput = { name: string; email: string; age: number };

const existingEmails = new Set(["admin@example.com"]);

const validateInput = Result.fn({
  try: async (input: UserInput): Promise<UserInput> => {
    if (input.name.length < 3)
      throw { _tag: "ValidationError", field: "name", message: "名前は3文字以上" } as AppError;
    if (!input.email.includes("@"))
      throw { _tag: "ValidationError", field: "email", message: "メール形式が不正" } as AppError;
    if (input.age < 0 || input.age > 150)
      throw { _tag: "ValidationError", field: "age", message: "年齢は0-150" } as AppError;
    return input;
  },
  catch: (e: unknown): AppError =>
    typeof e === "object" && e !== null && "_tag" in e
      ? (e as AppError)
      : { _tag: "DatabaseError", cause: String(e) },
});

const checkDuplicate = async (input: UserInput): Result.ResultAsync<UserInput, AppError> =>
  existingEmails.has(input.email)
    ? Result.fail({ _tag: "DuplicateError", email: input.email })
    : Result.succeed(input);

const saveUser = async (input: UserInput): Result.ResultAsync<User, AppError> =>
  Result.succeed({ id: "generated-id", ...input });

export const registerUser = async (input: UserInput): Result.ResultAsync<User, AppError> => {
  const validated = await validateInput(input);
  if (Result.isFailure(validated)) return validated;
  const checked = await checkDuplicate(validated.value);
  if (Result.isFailure(checked)) return checked;
  return saveUser(checked.value);
};
