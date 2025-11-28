import { fromThrowable } from "neverthrow";
import type { BankAccount } from "../../../domain/bank-account";
import { InsufficientFundsError, ValidationError, WithdrawError } from "../../../errors";

export const withdraw = fromThrowable(
  (account: BankAccount, amount: number) => {
    if (amount <= 0) {
      throw new ValidationError("出金額が0以下です");
    }
    if (account.balance < amount) {
      throw new InsufficientFundsError("残高不足です");
    }

    account.balance -= amount;
    return account;
  },
  (_err) => new WithdrawError('出金処理に失敗しました'),
);
