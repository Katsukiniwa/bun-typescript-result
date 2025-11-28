import { fromSafePromise } from "neverthrow";

export function depositFromATM(accountId: number, amount: number) {
  return fromSafePromise(command(accountId, amount));
}

const command = async (accountId: number, amount: number) => {
  await new Promise((r) => setTimeout(r, 1000));
  if (accountId <= 0) throw new Error("Invalid accountId");
  if (amount <= 0) throw new Error("amount must be > 0");
  return `Deposited ${amount} to account ${accountId}`;
};
