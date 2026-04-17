# Level 1 - 04: map() — 成功値の変換

## このお題で学ぶこと

`.map()` を使って、成功Resultの値を変換する方法を覚えます。

## map() とは？

```typescript
ok(5).map(n => n * 2)     // Ok(10) — 成功値が変換される
err("失敗").map(n => n * 2) // Err("失敗") — エラーはそのまま通過
```

`map()` は:
- Okのとき: 関数を適用して新しいOkを返す
- Errのとき: 何もせずErrをそのまま返す

配列の `.map()` と同じ考え方です。エラーを気にせず変換ロジックだけ書けます。

## 問題

### `double(result): Result<number, string>`
Resultの数値を2倍にする

### `toUpperCase(result): Result<string, string>`
ResultのteStringを大文字にする

### `addPrefix(result, prefix): Result<string, string>`
Resultの文字列にprefixを追加する

### `parseNumber(result): Result<number, string>`
Result内の文字列をparseIntする。"abc"など変換できない場合はErrを返す

## テスト実行

```bash
bun test src/exercises/level1/04-map/index.test.ts
```

## ヒント

`.map(value => 変換後の値)` の形で使います。
Errのときは自動的にスキップされるのでif文は不要です。
