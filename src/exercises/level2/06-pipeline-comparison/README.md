# Level 2 - 06: パイプライン比較（ROP）— neverthrow vs byethrow

## このお題で学ぶこと

Railway Oriented Programming (ROP) の考え方で、複数の非同期ステップをパイプライン化する方法を比較します。
エラーが発生した時点でパイプラインが「エラーレール」に移り、残りのステップをスキップする動作を確認します。

## ROP のイメージ

```
入力 → [バリデーション] → [重複チェック] → [DB保存] → User
                ↓エラー           ↓エラー        ↓エラー
            ValidationError  DuplicateError  DatabaseError
```

エラーが発生した時点で下のレールに落ちて、以降のステップはスキップされます。

## API 比較

| 操作 | neverthrow | byethrow |
|------|-----------|---------|
| 非同期チェーン | `resultAsync.andThen(fn)` | `await` + `if (Result.isFailure(...)) return` |
| チェーンスタイル | メソッドチェーン（フラット） | 命令型スタイル（見通しが良い） |
| 型 | `ResultAsync<T, E>` | `Promise<Result.Result<T, E>>` |

## パイプラインの書き方

neverthrow はメソッドチェーンでスッキリ書けます:

```typescript
validateInput(name, email)
  .andThen(checkDuplicate)
  .andThen(saveUser)
```

byethrow は `await` を使った明示的な手続き型スタイルになります:

```typescript
const validated = await validateInput({ name, email });
if (Result.isFailure(validated)) return validated;
const checked = await checkDuplicate(validated.value);
if (Result.isFailure(checked)) return checked;
return saveUser(checked.value);
```

## 問題

### neverthrow.ts の `registerUser` を実装してください

### byethrow.ts の `registerUser` を実装してください

## テスト実行

```bash
bun test src/exercises/level2/06-pipeline-comparison/index.test.ts
```
