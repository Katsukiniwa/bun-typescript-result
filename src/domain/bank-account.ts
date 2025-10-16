export class BankAccount {
  public balance: number;
  constructor(
    public id: number,
    public ownerId: number,
  ) {
    this.balance = 0;
  }
}
