import type { ResultAsync } from "neverthrow";

type AppError = { type: "Failed"; attempts: number } | { type: "Timeout"; ms: number };

// 指定ミリ秒だけ待つ小さなヘルパー
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * flaky な task を maxRetries 回まで追加リトライする（合計 maxRetries + 1 回試行）。
 * 全試行が失敗したら { type: "Failed", attempts } を返す。
 * @hint 内部に `attemptLoop = async (): Promise<T>` を書き、試行回数を数えつつ task() を await する。
 *   使い切ったら `throw { type: "Failed", attempts } satisfies AppError` し、ResultAsync.fromPromise(attemptLoop(), (e) => e as AppError) で包む。
 */
export const withRetry = <T>(
  task: () => Promise<T>,
  maxRetries: number,
): ResultAsync<T, AppError> => {
  throw new Error(
    `TODO: attemptLoop を ResultAsync.fromPromise で包んでリトライしてください (task=${typeof task}, maxRetries=${maxRetries})`,
  );
};

/**
 * task() と ms のタイムアウトを競争させる。
 * task が先に resolve すれば成功、タイムアウトが勝てば { type: "Timeout", ms } を返す。
 * @hint Promise.race([task().then((value) => ({ timedOut: false, value })), sleep(ms).then(() => ({ timedOut: true }))]) で競争し、
 *   timedOut のとき throw、そうでなければ value を返す async 関数を ResultAsync.fromPromise で包む。
 */
export const withTimeout = <T>(task: () => Promise<T>, ms: number): ResultAsync<T, AppError> => {
  throw new Error(
    `TODO: Promise.race で task(${typeof task}) と sleep(=${typeof sleep})(${ms}) を競争させ ResultAsync.fromPromise で包んでください`,
  );
};
