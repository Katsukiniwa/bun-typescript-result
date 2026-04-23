# Level 1 - 16: ResultAsync — 非同期パイプライン

## このお題で学ぶこと

`ResultAsync` を使って、Promise ベースの非同期処理をResult型で扱う方法を覚えます。

## ResultAsync とは？

`ResultAsync<T, E>` は `Promise<Result<T, E>>` を薄くラップしたもので、
Promise チェーンの中でも `.map()` や `.andThen()` が使えます。

```typescript
// Promise を ResultAsync に変換
const result = ResultAsync.fromPromise(
  fetch("/api/user"),        // 失敗する可能性がある Promise
  (e) => ({ type: "NetworkError", message: String(e) })  // エラーマッパー
);

// 絶対に失敗しない Promise をラップ
const result2 = ResultAsync.fromSafePromise(
  Promise.resolve(42)
);

// ResultAsync にも .map() と .andThen() が使える
result
  .map(user => user.name)           // 成功値を変換
  .andThen(name => fetchRole(name)) // 別の ResultAsync にチェーン
```

## 問題

### `fetchUser(id): ResultAsync<User, ApiError>`
`userApi.getUser(id)` をラップする。失敗したら `type: "NetworkError"` のエラーに変換する。

### `fetchUserName(id): ResultAsync<string, ApiError>`
`fetchUser` を使ってユーザー名だけ取り出す。

### `fetchUserWithRole(id): ResultAsync<{ user, role }, ApiError>`
`fetchUser` でユーザーを取得後、`userApi.getRole()` でロールを付与する。

## 使うAPI

```typescript
import { ResultAsync } from "neverthrow";

ResultAsync.fromPromise(promise, errorMapper)  // 失敗する可能性があるPromiseをラップ
ResultAsync.fromSafePromise(promise)           // 失敗しないPromiseをラップ
resultAsync.map(value => newValue)             // 成功値を変換
resultAsync.andThen(value => anotherResultAsync) // ResultAsync をチェーン
```

## テスト実行

```bash
bun test src/exercises/level1/16-result-async/index.test.ts
```

## ヒント

`ResultAsync` はほぼ `Result` と同じ感覚で使えます。
`await resultAsync` すると通常の `Result` として扱えます。
