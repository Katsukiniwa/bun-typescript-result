# Level 1 - 08: match() — パターンマッチング

## このお題で学ぶこと

`.match()` を使って、成功と失敗の両方を一度に処理する方法を覚えます。

## match() とは？

```typescript
const message = result.match(
  (value) => `成功: ${value}`,  // Okのとき
  (error) => `失敗: ${error}`,  // Errのとき
)
```

`match()` は:
- 成功と失敗の両方のケースを強制的に処理させる
- 戻り値の型が統一される（どちらも同じ型を返す）
- if/elseより簡潔に書ける

CLIやAPIのレスポンス生成でよく使います。

## 問題

### `toMessage(result): string`
Ok → "成功: {値}", Err → "失敗: {エラー}"

### `toNumber(result): number`
Ok(n) → n, Err(_) → -1

### `formatUserResult(result): string`
Ok({name, age}) → "{name}さん({age}歳)", Err({message}) → "エラー: {message}"

## テスト実行

```bash
bun test src/exercises/level1/08-match/index.test.ts
```
