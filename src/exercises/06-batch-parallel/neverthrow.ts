import type { Result, ResultAsync } from "neverthrow";

type AppError = { type: "ParseError"; input: string };

/**
 * 文字列を数値にパースする。NaN なら ParseError を返す。
 * @hint ok(n) / err({ type: "ParseError", input: raw })
 * 実装するときは `import type { Result }` を値の import に変えること。
 */
export const parseOne = (raw: string): Result<number, AppError> => {
  throw new Error(`TODO: Number(raw) でパースし NaN なら ParseError を返してください (raw=${raw})`);
};

/**
 * 全要素をパースし、成功と失敗に分離する（パーシャル失敗許容）。
 * @hint raws.map(parseOne) → isOk/isErr で振り分け
 */
export const partition = (raws: string[]): { ok: number[]; errors: AppError[] } => {
  throw new Error(
    `TODO: parseOne で各要素をパースし ok/errors に振り分けてください (raws.length=${raws.length})`,
  );
};

/**
 * 全要素のパースが成功した場合のみ Ok を返す（all-or-nothing）。
 * @hint raws.map(parseOne) → ループで最初のエラーを返す
 */
export const combineAll = (raws: string[]): Result<number[], AppError> => {
  throw new Error(
    `TODO: raws.map(parseOne) の全結果を合成し最初のエラーで止めてください (raws.length=${raws.length})`,
  );
};

/**
 * 全要素を並列非同期でパースし、全成功なら Ok を返す（all-or-nothing）。
 * @hint okAsync/errAsync で ResultAsync に持ち上げ → ResultAsync.combine
 * 実装するときは import type を値の import に変えること。
 */
export const combineAllAsync = (raws: string[]): ResultAsync<number[], AppError> => {
  throw new Error(
    `TODO: parseOne の結果を ResultAsync に変換し ResultAsync.combine で合成してください (raws.length=${raws.length})`,
  );
};
