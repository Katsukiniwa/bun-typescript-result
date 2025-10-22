import { err, ok, type Result } from "neverthrow";
import type { BankAccount } from "../domain/bank-account";
import { Transaction } from "../domain/transaction";
import { ValidationError } from "../errors";
import { database, transactions } from "../repository";

export function deposit(account: BankAccount, amount: number): Result<Transaction, ValidationError> {
  if (amount <= 0) {
    return err(new ValidationError("入金額が0以下です"));
  }
  account.balance += amount;
  const t = new Transaction(
    database.nextTransactionId++,
    null,
    account.id,
    amount,
    "initial deposit",
  );
  transactions.push(t);

  return ok(t);
}
