# TypeScript関数型プログラミング 演習

## ゴール

neverthrow / @praha/byethrow / fp-ts を使って、TypeScript関数型バックエンド開発をマスターする。

## 学習の進め方

### ステップ1: まずREADMEを読む
各演習ディレクトリの `README.md` でコンセプトを理解する。

### ステップ2: テストを読む
`index.test.ts` を読んで「何を作るか」を把握する。

### ステップ3: スケルトンを実装する
`neverthrow.ts`（Level 1）や `byethrow.ts`（Level 2）を開いて `throw new Error("TODO: ...")` を実装する。

### ステップ4: テストを実行して確認する
```bash
bun test src/exercises/level1/01-ok-basics/index.test.ts
```

### ステップ5: 詰まったら解答を見る
`answers/neverthrow.ts` に完全な実装がある。

---

## レベル構成

### Level 1 — neverthrow基礎（1 APIずつ習得）

neverthrowだけを使って、Result型の各APIを1つずつ丁寧に学ぶ。

| # | お題 | 習得API |
|---|------|---------|
| 01 | ok-basics | `ok()` |
| 02 | err-basics | `err()` |
| 03 | type-guard | `.isOk()`, `.isErr()` |
| 04 | map | `.map()` |
| 05 | map-error | `.mapErr()` |
| 06 | and-then | `.andThen()` |
| 07 | or-else | `.orElse()` |
| 08 | match | `.match()` |
| 09 | unwrap-or | `.unwrapOr()` |
| 10 | from-throwable | `fromThrowable()` |
| 11 | single-validation | バリデーション基礎 |
| 12 | chained-validation | andThenで複数バリデーション |
| 13 | map-and-then-combo | mapとandThenの組み合わせ |
| 14 | error-transform | エラー型変換 |
| 15 | combine | `Result.combine()`, `Result.combineWithAllErrors()` |

```bash
bun test src/exercises/level1/
```

---

### Level 2 — neverthrow vs byethrow 比較

同じお題をneverthrowとbyethrowで実装して、設計思想の違いを体感する。

| # | お題 | 比較ポイント |
|---|------|------------|
| 01 | ok-err-comparison | `ok()` vs `Result.succeed()` |
| 02 | map-comparison | `.map()` vs `Result.pipe(r, Result.map())` |
| 03 | and-then-comparison | `.andThen()` vs `Result.andThen()` (カリー化) |
| 04 | validation-comparison | バリデーション実装スタイル比較 |
| 05 | async-comparison | `ResultAsync` vs `Result.fn({ try, catch })` |
| 06 | pipeline-comparison | ROPパイプラインの設計比較 |
| 07 | error-union-comparison | Discriminated Unionエラー型 + ts-pattern |
| 08 | collect-comparison | `Result.combine()` vs `Result.sequence()` |

```bash
bun test src/exercises/level2/
```

---

### Level 3 — ドメインモデリング + fp-ts

関数型ドメインモデリングのパターンと、fp-tsの習得。

| # | お題 | テーマ |
|---|------|--------|
| 01 | branded-types | Branded型・スマートコンストラクタ |
| 02 | state-machine | ステートマシン（型安全な状態遷移） |
| 03 | partial-application-di | 部分適用でDI・Workflow設計 |
| 04 | fp-ts-either | fp-ts Either基礎 |
| 05 | fp-ts-taskeither | fp-ts TaskEither（非同期） |
| 06 | domain-workflow | 3ライブラリ横断ドメインワークフロー |

```bash
bun test src/exercises/level3/
```

---

## 全テスト実行

```bash
bun test src/exercises/
```

## ライブラリAPI早見表

### neverthrow

```typescript
import { ok, err, Result, fromThrowable, ResultAsync, fromPromise, okAsync, errAsync } from "neverthrow";

ok(value)              // Ok<T, never>
err(error)             // Err<never, E>
result.isOk()          // boolean
result.isErr()         // boolean
result.value           // T (isOk()後)
result.error           // E (isErr()後)
result.map(fn)         // Result<U, E>
result.mapErr(fn)      // Result<T, F>
result.andThen(fn)     // Result<U, E>
result.orElse(fn)      // Result<T, F>
result.match(ok, err)  // U
result.unwrapOr(def)   // T
fromThrowable(fn, err) // 安全なラッパー関数を返す
Result.combine([...])  // 最初のErr or Ok([...])
Result.combineWithAllErrors([...]) // 全Err配列 or Ok([...])
```

### @praha/byethrow

```typescript
import { Result } from "@praha/byethrow";

Result.succeed(value)      // { type: "Success", value }
Result.fail(error)         // { type: "Failure", error }
Result.isSuccess(result)   // boolean
Result.isFailure(result)   // boolean
result.value               // T (isSuccess後)
result.error               // E (isFailure後)
Result.pipe(result, ...transformers)  // パイプライン
Result.map(fn)             // カリー化変換関数 (result) => result
Result.andThen(fn)         // カリー化連鎖関数
Result.mapError(fn)        // カリー化エラー変換関数
Result.sequence([...])     // 最初のエラーで停止
Result.collect([...])      // 全エラーを収集
Result.fn({ try, catch })  // 非同期ラッパー
```

### fp-ts

```typescript
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

// Either<E, A> — Eがエラー型、Aが成功型 (neverthrowと逆順!)
E.right(value)        // Right (成功)
E.left(error)         // Left (失敗)
E.isRight(e)          // boolean
E.isLeft(e)           // boolean
e.right               // A (isRight後)
e.left                // E (isLeft後)
pipe(result, E.map(fn), E.chain(fn), E.mapLeft(fn))

// TaskEither<E, A> = () => Promise<Either<E, A>> (関数！)
TE.right(value)       // TaskEither (即成功)
TE.left(error)        // TaskEither (即失敗)
TE.tryCatch(tryFn, catchFn)  // 非同期ラッパー
pipe(te, TE.map(fn), TE.chain(fn))
await myTaskEither()  // 実行する（末尾の () が必要！）
```
