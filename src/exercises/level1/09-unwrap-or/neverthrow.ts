import { type Result } from "neverthrow";

/**
 * OkならOk値、ErrならdefaultValueを返す
 * @hint result.unwrapOr(defaultValue) を使ってください
 */
export const getValueOr = (result: Result<number, string>, defaultValue: number): number => {
  return result.unwrapOr(defaultValue)
};

/**
 * ユーザー名を取得。エラーの場合は"匿名"を返す
 * @hint .unwrapOr({ name: "匿名" }).name のように書けます
 */
export const getUserName = (result: Result<{ name: string }, string>): string => {
  return result.unwrapOr({name: '匿名'}).name
};
