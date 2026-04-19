import { fromThrowable, type Result } from "neverthrow";

/**
 * JSON文字列をパースしてResult型で返す
 * @hint const safe = fromThrowable(JSON.parse, e => String(e))
 * @hint fromThrowable は「throwするかもしれない関数」を「Resultを返す関数」に変換します
 */
export const parseJson = (jsonString: string): Result<unknown, string> => {
  const safeParseJson = fromThrowable((e: string) =>
    JSON.parse(e),
    (e) => String(e)
  );
  return safeParseJson(jsonString)
};

/**
 * 文字列を数値に変換。NaNになる文字列はErrを返す
 * @hint Number(value) がNaNのとき throw する関数を fromThrowable でラップしてください
 */
export const toNumber = (value: string): Result<number, string> => {
  const safeToNumber = fromThrowable(
    (s: string): number => {
      const n = Number(s);
      if (Number.isNaN(n) || s.trim() === "") throw new Error("数値に変換できません");
      return n;
    }, 
    () => {
      return  "数値に変換できません"
    });
  return safeToNumber(value)
};
