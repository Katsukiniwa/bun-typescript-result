import { Result } from "@praha/byethrow";

declare const AmountBrand: unique symbol;
type Amount = number & { readonly [AmountBrand]: never };
export const toAmount = (n: number) => n as Amount;

type Active = { _state: "Active"; balance: Amount };
type Frozen = { _state: "Frozen"; balance: Amount; reason: string };
type Closed = { _state: "Closed" };
export type BankAccount = Active | Frozen | Closed;

type FundsRemainingError = { _tag: "FundsRemainingError"; balance: number };
type InsufficientFundsError = { _tag: "InsufficientFundsError"; balance: number; amount: number };

export const freeze = (account: Active, reason: string): Result.Result<Frozen, never> =>
  Result.succeed({ _state: "Frozen", balance: account.balance, reason });

export const unfreeze = (account: Frozen): Result.Result<Active, never> =>
  Result.succeed({ _state: "Active", balance: account.balance });

export const close = (account: Active): Result.Result<Closed, FundsRemainingError> =>
  account.balance > 0
    ? Result.fail({ _tag: "FundsRemainingError", balance: account.balance })
    : Result.succeed({ _state: "Closed" });

export const deposit = (account: Active, amount: Amount): Result.Result<Active, never> =>
  Result.succeed({ _state: "Active", balance: toAmount(account.balance + amount) });

export const withdraw = (
  account: Active,
  amount: Amount,
): Result.Result<Active, InsufficientFundsError> =>
  account.balance < amount
    ? Result.fail({ _tag: "InsufficientFundsError", balance: account.balance, amount })
    : Result.succeed({ _state: "Active", balance: toAmount(account.balance - amount) });
