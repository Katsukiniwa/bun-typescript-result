# 06 - バッチ・並列処理と部分失敗

## このテーマで学ぶこと

複数アイテムをまとめて処理するとき、「**一部が失敗しても続ける（partition）**」か「**1件でも失敗したら止める（all-or-nothing）**」かという2つの戦略がある。Result 型ではこの選択を型レベルで表現できる。

- **partition** — 全件処理し、成功リストと失敗リストを分離して返す。部分失敗を許容するバルク処理に使う。
- **all-or-nothing** — 最初の失敗でそれ以上処理せず `Err/Failure/Left` を返す。トランザクション的な整合性が必要な処理に使う。

## API比較

| やりたいこと | neverthrow | byethrow | fp-ts |
|-------------|-----------|---------|-------|
| 部分失敗を許容して振り分け | 手動ループ + `isOk/isErr` | 手動ループ + `Result.isSuccess/isFailure` | `A.partitionMap(fn)` |
| all-or-nothing (同期) | 手動ループ or `Result.combine` | `Result.sequence(results)` | `A.traverse(E.Applicative)(fn)` |
| all-or-nothing (非同期) | `ResultAsync.combine(results)` | `Result.sequence(asyncResults)` | `A.traverse(TE.ApplicativePar)(fn)` |

## 実装する関数（`neverthrow.ts` / `byethrow.ts` / `fp-ts.ts`）

1. **`parseOne(raw)`** — 文字列を `number` にパース。`NaN` なら `ParseError` を返す
2. **`partition(raws)`** — 全件パースし `{ ok: number[], errors: AppError[] }` に分離する
3. **`combineAll(raws)`** — all-or-nothing。全件成功なら `Ok([...numbers])` / 最初の失敗で止まる
4. **`combineAllAsync(raws)`** — 非同期版 all-or-nothing（`ResultAsync` / `Promise<Result>` / `TaskEither`）

## エラー型（3ライブラリ共通）

```typescript
type AppError = { type: "ParseError"; input: string };
```

## テスト実行

```bash
bun test src/exercises/06-batch-parallel/index.test.ts
```
