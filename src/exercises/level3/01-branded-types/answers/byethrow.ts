import { Result } from "@praha/byethrow";

declare const UserIdBrand: unique symbol;
export type UserId = string & { readonly [UserIdBrand]: never };

declare const EmailBrand: unique symbol;
export type Email = string & { readonly [EmailBrand]: never };

declare const AmountBrand: unique symbol;
export type Amount = number & { readonly [AmountBrand]: never };

type BrandError = { field: string; message: string };

export const createUserId = (value: string): Result.Result<UserId, BrandError> =>
  !value
    ? Result.fail({ field: "userId", message: "UserIdは空にできません" })
    : Result.succeed(value as UserId);

export const createEmail = (value: string): Result.Result<Email, BrandError> =>
  !value.includes("@")
    ? Result.fail({ field: "email", message: "メールアドレスの形式が正しくありません" })
    : Result.succeed(value as Email);

export const createAmount = (value: number): Result.Result<Amount, BrandError> =>
  value < 0
    ? Result.fail({ field: "amount", message: "金額は0以上にしてください" })
    : Result.succeed(value as Amount);
