export class Transaction {
  constructor(
    public id: number,
    public fromAccountId: number | null,
    public toAccountId: number | null,
    public amount: number,
    public memo?: string,
  ) {}
}
