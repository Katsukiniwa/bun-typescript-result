import type { Result } from "neverthrow";
import type { Transaction } from "../domain/transaction";
import { createAccountForUser } from "./create-account-for-user";
import { createUser } from "./create-user";
import { deposit } from "./deposit";

export function createUserWithInitialDeposit(
  name: string,
  initialDeposit: number,
): Result<Transaction, string> {
  return createUser(name)
    .andThen((user) => createAccountForUser(user))
    .andThen((account) => deposit(account, initialDeposit));
}
