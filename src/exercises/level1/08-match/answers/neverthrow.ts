import { type Result } from "neverthrow";

export const toMessage = (result: Result<number, string>): string =>
  result.match(
    (v) => `成功: ${v}`,
    (e) => `失敗: ${e}`,
  );

export const toNumber = (result: Result<number, string>): number =>
  result.match(
    (n) => n,
    () => -1,
  );

export const formatUserResult = (
  result: Result<{ name: string; age: number }, { message: string }>,
): string =>
  result.match(
    (u) => `${u.name}さん(${u.age}歳)`,
    (e) => `エラー: ${e.message}`,
  );
