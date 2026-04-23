import { err, ok, type Result } from "neverthrow";

/** バリデーションエラーの型 */
type ValidationError = {
  field: string;
  message: string;
};

/**
 * 名前のバリデーション（3文字以上）
 * @hint 条件を満たさない場合は err({ field: "name", message: "..." }) を返す
 */
export const validateName = (name: string): Result<string, ValidationError> => {
  if (name.length === 0) return err({ field: "name", message: "名前は必須です" });
  if (name.length < 3) return err({ field: "name", message: "名前は3文字以上にしてください" });
  return ok(name);
};

/**
 * メールアドレスのバリデーション（@を含む）
 * @hint "@" が含まれているかチェックしてください
 */
export const validateEmail = (email: string): Result<string, ValidationError> => {
  if (email.length === 0) return err({ field: "email", message: "メールアドレスは必須です" });
  if (!email.includes("@"))
    return err({ field: "email", message: "メールアドレスの形式が正しくありません" });
  return ok(email);
};

/**
 * 年齢のバリデーション（0以上150以下）
 */
export const validateAge = (age: number): Result<number, ValidationError> => {
  if (age < 0) return err({ field: "age", message: "年齢は0以上にしてください" });
  if (age > 150) return err({ field: "age", message: "年齢は150以下にしてください" });
  return ok(age);
};
