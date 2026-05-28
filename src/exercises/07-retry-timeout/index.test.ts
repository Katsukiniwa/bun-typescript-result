import { describe, expect, it } from "bun:test";
import { Result } from "@praha/byethrow";
import * as E from "fp-ts/Either";
import { withRetry as retryByethrow, withTimeout as timeoutByethrow } from "./byethrow";
import { withRetry as retryFp, withTimeout as timeoutFp } from "./fp-ts";
import { withRetry as retryNeverthrow, withTimeout as timeoutNeverthrow } from "./neverthrow";

// 指定ミリ秒だけ待つ小さなヘルパー
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// failTimes 回だけ reject し、その後 "ok" を resolve する flaky task を生成する
const makeFlaky = (failTimes: number): (() => Promise<string>) => {
  let calls = 0;
  return () => {
    calls++;
    if (calls <= failTimes) {
      return Promise.reject(new Error(`flaky failure #${calls}`));
    }
    return Promise.resolve("ok");
  };
};

// すぐ resolve する task
const fast = (): Promise<string> => Promise.resolve("fast");
// 50ms かけて resolve する遅い task
const slow = (): Promise<string> => sleep(50).then(() => "slow");

describe("neverthrow", () => {
  it("withRetry: 2回失敗してから成功 → Ok('ok')", async () => {
    const r = await retryNeverthrow(makeFlaky(2), 3);
    expect(r.isOk()).toBe(true);
    if (r.isOk()) expect(r.value).toBe("ok");
  });

  it("withRetry: リトライ予算内で常に失敗 → Err(Failed, attempts=3)", async () => {
    const r = await retryNeverthrow(makeFlaky(5), 2);
    expect(r.isErr()).toBe(true);
    if (r.isErr()) {
      expect(r.error.type).toBe("Failed");
      if (r.error.type === "Failed") expect(r.error.attempts).toBe(3);
    }
  });

  it("withTimeout: 速い task → Ok('fast')", async () => {
    const r = await timeoutNeverthrow(fast, 10);
    expect(r.isOk()).toBe(true);
    if (r.isOk()) expect(r.value).toBe("fast");
  });

  it("withTimeout: 遅い task → Err(Timeout, ms=10)", async () => {
    const r = await timeoutNeverthrow(slow, 10);
    expect(r.isErr()).toBe(true);
    if (r.isErr()) {
      expect(r.error.type).toBe("Timeout");
      if (r.error.type === "Timeout") expect(r.error.ms).toBe(10);
    }
  });
});

describe("byethrow", () => {
  it("withRetry: 2回失敗してから成功 → Success('ok')", async () => {
    const r = await retryByethrow(makeFlaky(2), 3);
    expect(Result.isSuccess(r)).toBe(true);
    if (Result.isSuccess(r)) expect(r.value).toBe("ok");
  });

  it("withRetry: リトライ予算内で常に失敗 → Failure(Failed, attempts=3)", async () => {
    const r = await retryByethrow(makeFlaky(5), 2);
    expect(Result.isFailure(r)).toBe(true);
    if (Result.isFailure(r)) {
      expect(r.error.type).toBe("Failed");
      if (r.error.type === "Failed") expect(r.error.attempts).toBe(3);
    }
  });

  it("withTimeout: 速い task → Success('fast')", async () => {
    const r = await timeoutByethrow(fast, 10);
    expect(Result.isSuccess(r)).toBe(true);
    if (Result.isSuccess(r)) expect(r.value).toBe("fast");
  });

  it("withTimeout: 遅い task → Failure(Timeout, ms=10)", async () => {
    const r = await timeoutByethrow(slow, 10);
    expect(Result.isFailure(r)).toBe(true);
    if (Result.isFailure(r)) {
      expect(r.error.type).toBe("Timeout");
      if (r.error.type === "Timeout") expect(r.error.ms).toBe(10);
    }
  });
});

describe("fp-ts", () => {
  it("withRetry: 2回失敗してから成功 → Right('ok')", async () => {
    const r = await retryFp(makeFlaky(2), 3)();
    expect(E.isRight(r)).toBe(true);
    if (E.isRight(r)) expect(r.right).toBe("ok");
  });

  it("withRetry: リトライ予算内で常に失敗 → Left(Failed, attempts=3)", async () => {
    const r = await retryFp(makeFlaky(5), 2)();
    expect(E.isLeft(r)).toBe(true);
    if (E.isLeft(r)) {
      expect(r.left.type).toBe("Failed");
      if (r.left.type === "Failed") expect(r.left.attempts).toBe(3);
    }
  });

  it("withTimeout: 速い task → Right('fast')", async () => {
    const r = await timeoutFp(fast, 10)();
    expect(E.isRight(r)).toBe(true);
    if (E.isRight(r)) expect(r.right).toBe("fast");
  });

  it("withTimeout: 遅い task → Left(Timeout, ms=10)", async () => {
    const r = await timeoutFp(slow, 10)();
    expect(E.isLeft(r)).toBe(true);
    if (E.isLeft(r)) {
      expect(r.left.type).toBe("Timeout");
      if (r.left.type === "Timeout") expect(r.left.ms).toBe(10);
    }
  });
});
