import { ResultAsync } from "neverthrow";

type AppError = { type: "Failed"; attempts: number } | { type: "Timeout"; ms: number };

// 指定ミリ秒だけ待つ小さなヘルパー
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// flaky な task を maxRetries 回まで追加リトライする（合計 maxRetries + 1 回試行）
export const withRetry = <T>(
  task: () => Promise<T>,
  maxRetries: number,
): ResultAsync<T, AppError> => {
  // 全リブラリ共通の素朴なループ。最終的に失敗したら AppError を throw する
  const attemptLoop = async (): Promise<T> => {
    let attempts = 0;
    while (attempts <= maxRetries) {
      attempts++;
      try {
        return await task();
      } catch {
        // 試行回数を使い切ったら AppError を throw する
        if (attempts > maxRetries) {
          throw { type: "Failed", attempts } satisfies AppError;
        }
      }
    }
    throw { type: "Failed", attempts } satisfies AppError;
  };

  return ResultAsync.fromPromise(attemptLoop(), (e) => e as AppError);
};

// task() と ms のタイムアウトを競争させる
export const withTimeout = <T>(task: () => Promise<T>, ms: number): ResultAsync<T, AppError> => {
  // タイムアウトが勝ったら AppError を throw する
  const race = async (): Promise<T> => {
    const result = await Promise.race([
      task().then((value) => ({ timedOut: false as const, value })),
      sleep(ms).then(() => ({ timedOut: true as const })),
    ]);
    if (result.timedOut) {
      throw { type: "Timeout", ms } satisfies AppError;
    }
    return result.value;
  };

  return ResultAsync.fromPromise(race(), (e) => e as AppError);
};
