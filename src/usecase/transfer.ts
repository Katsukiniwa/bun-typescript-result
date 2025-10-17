import { ok, type Result, safeTry } from "neverthrow";
import { BankAccount } from "../domain/bank-account";
import { deposit } from "./deposit";
import { withdraw } from "./withdraw";

export function transfer(fromOwnerId: number, toOwnerId: number): Result<number, string> {
  return safeTry<number, string>(function* () {
    return ok(
      (yield* withdraw(new BankAccount(1, fromOwnerId), 50)
        .map((r) => r.balance)
        .mapErr((e) => `aborted by an error from 2nd function, ${e}`)) +
        (yield* deposit(new BankAccount(2, toOwnerId), 100)
          .map((r) => r.amount)
          .mapErr((e) => `aborted by an error from 1st function, ${e}`)),
    );
  });
}
