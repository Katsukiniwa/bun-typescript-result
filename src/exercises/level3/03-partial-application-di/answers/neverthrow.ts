import { type Result, type ResultAsync, errAsync, fromSafePromise, okAsync } from "neverthrow";

type User = { id: string; name: string; email: string };
type AppError =
  | { type: "ValidationError"; message: string }
  | { type: "DuplicateError"; email: string }
  | { type: "DatabaseError"; message: string };
type DatabaseError = { message: string };

type Deps = {
  findByEmail: (email: string) => Promise<Result<User | null, never>>;
  save: (user: { name: string; email: string }) => Promise<Result<User, DatabaseError>>;
};

export const createUserWorkflow =
  (deps: Deps) =>
  (input: { name: string; email: string }): ResultAsync<User, AppError> => {
    if (input.name.length < 3)
      return errAsync({ type: "ValidationError", message: "名前は3文字以上" });
    if (!input.email.includes("@"))
      return errAsync({ type: "ValidationError", message: "メール形式が不正" });

    return fromSafePromise(deps.findByEmail(input.email)).andThen((findResult) => {
      // findByEmail は Promise<Result<User|null, never>> を返すため、
      // fromSafePromise で包むと ResultAsync<Result<User|null, never>, never> になる
      // そのため .andThen コールバックは Result<User|null, never> を受け取る
      const existingUser = findResult.isOk() ? findResult.value : null;
      if (existingUser !== null)
        return errAsync<User, AppError>({ type: "DuplicateError", email: input.email });
      return fromSafePromise(deps.save(input)).andThen((saveResult) =>
        saveResult.isOk()
          ? okAsync(saveResult.value)
          : errAsync({ type: "DatabaseError", message: saveResult.error.message }),
      );
    });
  };
