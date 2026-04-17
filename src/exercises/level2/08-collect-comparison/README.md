# Level 2 - 08: collect 比較 — neverthrow vs byethrow

## このお題で学ぶこと

複数の Result を一度にまとめる方法を比較します。
「最初のエラーで止まる」と「全エラーを収集する」2つの動作の違いを理解します。

## 動作の違い

### 短絡評価（最初のエラーで止まる）

```
[Ok("Alice"), Err(emailErr), Err(ageErr)]
→ Err(emailErr)  ← 最初のエラーだけ
```

### 全エラー収集

```
[Ok("Alice"), Err(emailErr), Err(ageErr)]
→ Err([emailErr, ageErr])  ← 全てのエラー
```

## API 比較

| 動作 | neverthrow | byethrow |
|------|-----------|---------|
| 短絡評価（最初のエラー） | `Result.combine([r1, r2, r3])` | `Result.sequence([r1, r2, r3])` |
| 全エラー収集 | `Result.combineWithAllErrors([r1, r2, r3])` | `Result.collect([r1, r2, r3])` |
| 成功時の戻り値 | `Ok([v1, v2, v3])` | `Success([v1, v2, v3])` |
| 短絡失敗時の戻り値 | `Err(firstError)` | `Failure(firstError)` |
| 全エラー失敗時の戻り値 | `Err([err1, err2, ...])` | `Failure([err1, err2, ...])` |

## 使い分け

- **短絡評価**: 1つでもエラーがあれば処理を止めたい場合（早期リターン）
- **全エラー収集**: フォームバリデーションのように、全てのエラーをユーザーに一度に見せたい場合

## 問題

### neverthrow.ts の `validateForm`, `validateFormAllErrors` を実装してください

### byethrow.ts の `validateForm`, `validateFormAllErrors` を実装してください

## テスト実行

```bash
bun test src/exercises/level2/08-collect-comparison/index.test.ts
```

## ヒント

neverthrow:
```typescript
import { Result } from "neverthrow";
Result.combine([r1, r2, r3])             // 短絡評価（v8 では静的メソッド）
Result.combineWithAllErrors([r1, r2, r3]) // 全エラー収集（v8 では静的メソッド）
```

byethrow:
```typescript
import { Result } from "@praha/byethrow";
Result.sequence([r1, r2, r3]) // 短絡評価（neverthrow の combine に相当）
Result.collect([r1, r2, r3])  // 全エラー収集（neverthrow の combineWithAllErrors に相当）
```
