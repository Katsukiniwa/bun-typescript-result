import { describe, expect, it } from "bun:test";
import { divide, divideAndSqrt, sqrt } from "./neverthrow";

describe("06: andThen() — Resultを返す関数との連鎖", () => {
  describe("divide", () => {
    it("10 ÷ 2 = 5", () => {
      const result = divide(10, 2);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) expect(result.value).toBe(5);
    });

    it("ゼロ除算はエラー", () => {
      const result = divide(10, 0);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) expect(result.error).toBe("ゼロ除算エラー");
    });
  });

  describe("sqrt", () => {
    it("Ok(4) → Ok(2)", () => {
      const result = sqrt(divide(4, 1));
      expect(result.isOk()).toBe(true);
      if (result.isOk()) expect(result.value).toBe(2);
    });

    it("負の数はエラー", () => {
      const result = sqrt(divide(-4, 1));
      expect(result.isErr()).toBe(true);
      if (result.isErr()) expect(result.error).toBe("負の数の平方根は計算できません");
    });

    it("前のステップがErrなら連鎖しない", () => {
      const result = sqrt(divide(10, 0));
      expect(result.isErr()).toBe(true);
      if (result.isErr()) expect(result.error).toBe("ゼロ除算エラー");
    });
  });

  describe("divideAndSqrt", () => {
    it("16 ÷ 4 = 4 → √4 = 2", () => {
      const result = divideAndSqrt(16, 4);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) expect(result.value).toBe(2);
    });

    it("ゼロ除算で失敗した場合は平方根は計算されない", () => {
      const result = divideAndSqrt(16, 0);
      expect(result.isErr()).toBe(true);
      if (result.isErr()) expect(result.error).toBe("ゼロ除算エラー");
    });
  });
});
