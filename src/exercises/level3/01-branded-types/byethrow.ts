import { Result } from "@praha/byethrow";

declare const UserIdBrand: unique symbol;
export type UserId = string & { readonly [UserIdBrand]: never };

declare const EmailBrand: unique symbol;
export type Email = string & { readonly [EmailBrand]: never };

declare const AmountBrand: unique symbol;
export type Amount = number & { readonly [AmountBrand]: never };

type BrandError = { field: string; message: string };

/**
 * UserId を作成するスマートコンストラクタ
 * @hint 空文字の場合は Result.fail({ field: "userId", message: "..." }) を返してください
 * @hint 正常な場合は Result.succeed(value as UserId) を返してください
 */
export const createUserId = (value: string): Result.Result<UserId, BrandError> => {
  throw new Error("TODO: バリデーション後に Result.succeed(value as UserId) を返してください");
};

/**
 * Email を作成するスマートコンストラクタ
 * @hint value.includes("@") で @ の有無をチェックしてください
 * @hint 不正な場合は Result.fail({ field: "email", message: "..." }) を返してください
 */
export const createEmail = (value: string): Result.Result<Email, BrandError> => {
  throw new Error("TODO: @を含む文字列のみ Result.succeed(value as Email) を返してください");
};

/**
 * Amount を作成するスマートコンストラクタ（0以上の数値）
 * @hint value < 0 のとき Result.fail({ field: "amount", message: "..." }) を返してください
 * @hint 正常な場合は Result.succeed(value as Amount) を返してください
 */
export const createAmount = (value: number): Result.Result<Amount, BrandError> => {
  throw new Error("TODO: 0以上のとき Result.succeed(value as Amount) を返してください");
};
