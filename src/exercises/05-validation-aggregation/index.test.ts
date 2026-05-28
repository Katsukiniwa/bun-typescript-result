import { describe, expect, it } from "bun:test";
import { Result } from "@praha/byethrow";
import * as E from "fp-ts/Either";
import { validateForm as validateByethrow } from "./byethrow";
import { validateForm as validateFp } from "./fp-ts";
import { validateForm as validateNeverthrow } from "./neverthrow";

const VALID = { name: "Alice", email: "a@b.com", age: 30 };
const ALL_INVALID = { name: "", email: "bad", age: -1 };
const ONE_INVALID = { name: "Alice", email: "bad", age: 30 };

describe("neverthrow", () => {
  it("validateForm: 全項目OK → Ok(ValidUser)", () => {
    const r = validateNeverthrow(VALID);
    expect(r.isOk()).toBe(true);
    if (r.isOk()) expect(r.value.name).toBe("Alice");
  });

  it("validateForm: 全項目NG → Err(全3件のFieldError)", () => {
    const r = validateNeverthrow(ALL_INVALID);
    expect(r.isErr()).toBe(true);
    if (r.isErr()) expect(r.error.length).toBe(3);
  });

  it("validateForm: 1項目NG → Err(1件・emailのみ)", () => {
    const r = validateNeverthrow(ONE_INVALID);
    expect(r.isErr()).toBe(true);
    if (r.isErr()) {
      expect(r.error.length).toBe(1);
      expect(r.error[0]?.field).toBe("email");
    }
  });
});

describe("byethrow", () => {
  it("validateForm: 全項目OK → Success(ValidUser)", () => {
    const r = validateByethrow(VALID);
    expect(Result.isSuccess(r)).toBe(true);
    if (Result.isSuccess(r)) expect(r.value.name).toBe("Alice");
  });

  it("validateForm: 全項目NG → Failure(全3件のFieldError)", () => {
    const r = validateByethrow(ALL_INVALID);
    expect(Result.isFailure(r)).toBe(true);
    if (Result.isFailure(r)) expect(r.error.length).toBe(3);
  });

  it("validateForm: 1項目NG → Failure(1件・emailのみ)", () => {
    const r = validateByethrow(ONE_INVALID);
    expect(Result.isFailure(r)).toBe(true);
    if (Result.isFailure(r)) {
      expect(r.error.length).toBe(1);
      expect(r.error[0]?.field).toBe("email");
    }
  });
});

describe("fp-ts", () => {
  it("validateForm: 全項目OK → Right(ValidUser)", () => {
    const r = validateFp(VALID);
    expect(E.isRight(r)).toBe(true);
    if (E.isRight(r)) expect(r.right.name).toBe("Alice");
  });

  it("validateForm: 全項目NG → Left(全3件のFieldError)", () => {
    const r = validateFp(ALL_INVALID);
    expect(E.isLeft(r)).toBe(true);
    if (E.isLeft(r)) expect(r.left.length).toBe(3);
  });

  it("validateForm: 1項目NG → Left(1件・emailのみ)", () => {
    const r = validateFp(ONE_INVALID);
    expect(E.isLeft(r)).toBe(true);
    if (E.isLeft(r)) {
      expect(r.left.length).toBe(1);
      expect(r.left[0]?.field).toBe("email");
    }
  });
});
