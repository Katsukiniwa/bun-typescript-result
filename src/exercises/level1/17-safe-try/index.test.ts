import { describe, expect, it } from "bun:test";
import { placeOrder } from "./neverthrow";

describe("17: safeTry — ジェネレータで連続チェーン", () => {
  describe("placeOrder", () => {
    it("正常な注文 → Ok(OrderResult)", () => {
      const result = placeOrder({ userId: 1, productId: 1, quantity: 2 });
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.total).toBe(2000);
        expect(result.value.userId).toBe(1);
        expect(result.value.productId).toBe(1);
        expect(result.value.orderId).toBeTruthy();
      }
    });

    it("数量1でも正常に注文できる", () => {
      const result = placeOrder({ userId: 1, productId: 1, quantity: 1 });
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.total).toBe(1000);
      }
    });

    it("存在しないユーザー(id=999) → Err(ユーザーが見つからない旨のメッセージ)", () => {
      const result = placeOrder({ userId: 999, productId: 1, quantity: 1 });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toContain("ユーザー");
      }
    });

    it("未成年ユーザー(id=2) → Err(未成年者は購入できない旨のメッセージ)", () => {
      const result = placeOrder({ userId: 2, productId: 1, quantity: 1 });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toContain("未成年");
      }
    });

    it("在庫切れ商品(id=2) → Err(在庫不足の旨のメッセージ)", () => {
      const result = placeOrder({ userId: 1, productId: 2, quantity: 1 });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toContain("在庫");
      }
    });

    it("在庫数を超える注文 → Err(在庫不足)", () => {
      const result = placeOrder({ userId: 1, productId: 1, quantity: 99 });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toContain("在庫");
      }
    });

    it("存在しない商品(id=999) → Err", () => {
      const result = placeOrder({ userId: 1, productId: 999, quantity: 1 });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toContain("商品");
      }
    });
  });
});
