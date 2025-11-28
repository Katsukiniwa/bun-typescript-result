import { ok, safeTry } from "neverthrow";
import { BankAccount } from "../domain/bank-account";
import { deposit } from "./deposit";
import { withdrawSimple } from "./withdraw-simple";

export function transfer(fromOwnerId: number, toOwnerId: number) {
  return safeTry(function* () {
    const from = new BankAccount(1, fromOwnerId)
    const to = new BankAccount(2, toOwnerId)

    return ok(
      (yield* withdrawSimple(from, 100)
        .map((r) => r.balance)
      )
      +
      (yield* deposit(to, 100)
        .map((r) => r.amount)
      )
    );
  });
}
