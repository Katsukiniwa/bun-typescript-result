# Level 1 - 12: 連鎖バリデーション — andThenでステップを繋ぐ

## このお題で学ぶこと

複数のバリデーションを `andThen()` で連鎖させ、最初に失敗した時点で処理を止める（Short-circuit評価）パターンを覚えます。

## Short-circuit（短絡評価）とは？

```
名前チェック → OK → メールチェック → OK → 年齢チェック → OK → User作成
名前チェック → エラー → ここで止まる（後続はスキップ）
```

`andThen()` でResultを連鎖すると、エラーが発生した時点で後続の処理が全てスキップされます。
`try/catch` の `throw` と同じ効果を型安全に実現できます。

## 実装パターン

```typescript
// andThen の連鎖
validateName(input.name)
  .andThen(name =>
    validateEmail(input.email)
      .andThen(email =>
        validateAge(input.age)
          .map(age => ({ name, email, age })) // 全て成功したらUserを作る
      )
  );
```

最後のステップは `map()` で OK です（失敗しないため）。

## 問題

### `createUser(input): Result<User, ValidationError>`

- `validateName` → `validateEmail` → `validateAge` の順に検証
- 全て成功したら `User` オブジェクトを返す
- 最初に失敗したバリデーションのエラーを返す

## テスト実行

```bash
bun test src/exercises/level1/12-chained-validation/index.test.ts
```

## ヒント

```typescript
validateName(input.name)
  .andThen((name) =>   // 名前が成功したら次へ
    validateEmail(input.email)
      .andThen((email) =>  // メールが成功したら次へ
        validateAge(input.age)
          .map((age) => ({ name, email, age }))  // 年齢が成功したらUserを作る
      )
  );
```

`andThen` の中で受け取る引数（`name`, `email`, `age`）は、それぞれOkの値です。
これらをクロージャで参照できるので、最後に全て使ってオブジェクトを作れます。
