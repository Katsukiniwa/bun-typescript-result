import { Result, err, ok } from "neverthrow";

type ValidationError = {
  field: string;
  message: string;
};

type FormInput = {
  name: string;
  email: string;
  age: number;
};

const validateName = (name: string): Result<string, ValidationError> => {
  if (name.length < 3) return err({ field: "name", message: "名前は3文字以上にしてください" });
  return ok(name);
};

const validateEmail = (email: string): Result<string, ValidationError> => {
  if (!email.includes("@"))
    return err({ field: "email", message: "メールアドレスの形式が正しくありません" });
  return ok(email);
};

const validateAge = (age: number): Result<number, ValidationError> => {
  if (age < 0) return err({ field: "age", message: "年齢は0以上にしてください" });
  return ok(age);
};

/**
 * フォームを検証して、1つでも失敗したら最初のErrを返す
 * @hint Result.combine([result1, result2, result3]) は全部成功なら Ok([v1, v2, v3])、失敗なら最初の Err
 */
export const validateForm = (
  input: FormInput,
): Result<[string, string, number], ValidationError> => {
  // TODO: Result.combine() を使って3つのバリデーション結果をまとめてください
  throw new Error("TODO: Result.combine([...]) を使って実装してください");
};

/**
 * フォームを検証して、失敗を全て収集する
 * @hint Result.combineWithAllErrors([result1, result2, result3]) は全部のエラーを配列で返す
 */
export const validateFormAllErrors = (
  input: FormInput,
): Result<[string, string, number], ValidationError[]> => {
  // TODO: Result.combineWithAllErrors([...]) を使って実装してください
  throw new Error("TODO: Result.combineWithAllErrors([...]) を使って実装してください");
};
