import { err, ok, type Result } from "neverthrow";
import type { BankAccount } from "../domain/bank-account";
import { Transaction } from "../domain/transaction";
import { database, transactions } from "../repository";

export function deposit(account: BankAccount, amount: number): Result<Transaction, string> {
  if (amount <= 0) {
    return err("amount must be > 0");
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
