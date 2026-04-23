import { describe, expect, it } from "bun:test";
import { processCsv, validateRow } from "./neverthrow";

describe("18: CSVバリデーション — 全エラー収集", () => {
  describe("validateRow", () => {
    it("全フィールド正常 → Ok(ValidRow)", () => {
      const result = validateRow({
        lineNumber: 1,
        name: "Alice",
        email: "alice@example.com",
        age: "25",
      });
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual({ name: "Alice", email: "alice@example.com", age: 25 });
      }
    });

    it("名前が不正(1文字) → Err([ValidationError])", () => {
      const result = validateRow({
        lineNumber: 1,
        name: "A",
        email: "alice@example.com",
        age: "25",
      });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.length).toBe(1);
        expect(result.error.some((e) => e.field === "name")).toBe(true);
        expect(result.error.some((e) => e.lineNumber === 1)).toBe(true);
      }
    });

    it("メールとageが不正 → Err(2件のエラー配列)", () => {
      const result = validateRow({
        lineNumber: 3,
        name: "Alice",
        email: "invalid-email",
        age: "abc",
      });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.length).toBe(2);
        expect(result.error.some((e) => e.field === "email")).toBe(true);
        expect(result.error.some((e) => e.field === "age")).toBe(true);
      }
    });

    it("全フィールドが不正 → Err(3件のエラー配列)", () => {
      const result = validateRow({
        lineNumber: 2,
        name: "A",
        email: "invalid",
        age: "abc",
      });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.length).toBe(3);
      }
    });

    it("年齢が範囲外(200) → Err([ValidationError])", () => {
      const result = validateRow({
        lineNumber: 4,
        name: "Bob",
        email: "bob@example.com",
        age: "200",
      });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.some((e) => e.field === "age")).toBe(true);
      }
    });
  });

  describe("processCsv", () => {
    const rows = [
      { lineNumber: 1, name: "Alice", email: "alice@example.com", age: "25" },
      { lineNumber: 2, name: "A", email: "invalid", age: "abc" },
      { lineNumber: 3, name: "Bob", email: "bob@example.com", age: "30" },
      { lineNumber: 4, name: "Charlie", email: "charlie@example.com", age: "200" },
    ];

    it("成功行と失敗行を正しく分類する", () => {
      const { successes, errors } = processCsv(rows);
      expect(successes.length).toBe(2);
      expect(errors.length).toBe(2);
    });

    it("成功行はValidRowとして返される", () => {
      const { successes } = processCsv(rows);
      const alice = successes.find((s) => s.name === "Alice");
      const bob = successes.find((s) => s.name === "Bob");
      expect(alice?.age).toBe(25);
      expect(bob?.age).toBe(30);
    });

    it("失敗行は行番号とエラー配列を持つ", () => {
      const { errors } = processCsv(rows);
      const line2 = errors.find((e) => e.lineNumber === 2);
      expect(line2).toBeDefined();
      expect((line2?.errors.length ?? 0) > 0).toBe(true);
    });

    it("全行が正常なら errors は空配列", () => {
      const { successes, errors } = processCsv([
        { lineNumber: 1, name: "Alice", email: "alice@example.com", age: "25" },
        { lineNumber: 2, name: "Bob", email: "bob@example.com", age: "30" },
      ]);
      expect(successes.length).toBe(2);
      expect(errors.length).toBe(0);
    });

    it("空配列を渡したら両方空", () => {
      const { successes, errors } = processCsv([]);
      expect(successes.length).toBe(0);
      expect(errors.length).toBe(0);
    });
  });
});
