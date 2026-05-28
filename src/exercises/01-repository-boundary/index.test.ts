import { describe, expect, it } from "bun:test";
import { Result } from "@praha/byethrow";
import * as E from "fp-ts/Either";
import {
  fetchUser as fetchByethrow,
  findUser as findByethrow,
  getUserEmail as getEmailByethrow,
  safeParseUser as parseByethrow,
} from "./byethrow";
import {
  fetchUser as fetchFp,
  findUser as findFp,
  getUserEmail as getEmailFp,
  safeParseUser as parseFp,
} from "./fp-ts";
import {
  fetchUser as fetchNeverthrow,
  findUser as findNeverthrow,
  getUserEmail as getEmailNeverthrow,
  safeParseUser as parseNeverthrow,
} from "./neverthrow";

const VALID_JSON = '{"id":1,"name":"Alice","email":"alice@example.com"}';
const BROKEN_JSON = "{ broken";

describe("neverthrow", () => {
  it("safeParseUser: 正しいJSON → Ok(User)", () => {
    const r = parseNeverthrow(VALID_JSON);
    expect(r.isOk()).toBe(true);
    if (r.isOk()) expect(r.value.name).toBe("Alice");
  });

  it("safeParseUser: 壊れたJSON → Err(ParseError)", () => {
    const r = parseNeverthrow(BROKEN_JSON);
    expect(r.isErr()).toBe(true);
    if (r.isErr()) expect(r.error.type).toBe("ParseError");
  });

  it("findUser: 存在 → Ok(User)", () => {
    const r = findNeverthrow(1);
    expect(r.isOk()).toBe(true);
    if (r.isOk()) expect(r.value.id).toBe(1);
  });

  it("findUser: 不在 → Err(NotFound)", () => {
    const r = findNeverthrow(999);
    expect(r.isErr()).toBe(true);
    if (r.isErr()) expect(r.error.type).toBe("NotFound");
  });

  it("getUserEmail: 存在 → Ok(email)", () => {
    const r = getEmailNeverthrow(2);
    expect(r.isOk()).toBe(true);
    if (r.isOk()) expect(r.value).toBe("bob@example.com");
  });

  it("fetchUser: 存在 → Ok(User)", async () => {
    const r = await fetchNeverthrow(1);
    expect(r.isOk()).toBe(true);
  });

  it("fetchUser: 不在 → Err(NotFound)", async () => {
    const r = await fetchNeverthrow(999);
    expect(r.isErr()).toBe(true);
    if (r.isErr()) expect(r.error.type).toBe("NotFound");
  });
});

describe("byethrow", () => {
  it("safeParseUser: 正しいJSON → Success(User)", () => {
    const r = parseByethrow(VALID_JSON);
    expect(Result.isSuccess(r)).toBe(true);
    if (Result.isSuccess(r)) expect(r.value.name).toBe("Alice");
  });

  it("safeParseUser: 壊れたJSON → Failure(ParseError)", () => {
    const r = parseByethrow(BROKEN_JSON);
    expect(Result.isFailure(r)).toBe(true);
    if (Result.isFailure(r)) expect(r.error.type).toBe("ParseError");
  });

  it("findUser: 存在 → Success(User)", () => {
    const r = findByethrow(1);
    expect(Result.isSuccess(r)).toBe(true);
    if (Result.isSuccess(r)) expect(r.value.id).toBe(1);
  });

  it("findUser: 不在 → Failure(NotFound)", () => {
    const r = findByethrow(999);
    expect(Result.isFailure(r)).toBe(true);
    if (Result.isFailure(r)) expect(r.error.type).toBe("NotFound");
  });

  it("getUserEmail: 存在 → Success(email)", () => {
    const r = getEmailByethrow(2);
    expect(Result.isSuccess(r)).toBe(true);
    if (Result.isSuccess(r)) expect(r.value).toBe("bob@example.com");
  });

  it("fetchUser: 不在 → Failure(NotFound)", async () => {
    const r = await fetchByethrow(999);
    expect(Result.isFailure(r)).toBe(true);
    if (Result.isFailure(r)) expect(r.error.type).toBe("NotFound");
  });
});

describe("fp-ts", () => {
  it("safeParseUser: 正しいJSON → Right(User)", () => {
    const r = parseFp(VALID_JSON);
    expect(E.isRight(r)).toBe(true);
    if (E.isRight(r)) expect(r.right.name).toBe("Alice");
  });

  it("safeParseUser: 壊れたJSON → Left(ParseError)", () => {
    const r = parseFp(BROKEN_JSON);
    expect(E.isLeft(r)).toBe(true);
    if (E.isLeft(r)) expect(r.left.type).toBe("ParseError");
  });

  it("findUser: 存在 → Right(User)", () => {
    const r = findFp(1);
    expect(E.isRight(r)).toBe(true);
    if (E.isRight(r)) expect(r.right.id).toBe(1);
  });

  it("findUser: 不在 → Left(NotFound)", () => {
    const r = findFp(999);
    expect(E.isLeft(r)).toBe(true);
    if (E.isLeft(r)) expect(r.left.type).toBe("NotFound");
  });

  it("getUserEmail: 存在 → Right(email)", () => {
    const r = getEmailFp(2);
    expect(E.isRight(r)).toBe(true);
    if (E.isRight(r)) expect(r.right).toBe("bob@example.com");
  });

  it("fetchUser: 不在 → Left(NotFound)", async () => {
    const r = await fetchFp(999)();
    expect(E.isLeft(r)).toBe(true);
    if (E.isLeft(r)) expect(r.left.type).toBe("NotFound");
  });
});
