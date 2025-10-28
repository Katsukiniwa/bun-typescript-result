import type { Result } from "neverthrow";
import type { Transaction } from "../domain/transaction";
import type { ValidationError } from "../errors";
import { createBankAccount } from "./create-bank-account";
import { createUser } from "./create-user";
import { deposit } from "./deposit";

export function createUserWithInitialDeposit(
  name: string,
  initialDeposit: number,
): Result<Transaction, string | ValidationError> {
  return createUser(name)
    .andThen((user) => createBankAccount(user.id))
    .andThen((bankAccount) => deposit(bankAccount, initialDeposit));
}
