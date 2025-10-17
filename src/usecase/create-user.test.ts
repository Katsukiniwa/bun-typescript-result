import { describe, expect, it } from "bun:test";
import { createUser } from "./create-user";

describe("createUser usecase", () => {
  it("正常にユーザーを作成できる", async () => {
    const result = createUser("Alice");

    expect(result.isOk()).toBe(true);

    if (result.isOk()) {
      const user = result.value;
      expect(user.name).toBe("Alice");
      expect(typeof user.id).toBe("number");
    }
  });

  it("名前が短すぎる場合はエラーを返す", async () => {
    const result = createUser("Bo");

    expect(result.isErr()).toBe(true);

    if (result.isErr()) {
      expect(result.error).toContain("Name must be at least 3 characters");
    }
  });
});
