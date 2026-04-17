# Level 3 - 02: State Machine（状態機械）

## このお題で学ぶこと

**State Machine**（状態機械）パターンを使って、ドメインオブジェクトの状態遷移を型レベルで安全にモデリングします。
不正な状態遷移をコンパイルエラーとして検出できるようになります。

## なぜ State Machine が必要か？

```typescript
// ❌ State Machine なし: どの操作もどの状態でも呼べてしまう
type BankAccount = {
  status: "active" | "frozen" | "closed";
  balance: number;
  freezeReason?: string;
};

function withdraw(account: BankAccount, amount: number) {
  // ランタイムで状態チェックが必要
  if (account.status !== "active") throw new Error("Invalid state");
}

withdraw(frozenAccount, 100); // コンパイルエラーにならない！
```

```typescript
// ✅ State Machine あり: 型で状態を表現し、不正な操作はコンパイルエラーに
type Active = { _state: "Active"; balance: Amount };
type Frozen = { _state: "Frozen"; balance: Amount; reason: string };
type Closed = { _state: "Closed" };

// withdraw は Active 口座のみ受け付ける
function withdraw(account: Active, amount: Amount): Result<Active, InsufficientFundsError>

// Frozen口座を渡すとコンパイルエラー！
withdraw(frozenAccount, amount); // ❌ 型エラー
```

## 状態遷移図

```
          freeze("理由")
Active ──────────────────→ Frozen
  ↑                            │
  └────────────────────────────┘
         unfreeze()

Active ──→ Closed   (残高が0の場合のみ)
  (close)

Active ──→ Active   (deposit / withdraw)
```

## 型による状態の表現

```typescript
type Active = { _state: "Active"; balance: Amount };
//             ↑ リテラル型で状態を一意に識別する

type Frozen = { _state: "Frozen"; balance: Amount; reason: string };
//             ↑ Frozen 状態固有のフィールド reason がある

type Closed = { _state: "Closed" };
//             ↑ Closed になると balance にアクセスできない（誤操作防止）
```

## API 比較

| 操作 | neverthrow | byethrow |
|------|-----------|---------|
| 常に成功 | `ok(...)` | `Result.succeed(...)` |
| エラー | `err({ _tag: "...", ... })` | `Result.fail({ _tag: "...", ... })` |

## 問題

各関数を実装してください。

### 関数一覧

| 関数 | 入力 | 出力 | エラー条件 |
|------|------|------|----------|
| `freeze` | `Active`, `reason` | `Frozen` | なし（常に成功） |
| `unfreeze` | `Frozen` | `Active` | なし（常に成功） |
| `close` | `Active` | `Closed` | 残高が0より大きい場合 |
| `deposit` | `Active`, `amount` | `Active` | なし（常に成功） |
| `withdraw` | `Active`, `amount` | `Active` | 残高不足の場合 |

## テスト実行

```bash
bun test src/exercises/level3/02-state-machine/index.test.ts
```

## ヒント

残高の更新は `toAmount(account.balance + amount)` のように `toAmount` でラップしてください。

```typescript
// deposit の例（neverthrow）
export const deposit = (account: Active, amount: Amount): Result<Active, never> =>
  ok({ _state: "Active", balance: toAmount(account.balance + amount) });
```
