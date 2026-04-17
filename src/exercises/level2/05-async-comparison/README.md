# Level 2 - 05: 非同期 Result 比較 — neverthrow vs byethrow

## このお題で学ぶこと

非同期処理を Result でラップする方法を両ライブラリで比較します。
Promise のエラーを型安全に扱う手法を学びます。

## API 比較

| 操作 | neverthrow | byethrow |
|------|-----------|---------|
| 非同期Resultの型 | `ResultAsync<T, E>` | `Result.ResultAsync<T, E>` = `Promise<Result.Result<T, E>>` |
| Promiseをラップ | `fromPromise(promise, errMapper)` | `Result.fn({ try, catch })` |
| 非同期エラーを返す | `errAsync(error)` | `throw` して `catch` でキャッチ |
| 非同期成功を返す | `okAsync(value)` | `return value`（`try` の中で） |

## 内部表現の違い

```typescript
// neverthrow: ResultAsync は Promise<Result<T,E>> のラッパークラス
// チェーンも ResultAsync のまま続けられる
const result: ResultAsync<User, AppError> = fromPromise(fetch(...), errorMapper);

// byethrow: ResultAsync は単なる Promise<Result<T,E>> の型エイリアス
// await して Result を取り出してから操作する
const result: Result.ResultAsync<User, AppError> = fetchUserFn(id);
const resolved = await result; // Result.Result<User, AppError>
```

## neverthrow のアプローチ

```typescript
// Promise を Result でラップ
fromPromise(promise, e => ({ type: "DatabaseError", message: String(e) }))

// エラーを直接返す
errAsync({ type: "NotFoundError", id })
```

## byethrow のアプローチ

```typescript
// Result.fn で try/catch を Result に変換
const fn = Result.fn({
  try: async (id: string) => {
    const user = db[id];
    if (!user) throw { type: "NotFoundError", id }; // ← throw でエラーを表現
    return user;
  },
  catch: (e: unknown): AppError => e as AppError, // ← catch でエラーをマップ
});
```

## 問題

### neverthrow.ts の `fetchUser` を実装してください

### byethrow.ts の `fetchUser` を実装してください

## テスト実行

```bash
bun test src/exercises/level2/05-async-comparison/index.test.ts
```
