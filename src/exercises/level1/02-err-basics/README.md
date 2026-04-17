# Level 1 - 02: err() の基本

## このお題で学ぶこと

`err()` を使って「失敗Result」を作る方法を覚えます。

## err() とは？

```typescript
err("エラーメッセージ")  // Err<string>
err({ code: 404 })      // Err<{code: number}>
err(new Error("失敗"))  // Err<Error>
```

エラーには文字列だけでなく、どんな値でも使えます。
オブジェクトを使うと複数の情報を持てて便利です。

## 問題

以下の関数を実装してください：

### `alwaysFail(msg: string): Result<never, string>`
常に指定したメッセージで失敗する

### `failWithCode(code: number, message: string): Result<never, { code: number; message: string }>`
コードとメッセージを持つエラーオブジェクトで失敗する

### `validatePositive(n: number): Result<number, string>`
正の数 → 成功、0以下 → "正の数が必要です" で失敗

## 使うAPI

```typescript
import { err, ok } from "neverthrow";

err("失敗")          // Err<string>
err({ code: 404 })  // Err<{code: number}>
```

## テスト実行

```bash
bun test src/exercises/level1/02-err-basics/index.test.ts
```

## ヒント

`err(値)` を返すだけです。条件分岐して ok/err を使い分けましょう。
