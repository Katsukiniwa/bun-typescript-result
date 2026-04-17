import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

type AppError =
  | { _tag: "ValidationError"; field: string; message: string }
  | { _tag: "DuplicateError"; email: string }
  | { _tag: "DatabaseError"; cause: string };

type User = { id: string; name: string; email: string; age: number };
type UserInput = { name: string; email: string; age: number };

const existingEmails = new Set(["admin@example.com"]);

const validateInput = (input: UserInput): TE.TaskEither<AppError, UserInput> =>
  input.name.length < 3
    ? TE.left({ _tag: "ValidationError", field: "name", message: "名前は3文字以上" })
    : !input.email.includes("@")
      ? TE.left({ _tag: "ValidationError", field: "email", message: "メール形式が不正" })
      : input.age < 0 || input.age > 150
        ? TE.left({ _tag: "ValidationError", field: "age", message: "年齢は0-150" })
        : TE.right(input);

const checkDuplicate = (input: UserInput): TE.TaskEither<AppError, UserInput> =>
  existingEmails.has(input.email)
    ? TE.left({ _tag: "DuplicateError", email: input.email })
    : TE.right(input);

const saveUser = (input: UserInput): TE.TaskEither<AppError, User> =>
  TE.right({ id: "generated-id", ...input });

export const registerUser = (input: UserInput): TE.TaskEither<AppError, User> =>
  pipe(validateInput(input), TE.chain(checkDuplicate), TE.chain(saveUser));
