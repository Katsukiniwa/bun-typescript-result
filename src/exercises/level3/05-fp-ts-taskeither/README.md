# Level 3 - 05: fp-ts TaskEither（非同期エラーハンドリング）

## このお題で学ぶこと

fp-ts の `TaskEither` を使った非同期処理のエラーハンドリングを学びます。
neverthrow の `ResultAsync`、byethrow の `ResultAsync` に相当しますが、**関数として呼び出す**点が異なります。

## TaskEither とは

```typescript
// TaskEither<E, A> の実体は「() => Promise<Either<E, A>>」という関数
type TaskEither<E, A> = () => Promise<Either<E, A>>;
```

重要: TaskEither は **Promise ではなく、Promise を返す関数** です。

```typescript
const myTaskEither: TE.TaskEither<Error, User> = TE.tryCatch(
  async () => fetchUser(),
  (e) => new Error(String(e))
);

// ❌ これは Wrong: Promise<Either> を await しているのではない
// const result = await myTaskEither;

// ✅ 正しい: 関数として呼び出してから await する
const result = await myTaskEither(); // 末尾の () が必要！
```

## 3ライブラリ比較

| 操作 | neverthrow | byethrow | fp-ts |
|------|-----------|---------|-------|
| 非同期ラップ | `fromPromise(p, e)` | `Result.fn({ try, catch })` | `TE.tryCatch(tryFn, catchFn)` |
| 成功変換 | `.map(fn)` | `Result.map(fn)` | `pipe(te, TE.map(fn))` |
| 連鎖 | `.andThen(fn)` | `Result.andThen(fn)` | `pipe(te, TE.chain(fn))` |
| 実行 | `await resultAsync` | `await resultAsync` | `await taskEither()` ← 関数呼び出し！ |

## TE.tryCatch の使い方

```typescript
import * as TE from "fp-ts/TaskEither";

TE.tryCatch(
  // tryFn: 非同期処理（throw するとエラーになる）
  async () => {
    const data = await fetchData();
    if (!data) throw new Error("Not found");
    return data;
  },
  // catchFn: throw された値を AppError に変換する
  (thrownValue): AppError => ({
    type: "DatabaseError",
    message: String(thrownValue)
  })
)
```

## pipe による変換の連鎖

```typescript
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";

const result = await pipe(
  fetchUser("1"),                    // TaskEither<AppError, User>
  TE.map(user => user.name),         // TaskEither<AppError, string>
  TE.chain(name =>                   // TaskEither<AppError, string>
    TE.right(`こんにちは、${name}さん！`)
  )
)(); // ← 末尾の () で実行
```

## 問題

`fp-ts.ts` の各関数を実装してください。

## テスト実行

```bash
bun test src/exercises/level3/05-fp-ts-taskeither/index.test.ts
```

## ヒント

```typescript
// fetchUser
TE.tryCatch(
  async () => {
    const user = mockDb[id];
    if (!user) throw { type: "NotFoundError", id } as AppError;
    return user;
  },
  (e): AppError =>
    typeof e === "object" && e !== null && "type" in e
      ? (e as AppError)
      : { type: "DatabaseError", message: String(e) }
)

// fetchUserMessage
pipe(
  fetchUser(id),
  TE.map(user => `こんにちは、${user.name}さん！`)
)
```
