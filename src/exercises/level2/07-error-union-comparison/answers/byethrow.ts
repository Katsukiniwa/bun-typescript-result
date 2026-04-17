import { Result } from "@praha/byethrow";
import { match } from "ts-pattern";

type AppError =
  | { _tag: "ValidationError"; field: string; message: string }
  | { _tag: "NotFoundError"; id: string }
  | { _tag: "DuplicateError"; email: string }
  | { _tag: "DatabaseError"; cause: string };

export const toStatusCode = (error: AppError): number =>
  match(error)
    .with({ _tag: "ValidationError" }, () => 400)
    .with({ _tag: "NotFoundError" }, () => 404)
    .with({ _tag: "DuplicateError" }, () => 409)
    .with({ _tag: "DatabaseError" }, () => 500)
    .exhaustive();

export const toUserMessage = (error: AppError): string =>
  match(error)
    .with({ _tag: "ValidationError" }, (e) => `${e.field}: ${e.message}`)
    .with({ _tag: "NotFoundError" }, (e) => `ID ${e.id} が見つかりません`)
    .with({ _tag: "DuplicateError" }, (e) => `${e.email} は既に登録済みです`)
    .with({ _tag: "DatabaseError" }, () => "データベースエラーが発生しました")
    .exhaustive();

export const resultToStatusCode = (result: Result.Result<unknown, AppError>): number | null =>
  Result.isFailure(result) ? toStatusCode(result.error) : null;
