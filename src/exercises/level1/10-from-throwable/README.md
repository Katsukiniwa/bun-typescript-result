# Level 1 - 10: fromThrowable() — throwをResult化する

## このお題で学ぶこと

`fromThrowable()` を使って、`throw` するかもしれない関数を `Result` を返す関数に変換する方法を覚えます。

## fromThrowable() とは？

JavaScript には `throw` する関数が多くあります（`JSON.parse` など）。
これらを `try/catch` なしに安全に使うための変換ツールが `fromThrowable()` です。

```typescript
// try/catch を使う従来の方法
const parseJson = (s: string) => {
  try {
    return ok(JSON.parse(s));
  } catch (e) {
    return err(`エラー: ${e}`);
  }
};

// fromThrowable を使うとシンプルに書ける
const parseJson = fromThrowable(
  JSON.parse,                    // throwするかもしれない関数
  (e) => `エラー: ${String(e)}`, // エラーを変換するマッパー
);
// parseJson は (s: string) => Result<unknown, string> になる
```

## 問題

### `parseJson(jsonString): Result<unknown, string>`

- 正しいJSON文字列ならOkを返す
- 不正なJSON文字列ならErrを返す

### `toNumber(value): Result<number, string>`

- 数値に変換できる文字列ならOkを返す
- `NaN` になる文字列や空文字はErrを返す

## テスト実行

```bash
bun test src/exercises/level1/10-from-throwable/index.test.ts
```

## ヒント

```typescript
// ステップ1: fromThrowable で安全な関数を作る
const safeParseJson = fromThrowable(
  JSON.parse,
  (e) => String(e)
);

// ステップ2: その関数を呼び出す
export const parseJson = (s: string) => safeParseJson(s);
```

`toNumber` では `Number(s)` が `NaN` のとき `throw` する関数を作って `fromThrowable` でラップしましょう。
