import { err, ok, type Result } from "neverthrow";

declare const UserIdBrand: unique symbol;
export type UserId = string & { readonly [UserIdBrand]: never };

declare const EmailBrand: unique symbol;
export type Email = string & { readonly [EmailBrand]: never };

declare const AmountBrand: unique symbol;
export type Amount = number & { readonly [AmountBrand]: never };

type BrandError = { field: string; message: string };

export const createUserId = (value: string): Result<UserId, BrandError> => {
  if (!value) return err({ field: "userId", message: "UserIdは空にできません" });
  return ok(value as UserId);
};

export const createEmail = (value: string): Result<Email, BrandError> => {
  if (!value.includes("@")) return err({ field: "email", message: "メールアドレスの形式が正しくありません" });
  return ok(value as Email);
};

export const createAmount = (value: number): Result<Amount, BrandError> => {
  if (value < 0) return err({ field: "amount", message: "金額は0以上にしてください" });
  return ok(value as Amount);
};
