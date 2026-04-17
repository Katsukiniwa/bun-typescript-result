import { fromThrowable, type Result } from "neverthrow";

const safeParseJson = fromThrowable(JSON.parse, (e) => `パースエラー: ${String(e)}`);

export const parseJson = (jsonString: string): Result<unknown, string> =>
  safeParseJson(jsonString);

const parseNumberFn = (s: string): number => {
  const n = Number(s);
  if (Number.isNaN(n) || s.trim() === "") throw new Error("数値に変換できません");
  return n;
};
const safeToNumber = fromThrowable(parseNumberFn, () => "数値に変換できません");

export const toNumber = (value: string): Result<number, string> => safeToNumber(value);
