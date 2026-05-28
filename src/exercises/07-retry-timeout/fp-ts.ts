import type * as TE from "fp-ts/TaskEither";

type AppError = { type: "Failed"; attempts: number } | { type: "Timeout"; ms: number };

// 指定ミリ秒だけ待つ小さなヘルパー
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * flaky な task を maxRetries 回まで追加リトライする（合計 maxRetries + 1 回試行）。
 * 全試行が失敗したら { type: "Failed", attempts } を返す（TaskEither<E, A> は E が先・A が後）。
 * @hint 内部に `attemptLoop = async (): Promise<T>` を書き、試行回数を数えつつ task() を await する。
 *   使い切ったら `throw { type: "Failed", attempts } satisfies AppError` し、TE.tryCatch(() => attemptLoop(), (e) => e as AppError) で包む。
 *   実装するときは型のみの import を値の import（import * as TE from "fp-ts/TaskEither" 等）に変えること。
 */
export const withRetry = <T>(
  task: () => Promise<T>,
  maxRetries: number,
): TE.TaskEither<AppError, T> => {
  throw new Error(
    `TODO: attemptLoop を TE.tryCatch で包んでリトライしてください (task=${typeof task}, maxRetries=${maxRetries})`,
  );
};

/**
 * task() と ms のタイムアウトを競争させる。
 * task が先に resolve すれば成功、タイムアウトが勝てば { type: "Timeout", ms } を返す。
 * @hint Promise.race([task().then((value) => ({ timedOut: false, value })), sleep(ms).then(() => ({ timedOut: true }))]) で競争し、
 *   timedOut のとき throw、そうでなければ value を返す async 関数を TE.tryCatch で包む。
 */
export const withTimeout = <T>(task: () => Promise<T>, ms: number): TE.TaskEither<AppError, T> => {
  throw new Error(
    `TODO: Promise.race で task(${typeof task}) と sleep(=${typeof sleep})(${ms}) を競争させ TE.tryCatch で包んでください`,
  );
};
