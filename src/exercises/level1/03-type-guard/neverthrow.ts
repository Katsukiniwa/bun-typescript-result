import { type Result } from "neverthrow";

/**
 * ResultがOkかErrかを文字列で返す
 * @hint result.isOk() で判定できます
 */
export const getStatus = (result: Result<unknown, unknown>): "ok" | "err" => {
  // TODO: 実装してください
  throw new Error("TODO: isOk() / isErr() を使って実装してください");
};

/**
 * OkならResult内の数値を2倍、ErrならErrorの数値をそのまま返す
 * @hint isOk()のブロック内では result.value が使えます
 * @hint isErr()のブロック内では result.error が使えます
 */
export const doubleIfOk = (result: Result<number, number>): number => {
  // TODO: 実装してください
  throw new Error("TODO: isOk() で型ガードして値を取り出してください");
};

/**
 * Result配列の成功数と失敗数を数える
 * @hint filter() と isOk() / isErr() を組み合わせましょう
 */
export const countResults = (
  results: Result<unknown, unknown>[],
): { ok: number; err: number } => {
  // TODO: 実装してください
  throw new Error("TODO: filter() と isOk() を使って実装してください");
};
