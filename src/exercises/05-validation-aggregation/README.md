# 05 - バリデーションのエラー集約

## このテーマで学ぶこと

フォーム検証では「最初に見つかったエラーだけ」を返すと UX が悪い。名前・メール・年齢が
すべて不正なのに「名前は3文字以上」だけ返ってきても、ユーザーは一度に1つずつしか直せない。
理想は **全フィールドのエラーを一度に集める** ことだ。

ここで効いてくるのが **短絡（short-circuit）と集約（aggregate）の違い**。

- **短絡**: `andThen` / `flatMap` / `sequence` は **先頭の失敗で止まる**。後続の検証は走らない。
- **集約**: すべての検証を走らせ、**失敗を配列にまとめて** 返す。

このテーマでは、`Form` を検証して成功なら `ValidUser`、失敗なら `FieldError[]`（全エラー）を返す
`validateForm` を、3ライブラリそれぞれの「全エラー集約」APIで実装する。

```
short-circuit:  validateName ──✗──▶ 終了（emailとageは未評価）   → FieldError 1件
aggregate:      validateName ──✗──┐
                validateEmail ──✗──┼─▶ 全部評価して結合          → FieldError[] 3件
                validateAge   ──✗──┘
```

## API比較

| やりたいこと | neverthrow | byethrow | fp-ts |
|------|-----------|---------|-------|
| 全エラーを集約 | `Result.combineWithAllErrors([...])` | `Result.collect([...])` | `getApplicativeValidation` + `sequenceT` |
| 先頭で短絡（対比） | `Result.combine([...])` | `Result.sequence([...])` | `E.ap`（標準のApplicative） |
| 成功値を組み立て | `.map(([a, b, c]) => ...)` | `Result.map(([a, b, c]) => ...)` | `E.map(([a, b, c]) => ...)` |

- neverthrow: `combineWithAllErrors` は失敗を `FieldError[]` にまとめる（`combine` は先頭で短絡）。
- byethrow: `Result.collect` は全失敗を `FieldError[]` に集約する（`Result.sequence` は先頭で短絡）。
- fp-ts: **applicative validation**。各バリデータの Left を `FieldError[]`（単一要素配列）にしておき、
  `E.getApplicativeValidation(Semigroup)` でそれらを結合する。

### なぜ fp-ts は Semigroup が必要か

fp-ts の標準の Either は Applicative として「先頭の Left で短絡」する。エラーを溜めるには
**Left 同士をどう合体させるか** を `Semigroup`（結合の方法）で教えてやる必要がある。
`A.getSemigroup<FieldError>()` は配列の concat を表す Semigroup なので、
`getApplicativeValidation` に渡すと Left のエラー配列が次々と連結され、全エラーが集約される。
だから各バリデータの Left は `[err]`（単一要素の配列）にしておく。

## 実装する関数（`neverthrow.ts` / `byethrow.ts` / `fp-ts.ts`）

各ファイルにドメイン型・バリデータ・`validateForm` をインライン定義してある。
バリデータの仕様は3ライブラリ共通:

- `validateName(name)`: `name.length >= 3` 以外なら `{ field: "name", message: "名前は3文字以上" }`
- `validateEmail(email)`: `email.includes("@")` 以外なら `{ field: "email", message: "メール形式が不正" }`
- `validateAge(age)`: `age >= 0 && age <= 120` 以外なら `{ field: "age", message: "年齢が範囲外" }`

実装するのは `validateForm(form)` のみ。成功なら `ValidUser`、失敗なら **全フィールドの** `FieldError[]`。

## ドメイン型（3ライブラリ共通）

```typescript
type Form = { name: string; email: string; age: number };
type ValidUser = { name: string; email: string; age: number };
type FieldError = { field: string; message: string };
```

## テスト実行

```bash
bun test src/exercises/05-validation-aggregation/index.test.ts
```
