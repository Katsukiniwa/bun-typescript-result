# Level 1 - 11: 単一バリデーション — Result型で検証する

## このお題で学ぶこと

バリデーション（入力値の検証）をResult型で実装します。
条件を満たせばOk、満たさなければErrを返すパターンです。

## バリデーション関数のパターン

```typescript
type ValidationError = {
  field: string;   // どのフィールドが問題か
  message: string; // ユーザー向けメッセージ
};

const validateName = (name: string): Result<string, ValidationError> => {
  if (name.length === 0) {
    return err({ field: "name", message: "名前は必須です" });
  }
  if (name.length < 3) {
    return err({ field: "name", message: "名前は3文字以上にしてください" });
  }
  return ok(name);
};
```

エラーを `throw` せず `err()` で返すのがポイントです。
呼び出し側でエラーハンドリングを強制できます。

## 問題

### `validateName(name): Result<string, ValidationError>`

- 3文字以上ならOk
- 空文字または2文字以下ならErr（field: "name"）

### `validateEmail(email): Result<string, ValidationError>`

- "@" を含む文字列ならOk
- 空文字または "@" がないならErr（field: "email"）

### `validateAge(age): Result<number, ValidationError>`

- 0以上150以下ならOk
- 負の数または150より大きいならErr（field: "age"）

## テスト実行

```bash
bun test src/exercises/level1/11-single-validation/index.test.ts
```

## ヒント

```typescript
// 条件を満たさないとき err() を返す
if (条件を満たさない) {
  return err({ field: "フィールド名", message: "エラーメッセージ" });
}
// 全ての条件を満たしたとき ok() を返す
return ok(value);
```
