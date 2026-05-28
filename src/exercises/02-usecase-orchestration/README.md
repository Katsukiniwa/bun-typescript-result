# 02 - Usecase Orchestration（Railway Oriented Programming）

## このテーマで学ぶこと

複数のユースケースステップを **直列チェーン** でつなぎ、途中でエラーが発生したら後続ステップを実行せずに失敗を伝播させる。これを **Railway Oriented Programming（ROP）** と呼ぶ。

「バリデーション → 重複チェック → アカウント生成」のような処理を `andThen` / `E.chain` でつなぐと、各ステップは Result/Either を返し、失敗した時点でレールが切り替わって後続は一切実行されない。型で安全に保証される。

## ROPのイメージ

```
[正常レール]   validateName ──→ checkDuplicate ──→ buildUser ──→ buildAccount
                   │                  │                 │              │
[エラーレール]     ▼                  ▼                 ▼              ▼
             ValidationError   DuplicateError        (スキップ)    NegativeDeposit
```

一度エラーレールに入ると、以降の処理はすべてスキップされ、エラーがそのまま末端まで伝播する。

## API比較

| やりたいこと | neverthrow | byethrow | fp-ts |
|------|-----------|---------|-------|
| andThen チェーン | `.andThen(fn)` | `Result.pipe(r, Result.andThen(fn))` | `pipe(e, E.chain(fn))` |
| 同期値を Result 化 | `ok(v)` / `err(e)` | `Result.succeed(v)` / `Result.fail(e)` | `E.right(v)` / `E.left(e)` |
| 非同期に昇格 | `okAsync(v)` / `errAsync(e)` | `async` 関数で `Promise<Result.Result<...>>` | `TE.fromEither(e)` |
| 非同期チェーン | `ResultAsync.andThen(fn)` | `async` 関数内で同期チェーン | `pipe(te, TE.chain(fn))` |

## 実装する関数（`neverthrow.ts` / `byethrow.ts` / `fp-ts.ts`）

1. **`registerUser(name)`** — `name.length < 3` → `ValidationError` / `name === "taken"` → `DuplicateError` / それ以外 → `{ id: 1, name }` を ROP チェーンで実装する
2. **`openAccount(name, deposit)`** — `registerUser` を呼んでから `deposit < 0` → `NegativeDeposit` / それ以外 → `Account { id: 100, ownerId, balance }` を返す（同期）
3. **`openAccountAsync(name, deposit)`** — `openAccount` と同じロジックを非同期で返す（neverthrow: `ResultAsync` / byethrow: `Promise<Result.Result<...>>` / fp-ts: `TaskEither`）

## エラー型（3ライブラリ共通）

```typescript
type AppError =
  | { type: "ValidationError"; message: string }
  | { type: "DuplicateError"; name: string }
  | { type: "NegativeDeposit"; amount: number };
```

## テスト実行

```bash
bun test src/exercises/02-usecase-orchestration/index.test.ts
```
