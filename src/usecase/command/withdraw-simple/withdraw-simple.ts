import { err, ok, type Result } from "neverthrow";
import type { BankAccount } from "../domain/bank-account";
import { InsufficientFundsError, ValidationError } from "../errors";

export const withdrawSimple = (account: BankAccount, amount: number): Result<BankAccount, ValidationError | InsufficientFundsError> => {
  if (amount <= 0) {
    return err(new ValidationError("出金額が0以下です"))
  }
  if (account.balance < amount) {
    return err(new InsufficientFundsError("残高不足です"));
  }

  account.balance -= amount;

  return ok(account);
}
