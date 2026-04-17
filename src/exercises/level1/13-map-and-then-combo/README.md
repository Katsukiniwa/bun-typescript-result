# Level 1 - 13: map + andThen コンボ — 変換と検証を組み合わせる

## このお題で学ぶこと

`map()` と `andThen()` の使い分けと組み合わせ方を覚えます。

## map と andThen の違いを復習

```typescript
// map: 失敗しない変換
ok("  alice  ").map(s => s.trim())  // Ok("alice")

// andThen: 失敗する可能性がある変換
ok("alice").andThen(name =>
  name.length === 0 ? err("空です") : ok(name)
)
```

**ルール:**
- 変換が絶対に成功する → `map()`
- 変換が失敗するかもしれない → `andThen()`

## 実装パターン

```typescript
ok(rawName)
  .map(s => s.trim().toUpperCase())         // トリム・大文字化（失敗しない）
  .andThen(name =>                           // 空文字チェック（失敗する可能性あり）
    name.length === 0 ? err("空です") : ok(name)
  )
  .andThen(name => {                         // 年齢変換（失敗する可能性あり）
    const age = Number(rawAge);
    if (Number.isNaN(age)) return err("数値にしてください");
    return ok({ name, age });
  });
```

## 問題

### `processInput(input): Result<ProcessedInput, string>`

入力:
- `rawName`: 生の名前文字列（空白が含まれているかも）
- `rawAge`: 文字列の年齢

処理:
1. `rawName` をトリム・大文字化（map）
2. 空文字ならErr
3. `rawAge` を数値に変換。NaNならErr
4. 年齢が0未満ならErr
5. 全て成功なら `{ name, age }` を返す

## テスト実行

```bash
bun test src/exercises/level1/13-map-and-then-combo/index.test.ts
```

## ヒント

```typescript
ok(input.rawName)
  .map(s => s.trim().toUpperCase())
  .andThen(name => ...)  // 空文字チェック
  .andThen(name => ...)  // 年齢変換と0以上チェック
```

`andThen` の中では name がクロージャで参照できるので、
最後のステップで `ok({ name, age })` と書けます。
