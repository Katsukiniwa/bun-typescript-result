import { type Result } from "neverthrow";

/**
 * ResultがOkかErrかを文字列で返す
 * @hint result.isOk() で判定できます
 */
export const getStatus = (result: Result<unknown, unknown>): "ok" | "err" => {
  if (result.isOk()) {
    return "ok";
  } else {
    return "err";
  }
};

/**
 * OkならResult内の数値を2倍、ErrならErrorの数値をそのまま返す
 * @hint isOk()のブロック内では result.value が使えます
 * @hint isErr()のブロック内では result.error が使えます
 */
export const doubleIfOk = (result: Result<number, number>): number => {
  if (result.isOk()) {
    return result.value * 2;
  } else {
    return result.error;
  }
};

/**
 * Result配列の成功数と失敗数を数える
 * @hint filter() と isOk() / isErr() を組み合わせましょう
 */
export const countResults = (
  results: Result<unknown, unknown>[],
): { ok: number; err: number } => {
  return {
    ok: results.filter((r) => r.isOk()).length,
    err: results.filter((r) => r.isErr()).length,
  };
};
