import { describe, expect, it } from "bun:test";
import { validateForm, validateFormAllErrors } from "./neverthrow";

describe("15: combine() — 複数ResultをまとめてOk/Errにする", () => {
  describe("validateForm（1つでも失敗したらErr）", () => {
    it("全て成功したら全値の配列のOkを返す", () => {
      const result = validateForm({
        name: "Alice",
        email: "alice@example.com",
        age: 25,
      });
      expect(result.isOk()).toBe(true);
    });

    it("名前が不正ならErrを返す", () => {
      const result = validateForm({
        name: "Ab",
        email: "alice@example.com",
        age: 25,
      });
      expect(result.isErr()).toBe(true);
    });

    it("メールが不正ならErrを返す", () => {
      const result = validateForm({
        name: "Alice",
        email: "invalid",
        age: 25,
      });
      expect(result.isErr()).toBe(true);
    });

    it("複数失敗のとき最初のエラーを返す", () => {
      const result = validateForm({
        name: "Ab",
        email: "invalid",
        age: -1,
      });
      expect(result.isErr()).toBe(true);
    });
  });

  describe("validateFormAllErrors（全エラーを収集）", () => {
    it("全て成功したらOkを返す", () => {
      const result = validateFormAllErrors({
        name: "Alice",
        email: "alice@example.com",
        age: 25,
      });
      expect(result.isOk()).toBe(true);
    });

    it("複数失敗のとき全エラーの配列を返す", () => {
      const result = validateFormAllErrors({
        name: "Ab",
        email: "invalid",
        age: -1,
      });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        // 3つ全てのエラーが収集される
        expect(result.error.length).toBe(3);
      }
    });

    it("1つだけ失敗したとき1つのエラーが返る", () => {
      const result = validateFormAllErrors({
        name: "Ab",
        email: "alice@example.com",
        age: 25,
      });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.length).toBe(1);
      }
    });
  });
});
