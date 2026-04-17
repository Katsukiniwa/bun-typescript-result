import { Result, err, ok } from "neverthrow";

type ValidationError = { field: string; message: string };
type FormInput = { name: string; email: string; age: number };

const validateName = (name: string): Result<string, ValidationError> =>
  name.length < 3
    ? err({ field: "name", message: "名前は3文字以上にしてください" })
    : ok(name);

const validateEmail = (email: string): Result<string, ValidationError> =>
  !email.includes("@")
    ? err({ field: "email", message: "メールアドレスの形式が正しくありません" })
    : ok(email);

const validateAge = (age: number): Result<number, ValidationError> =>
  age < 0
    ? err({ field: "age", message: "年齢は0以上にしてください" })
    : ok(age);

/**
 * 短絡評価バリデーション: 最初のエラーで止まる
 * @hint Result.combine([validateName(input.name), validateEmail(input.email), validateAge(input.age)]) を使ってください
 * @note Result.combine() は最初のエラーで止まります（neverthrow v8 では Result.combine() が静的メソッド）
 */
export const validateForm = (input: FormInput): Result<[string, string, number], ValidationError> => {
  throw new Error("TODO: Result.combine() を使って実装してください");
};

/**
 * 全エラー収集バリデーション: 全てのバリデーションを実行してエラーを収集
 * @hint Result.combineWithAllErrors([...]) を使ってください
 * @note Result.combineWithAllErrors() は全エラーを収集します
 */
export const validateFormAllErrors = (input: FormInput): Result<[string, string, number], ValidationError[]> => {
  throw new Error("TODO: Result.combineWithAllErrors() を使って実装してください");
};
