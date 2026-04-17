import { describe, expect, it } from "bun:test";
import * as E from "fp-ts/Either";
import { fetchUser, fetchUserMessage } from "./answers/fp-ts";

// TaskEither は「関数」なので、実行するには末尾に () が必要
// const result = await fetchUser("1")();  ← () に注目！

describe("fp-ts TaskEither", () => {
  describe("fetchUser", () => {
    it("存在するID '1' → Right(User)", async () => {
      const result = await fetchUser("1")();
      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right).toEqual({ id: "1", name: "Alice" });
      }
    });

    it("存在するID '2' → Right(User)", async () => {
      const result = await fetchUser("2")();
      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right).toEqual({ id: "2", name: "Bob" });
      }
    });

    it("存在しないID '99' → Left(NotFoundError)", async () => {
      const result = await fetchUser("99")();
      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) {
        expect(result.left.type).toBe("NotFoundError");
        expect((result.left as { type: "NotFoundError"; id: string }).id).toBe("99");
      }
    });
  });

  describe("fetchUserMessage", () => {
    it("存在するID '1' → Right('こんにちは、Aliceさん！')", async () => {
      const result = await fetchUserMessage("1")();
      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right).toBe("こんにちは、Aliceさん！");
      }
    });

    it("存在しないID '99' → Left(NotFoundError)", async () => {
      const result = await fetchUserMessage("99")();
      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) {
        expect(result.left.type).toBe("NotFoundError");
      }
    });
  });
});
