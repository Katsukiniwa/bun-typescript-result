# 01 - Repository境界の統合

## このテーマで学ぶこと

DB・外部API・`JSON.parse` など「外の世界」は **例外を投げてくる**。アプリの内側を Result で組み立てるには、まずこの **境界で throw を Result に変換** しなければならない。これを怠ると、せっかくの型安全な Result パイプラインの真ん中で突然例外が飛んでくる。

このテーマでは、throw する既存関数（レガシーRepository・`JSON.parse`・非同期fetch）を **境界アダプタ** で Result 化するパターンを、3ライブラリで繰り返し書く。

## 境界アダプタのイメージ

```
[外の世界: throwする]         [境界アダプタ]              [アプリ内: Resultで安全]
 rawFindUser(id) ──throw──▶  fromThrowable / try ──▶  Result<User, RepoError>
 JSON.parse(text) ─throw──▶  fromThrowable / try ──▶  Result<User, RepoError>
 fetchUser(id) ───reject──▶  fromPromise / tryCatch ▶  ResultAsync<User, RepoError>
```

## API比較

| やりたいこと | neverthrow | byethrow | fp-ts |
|------|-----------|---------|-------|
| 同期throwを包む | `fromThrowable(fn, mapErr)` | `Result.try({ try, catch })` | `E.tryCatch(fn, onThrow)` |
| 非同期rejectを包む | `fromPromise(promise, mapErr)` | `Result.try({ try: async, catch })` | `TE.tryCatch(fn, onThrow)` |
| 成功値を変換 | `.map(fn)` | `Result.pipe(r, Result.map(fn))` | `pipe(e, E.map(fn))` |

## 実装する関数（`neverthrow.ts` / `byethrow.ts` / `fp-ts.ts`）

順に難しくなる。3ライブラリすべてで実装すること。

1. **`safeParseUser(json)`** — `JSON.parse` の throw を捕まえ、`ParseError` に変換して `Result<User, RepoError>` を返す
2. **`findUser(id)`** — throw するレガシー関数 `rawFindUser` を包み、見つからなければ `NotFound` に変換する
3. **`getUserEmail(id)`** — `findUser` を呼び、成功時はメールアドレスだけを取り出す（境界アダプタ + map の合成）
4. **`fetchUser(id)`** — 非同期で reject する `rawFetchUser` を包み、`ResultAsync` / `TaskEither` を返す

## エラー型（3ライブラリ共通）

```typescript
type RepoError =
  | { type: "NotFound"; id: number }
  | { type: "ParseError"; message: string };
```

## テスト実行

```bash
bun test src/exercises/01-repository-boundary/index.test.ts
```
