import { describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import { createUser } from "./create-user";

describe("createUser usecase", () => {
  it("正常にユーザーを作成できる", async () => {
    const userName = faker.person.firstName();
    const result = createUser(userName);

    expect(result.isOk()).toBe(true);

    if (result.isOk()) {
      const user = result.value;
      expect(user.name).toBe(userName);
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
