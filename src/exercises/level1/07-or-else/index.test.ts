import { describe, expect, it } from "bun:test";
import { err, ok } from "neverthrow";
import { escalateError, retryWithFallback, withDefault } from "./neverthrow";

describe("07: orElse() — エラーからの回復", () => {
  describe("withDefault", () => {
    it("ErrのときデフォルトOkで回復する", () => {
      const result = withDefault(err("失敗"), 0);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) expect(result.value).toBe(0);
    });

    it("Okのときはそのままの値", () => {
      const result = withDefault(ok(42), 0);
      expect(result.isOk()).toBe(true);
      if (result.isOk()) expect(result.value).toBe(42);
    });
  });

  describe("retryWithFallback", () => {
    it("primaryが成功ならprimaryの値", () => {
      const result = retryWithFallback(ok("primary"), ok("fallback"));
      expect(result.isOk()).toBe(true);
      if (result.isOk()) expect(result.value).toBe("primary");
    });

    it("primaryが失敗してfallbackが成功なら回復", () => {
      const result = retryWithFallback(err("primary失敗"), ok("fallback"));
      expect(result.isOk()).toBe(true);
      if (result.isOk()) expect(result.value).toBe("fallback");
    });

    it("両方失敗したら失敗", () => {
      const result = retryWithFallback(err("primary失敗"), err("fallback失敗"));
      expect(result.isErr()).toBe(true);
      if (result.isErr()) expect(result.error).toBe("fallback失敗");
    });
  });

  describe("escalateError", () => {
    it("'軽微エラー'はOk(0)で回復する", () => {
      const result = escalateError(err("軽微エラー"));
      expect(result.isOk()).toBe(true);
      if (result.isOk()) expect(result.value).toBe(0);
    });

    it("その他のエラーは'重大エラー'に変換", () => {
      const result = escalateError(err("未知のエラー"));
      expect(result.isErr()).toBe(true);
      if (result.isErr()) expect(result.error).toBe("重大エラー");
    });

    it("Okはそのまま通過", () => {
      const result = escalateError(ok(5));
      expect(result.isOk()).toBe(true);
      if (result.isOk()) expect(result.value).toBe(5);
    });
  });
});
