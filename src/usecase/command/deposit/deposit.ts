import { err, ok, type Result } from "neverthrow";
import { Transaction } from "../../../domain/transaction";
import { ValidationError } from "../../../errors";
import { BankAccountRepository } from "../../../repository/bank-account";

export function deposit(bankAccountId: number, amount: number): Result<Transaction, ValidationError> {
  if (amount <= 0) {
    return err(new ValidationError("入金額が0以下です"));
  }
  const bankAccount = new BankAccountRepository().getById(bankAccountId);
  bankAccount.balance += amount;
  const t = new Transaction(
    0,
    null,
    bankAccount.id,
    amount,
    "initial deposit",
  );
  // TODO: DBに保存する

  return ok(t);
}
