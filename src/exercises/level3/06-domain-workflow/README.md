# Level 3 - 06: Domain Workflow Integration（ドメインワークフロー統合）

## このお題で学ぶこと

Level 3 の集大成として、ユーザー登録ワークフローを3つのライブラリで実装します。
同じ問題を異なるアプローチで解くことで、各ライブラリの特徴と使い分けを理解します。

## 実装するワークフロー

```
入力受け取り (UserInput)
  ↓
バリデーション
  - name: 3文字以上       → ValidationError(field: "name")
  - email: @を含む        → ValidationError(field: "email")
  - age: 0〜150           → ValidationError(field: "age")
  ↓
重複チェック
  - 既存メールの場合      → DuplicateError
  ↓
ユーザー保存
  ↓
Ok / Right / Success (User)
```

## 3ライブラリの実装比較

### neverthrow（チェーンスタイル）

```typescript
const registerUser = (input: UserInput): ResultAsync<User, AppError> =>
  validateInput(input)       // ResultAsync<UserInput, AppError>
    .andThen(checkDuplicate) // ResultAsync<UserInput, AppError>
    .andThen(saveUser);      // ResultAsync<User, AppError>
```

特徴: `.andThen()` でパイプラインを組む。関数型プログラミングのスタイルに近い。

### byethrow（async/awaitスタイル）

```typescript
const registerUser = async (input: UserInput): ResultAsync<User, AppError> => {
  const validated = await validateInput(input);
  if (Result.isFailure(validated)) return validated;
  const checked = await checkDuplicate(validated.value);
  if (Result.isFailure(checked)) return checked;
  return saveUser(checked.value);
};
```

特徴: 普通の async/await に近い書き方。既存コードに馴染みやすい。

### fp-ts（pipe + chainスタイル）

```typescript
const registerUser = (input: UserInput): TE.TaskEither<AppError, User> =>
  pipe(
    validateInput(input),
    TE.chain(checkDuplicate),
    TE.chain(saveUser),
  );
```

特徴: `pipe` による関数合成。最も宣言的なスタイル。**実行は `await registerUser(input)()`** と末尾の `()` が必要。

## ライブラリ選択の指針

| ライブラリ | 向いているケース |
|-----------|--------------|
| **neverthrow** | チームでよく使われる。TypeScript プロジェクトへの導入が簡単 |
| **byethrow** | async/await に慣れたチームで Result を段階的に導入したい場合 |
| **fp-ts** | 関数型プログラミングを徹底したい場合。学習コストは高め |

## 問題

各ファイルの `registerUser` を実装してください。

## テスト実行

```bash
bun test src/exercises/level3/06-domain-workflow/index.test.ts
```

## fp-ts の注意点

fp-ts の `registerUser` は **TaskEither（= 関数）を返す**ので、テストやアプリコードで実行するには末尾に `()` が必要です:

```typescript
// ✅ 正しい
const result = await registerUser(input)();

// ❌ Wrong: TaskEither は await できない（それ自体が関数なので）
const result = await registerUser(input);
```
