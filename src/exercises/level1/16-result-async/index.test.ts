import { describe, expect, it } from "bun:test";
import { fetchUser, fetchUserName, fetchUserWithRole } from "./neverthrow";

describe("16: ResultAsync — 非同期パイプライン", () => {
  describe("fetchUser", () => {
    it("有効なID → Ok(User)", async () => {
      const result = await fetchUser(1);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.id).toBe(1);
        expect(result.value.name).toBe("User1");
        expect(result.value.email).toBe("user1@example.com");
      }
    });

    it("不正なID(0以下) → Err(NetworkError)", async () => {
      const result = await fetchUser(0);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe("NetworkError");
      }
    });

    it("存在しないID(999) → Err(NetworkError)", async () => {
      const result = await fetchUser(999);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe("NetworkError");
      }
    });
  });

  describe("fetchUserName", () => {
    it("有効なID → Ok(name文字列)", async () => {
      const result = await fetchUserName(1);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe("User1");
      }
    });

    it("ID=2 → Ok('User2')", async () => {
      const result = await fetchUserName(2);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toBe("User2");
      }
    });

    it("不正なID → Err（fetchUserのエラーが伝播する）", async () => {
      const result = await fetchUserName(0);
      expect(result.isErr()).toBe(true);
    });
  });

  describe("fetchUserWithRole", () => {
    it("ID=1 → Ok({ user, role: 'admin' })", async () => {
      const result = await fetchUserWithRole(1);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.user.name).toBe("User1");
        expect(result.value.role).toBe("admin");
      }
    });

    it("ID=2 → Ok({ user, role: 'member' })", async () => {
      const result = await fetchUserWithRole(2);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.user.name).toBe("User2");
        expect(result.value.role).toBe("member");
      }
    });

    it("不正なID → Err", async () => {
      const result = await fetchUserWithRole(999);
      expect(result.isErr()).toBe(true);
    });
  });
});
