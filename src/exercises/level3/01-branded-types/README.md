# Level 3 - 01: Branded Types（スマートコンストラクタ）

## このお題で学ぶこと

**Branded Types**（Nominal Types とも呼ばれる）は、同じプリミティブ型の値を型レベルで区別するテクニックです。
スマートコンストラクタと組み合わせることで、バリデーション済みの値を型として表現できます。

## なぜ Branded Types が必要か？

```typescript
// ❌ Branded Types なし: コンパイルエラーにならない混用
function processUser(userId: string) { /* ... */ }

const orderId = "order-123";
processUser(orderId); // 誤ってorderIdを渡しても型エラーにならない！
```

```typescript
// ✅ Branded Types あり: コンパイルエラーで誤りを検出
declare const UserIdBrand: unique symbol;
type UserId = string & { readonly [UserIdBrand]: never };

function processUser(userId: UserId) { /* ... */ }

const orderId = "order-123"; // string 型
processUser(orderId); // コンパイルエラー！ string は UserId ではない
```

## Branded Types の仕組み

```typescript
declare const UserIdBrand: unique symbol;
//             ↑ unique symbol: このファイル固有のシンボル（他と重複しない）

type UserId = string & { readonly [UserIdBrand]: never };
//            ↑ string に対して特別なプロパティを intersection で付与する
//              実行時には普通の string として動作する
```

`unique symbol` を使うことで、`UserId` と `OrderId` は別のブランドを持ち、互換性がなくなります。

## スマートコンストラクタ

Branded Types を作成する唯一の正規ルートが**スマートコンストラクタ**です。
バリデーションを通過した値だけを Branded Type にキャストして返します。

```typescript
export const createUserId = (value: string): Result<UserId, BrandError> => {
  if (!value) return err({ field: "userId", message: "UserIdは空にできません" });
  return ok(value as UserId); // ✅ バリデーション済みなので as キャストが安全
};
```

## API 比較

| 操作 | neverthrow | byethrow |
|------|-----------|---------|
| 成功を返す | `ok(value as UserId)` | `Result.succeed(value as UserId)` |
| 失敗を返す | `err({ field, message })` | `Result.fail({ field, message })` |

## 問題

各ファイルの `createUserId`, `createEmail`, `createAmount` を実装してください。

### バリデーションルール

| 関数 | 条件 |
|------|------|
| `createUserId` | 空文字列の場合はエラー |
| `createEmail` | `@` を含まない場合はエラー |
| `createAmount` | 0未満の場合はエラー |

## テスト実行

```bash
bun test src/exercises/level3/01-branded-types/index.test.ts
```

## ヒント

neverthrow:
```typescript
if (!value) return err({ field: "userId", message: "..." });
return ok(value as UserId);
```

byethrow:
```typescript
return !value
  ? Result.fail({ field: "userId", message: "..." })
  : Result.succeed(value as UserId);
```
