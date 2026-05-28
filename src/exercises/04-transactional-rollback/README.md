# 04 - トランザクション的ロールバック

## このテーマで学ぶこと

複数ステップの書き込み処理では、**後のステップが失敗したときに前のステップの副作用を打ち消す**（補償）必要がある。これを怠ると、ユーザーだけ作成されてアカウントがない、といった半端な状態が残ってしまう。

このテーマでは、Result チェーンの中で `orElse` を使って補償処理（ロールバック）を組み込むパターンを 3 ライブラリで繰り返し書く。

## ロールバックのイメージ

```
createUser(name)          ← ステップ1: db.users に追加
  ↓ 成功
createAccount(user.id)    ← ステップ2: db.accounts に追加
  ↓ 成功
deposit < 0 の検証        ← ステップ3: 失敗 → NegativeDeposit
  ↓ 失敗
orElse(rollback)          ← db.users / db.accounts を切り捨てて元に戻す
  ↓
同じエラーを返す
```

**成功ケース**: ステップ3 まで全部通れば `{ user, account }` を返す。  
**失敗ケース**: どこで失敗しても `before` 時点のサイズに切り戻す。

## API 比較 — orElse で補償

| やりたいこと | neverthrow | byethrow | fp-ts |
|---|---|---|---|
| エラー時に補償して同じエラーを返す | `.orElse(e => { rollback(); return err(e); })` | `Result.orElse(e => { rollback(); return Result.fail(e); })` | `E.orElse(e => { rollback(); return E.left(e); })` |
| 成功値を変換しながら連鎖 | `.andThen(fn)` | `Result.andThen(fn)` | `E.chain(fn)` |
| 成功値を写像 | `.map(fn)` | `Result.map(fn)` | `E.map(fn)` |

## 実装する関数（`neverthrow.ts` / `byethrow.ts` / `fp-ts.ts`）

1. **`resetDb()`** — `db.users` と `db.accounts` を空にする（テスト間のリセット用）
2. **`createUser(name)`** — `name === "dup"` なら `DuplicateError`、それ以外は `db.users` に追加して成功を返す
3. **`createAccount(ownerId)`** — 常に成功し `db.accounts` に追加して返す
4. **`createUserWithAccount(name, deposit)`** — 上記 2 関数を連鎖し、`deposit < 0` なら `NegativeDeposit` で失敗。**失敗時はロールバック**（`db.users.length = before.u; db.accounts.length = before.a`）してから同じエラーを返す

## エラー型（3 ライブラリ共通）

```typescript
type AppError =
  | { type: "DuplicateError"; name: string }
  | { type: "NegativeDeposit"; amount: number };
```

## テスト実行

```bash
bun test src/exercises/04-transactional-rollback/index.test.ts
```
