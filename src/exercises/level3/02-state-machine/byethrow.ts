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

/**
 * Active口座を凍結する（必ず成功する）
 * @hint Result.succeed({ _state: "Frozen", balance: account.balance, reason }) を返してください
 */
export const freeze = (account: Active, reason: string): Result.Result<Frozen, never> => {
  throw new Error("TODO: 実装してください");
};

/**
 * Frozen口座を解凍する（必ず成功する）
 * @hint Result.succeed({ _state: "Active", balance: account.balance }) を返してください
 */
export const unfreeze = (account: Frozen): Result.Result<Active, never> => {
  throw new Error("TODO: 実装してください");
};

/**
 * Active口座を閉鎖する（残高があるとエラー）
 * @hint account.balance > 0 のとき Result.fail({ _tag: "FundsRemainingError", balance: account.balance }) を返してください
 * @hint 残高が0のとき Result.succeed({ _state: "Closed" }) を返してください
 */
export const close = (account: Active): Result.Result<Closed, FundsRemainingError> => {
  throw new Error("TODO: balance > 0 のとき FundsRemainingError を返し、それ以外は Result.succeed({_state: 'Closed'}) を返してください");
};

/**
 * Active口座に入金する（必ず成功する）
 * @hint Result.succeed({ _state: "Active", balance: toAmount(account.balance + amount) }) を返してください
 */
export const deposit = (account: Active, amount: Amount): Result.Result<Active, never> => {
  throw new Error("TODO: 実装してください");
};

/**
 * Active口座から出金する（残高不足はエラー）
 * @hint account.balance < amount のとき Result.fail({ _tag: "InsufficientFundsError", balance: account.balance, amount }) を返してください
 * @hint 正常なとき Result.succeed({ _state: "Active", balance: toAmount(account.balance - amount) }) を返してください
 */
export const withdraw = (
  account: Active,
  amount: Amount,
): Result.Result<Active, InsufficientFundsError> => {
  throw new Error("TODO: balance < amount のとき InsufficientFundsError を返してください");
};
