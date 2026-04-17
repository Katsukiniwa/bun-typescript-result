# Level 1 - 15: combine() — 複数ResultをまとめてOk/Errにする

## このお題で学ぶこと

`combine()` と `combineWithAllErrors()` を使って、複数のResultをまとめる方法を覚えます。
「最初のエラーで止まる」vs「全エラーを収集する」の違いも学びます。

## combine() とは？

```typescript
// 全て成功 → Ok([値の配列])
combine([ok(1), ok(2), ok(3)])  // Ok([1, 2, 3])

// 1つでも失敗 → 最初のErr
combine([ok(1), err("失敗"), err("別の失敗")])  // Err("失敗")
```

## combineWithAllErrors() とは？

```typescript
// 全て成功 → Ok([値の配列])
combineWithAllErrors([ok(1), ok(2)])  // Ok([1, 2])

// 失敗を全て収集 → Err([エラーの配列])
combineWithAllErrors([ok(1), err("エラー1"), err("エラー2")])
// Err(["エラー1", "エラー2"])
```

## どちらを使うか？

| 状況 | 使うAPI |
|------|---------|
| 最初のエラーで止まる（Short-circuit） | `combine()` |
| 全エラーをユーザーに一度に見せたい | `combineWithAllErrors()` |

フォームバリデーションでは通常 `combineWithAllErrors()` が好まれます
（全ての問題を一度に知らせるため）。

## 問題

### `validateForm(input): Result<[string, string, number], ValidationError>`

- 3つのバリデーションを `combine()` でまとめる
- 1つでも失敗したら最初のErrを返す

### `validateFormAllErrors(input): Result<[string, string, number], ValidationError[]>`

- 3つのバリデーションを `combineWithAllErrors()` でまとめる
- 全ての失敗を配列で返す

## テスト実行

```bash
bun test src/exercises/level1/15-combine/index.test.ts
```

## ヒント

```typescript
// combine は配列を受け取る
combine([
  validateName(input.name),
  validateEmail(input.email),
  validateAge(input.age),
]);

// combineWithAllErrors も同じ形
combineWithAllErrors([
  validateName(input.name),
  validateEmail(input.email),
  validateAge(input.age),
]);
```

Level 1はここで完了です！次は Level 2 で neverthrow と byethrow を比較しながら学びましょう。
