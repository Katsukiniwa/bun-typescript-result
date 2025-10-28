import { BankAccount } from "../domain/bank-account";
import { BaseRepository } from ".";

export class BankAccountRepository extends BaseRepository {
  public create(bankAccount: BankAccount): BankAccount {
    const newBankAccount = this
      .db
      .query(
        "INSERT INTO bank_accounts (owner_id, balance) VALUES ($owner_id, $balance) RETURNING *"
      )
      .as(BankAccount)
      .get(bankAccount.ownerId, bankAccount.balance)
    if (!newBankAccount) {
      throw new Error("Failed to create bank account");
    }
    console.log(`BankAccount created: ${JSON.stringify(newBankAccount)}`);

    return newBankAccount;
  }
}
