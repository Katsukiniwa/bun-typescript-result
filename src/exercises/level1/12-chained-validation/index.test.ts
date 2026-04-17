import { describe, expect, it } from "bun:test";
import { type User, createUser } from "./neverthrow";

describe("12: 連鎖バリデーション — andThenでステップを繋ぐ", () => {
  describe("createUser", () => {
    it("全項目正常でUserオブジェクトのOkを返す", () => {
      const result = createUser({ name: "Alice", email: "alice@example.com", age: 25 });
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const user: User = result.value;
        expect(user.name).toBe("Alice");
        expect(user.email).toBe("alice@example.com");
        expect(user.age).toBe(25);
      }
    });

    it("名前が不正のとき最初のエラーを返す", () => {
      const result = createUser({ name: "Ab", email: "alice@example.com", age: 25 });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.field).toBe("name");
      }
    });

    it("メールが不正のとき2番目のエラーを返す（名前が正常の場合）", () => {
      const result = createUser({ name: "Alice", email: "invalid", age: 25 });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.field).toBe("email");
      }
    });

    it("年齢が不正のとき3番目のエラーを返す（名前・メールが正常の場合）", () => {
      const result = createUser({ name: "Alice", email: "alice@example.com", age: -1 });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.field).toBe("age");
      }
    });

    it("最初のエラーで短絡評価される（名前エラーのとき、他はチェックされない）", () => {
      // 名前もメールも年齢も全て不正 → 最初の名前エラーのみ返る
      const result = createUser({ name: "Ab", email: "invalid", age: -1 });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.field).toBe("name");
      }
    });
  });
});
