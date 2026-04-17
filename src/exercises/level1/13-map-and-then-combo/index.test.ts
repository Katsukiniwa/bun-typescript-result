import { describe, expect, it } from "bun:test";
import { processInput } from "./neverthrow";

describe("13: map + andThen コンボ — 変換と検証を組み合わせる", () => {
  describe("processInput", () => {
    it("正しい入力で処理済みオブジェクトを返す", () => {
      const result = processInput({ rawName: "  alice  ", rawAge: "25" });
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.name).toBe("ALICE");
        expect(result.value.age).toBe(25);
      }
    });

    it("空白だけの名前でErrを返す", () => {
      const result = processInput({ rawName: "   ", rawAge: "25" });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toContain("name");
      }
    });

    it("数値でない年齢文字列でErrを返す", () => {
      const result = processInput({ rawName: "Alice", rawAge: "abc" });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toContain("age");
      }
    });

    it("負の年齢でErrを返す", () => {
      const result = processInput({ rawName: "Alice", rawAge: "-5" });
      expect(result.isErr()).toBe(true);
    });

    it("名前は大文字化・トリムされる", () => {
      const result = processInput({ rawName: "  bob  ", rawAge: "30" });
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.name).toBe("BOB");
      }
    });
  });
});
