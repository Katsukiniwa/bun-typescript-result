# Level 2 - 04: バリデーション比較 — neverthrow vs byethrow

## このお題で学ぶこと

複数のバリデーションを `andThen()` でチェーンする方法を比較します。
最初のエラーで処理が止まる「短絡評価」の動作を確認します。

## API 比較

| 操作 | neverthrow | byethrow |
|------|-----------|---------|
| チェーン | `result.andThen(fn)` | `Result.pipe(result, Result.andThen(fn))` |
| 値の変換 | `result.map(fn)` | `Result.pipe(result, Result.map(fn))` |
| チェーンスタイル | メソッドチェーン（フラット） | pipe のネスト |

## チェーンの書き方の違い

neverthrow はメソッドチェーンでフラットに書けます:

```typescript
validateName(input.name)
  .andThen(name => validateEmail(input.email)
    .andThen(email => validateAge(input.age)
      .map(age => ({ name, email, age }))
    )
  )
```

byethrow は `Result.pipe` をネストします:

```typescript
Result.pipe(
  validateName(input.name),
  Result.andThen(name =>
    Result.pipe(
      validateEmail(input.email),
      Result.andThen(email =>
        Result.pipe(validateAge(input.age), Result.map(age => ({ name, email, age })))
      )
    )
  )
)
```

## 短絡評価の動作

最初のバリデーションが失敗した時点で、残りのバリデーションはスキップされます。

```
name: "A" (無効), email: "invalid" (無効), age: -1 (無効)
→ name のバリデーションで失敗した時点で止まる
→ Err/Failure({ field: "name", ... }) が返る
```

## 問題

### neverthrow.ts の `createUser` を実装してください

### byethrow.ts の `createUser` を実装してください

## テスト実行

```bash
bun test src/exercises/level2/04-validation-comparison/index.test.ts
```
