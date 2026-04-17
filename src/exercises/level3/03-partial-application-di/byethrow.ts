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

/**
 * 依存関係を受け取り、ユーザー作成Workflowを返す
 * @hint (deps) => async (input) => { ... } の形（カリー化）で実装してください
 * @hint input.name.length < 3 のとき Result.fail({ type: "ValidationError", ... }) を返してください
 * @hint input.email.includes("@") が false のとき Result.fail({ type: "ValidationError", ... }) を返してください
 * @hint deps.findByEmail でメールを検索し、既存ユーザーがいれば Result.fail({ type: "DuplicateError", ... }) を返してください
 * @hint deps.save でユーザーを保存し、Result.isFailure でエラーをハンドリングしてください
 */
export const createUserWorkflow =
  (deps: Deps) =>
  async (input: { name: string; email: string }): Result.ResultAsync<User, AppError> => {
    throw new Error("TODO: 依存関係を使ってユーザー作成を実装してください");
  };
