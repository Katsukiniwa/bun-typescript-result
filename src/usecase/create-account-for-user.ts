import { accounts, database } from "../repository";
import { BankAccount } from "../domain/bank-account";
import { ok, type Result } from "neverthrow";

import type { User } from "../domain/user";

export const createAccountForUser = (user: User): Result<BankAccount, string> => {
  const account = new BankAccount(database.nextAccountId++, user.id);
  accounts.set(account.id, account);

  return ok(account);
};
