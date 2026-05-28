import { Result } from "@praha/byethrow";

type Form = { name: string; email: string; age: number };

type ValidUser = { name: string; email: string; age: number };

type FieldError = { field: string; message: string };

// 各バリデータは Result.Result<value, FieldError> を返す
const validateName = (name: string): Result.Result<string, FieldError> =>
  name.length >= 3
    ? Result.succeed(name)
    : Result.fail({ field: "name", message: "名前は3文字以上" });

const validateEmail = (email: string): Result.Result<string, FieldError> =>
  email.includes("@")
    ? Result.succeed(email)
    : Result.fail({ field: "email", message: "メール形式が不正" });

const validateAge = (age: number): Result.Result<number, FieldError> =>
  age >= 0 && age <= 120
    ? Result.succeed(age)
    : Result.fail({ field: "age", message: "年齢が範囲外" });

/**
 * フォームを検証し、全フィールドのエラーを集約して返す（先頭で短絡しない）。
 * @hint Result.collect([...]) は全失敗を配列(FieldError[])に集約する（sequence は先頭で短絡）。
 * Result.pipe(Result.collect([...]), Result.map(([name, email, age]) => ({ ... }))) で組み立てる。
 */
export const validateForm = (form: Form): Result.Result<ValidUser, FieldError[]> => {
  // 下の3つのバリデータを Result.collect にまとめて使う（この void は未使用警告を避けるためのダミー）
  void [validateName, validateEmail, validateAge];
  throw new Error(
    `TODO: Result.collect で全フィールドのエラーを集約してください (name=${form.name}, email=${form.email}, age=${form.age})`,
  );
};
