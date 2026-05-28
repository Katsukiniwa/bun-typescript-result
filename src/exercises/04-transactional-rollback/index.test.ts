import { describe, expect, it } from "bun:test";
import { Result } from "@praha/byethrow";
import * as E from "fp-ts/Either";
import {
  createUserWithAccount as createByethrow,
  getCounts as getCountsByethrow,
  resetDb as resetByethrow,
} from "./byethrow";
import {
  createUserWithAccount as createFp,
  getCounts as getCountsFp,
  resetDb as resetFp,
} from "./fp-ts";
import {
  createUserWithAccount as createNeverthrow,
  getCounts as getCountsNeverthrow,
  resetDb as resetNeverthrow,
} from "./neverthrow";

describe("neverthrow", () => {
  it("成功: Alice + deposit 100 → Ok; db にユーザーとアカウントが1件ずつ残る", () => {
    resetNeverthrow();
    const r = createNeverthrow("Alice", 100);
    expect(r.isOk()).toBe(true);
    if (r.isOk()) {
      expect(r.value.user.name).toBe("Alice");
      expect(r.value.account.ownerId).toBe(r.value.user.id);
    }
    expect(getCountsNeverthrow()).toEqual({ users: 1, accounts: 1 });
  });

  it("deposit が負: NegativeDeposit → Err; ロールバックで db が空になる", () => {
    resetNeverthrow();
    const r = createNeverthrow("Alice", -5);
    expect(r.isErr()).toBe(true);
    if (r.isErr()) expect(r.error.type).toBe("NegativeDeposit");
    expect(getCountsNeverthrow()).toEqual({ users: 0, accounts: 0 });
  });

  it("重複ユーザー: DuplicateError → Err; ロールバックで db が空になる", () => {
    resetNeverthrow();
    const r = createNeverthrow("dup", 100);
    expect(r.isErr()).toBe(true);
    if (r.isErr()) expect(r.error.type).toBe("DuplicateError");
    expect(getCountsNeverthrow()).toEqual({ users: 0, accounts: 0 });
  });
});

describe("byethrow", () => {
  it("成功: Alice + deposit 100 → Success; db にユーザーとアカウントが1件ずつ残る", () => {
    resetByethrow();
    const r = createByethrow("Alice", 100);
    expect(Result.isSuccess(r)).toBe(true);
    if (Result.isSuccess(r)) {
      expect(r.value.user.name).toBe("Alice");
      expect(r.value.account.ownerId).toBe(r.value.user.id);
    }
    expect(getCountsByethrow()).toEqual({ users: 1, accounts: 1 });
  });

  it("deposit が負: NegativeDeposit → Failure; ロールバックで db が空になる", () => {
    resetByethrow();
    const r = createByethrow("Alice", -5);
    expect(Result.isFailure(r)).toBe(true);
    if (Result.isFailure(r)) expect(r.error.type).toBe("NegativeDeposit");
    expect(getCountsByethrow()).toEqual({ users: 0, accounts: 0 });
  });

  it("重複ユーザー: DuplicateError → Failure; ロールバックで db が空になる", () => {
    resetByethrow();
    const r = createByethrow("dup", 100);
    expect(Result.isFailure(r)).toBe(true);
    if (Result.isFailure(r)) expect(r.error.type).toBe("DuplicateError");
    expect(getCountsByethrow()).toEqual({ users: 0, accounts: 0 });
  });
});

describe("fp-ts", () => {
  it("成功: Alice + deposit 100 → Right; db にユーザーとアカウントが1件ずつ残る", () => {
    resetFp();
    const r = createFp("Alice", 100);
    expect(E.isRight(r)).toBe(true);
    if (E.isRight(r)) {
      expect(r.right.user.name).toBe("Alice");
      expect(r.right.account.ownerId).toBe(r.right.user.id);
    }
    expect(getCountsFp()).toEqual({ users: 1, accounts: 1 });
  });

  it("deposit が負: NegativeDeposit → Left; ロールバックで db が空になる", () => {
    resetFp();
    const r = createFp("Alice", -5);
    expect(E.isLeft(r)).toBe(true);
    if (E.isLeft(r)) expect(r.left.type).toBe("NegativeDeposit");
    expect(getCountsFp()).toEqual({ users: 0, accounts: 0 });
  });

  it("重複ユーザー: DuplicateError → Left; ロールバックで db が空になる", () => {
    resetFp();
    const r = createFp("dup", 100);
    expect(E.isLeft(r)).toBe(true);
    if (E.isLeft(r)) expect(r.left.type).toBe("DuplicateError");
    expect(getCountsFp()).toEqual({ users: 0, accounts: 0 });
  });
});
