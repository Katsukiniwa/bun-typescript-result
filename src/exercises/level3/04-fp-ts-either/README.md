# Level 3 - 04: fp-ts Either の基礎

## このお題で学ぶこと

fp-ts の `Either` 型を学びます。neverthrow の `Result` と同じ概念ですが、**型パラメータの順序が逆**になっています。

## neverthrow と fp-ts Either の比較

| 概念 | neverthrow | fp-ts Either |
|------|-----------|-------------|
| 成功 | `ok(value)` | `E.right(value)` |
| 失敗 | `err(error)` | `E.left(error)` |
| 型定義 | `Result<T, E>` | `Either<E, A>` |
| 成功か確認 | `result.isOk()` | `E.isRight(result)` |
| 失敗か確認 | `result.isErr()` | `E.isLeft(result)` |
| 成功値へのアクセス | `result.value` | `result.right` |
| エラーへのアクセス | `result.error` | `result.left` |
| 変換 | `result.map(fn)` | `pipe(result, E.map(fn))` |
| 連鎖 | `result.andThen(fn)` | `pipe(result, E.chain(fn))` |

## 重要: 型パラメータの順序

```typescript
// neverthrow: Result<成功値型, エラー型>
type MyResult = Result<User, AppError>;

// fp-ts: Either<エラー型, 成功値型>  ← 逆順！
type MyEither = Either<AppError, User>;
```

fp-ts の `Either<E, A>` は **E がエラー（Left）、A が成功値（Right）** です。

## pipe による関数合成

fp-ts では `pipe` を使って変換を連鎖させます。

```typescript
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";

const result = pipe(
  E.right(5),           // Either<never, number>  Right(5)
  E.map(n => n * 2),    // Either<never, number>  Right(10)
  E.chain(n =>          // Either<string, number>
    n > 0
      ? E.right(n)
      : E.left("0以下は不正")
  )
);
```

## E.map vs E.chain

```typescript
// E.map: 成功値を変換する（失敗は通過）
// fn の戻り値は Either ではなく普通の値
E.map((n: number) => n * 2)

// E.chain: 成功値を別の Either に変換する（失敗は通過）
// fn の戻り値は Either（andThen 相当）
E.chain((n: number) => n > 0 ? E.right(n) : E.left("エラー"))
```

## 問題

`fp-ts.ts` の各関数を実装してください。

## テスト実行

```bash
bun test src/exercises/level3/04-fp-ts-either/index.test.ts
```

## ヒント

```typescript
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

// wrapValue
E.right(value)

// wrapError
E.left(error)

// double
pipe(result, E.map(n => n * 2))

// toInt
pipe(
  E.right(s),
  E.chain(str => {
    const n = Number.parseInt(str, 10);
    return Number.isNaN(n) ? E.left("変換できません") : E.right(n);
  })
)
```
