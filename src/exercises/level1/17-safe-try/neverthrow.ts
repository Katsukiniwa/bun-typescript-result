import { type Result, err, ok, safeTry } from "neverthrow";

type User = { id: number; name: string; age: number };
type Product = { id: number; name: string; price: number; stock: number };
type OrderInput = { userId: number; productId: number; quantity: number };
type OrderResult = { orderId: string; userId: number; productId: number; total: number };

const users: User[] = [
  { id: 1, name: "Alice", age: 20 },
  { id: 2, name: "Bob", age: 17 },
];

const products: Product[] = [
  { id: 1, name: "商品A", price: 1000, stock: 5 },
  { id: 2, name: "商品B", price: 500, stock: 0 },
];

export const findUser = (id: number): Result<User, string> => {
  const user = users.find((u) => u.id === id);
  return user ? ok(user) : err(`ユーザー(id=${id})が見つかりません`);
};

export const verifyAge = (user: User): Result<User, string> =>
  user.age >= 18 ? ok(user) : err(`未成年者(${user.name})は購入できません`);

export const findProduct = (id: number): Result<Product, string> => {
  const product = products.find((p) => p.id === id);
  return product ? ok(product) : err(`商品(id=${id})が見つかりません`);
};

export const checkStock = (product: Product, quantity: number): Result<Product, string> =>
  product.stock >= quantity
    ? ok(product)
    : err(`在庫不足: ${product.name}の在庫は${product.stock}個です`);

/**
 * safeTry を使って注文処理を実装する
 * ユーザー検索 → 年齢確認 → 商品検索 → 在庫確認 → 注文確定
 *
 * @hint safeTry(function* () { ... }) の中で yield* を使うと Result を unwrap できます
 * @hint const user = yield* findUser(input.userId);
 *       → 成功なら user に値が入り、失敗なら即座に Err が返る（Rustの ? 演算子と同じ）
 * @hint 最後は ok({ orderId, ... }) を return してください
 */
export const placeOrder = (input: OrderInput): Result<OrderResult, string> => {
  return safeTry(function* () {
    const user = yield* findUser(input.userId).safeUnwrap();
    yield* verifyAge(user).safeUnwrap();
    const product = yield* findProduct(input.productId).safeUnwrap()
    yield* checkStock(product, input.quantity).safeUnwrap()
    return ok({
      orderId: `ORDER-${Date.now()}`,
      userId: user.id,
      productId: product.id,
      total: product.price * input.quantity,
    });
  })
};

// safeTry の使い方メモ（削除して実装してください）
// return safeTry(function* () {
//   const user = yield* findUser(input.userId).safeUnwrap();
//   ...
//   return ok({ ... });
// });
