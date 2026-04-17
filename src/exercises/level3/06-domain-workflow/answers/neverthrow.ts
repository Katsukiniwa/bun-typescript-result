import { errAsync, fromSafePromise, okAsync, type ResultAsync } from "neverthrow";

type AppError =
  | { _tag: "ValidationError"; field: string; message: string }
  | { _tag: "DuplicateError"; email: string }
  | { _tag: "DatabaseError"; cause: string };

type User = { id: string; name: string; email: string; age: number };
type UserInput = { name: string; email: string; age: number };

const existingEmails = new Set(["admin@example.com"]);

const validateInput = (input: UserInput): ResultAsync<UserInput, AppError> => {
  if (input.name.length < 3)
    return errAsync({ _tag: "ValidationError", field: "name", message: "名前は3文字以上" });
  if (!input.email.includes("@"))
    return errAsync({ _tag: "ValidationError", field: "email", message: "メール形式が不正" });
  if (input.age < 0 || input.age > 150)
    return errAsync({ _tag: "ValidationError", field: "age", message: "年齢は0-150" });
  return okAsync(input);
};

const checkDuplicate = (input: UserInput): ResultAsync<UserInput, AppError> =>
  existingEmails.has(input.email)
    ? errAsync({ _tag: "DuplicateError", email: input.email })
    : okAsync(input);

const saveUser = (input: UserInput): ResultAsync<User, AppError> =>
  fromSafePromise(Promise.resolve({ id: crypto.randomUUID(), ...input }));

export const registerUser = (input: UserInput): ResultAsync<User, AppError> =>
  validateInput(input).andThen(checkDuplicate).andThen(saveUser);
