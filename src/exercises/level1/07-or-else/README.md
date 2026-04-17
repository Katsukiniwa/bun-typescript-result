# Level 1 - 07: orElse() — エラーからの回復

## このお題で学ぶこと

`.orElse()` を使って、失敗Resultをリカバリーする方法を覚えます。

## orElse() とは？

```typescript
err("失敗").orElse(() => ok(0))   // Ok(0) — エラーからデフォルト値で回復
ok(5).orElse(() => ok(0))        // Ok(5) — 成功はそのまま

// エラーを見て回復方法を変えることも
err("not_found").orElse(e =>
  e === "not_found" ? ok(defaultValue) : err(e)
)
```

`andThen` がOkに対して働くのに対し、`orElse` はErrに対して働きます。

## 問題

### `withDefault(result, defaultValue): Result<number, string>`
Errのときdefault値で回復する

### `retryWithFallback(primary, fallback): Result<string, string>`
primaryが失敗したらfallbackを試す

### `escalateError(result): Result<number, string>`
"軽微エラー" はデフォルト値0で回復、それ以外は "重大エラー" に変換する

## テスト実行

```bash
bun test src/exercises/level1/07-or-else/index.test.ts
```
