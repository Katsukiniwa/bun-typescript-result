import { Result } from "@praha/byethrow";
import { match } from "ts-pattern";

type AppError =
  | { _tag: "ValidationError"; field: string; message: string }
  | { _tag: "NotFoundError"; id: string }
  | { _tag: "DuplicateError"; email: string }
  | { _tag: "DatabaseError"; cause: string };

/**
 * エラーをHTTPステータスコードに変換する
 * @hint match(error).with({ _tag: "ValidationError" }, () => 400).exhaustive() のように書いてください
 * @note ts-pattern はどちらのライブラリとも独立して使えます
 */
export const toStatusCode = (error: AppError): number => {
  throw new Error("TODO: ts-pattern の match().with().exhaustive() を使って実装してください");
};

/**
 * エラーをユーザー向けメッセージに変換する
 */
export const toUserMessage = (error: AppError): string => {
  throw new Error("TODO: ts-pattern を使って実装してください");
};

/**
 * Result からエラーを取り出してステータスコードに変換する
 * @hint Result.isFailure(result) でエラーを取り出してください
 */
export const resultToStatusCode = (result: Result.Result<unknown, AppError>): number | null => {
  throw new Error("TODO: Result.isFailure() + toStatusCode() を使って実装してください");
};
