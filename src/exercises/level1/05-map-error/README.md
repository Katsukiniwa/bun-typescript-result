# Level 1 - 05: mapErr() — エラーの変換

## このお題で学ぶこと

`.mapErr()` を使って、エラーResultの値を変換する方法を覚えます。

## mapErr() とは？

```typescript
ok(5).mapErr(e => `エラー: ${e}`)      // Ok(5) — 成功はそのまま
err("not found").mapErr(e => 404)     // Err(404) — エラーが変換される
```

`mapErr()` は `.map()` の逆で:
- Errのとき: 関数を適用して新しいErrを返す
- Okのとき: 何もせずOkをそのまま返す

エラーの型を変換したいときに使います。例えば、内部エラー（string）をAPIのエラーレスポンス型に変換するなど。

## 問題

### `addErrorPrefix(result, prefix): Result<number, string>`
エラーメッセージにprefixを追加する

### `toErrorCode(result): Result<string, number>`
"not_found" → 404, "unauthorized" → 401, その他 → 500

### `wrapInErrorObject(result): Result<string, { message: string; timestamp: number }>`
文字列エラーを構造化エラーオブジェクトに変換する

## テスト実行

```bash
bun test src/exercises/level1/05-map-error/index.test.ts
```
