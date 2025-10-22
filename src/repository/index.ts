import { Database } from "bun:sqlite";
import type { BankAccount } from "../domain/bank-account";
import type { Merchant } from "../domain/merchant";
import type { Transaction } from "../domain/transaction";
import type { User } from "../domain/user";


export const users = new Map<number, User>();
export const merchants = new Map<number, Merchant>();
export const accounts = new Map<number, BankAccount>();
export const transactions: Transaction[] = [];

export const database = {
  nextUserId: 1,
  nextMerchantId: 1,
  nextAccountId: 1,
  nextTransactionId: 1,
};

export abstract class BaseRepository {
  db: Database;

  constructor() {
    this.db = new Database("app.db");
  }
}
