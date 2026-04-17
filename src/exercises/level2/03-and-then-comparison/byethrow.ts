import { Result } from "@praha/byethrow";

/**
 * 文字列を整数に変換する（変換できない場合はFailure）
 * @hint Result.succeed() / Result.fail() で結果を作ってください
 * @note byethrow では Result.andThen(fn) はカリー化: fn を取り (result) => result を返す
 */
export const parseInt_ = (s: string): Result.Result<number, string> => {
  throw new Error("TODO: Result.succeed() / Result.fail() と Result.pipe() + Result.andThen() を使って実装してください");
};

/**
 * 正の数のみ受け付ける（負の数はFailure）
 * @hint Result.pipe(result, Result.andThen(n => n > 0 ? Result.succeed(n) : Result.fail(...))) を使ってください
 */
export const requirePositive = (result: Result.Result<number, string>): Result.Result<number, string> => {
  throw new Error("TODO: Result.pipe() + Result.andThen() を使って実装してください");
};
