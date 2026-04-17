# Level 2 - 02: map 比較 — neverthrow vs byethrow

## このお題で学ぶこと

Ok/Success の値を変換する `map()` の使い方を両ライブラリで比較します。
Err/Failure の場合は変換されずそのまま通過することを確認します。

## API 比較

| 操作 | neverthrow | byethrow |
|------|-----------|---------|
| 値を変換する | `result.map(fn)` | `Result.pipe(result, Result.map(fn))` |
| 設計スタイル | メソッドチェーン | 静的関数 + pipe |
| fn の受け取り方 | `result.map(fn)` でそのまま適用 | `Result.map(fn)` はカリー化: 変換関数を返す |

## 動作の説明

```typescript
// neverthrow: メソッドチェーンスタイル
ok(5).map(n => n * 2)   // Ok(10)
err("x").map(n => n * 2) // Err("x") ← エラーはスルー

// byethrow: pipe スタイル
Result.pipe(Result.succeed(5), Result.map(n => n * 2))   // Success(10)
Result.pipe(Result.fail("x"), Result.map(n => n * 2))    // Failure("x") ← エラーはスルー
```

## byethrow の map がカリー化されている理由

`Result.map(fn)` は `(result) => Result` を返します。
これにより `Result.pipe()` の引数として渡せます。

```typescript
const double = Result.map((n: number) => n * 2);
// double は (result: Result<number, E>) => Result<number, E> 型の関数

Result.pipe(Result.succeed(5), double); // Success(10)
```

## 問題

### neverthrow.ts の `double`, `toUpperCase` を実装してください

### byethrow.ts の `double`, `toUpperCase` を実装してください

## テスト実行

```bash
bun test src/exercises/level2/02-map-comparison/index.test.ts
```

## ヒント

neverthrow:
```typescript
result.map(fn) // Ok の場合のみ fn を適用、Err はスルー
```

byethrow:
```typescript
Result.pipe(result, Result.map(fn)) // Success の場合のみ fn を適用、Failure はスルー
```
