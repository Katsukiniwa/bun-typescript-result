import { fromThrowable } from "neverthrow";
import type { BankAccount } from "../domain/bank-account";

export const withdraw = fromThrowable(
  (account: BankAccount, amount: number) => {
    if (amount <= 0) {
      throw new Error("出金額が0以下です");
    }
    if (account.balance < amount) {
      throw new Error("残高不足です");
    }

    account.balance -= amount;
    return account;
  },
  (err) => `出金エラー: ${(err as Error).message}`,
);
