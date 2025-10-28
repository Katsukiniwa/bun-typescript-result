import { ok, type Result } from "neverthrow";
import { BankAccount } from "../domain/bank-account";
import { database } from "../repository";
import { BankAccountRepository } from "../repository/bank-account";

type CreateBankAccount = (ownerId: number) => Result<BankAccount, string>;

export const createBankAccount: CreateBankAccount = (ownerId) => {
  const bankAccount = new BankAccount(database.nextAccountId++, ownerId);
  new BankAccountRepository().create(bankAccount);

  return ok(bankAccount);
};
