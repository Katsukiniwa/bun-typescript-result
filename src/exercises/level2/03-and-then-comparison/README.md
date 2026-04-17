# Level 2 - 03: andThen 比較 — neverthrow vs byethrow

## このお題で学ぶこと

Result を返す関数を連鎖させる `andThen()` の使い方を比較します。
`map()` との違いは、`andThen()` に渡す関数が Result を返す点です。

## map vs andThen

| | 渡す関数の戻り値 | 用途 |
|--|--|--|
| `map` | `T`（通常の値） | 値を変換する |
| `andThen` | `Result<T, E>`（Result） | 失敗する可能性のある処理を連鎖する |

## API 比較

| 操作 | neverthrow | byethrow |
|------|-----------|---------|
| 連鎖する | `result.andThen(fn)` | `Result.pipe(result, Result.andThen(fn))` |
| fn の戻り値 | `Result<T, E>` | `Result.Result<T, E>` |
| エラー時の動作 | fn をスキップしてErrをそのまま返す | fn をスキップしてFailureをそのまま返す |

## 動作の説明

```typescript
// neverthrow
ok(5).andThen(n => n > 0 ? ok(n) : err("負の数"))   // Ok(5)
ok(-3).andThen(n => n > 0 ? ok(n) : err("負の数"))  // Err("負の数")
err("x").andThen(n => ok(n * 2))                     // Err("x") ← スキップ

// byethrow
Result.pipe(Result.succeed(5), Result.andThen(n => n > 0 ? Result.succeed(n) : Result.fail("負の数")))   // Success(5)
Result.pipe(Result.succeed(-3), Result.andThen(n => n > 0 ? Result.succeed(n) : Result.fail("負の数")))  // Failure("負の数")
Result.pipe(Result.fail("x"), Result.andThen(n => Result.succeed(n * 2)))                                // Failure("x") ← スキップ
```

## 問題

### neverthrow.ts の `parseInt_`, `requirePositive` を実装してください

### byethrow.ts の `parseInt_`, `requirePositive` を実装してください

## テスト実行

```bash
bun test src/exercises/level2/03-and-then-comparison/index.test.ts
```

## ヒント

neverthrow:
```typescript
result.andThen(fn) // fn は Result を返す必要がある
```

byethrow:
```typescript
Result.pipe(result, Result.andThen(fn)) // fn は Result.Result を返す必要がある
```
