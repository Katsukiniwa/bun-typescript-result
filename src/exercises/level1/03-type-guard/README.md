# Level 1 - 03: isOk() / isErr() の型ガード

## このお題で学ぶこと

`isOk()` / `isErr()` でResultの状態を判定し、値を安全に取り出す方法を覚えます。

## isOk() / isErr() とは？

```typescript
const result: Result<number, string> = ok(42);

if (result.isOk()) {
  // このブロック内では result.value が使える（TypeScriptが保証）
  console.log(result.value); // 42
}

if (result.isErr()) {
  // このブロック内では result.error が使える
  console.log(result.error);
}
```

`isOk()` は「型ガード」として機能します。
if文の中で自動的に型が絞り込まれます。

## 問題

### `getStatus(result): "ok" | "err"`
Okなら"ok"、Errなら"err"を返す

### `doubleIfOk(result): number`
OkならResult内の数値を2倍にして返す。ErrならそのままErrorの数値を返す。

### `countResults(results): { ok: number; err: number }`
Resultの配列を受け取り、成功数と失敗数を数える

## テスト実行

```bash
bun test src/exercises/level1/03-type-guard/index.test.ts
```
