# Level 1 - 17: safeTry — ジェネレータで連続チェーン

## このお題で学ぶこと

`safeTry` を使って、複数の Result を連続してチェーンする方法を覚えます。

## safeTry とは？

複数の Result をネストした `.andThen()` でチェーンすると深くなりがちです。

```typescript
// andThen を連続すると深くなる
const result = findUser(userId)
  .andThen(user => verifyAge(user)
    .andThen(_ => findProduct(productId)
      .andThen(product => checkStock(product, qty)
        .andThen(_ => ok({ ... }))
      )
    )
  );
```

`safeTry` を使うと Rust の `?` 演算子のようにフラットに書けます：

```typescript
const result = safeTry(function* () {
  const user = yield* findUser(userId).safeUnwrap();
  yield* verifyAge(user).safeUnwrap();
  const product = yield* findProduct(productId).safeUnwrap();
  yield* checkStock(product, qty).safeUnwrap();
  return ok({ ... });
});
```

`yield* result.safeUnwrap()` は：
- **成功**なら値を取り出してジェネレータを続ける
- **失敗**なら即座に Err を返してジェネレータを終了する

## 問題

### `placeOrder(input): Result<OrderResult, string>`

以下のステップを `safeTry` で連続チェーンして実装してください：

1. `findUser(input.userId)` — ユーザーを検索
2. `verifyAge(user)` — 年齢確認（18歳未満は NG）
3. `findProduct(input.productId)` — 商品を検索
4. `checkStock(product, input.quantity)` — 在庫確認
5. 全て成功したら `ok({ orderId, userId, productId, total })` を返す

## 使うAPI

```typescript
import { safeTry } from "neverthrow";

const result = safeTry(function* () {
  const value = yield* someResult.safeUnwrap(); // unwrap or short-circuit
  return ok(value);
});
```

## テスト実行

```bash
bun test src/exercises/level1/17-safe-try/index.test.ts
```

## ヒント

`safeTry` の中は同期的に見えますが、実際には Result のチェーンです。
`yield*` と `.safeUnwrap()` はセットで使います。
