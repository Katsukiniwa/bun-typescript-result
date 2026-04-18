import { type Result } from "neverthrow";

/**
 * OkとErrを文字列に変換する
 * @hint result.match(v => `成功: ${v}`, e => `失敗: ${e}`)
 */
export const toMessage = (result: Result<number, string>): string => {
  return result.match(v => `成功: ${v}`, e => `失敗: ${e}`)
};

/**
 * OkはそのままErrは-1に変換する
 */
export const toNumber = (result: Result<number, string>): number => {
  return result.match(v => v, () => -1)
};

/**
 * ユーザー情報をフォーマットする
 */
export const formatUserResult = (
  result: Result<{ name: string; age: number }, { message: string }>,
): string => {
  return result.match(
    (u) => `${u.name}さん(${u.age}歳)`,
    (e) => `エラー: ${e.message}`,
  );
};
