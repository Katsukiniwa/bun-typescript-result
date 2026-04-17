import { Result } from "@praha/byethrow";

type User = { id: string; name: string; email: string };
type AppError =
  | { type: "ValidationError"; message: string }
  | { type: "DuplicateError"; email: string }
  | { type: "DatabaseError"; message: string };
type DatabaseError = { message: string };

type Deps = {
  findByEmail: (email: string) => Promise<Result.Result<User | null, never>>;
  save: (user: { name: string; email: string }) => Promise<Result.Result<User, DatabaseError>>;
};

export const createUserWorkflow =
  (deps: Deps) =>
  async (input: { name: string; email: string }): Result.ResultAsync<User, AppError> => {
    if (input.name.length < 3)
      return Result.fail({ type: "ValidationError", message: "名前は3文字以上" });
    if (!input.email.includes("@"))
      return Result.fail({ type: "ValidationError", message: "メール形式が不正" });

    const existing = await deps.findByEmail(input.email);
    if (Result.isSuccess(existing) && existing.value !== null)
      return Result.fail({ type: "DuplicateError", email: input.email });

    const saved = await deps.save(input);
    if (Result.isFailure(saved))
      return Result.fail({ type: "DatabaseError", message: saved.error.message });

    return Result.succeed(saved.value);
  };
