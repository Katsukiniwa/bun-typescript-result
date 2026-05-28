import { describe, expect, it } from "bun:test";
import { Result } from "@praha/byethrow";
import * as E from "fp-ts/Either";
import { err, ok } from "neverthrow";
import {
  handleResult as handleByethrow,
  toErrorBody as toErrorBodyByethrow,
  toStatus as toStatusByethrow,
} from "./byethrow";
import {
  handleResult as handleFp,
  toErrorBody as toErrorBodyFp,
  toStatus as toStatusFp,
} from "./fp-ts";
import {
  handleResult as handleNeverthrow,
  toErrorBody as toErrorBodyNeverthrow,
  toStatus as toStatusNeverthrow,
} from "./neverthrow";

describe("neverthrow", () => {
  it("toStatus: NotFound → 404", () => {
    expect(toStatusNeverthrow({ type: "NotFound", resource: "user" })).toBe(404);
  });

  it("toStatus: ValidationError → 400", () => {
    expect(toStatusNeverthrow({ type: "ValidationError", message: "invalid" })).toBe(400);
  });

  it("toStatus: Unauthorized → 401", () => {
    expect(toStatusNeverthrow({ type: "Unauthorized" })).toBe(401);
  });

  it("toStatus: Conflict → 409", () => {
    expect(toStatusNeverthrow({ type: "Conflict", detail: "already exists" })).toBe(409);
  });

  it("toErrorBody: NotFound → code NOT_FOUND, message includes resource", () => {
    const body = toErrorBodyNeverthrow({ type: "NotFound", resource: "user" });
    expect(body.code).toBe("NOT_FOUND");
    expect(body.message).toBe("user not found");
  });

  it("handleResult: ok(42) → { status: 200, body: 42 }", () => {
    const res = handleNeverthrow(ok(42));
    expect(res).toEqual({ status: 200, body: 42 });
  });

  it("handleResult: err(NotFound) → { status: 404, body: { code: NOT_FOUND, ... } }", () => {
    const res = handleNeverthrow(err({ type: "NotFound", resource: "user" }));
    expect(res.status).toBe(404);
    expect((res.body as { code: string }).code).toBe("NOT_FOUND");
  });
});

describe("byethrow", () => {
  it("toStatus: NotFound → 404", () => {
    expect(toStatusByethrow({ type: "NotFound", resource: "user" })).toBe(404);
  });

  it("toStatus: ValidationError → 400", () => {
    expect(toStatusByethrow({ type: "ValidationError", message: "invalid" })).toBe(400);
  });

  it("toStatus: Unauthorized → 401", () => {
    expect(toStatusByethrow({ type: "Unauthorized" })).toBe(401);
  });

  it("toStatus: Conflict → 409", () => {
    expect(toStatusByethrow({ type: "Conflict", detail: "already exists" })).toBe(409);
  });

  it("toErrorBody: NotFound → code NOT_FOUND, message includes resource", () => {
    const body = toErrorBodyByethrow({ type: "NotFound", resource: "user" });
    expect(body.code).toBe("NOT_FOUND");
    expect(body.message).toBe("user not found");
  });

  it("handleResult: succeed(42) → { status: 200, body: 42 }", () => {
    const res = handleByethrow(Result.succeed(42));
    expect(res).toEqual({ status: 200, body: 42 });
  });

  it("handleResult: fail(NotFound) → { status: 404, body: { code: NOT_FOUND, ... } }", () => {
    const res = handleByethrow(Result.fail({ type: "NotFound", resource: "user" }));
    expect(res.status).toBe(404);
    expect((res.body as { code: string }).code).toBe("NOT_FOUND");
  });
});

describe("fp-ts", () => {
  it("toStatus: NotFound → 404", () => {
    expect(toStatusFp({ type: "NotFound", resource: "user" })).toBe(404);
  });

  it("toStatus: ValidationError → 400", () => {
    expect(toStatusFp({ type: "ValidationError", message: "invalid" })).toBe(400);
  });

  it("toStatus: Unauthorized → 401", () => {
    expect(toStatusFp({ type: "Unauthorized" })).toBe(401);
  });

  it("toStatus: Conflict → 409", () => {
    expect(toStatusFp({ type: "Conflict", detail: "already exists" })).toBe(409);
  });

  it("toErrorBody: NotFound → code NOT_FOUND, message includes resource", () => {
    const body = toErrorBodyFp({ type: "NotFound", resource: "user" });
    expect(body.code).toBe("NOT_FOUND");
    expect(body.message).toBe("user not found");
  });

  it("handleResult: right(42) → { status: 200, body: 42 }", () => {
    const res = handleFp(E.right(42));
    expect(res).toEqual({ status: 200, body: 42 });
  });

  it("handleResult: left(NotFound) → { status: 404, body: { code: NOT_FOUND, ... } }", () => {
    const res = handleFp(E.left({ type: "NotFound", resource: "user" }));
    expect(res.status).toBe(404);
    expect((res.body as { code: string }).code).toBe("NOT_FOUND");
  });
});
