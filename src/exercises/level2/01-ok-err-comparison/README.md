# Level 2 - 01: Ok/Err 比較 — neverthrow vs byethrow

## このお題で学ぶこと

neverthrow と byethrow の基本的なResult生成APIを並べて比較します。
同じ概念が2つのライブラリでどう実装されているかを理解します。

## API 比較

| 操作 | neverthrow | byethrow |
|------|-----------|---------|
| 成功を作る | `ok(value)` | `Result.succeed(value)` |
| 失敗を作る | `err(error)` | `Result.fail(error)` |
| 成功か確認 | `result.isOk()` | `Result.isSuccess(result)` |
| 失敗か確認 | `result.isErr()` | `Result.isFailure(result)` |
| 成功値を取り出す | `result.value`（isOkで絞り込み後） | `result.value`（isSuccessで絞り込み後） |

## 内部表現の違い

```typescript
// neverthrow
ok(42)   // { value: 42 }（.isOk()はtrueを返すメソッド付き）
err("x") // { error: "x" }（.isErr()はtrueを返すメソッド付き）

// byethrow
Result.succeed(42)  // { type: "Success", value: 42 }
Result.fail("x")    // { type: "Failure", error: "x" }
```

neverthrow は **メソッドベース**、byethrow は **静的関数ベース** の設計です。

## 問題

### neverthrow.ts の `wrapValue`, `wrapError` を実装してください

### byethrow.ts の `wrapValue`, `wrapError` を実装してください

## テスト実行

```bash
bun test src/exercises/level2/01-ok-err-comparison/index.test.ts
```

## ヒント

neverthrow:
```typescript
import { ok, err } from "neverthrow";
ok(value)   // OkのResult
err(error)  // ErrのResult
```

byethrow:
```typescript
import { Result } from "@praha/byethrow";
Result.succeed(value)  // SuccessのResult
Result.fail(error)     // FailureのResult
```
