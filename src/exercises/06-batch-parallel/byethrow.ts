import type { Result } from "@praha/byethrow";

type AppError = { type: "ParseError"; input: string };

/**
 * 文字列を数値にパースする。NaN なら ParseError を返す。
 * @hint Result.succeed(n) / Result.fail({ type: "ParseError", input: raw })
 * 実装するときは `import type { Result }` を `import { Result }` に変えて値として使うこと。
 */
export const parseOne = (raw: string): Result.Result<number, AppError> => {
  throw new Error(`TODO: Number(raw) でパースし NaN なら ParseError を返してください (raw=${raw})`);
};

/**
 * 全要素をパースし、成功と失敗に分離する（パーシャル失敗許容）。
 * @hint raws.map(parseOne) → Result.isSuccess/isFailure で振り分け
 */
export const partition = (raws: string[]): { ok: number[]; errors: AppError[] } => {
  throw new Error(
    `TODO: parseOne で各要素をパースし ok/errors に振り分けてください (raws.length=${raws.length})`,
  );
};

/**
 * 全要素のパースが成功した場合のみ Success を返す（all-or-nothing）。
 * @hint Result.sequence(raws.map(parseOne))
 */
export const combineAll = (raws: string[]): Result.Result<number[], AppError> => {
  throw new Error(
    `TODO: Result.sequence で全件を合成し最初のエラーで止めてください (raws.length=${raws.length})`,
  );
};

/**
 * 全要素を並列非同期でパースし、全成功なら Success を返す（all-or-nothing）。
 * @hint Promise.resolve(Result.succeed/fail(...)) で ResultAsync に変換 → Result.sequence
 */
export const combineAllAsync = (raws: string[]): Result.ResultAsync<number[], AppError> => {
  throw new Error(
    `TODO: parseOne の結果を ResultAsync に変換し Result.sequence で合成してください (raws.length=${raws.length})`,
  );
};
