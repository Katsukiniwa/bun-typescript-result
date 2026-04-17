# Level 1 - 09: unwrapOr() — デフォルト値の取り出し

## このお題で学ぶこと

`.unwrapOr()` を使って、ResultからOk値を取り出す方法を覚えます。
エラーのときは指定したデフォルト値を返します。

## unwrapOr() とは？

`match()` を使った書き方と比べてみましょう。

```typescript
// match() を使う場合（少し冗長）
const value = result.match(
  (v) => v,
  () => defaultValue,
);

// unwrapOr() を使うと短く書ける
const value = result.unwrapOr(defaultValue);
```

エラーの場合に「決まったデフォルト値を使う」なら、`match()` より `unwrapOr()` の方がシンプルです。

## 問題

### `getValueOr(result, defaultValue): number`

- `Ok(10)` なら `10` を返す
- `Err` なら `defaultValue` を返す

### `getUserName(result): string`

- `Ok({ name: 'Alice' })` なら `'Alice'` を返す
- `Err` なら `'匿名'` を返す

## テスト実行

```bash
bun test src/exercises/level1/09-unwrap-or/index.test.ts
```

## ヒント

`result.unwrapOr(デフォルト値)` で値を取り出せます。

`getUserName` は `.unwrapOr({ name: "匿名" }).name` のように書くと、
デフォルトオブジェクトを渡してから `.name` を取り出せます。
