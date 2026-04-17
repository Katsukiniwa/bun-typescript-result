import { Result } from "@praha/byethrow";

type ValidationError = { field: string; message: string };
type FormInput = { name: string; email: string; age: number };

const validateName = (name: string): Result.Result<string, ValidationError> =>
  name.length < 3
    ? Result.fail({ field: "name", message: "名前は3文字以上にしてください" })
    : Result.succeed(name);

const validateEmail = (email: string): Result.Result<string, ValidationError> =>
  !email.includes("@")
    ? Result.fail({ field: "email", message: "メールアドレスの形式が正しくありません" })
    : Result.succeed(email);

const validateAge = (age: number): Result.Result<number, ValidationError> =>
  age < 0
    ? Result.fail({ field: "age", message: "年齢は0以上にしてください" })
    : Result.succeed(age);

/**
 * 短絡評価バリデーション: 最初のエラーで止まる
 * @hint Result.sequence([validateName(input.name), validateEmail(input.email), validateAge(input.age)]) を使ってください
 * @note neverthrow の combine() に相当します
 */
export const validateForm = (input: FormInput): Result.Result<[string, string, number], ValidationError> => {
  throw new Error("TODO: Result.sequence() を使って実装してください");
};

/**
 * 全エラー収集バリデーション: 全てのバリデーションを実行してエラーを収集
 * @hint Result.collect([...]) を使ってください
 * @note neverthrow の combineWithAllErrors() に相当します
 */
export const validateFormAllErrors = (input: FormInput): Result.Result<[string, string, number], ValidationError[]> => {
  throw new Error("TODO: Result.collect() を使って実装してください");
};
