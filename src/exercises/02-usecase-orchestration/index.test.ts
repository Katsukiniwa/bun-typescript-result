import { describe, expect, it } from "bun:test";
import { Result } from "@praha/byethrow";
import * as E from "fp-ts/Either";
import {
  openAccountAsync as openAccountAsyncByethrow,
  openAccount as openAccountByethrow,
} from "./byethrow";
import { openAccountAsync as openAccountAsyncFp, openAccount as openAccountFp } from "./fp-ts";
import {
  openAccountAsync as openAccountAsyncNeverthrow,
  openAccount as openAccountNeverthrow,
} from "./neverthrow";

describe("neverthrow", () => {
  it("openAccount: 正常系 → Ok(Account) balance=100, ownerId=1", () => {
    const r = openAccountNeverthrow("Alice", 100);
    expect(r.isOk()).toBe(true);
    if (r.isOk()) {
      expect(r.value.balance).toBe(100);
      expect(r.value.ownerId).toBe(1);
    }
  });

  it("openAccount: 短い名前 → Err(ValidationError) ショートサーキット", () => {
    const r = openAccountNeverthrow("Al", 100);
    expect(r.isErr()).toBe(true);
    if (r.isErr()) expect(r.error.type).toBe("ValidationError");
  });

  it("openAccount: 重複名 → Err(DuplicateError)", () => {
    const r = openAccountNeverthrow("taken", 100);
    expect(r.isErr()).toBe(true);
    if (r.isErr()) expect(r.error.type).toBe("DuplicateError");
  });

  it("openAccount: マイナス預金 → Err(NegativeDeposit)", () => {
    const r = openAccountNeverthrow("Alice", -5);
    expect(r.isErr()).toBe(true);
    if (r.isErr()) expect(r.error.type).toBe("NegativeDeposit");
  });

  it("openAccountAsync: 正常系 → Ok(Account) balance=50", async () => {
    const r = await openAccountAsyncNeverthrow("Alice", 50);
    expect(r.isOk()).toBe(true);
    if (r.isOk()) expect(r.value.balance).toBe(50);
  });

  it("openAccountAsync: 短い名前 → Err(ValidationError)", async () => {
    const r = await openAccountAsyncNeverthrow("Al", 50);
    expect(r.isErr()).toBe(true);
    if (r.isErr()) expect(r.error.type).toBe("ValidationError");
  });
});

describe("byethrow", () => {
  it("openAccount: 正常系 → Success(Account) balance=100, ownerId=1", () => {
    const r = openAccountByethrow("Alice", 100);
    expect(Result.isSuccess(r)).toBe(true);
    if (Result.isSuccess(r)) {
      expect(r.value.balance).toBe(100);
      expect(r.value.ownerId).toBe(1);
    }
  });

  it("openAccount: 短い名前 → Failure(ValidationError) ショートサーキット", () => {
    const r = openAccountByethrow("Al", 100);
    expect(Result.isFailure(r)).toBe(true);
    if (Result.isFailure(r)) expect(r.error.type).toBe("ValidationError");
  });

  it("openAccount: 重複名 → Failure(DuplicateError)", () => {
    const r = openAccountByethrow("taken", 100);
    expect(Result.isFailure(r)).toBe(true);
    if (Result.isFailure(r)) expect(r.error.type).toBe("DuplicateError");
  });

  it("openAccount: マイナス預金 → Failure(NegativeDeposit)", () => {
    const r = openAccountByethrow("Alice", -5);
    expect(Result.isFailure(r)).toBe(true);
    if (Result.isFailure(r)) expect(r.error.type).toBe("NegativeDeposit");
  });

  it("openAccountAsync: 正常系 → Success(Account) balance=50", async () => {
    const r = await openAccountAsyncByethrow("Alice", 50);
    expect(Result.isSuccess(r)).toBe(true);
    if (Result.isSuccess(r)) expect(r.value.balance).toBe(50);
  });

  it("openAccountAsync: 短い名前 → Failure(ValidationError)", async () => {
    const r = await openAccountAsyncByethrow("Al", 50);
    expect(Result.isFailure(r)).toBe(true);
    if (Result.isFailure(r)) expect(r.error.type).toBe("ValidationError");
  });
});

describe("fp-ts", () => {
  it("openAccount: 正常系 → Right(Account) balance=100, ownerId=1", () => {
    const r = openAccountFp("Alice", 100);
    expect(E.isRight(r)).toBe(true);
    if (E.isRight(r)) {
      expect(r.right.balance).toBe(100);
      expect(r.right.ownerId).toBe(1);
    }
  });

  it("openAccount: 短い名前 → Left(ValidationError) ショートサーキット", () => {
    const r = openAccountFp("Al", 100);
    expect(E.isLeft(r)).toBe(true);
    if (E.isLeft(r)) expect(r.left.type).toBe("ValidationError");
  });

  it("openAccount: 重複名 → Left(DuplicateError)", () => {
    const r = openAccountFp("taken", 100);
    expect(E.isLeft(r)).toBe(true);
    if (E.isLeft(r)) expect(r.left.type).toBe("DuplicateError");
  });

  it("openAccount: マイナス預金 → Left(NegativeDeposit)", () => {
    const r = openAccountFp("Alice", -5);
    expect(E.isLeft(r)).toBe(true);
    if (E.isLeft(r)) expect(r.left.type).toBe("NegativeDeposit");
  });

  it("openAccountAsync: 正常系 → Right(Account) balance=50", async () => {
    const r = await openAccountAsyncFp("Alice", 50)();
    expect(E.isRight(r)).toBe(true);
    if (E.isRight(r)) expect(r.right.balance).toBe(50);
  });

  it("openAccountAsync: 短い名前 → Left(ValidationError)", async () => {
    const r = await openAccountAsyncFp("Al", 50)();
    expect(E.isLeft(r)).toBe(true);
    if (E.isLeft(r)) expect(r.left.type).toBe("ValidationError");
  });
});
