# Level 2 - 07: エラーユニオン比較 — neverthrow vs byethrow

## このお題で学ぶこと

判別共用体（Discriminated Union）のエラー型と `ts-pattern` を組み合わせた網羅的なパターンマッチングを学びます。
`ts-pattern` はどちらのライブラリとも独立して使えます。

## 判別共用体とは

`_tag` フィールドで型を区別できるユニオン型です:

```typescript
type AppError =
  | { _tag: "ValidationError"; field: string; message: string }
  | { _tag: "NotFoundError"; id: string }
  | { _tag: "DuplicateError"; email: string }
  | { _tag: "DatabaseError"; cause: string };
```

## ts-pattern の使い方

```typescript
import { match } from "ts-pattern";

match(error)
  .with({ _tag: "ValidationError" }, (e) => `${e.field}: ${e.message}`)
  .with({ _tag: "NotFoundError" }, (e) => `ID ${e.id} が見つかりません`)
  .with({ _tag: "DuplicateError" }, (e) => `${e.email} は既に登録済みです`)
  .with({ _tag: "DatabaseError" }, () => "DBエラー")
  .exhaustive(); // ← 全ケースを網羅していないとコンパイルエラー
```

`.exhaustive()` を使うと、新しいエラー型を追加したときに対応漏れをコンパイル時に検出できます。

## API 比較

| 操作 | neverthrow | byethrow |
|------|-----------|---------|
| エラーの取り出し | `result.isErr()` → `result.error` | `Result.isFailure(result)` → `result.error` |
| パターンマッチ | `ts-pattern`（ライブラリ非依存） | `ts-pattern`（ライブラリ非依存） |

## ts-pattern が必要な理由

TypeScript の `switch` 文でも判別共用体を扱えますが、`ts-pattern` の `.exhaustive()` は型レベルで網羅性を保証します。新しいエラー型を追加した際の対応漏れを防げます。

## 問題

### neverthrow.ts の `toStatusCode`, `toUserMessage`, `resultToStatusCode` を実装してください

### byethrow.ts の `toStatusCode`, `toUserMessage`, `resultToStatusCode` を実装してください

## テスト実行

```bash
bun test src/exercises/level2/07-error-union-comparison/index.test.ts
```
