# Level 3 - 03: Partial Application DI（部分適用による依存性注入）

## このお題で学ぶこと

**部分適用**（Partial Application）を使った関数型スタイルの依存性注入（DI）パターンを学びます。
クラスや DI コンテナを使わずに、高階関数として依存関係を注入します。

## なぜ関数型 DI が必要か？

```typescript
// ❌ グローバル依存: テストが難しい
async function createUser(input: { name: string; email: string }) {
  const existing = await database.findByEmail(input.email); // 本物のDBに依存
  // ...
}
```

```typescript
// ✅ 関数型DI: 依存関係を外から注入できる
const createUser = (deps: Deps) => async (input: Input) => {
  const existing = await deps.findByEmail(input.email); // モック可能
  // ...
};

// 本番用
const workflow = createUser({ findByEmail: db.findByEmail, save: db.save });

// テスト用（モックを注入）
const testWorkflow = createUser({ findByEmail: mockFindByEmail, save: mockSave });
```

## 部分適用のパターン

```typescript
// (deps) => (input) => Result の形（カリー化）
const createUserWorkflow = (deps: Deps) => (input: Input): ResultAsync<User, AppError> => {
  // deps を使って処理を実行
};

// 依存関係を固定してワークフローを作成
const workflow = createUserWorkflow({ findByEmail, save });

// 実行
const result = await workflow({ name: "Alice", email: "alice@example.com" });
```

## 処理フロー

```
入力受け取り
  ↓
バリデーション（名前3文字以上、メール@含む）
  ↓ エラー → ValidationError
重複チェック（findByEmail）
  ↓ 存在する → DuplicateError
ユーザー保存（save）
  ↓ エラー → DatabaseError
Ok(User)
```

## API 比較

| 操作 | neverthrow | byethrow |
|------|-----------|---------|
| 即時エラー | `errAsync(...)` | `Result.fail(...)` |
| Promiseラップ | `fromSafePromise(promise)` | `await promise` + `Result.isSuccess()` |
| 連鎖 | `.andThen(fn)` | `await` + `if (Result.isFailure(...))` |

## 問題

`createUserWorkflow` を実装してください。

## テスト実行

```bash
bun test src/exercises/level3/03-partial-application-di/index.test.ts
```

## ヒント

neverthrow（チェーン型）:
```typescript
export const createUserWorkflow = (deps: Deps) => (input: Input): ResultAsync<User, AppError> => {
  if (input.name.length < 3) return errAsync({ type: "ValidationError", message: "..." });

  return fromSafePromise(deps.findByEmail(input.email))
    .andThen((existing) => {
      if (existing !== null) return errAsync<User, AppError>({ type: "DuplicateError", ... });
      return fromSafePromise(deps.save(input)).andThen((result) => ...);
    });
};
```

byethrow（async/await 型）:
```typescript
export const createUserWorkflow = (deps: Deps) => async (input: Input): ResultAsync<User, AppError> => {
  if (input.name.length < 3) return Result.fail({ type: "ValidationError", message: "..." });

  const existing = await deps.findByEmail(input.email);
  if (Result.isSuccess(existing) && existing.value !== null)
    return Result.fail({ type: "DuplicateError", ... });

  const saved = await deps.save(input);
  if (Result.isFailure(saved)) return Result.fail({ type: "DatabaseError", ... });
  return Result.succeed(saved.value);
};
```
