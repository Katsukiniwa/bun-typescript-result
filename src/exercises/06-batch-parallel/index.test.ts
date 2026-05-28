import { describe, expect, it } from "bun:test";
import { Result } from "@praha/byethrow";
import * as E from "fp-ts/Either";
import {
  combineAllAsync as combineAllAsyncByethrow,
  combineAll as combineAllByethrow,
  partition as partitionByethrow,
} from "./byethrow";
import {
  combineAllAsync as combineAllAsyncFp,
  combineAll as combineAllFp,
  partition as partitionFp,
} from "./fp-ts";
import {
  combineAllAsync as combineAllAsyncNeverthrow,
  combineAll as combineAllNeverthrow,
  partition as partitionNeverthrow,
} from "./neverthrow";

describe("neverthrow", () => {
  it("partition: 一部失敗 → 成功と失敗を分離する", () => {
    const result = partitionNeverthrow(["1", "x", "3"]);
    expect(result.ok).toEqual([1, 3]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.type).toBe("ParseError");
    expect(result.errors[0]?.input).toBe("x");
  });

  it("partition: 全件成功 → errors は空", () => {
    const result = partitionNeverthrow(["1", "2"]);
    expect(result.ok).toEqual([1, 2]);
    expect(result.errors).toHaveLength(0);
  });

  it("combineAll: 全件成功 → Ok([1,2,3])", () => {
    const r = combineAllNeverthrow(["1", "2", "3"]);
    expect(r.isOk()).toBe(true);
    if (r.isOk()) expect(r.value).toEqual([1, 2, 3]);
  });

  it("combineAll: 一部失敗 → Err(ParseError)", () => {
    const r = combineAllNeverthrow(["1", "x"]);
    expect(r.isErr()).toBe(true);
    if (r.isErr()) expect(r.error.type).toBe("ParseError");
  });

  it("combineAllAsync: 全件成功 → Ok([1,2])", async () => {
    const r = await combineAllAsyncNeverthrow(["1", "2"]);
    expect(r.isOk()).toBe(true);
    if (r.isOk()) expect(r.value).toEqual([1, 2]);
  });

  it("combineAllAsync: 一部失敗 → Err(ParseError)", async () => {
    const r = await combineAllAsyncNeverthrow(["1", "x"]);
    expect(r.isErr()).toBe(true);
    if (r.isErr()) expect(r.error.type).toBe("ParseError");
  });
});

describe("byethrow", () => {
  it("partition: 一部失敗 → 成功と失敗を分離する", () => {
    const result = partitionByethrow(["1", "x", "3"]);
    expect(result.ok).toEqual([1, 3]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.type).toBe("ParseError");
    expect(result.errors[0]?.input).toBe("x");
  });

  it("partition: 全件成功 → errors は空", () => {
    const result = partitionByethrow(["1", "2"]);
    expect(result.ok).toEqual([1, 2]);
    expect(result.errors).toHaveLength(0);
  });

  it("combineAll: 全件成功 → Success([1,2,3])", () => {
    const r = combineAllByethrow(["1", "2", "3"]);
    expect(Result.isSuccess(r)).toBe(true);
    if (Result.isSuccess(r)) expect(r.value).toEqual([1, 2, 3]);
  });

  it("combineAll: 一部失敗 → Failure(ParseError)", () => {
    const r = combineAllByethrow(["1", "x"]);
    expect(Result.isFailure(r)).toBe(true);
    if (Result.isFailure(r)) expect(r.error.type).toBe("ParseError");
  });

  it("combineAllAsync: 全件成功 → Success([1,2])", async () => {
    const r = await combineAllAsyncByethrow(["1", "2"]);
    expect(Result.isSuccess(r)).toBe(true);
    if (Result.isSuccess(r)) expect(r.value).toEqual([1, 2]);
  });

  it("combineAllAsync: 一部失敗 → Failure(ParseError)", async () => {
    const r = await combineAllAsyncByethrow(["1", "x"]);
    expect(Result.isFailure(r)).toBe(true);
    if (Result.isFailure(r)) expect(r.error.type).toBe("ParseError");
  });
});

describe("fp-ts", () => {
  it("partition: 一部失敗 → 成功と失敗を分離する", () => {
    const result = partitionFp(["1", "x", "3"]);
    expect(result.ok).toEqual([1, 3]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.type).toBe("ParseError");
    expect(result.errors[0]?.input).toBe("x");
  });

  it("partition: 全件成功 → errors は空", () => {
    const result = partitionFp(["1", "2"]);
    expect(result.ok).toEqual([1, 2]);
    expect(result.errors).toHaveLength(0);
  });

  it("combineAll: 全件成功 → Right([1,2,3])", () => {
    const r = combineAllFp(["1", "2", "3"]);
    expect(E.isRight(r)).toBe(true);
    if (E.isRight(r)) expect(r.right).toEqual([1, 2, 3]);
  });

  it("combineAll: 一部失敗 → Left(ParseError)", () => {
    const r = combineAllFp(["1", "x"]);
    expect(E.isLeft(r)).toBe(true);
    if (E.isLeft(r)) expect(r.left.type).toBe("ParseError");
  });

  it("combineAllAsync: 全件成功 → Right([1,2])", async () => {
    const r = await combineAllAsyncFp(["1", "2"])();
    expect(E.isRight(r)).toBe(true);
    if (E.isRight(r)) expect(r.right).toEqual([1, 2]);
  });

  it("combineAllAsync: 一部失敗 → Left(ParseError)", async () => {
    const r = await combineAllAsyncFp(["1", "x"])();
    expect(E.isLeft(r)).toBe(true);
    if (E.isLeft(r)) expect(r.left.type).toBe("ParseError");
  });
});
