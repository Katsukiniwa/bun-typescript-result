# Level 1 - 01: ok() の基本

## このお題で学ぶこと

`ok()` を使って「成功Result」を作る方法を覚えます。

## Result型とは？

関数の戻り値として「成功」か「失敗」を表現できる型です。

```
成功: Ok<値>   ← ok(値) で作る
失敗: Err<エラー> ← err(エラー) で作る
```

throwを使うと、呼び出し元がエラーを処理し忘れてもコンパイラが気づけません。
Result型を使うと、エラーが型に現れるので処理を忘れることができません。

## 問題

以下の関数を実装してください：

### `wrapNumber(n: number): Result<number, never>`
数値をそのまま成功Resultでラップする

### `wrapString(s: string): Result<string, never>`
文字列をそのまま成功Resultでラップする

### `wrapObject(obj: { id: number; name: string }): Result<{ id: number; name: string }, never>`
オブジェクトをそのまま成功Resultでラップする

## 使うAPI

```typescript
import { ok } from "neverthrow";

ok(42)         // Result<number, never> — 成功
ok("hello")    // Result<string, never> — 成功
ok({ id: 1 }) // Result<{id: number}, never> — 成功
```

## テスト実行

```bash
bun test src/exercises/level1/01-ok-basics/index.test.ts
```

## ヒント

`ok(値)` を返すだけです。難しく考えずに。
