# Level 1 - 14: mapErr() — エラー型の変換

## このお題で学ぶこと

`mapErr()` を使って、エラーの型を別の型に変換する方法を覚えます。

## mapErr() とは？

`map()` が Ok の値を変換するのに対し、`mapErr()` は Err の値を変換します。
Ok の場合はそのまま通過します。

```typescript
// map: Ok の値を変換
ok(5).map(n => n * 2)         // Ok(10)
err("エラー").map(n => n * 2) // Err("エラー") — そのまま

// mapErr: Err の値を変換
ok(5).mapErr(e => `${e}!`)         // Ok(5) — そのまま
err("エラー").mapErr(e => `${e}!`) // Err("エラー!")
```

## なぜエラー変換が必要か？

アーキテクチャの層（レイヤー）ごとにエラー型が異なります。

```
DBレイヤー:    Result<User, DBError>
ドメイン層:    Result<User, DomainError>
HTTPハンドラー: Result<User, HttpError>
```

`mapErr()` で層を跨ぐときにエラー型を変換できます。

## 問題

### `toHttpError(error): Result<never, HttpError>`

- `NOT_FOUND` → `{ statusCode: 404, message: ... }`
- `UNAUTHORIZED` → `{ statusCode: 401, message: ... }`
- その他 → `{ statusCode: 500, message: ... }`

### `toUserFacingMessage(error): Result<never, string>`

- エラーをユーザー向けの文字列メッセージに変換する

## テスト実行

```bash
bun test src/exercises/level1/14-error-transform/index.test.ts
```

## ヒント

```typescript
result.mapErr(e => {
  // e は元のエラー型
  // 新しいエラー型を返す
  return { statusCode: 404, message: e.detail };
});
```

`mapErr` の中では元のエラー値 `e` にアクセスできます。
