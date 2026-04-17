import { type Result } from "neverthrow";
import { match } from "ts-pattern";

type AppError =
  | { _tag: "ValidationError"; field: string; message: string }
  | { _tag: "NotFoundError"; id: string }
  | { _tag: "DuplicateError"; email: string }
  | { _tag: "DatabaseError"; cause: string };

/**
 * エラーをHTTPステータスコードに変換する
 * @hint match(error).with({ _tag: "ValidationError" }, () => 400).exhaustive() のように書いてください
 * @note .exhaustive() で全ケースを網羅しているか型チェックできます
 */
export const toStatusCode = (error: AppError): number => {
  throw new Error("TODO: ts-pattern の match().with().exhaustive() を使って実装してください");
};

/**
 * エラーをユーザー向けメッセージに変換する
 * @hint match(error).with({ _tag: "..." }, e => `...${e.field}...`) のようにフィールドにアクセスできます
 */
export const toUserMessage = (error: AppError): string => {
  throw new Error("TODO: ts-pattern を使って実装してください");
};

/**
 * Result からエラーを取り出してステータスコードに変換する
 * @hint result.isErr() でエラーを取り出してください
 */
export const resultToStatusCode = (result: Result<unknown, AppError>): number | null => {
  throw new Error("TODO: result.isErr() + toStatusCode() を使って実装してください");
};
