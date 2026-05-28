import { err, errAsync, ok, okAsync, type Result, ResultAsync } from "neverthrow";

type AppError = { type: "ParseError"; input: string };

// 文字列を数値にパースし、NaN なら ParseError を返す
export const parseOne = (raw: string): Result<number, AppError> => {
  const n = Number(raw);
  return Number.isNaN(n) ? err({ type: "ParseError", input: raw }) : ok(n);
};

// パーシャル失敗を許容して成功と失敗を分離する
export const partition = (raws: string[]): { ok: number[]; errors: AppError[] } => {
  const successes: number[] = [];
  const failures: AppError[] = [];
  for (const raw of raws) {
    const r = parseOne(raw);
    if (r.isOk()) {
      successes.push(r.value);
    } else {
      failures.push(r.error);
    }
  }
  return { ok: successes, errors: failures };
};

// 全件成功しなければ最初のエラーで止める（all-or-nothing）
export const combineAll = (raws: string[]): Result<number[], AppError> => {
  const results = raws.map(parseOne);
  let firstError: AppError | null = null;
  const values: number[] = [];
  for (const r of results) {
    if (r.isErr()) {
      firstError = r.error;
      break;
    }
    values.push(r.value);
  }
  return firstError ? err(firstError) : ok(values);
};

// 並列非同期版の all-or-nothing（parseOne の結果を ResultAsync に持ち上げる）
export const combineAllAsync = (raws: string[]): ResultAsync<number[], AppError> => {
  const asyncResults = raws.map((raw) => {
    const r = parseOne(raw);
    return r.isOk() ? okAsync(r.value) : errAsync(r.error);
  });
  return ResultAsync.combine(asyncResults);
};
