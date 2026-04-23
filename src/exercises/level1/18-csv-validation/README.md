# Level 1 - 18: CSVバリデーション — 全エラー収集

## このお題で学ぶこと

`combineWithAllErrors` を使って、バッチ処理で全エラーを収集するパターンを覚えます。

## combineWithAllErrors とは？

exercise 15 の `combineWithAllErrors` を実際のユースケース（CSV処理）で使います。

```typescript
// combine: 最初のエラーで停止
Result.combine([validateName(row), validateEmail(row), validateAge(row)])
// → 名前が不正 → Err(nameエラー)  ← メール・年齢は確認されない

// combineWithAllErrors: 全エラーを収集
Result.combineWithAllErrors([validateName(row), validateEmail(row), validateAge(row)])
// → 全て不正 → Err([nameエラー, emailエラー, ageエラー])  ← 全て確認される
```

フォーム入力や CSV インポートでは「全エラーを一度に表示したい」場合に有効です。

## 問題

### `validateRow(row): Result<ValidRow, ValidationError[]>`

1行に対して `validateName` / `validateEmail` / `validateAge` を全て実行し、
エラーを全件収集してください。成功時は `ValidRow` オブジェクトに変換してください。

### `processCsv(rows): { successes, errors }`

CSV全行に `validateRow` を適用して、成功行と失敗行を分類してください。

```typescript
{
  successes: ValidRow[],  // バリデーション通過行
  errors: { lineNumber: number; errors: ValidationError[] }[]  // 失敗行
}
```

## 使うAPI

```typescript
import { Result } from "neverthrow";

Result.combineWithAllErrors([result1, result2, result3])
// → Result<[T1, T2, T3], E[]>

// 成功時は値のタプルなので .map() で変換
.map(([v1, v2, v3]) => ({ field1: v1, field2: v2, field3: v3 }))
```

## テスト実行

```bash
bun test src/exercises/level1/18-csv-validation/index.test.ts
```

## ヒント

`processCsv` では `Array.filter()` を2回使うか、`reduce` で1パスで分類できます。
