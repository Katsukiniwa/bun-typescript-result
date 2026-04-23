import { type Result, ok, safeTry } from "neverthrow";
import { checkStock, findProduct, findUser, verifyAge } from "../neverthrow";

type OrderInput = { userId: number; productId: number; quantity: number };
type OrderResult = { orderId: string; userId: number; productId: number; total: number };

export const placeOrder = (input: OrderInput): Result<OrderResult, string> =>
  safeTry(function* () {
    const user = yield* findUser(input.userId).safeUnwrap();
    yield* verifyAge(user).safeUnwrap();
    const product = yield* findProduct(input.productId).safeUnwrap();
    yield* checkStock(product, input.quantity).safeUnwrap();

    return ok({
      orderId: `ORDER-${Date.now()}`,
      userId: user.id,
      productId: product.id,
      total: product.price * input.quantity,
    });
  });
