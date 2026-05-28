# 07 - リトライとタイムアウト（非同期のレジリエンス）

## このテーマで学ぶこと

外部API・DBアクセスなど非同期処理は **一時的に失敗** したり **応答が返ってこない** ことがある。こうした不安定さに対する代表的なレジリエンスパターンが **リトライ（retry）** と **タイムアウト（timeout）** だ。

このテーマでは、`Promise` を返す不安定な task を、3ライブラリの非同期 Result 型（`ResultAsync` / `Result.ResultAsync` / `TaskEither`）に持ち上げながら、

- **リトライ**: 失敗したら一定回数まで再試行し、試行回数を数える
- **タイムアウト**: 指定ミリ秒で打ち切り、間に合わなければ失敗にする

を実装する。テストを高速・決定論的にするため、待ち時間はごく小さく保つ。

> 補足: 実運用では再試行の間隔を徐々に伸ばす **指数バックオフ（exponential backoff）** がよく使われるが、ここでは概念のみ。テストでは遅延を最小（実質ゼロ）にして高速に保つ。

## 設計のイメージ

3ライブラリで共通の「素朴な非同期関数」を書き、それを各ライブラリの非同期 Result に **一度だけ包む** のがコツ。

```
[失敗しうる素朴な async]                 [境界アダプタ]                  [Resultで安全]
 attemptLoop()  ──最終失敗で throw──▶  fromPromise / try / tryCatch ──▶  Result<T, AppError>
 race(task, ms) ──時間切れで throw──▶  fromPromise / try / tryCatch ──▶  Result<T, AppError>
```

`attemptLoop` / `race` は「成功なら値を返し、最終的な失敗時は `AppError` オブジェクトを throw する」素朴な `Promise<T>`。これを各ライブラリの境界アダプタで包めば、3ライブラリとも同じ形で書ける。

## API比較

| やりたいこと | neverthrow | byethrow | fp-ts |
|------|-----------|---------|-------|
| 非同期 Result 型 | `ResultAsync<T, E>` | `Result.ResultAsync<T, E>` | `TaskEither<E, A>`（サンク） |
| Promise を包む | `fromPromise(p, mapErr)` | `Result.try({ try, catch })` | `TE.tryCatch(fn, onThrow)` |
| 失敗時のリカバリ | `.orElse(fn)` | `Result.pipe(r, Result.recover(fn))` | `TE.orElse(fn)` |
| 合成 | `.andThen` / `.map` | `Result.pipe(r, Result.andThen(...))` | `pipe(te, TE.chain(...))` |

`fp-ts` の `TaskEither<E, A>` は `() => Promise<Either<E, A>>` という **サンク（関数）** なので、テストでは `await fn(...)()` のように最後に `()` を付けて実行する。neverthrow / byethrow は `await fn(...)` でそのまま待てる。

## 実装する関数（`neverthrow.ts` / `byethrow.ts` / `fp-ts.ts`）

3ライブラリすべてで実装すること。

1. **`withRetry<T>(task, maxRetries)`** — `task()` を試し、失敗したら追加で `maxRetries` 回までリトライする（合計試行回数 = `maxRetries + 1`）。どこかで成功すればその値で成功。全試行が失敗したら `{ type: "Failed", attempts }`（`attempts` は総試行回数）で失敗する。
2. **`withTimeout<T>(task, ms)`** — `task()` と `ms` ミリ秒のタイムアウトを競争させる。`task` が先に解決すれば成功、タイムアウトが勝てば `{ type: "Timeout", ms }` で失敗する。

## エラー型（3ライブラリ共通）

```typescript
type AppError =
  | { type: "Failed"; attempts: number }
  | { type: "Timeout"; ms: number };
```

## テスト実行

```bash
bun test src/exercises/07-retry-timeout/index.test.ts
```
