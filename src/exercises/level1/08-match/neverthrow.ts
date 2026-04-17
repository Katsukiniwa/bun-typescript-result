import { type Result } from "neverthrow";

/**
 * OkとErrを文字列に変換する
 * @hint result.match(v => `成功: ${v}`, e => `失敗: ${e}`)
 */
export const toMessage = (result: Result<number, string>): string => {
  // TODO: .match() を使って実装してください
  throw new Error("TODO: .match(onOk, onErr) を使って実装してください");
};

/**
 * OkはそのままErrは-1に変換する
 */
export const toNumber = (result: Result<number, string>): number => {
  // TODO: .match() を使って実装してください
  throw new Error("TODO: .match() を使って実装してください");
};

/**
 * ユーザー情報をフォーマットする
 */
export const formatUserResult = (
  result: Result<{ name: string; age: number }, { message: string }>,
): string => {
  // TODO: .match() を使って実装してください
  throw new Error("TODO: .match() を使って実装してください");
};
