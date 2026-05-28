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

// Result.collect は全失敗を配列(FieldError[])に集約する（sequence は先頭で短絡）
export const validateForm = (form: Form): Result.Result<ValidUser, FieldError[]> =>
  Result.pipe(
    Result.collect([validateName(form.name), validateEmail(form.email), validateAge(form.age)]),
    Result.map(([name, email, age]) => ({ name, email, age })),
  );
