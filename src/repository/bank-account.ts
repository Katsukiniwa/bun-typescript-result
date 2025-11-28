import { BankAccount } from "../domain/bank-account";
import { BaseRepository } from ".";

export class BankAccountRepository extends BaseRepository {
  public getById(id: number): BankAccount {
    const result = this.db.query("SELECT * FROM bank_accounts WHERE id = $id").values().map(raw => new BankAccount(
      raw[0] as number,
      raw[1] as number,
    ))[0];
    if (!result) {
      throw new Error(`BankAccount with id ${id} not found`);
    }
    return result;
  }


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
