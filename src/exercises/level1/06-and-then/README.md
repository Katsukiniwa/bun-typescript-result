# Level 1 - 06: andThen() — Resultを返す関数との連鎖

## このお題で学ぶこと

`.andThen()` を使って、Result型を返す関数を連鎖する方法を覚えます。

## andThen() とは？

```typescript
// map() はResult<A, E> → Result<B, E> に変換する（失敗しない変換）
ok(5).map(n => n * 2) // Ok(10)

// andThen() はResult<A, E> → Result<B, E> に変換する（失敗する可能性がある変換）
ok("42").andThen(s => {
  const n = parseInt(s);
  return Number.isNaN(n) ? err("変換失敗") : ok(n);
})
// Ok(42)
```

使い分け:
- 変換が失敗しない → `.map()`
- 変換が失敗する可能性がある → `.andThen()`

## 問題

### `divide(a, b): Result<number, string>`
a ÷ b を計算。b=0のとき "ゼロ除算エラー" で失敗

### `sqrt(result): Result<number, string>`
ResultのOk値の平方根を計算。負の数は "負の数の平方根は計算できません" で失敗

### `divideAndSqrt(a, b): Result<number, string>`
a ÷ b を計算して平方根を取る（andThenで2つを連鎖）

## テスト実行

```bash
bun test src/exercises/level1/06-and-then/index.test.ts
```

## ヒント

`andThen` の中では `ok()` か `err()` を返します。
連鎖すると、前のステップが失敗した時点で後続はスキップされます。
