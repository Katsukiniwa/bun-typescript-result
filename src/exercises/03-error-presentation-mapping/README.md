# 03 - エラー表現マッピング（ts-pattern × exhaustive）

## このテーマで学ぶこと

アプリが返すドメインエラーは Discriminated Union で表現される。これを HTTP レスポンス（ステータス + ボディ）に変換するとき、**バリアントの追加漏れ**が実行時エラーに直結する。

ts-pattern の `.exhaustive()` を使うと、**コンパイル時に全バリアントを処理したか**を強制できる。Result を HTTP レスポンスにたたみ込む「fold」の書き方も、3ライブラリで比較しながら習得する。

## なぜ `.exhaustive()` が重要か

```typescript
// AppError に { type: "RateLimit" } を追加した場合…

// switch文: コンパイルエラーにならず、default に落ちて不正なレスポンスを返す可能性がある
switch (error.type) {
  case "NotFound": return 404;
  default: return 500; // RateLimit が暗黙的にここに落ちる
}

// ts-pattern + exhaustive: コンパイルエラーになり対応漏れを防ぐ
match(error)
  .with({ type: "NotFound" }, () => 404)
  // ...
  .exhaustive(); // ← "RateLimit" を処理していないとコンパイルエラー
```

## ドメイン型（3ライブラリ共通）

```typescript
type AppError =
  | { type: "NotFound"; resource: string }
  | { type: "ValidationError"; message: string }
  | { type: "Unauthorized" }
  | { type: "Conflict"; detail: string };

type ErrorBody = { code: string; message: string };
type HttpResponse = { status: number; body: unknown };
```

## API比較：Result → HttpResponse への fold

| やりたいこと | neverthrow | byethrow | fp-ts |
|---|---|---|---|
| 成功/失敗をたたむ | `result.match(onOk, onErr)` | `Result.isSuccess(result) ? ... : ...` | `pipe(result, E.match(onLeft, onRight))` |
| エラーを変換 | `.mapErr(fn)` | `Result.pipe(r, Result.mapError(fn))` | `pipe(e, E.mapLeft(fn))` |

## 実装する関数（`neverthrow.ts` / `byethrow.ts` / `fp-ts.ts`）

1. **`toStatus(error)`** — AppError を HTTP ステータスコードにマップ（`match` + `.exhaustive()`）
2. **`toErrorBody(error)`** — AppError をクライアント向けエラーボディにマップ（`match` + `.exhaustive()`）
3. **`handleResult<T>(result)`** — Result/Either を HttpResponse にたたみ込む

## テスト実行

```bash
bun test src/exercises/03-error-presentation-mapping/index.test.ts
```
