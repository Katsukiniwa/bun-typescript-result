import { fromPromise, type ResultAsync } from "neverthrow";

export function fetchAccountBalance(accountId: number): ResultAsync<number, Error> {
  return fromPromise(
    command(accountId),
    (e) => new Error(`残高取得エラー: ${(e as Error).message}`),
  );
}

export const command = async (accountId: number) => {
  await new Promise((r) => setTimeout(r, 1000));
  if (accountId <= 0) throw new Error("Invalid accountId");
  return 1234.56;
};
