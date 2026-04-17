import { fromThrowable, type Result } from "neverthrow";

/**
 * JSON文字列をパースしてResult型で返す
 * @hint const safe = fromThrowable(JSON.parse, e => String(e))
 * @hint fromThrowable は「throwするかもしれない関数」を「Resultを返す関数」に変換します
 */
export const parseJson = (jsonString: string): Result<unknown, string> => {
  // TODO: fromThrowable で JSON.parse をラップした関数を作り、jsonString に適用してください
  throw new Error("TODO: fromThrowable(JSON.parse, errorMapper) を使って実装してください");
};

/**
 * 文字列を数値に変換。NaNになる文字列はErrを返す
 * @hint Number(value) がNaNのとき throw する関数を fromThrowable でラップしてください
 */
export const toNumber = (value: string): Result<number, string> => {
  // TODO: fromThrowable を使って実装してください
  throw new Error("TODO: fromThrowable を使って実装してください");
};
