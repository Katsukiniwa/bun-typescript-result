import { describe, expect, it } from "bun:test";
import { Result } from "@praha/byethrow";
import { fetchUser as fetchUserByethrow } from "./byethrow";
import { fetchUser as fetchUserNeverthrow } from "./neverthrow";

describe("neverthrow", () => {
  describe("fetchUser", () => {
    it("存在するID '1' → Ok(User)", async () => {
      const result = await fetchUserNeverthrow("1");
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual({ id: "1", name: "Alice" });
      }
    });

    it("存在するID '2' → Ok(User)", async () => {
      const result = await fetchUserNeverthrow("2");
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual({ id: "2", name: "Bob" });
      }
    });

    it("存在しないID '99' → Err(NotFoundError)", async () => {
      const result = await fetchUserNeverthrow("99");
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe("NotFoundError");
        expect((result.error as { type: "NotFoundError"; id: string }).id).toBe("99");
      }
    });
  });
});

describe("byethrow", () => {
  describe("fetchUser", () => {
    it("存在するID '1' → Success(User)", async () => {
      const result = await fetchUserByethrow("1");
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value).toEqual({ id: "1", name: "Alice" });
      }
    });

    it("存在するID '2' → Success(User)", async () => {
      const result = await fetchUserByethrow("2");
      expect(Result.isSuccess(result)).toBe(true);
      if (Result.isSuccess(result)) {
        expect(result.value).toEqual({ id: "2", name: "Bob" });
      }
    });

    it("存在しないID '99' → Failure(NotFoundError)", async () => {
      const result = await fetchUserByethrow("99");
      expect(Result.isFailure(result)).toBe(true);
      if (Result.isFailure(result)) {
        expect(result.error.type).toBe("NotFoundError");
        expect((result.error as { type: "NotFoundError"; id: string }).id).toBe("99");
      }
    });
  });
});
