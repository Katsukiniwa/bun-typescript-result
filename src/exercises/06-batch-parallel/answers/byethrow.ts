import { Result } from "@praha/byethrow";

type AppError = { type: "ParseError"; input: string };

// 文字列を数値にパースし、NaN なら ParseError を返す
export const parseOne = (raw: string): Result.Result<number, AppError> => {
  const n = Number(raw);
  return Number.isNaN(n) ? Result.fail({ type: "ParseError", input: raw }) : Result.succeed(n);
};

// パーシャル失敗を許容して成功と失敗を分離する
export const partition = (raws: string[]): { ok: number[]; errors: AppError[] } => {
  const successes: number[] = [];
  const failures: AppError[] = [];
  for (const raw of raws) {
    const r = parseOne(raw);
    if (Result.isSuccess(r)) {
      successes.push(r.value);
    } else {
      failures.push(r.error);
    }
  }
  return { ok: successes, errors: failures };
};

// 全件成功しなければ最初のエラーで止める（all-or-nothing）
export const combineAll = (raws: string[]): Result.Result<number[], AppError> => {
  return Result.sequence(raws.map(parseOne));
};

// 並列非同期版の all-or-nothing（parseOne の結果を ResultAsync に持ち上げる）
export const combineAllAsync = (raws: string[]): Result.ResultAsync<number[], AppError> => {
  const asyncResults = raws.map((raw): Result.ResultAsync<number, AppError> => {
    const r = parseOne(raw);
    if (Result.isSuccess(r)) {
      return Promise.resolve(Result.succeed(r.value));
    }
    return Promise.resolve(Result.fail(r.error));
  });
  return Result.sequence(asyncResults);
};
