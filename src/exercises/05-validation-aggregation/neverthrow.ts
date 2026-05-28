import { err, ok, type Result } from "neverthrow";

type Form = { name: string; email: string; age: number };

type ValidUser = { name: string; email: string; age: number };

type FieldError = { field: string; message: string };

// 各バリデータは Result<value, FieldError> を返す（成功なら値・失敗なら単一のFieldError）
const validateName = (name: string): Result<string, FieldError> =>
  name.length >= 3 ? ok(name) : err({ field: "name", message: "名前は3文字以上" });

const validateEmail = (email: string): Result<string, FieldError> =>
  email.includes("@") ? ok(email) : err({ field: "email", message: "メール形式が不正" });

const validateAge = (age: number): Result<number, FieldError> =>
  age >= 0 && age <= 120 ? ok(age) : err({ field: "age", message: "年齢が範囲外" });

/**
 * フォームを検証し、全フィールドのエラーを集約して返す（先頭で短絡しない）。
 * @hint Result.combineWithAllErrors([validateName(...), validateEmail(...), validateAge(...)])
 * は Ok([name, email, age]) もしくは Err(FieldError[]) を返す。最後に .map で ValidUser に組み立てる。
 */
export const validateForm = (form: Form): Result<ValidUser, FieldError[]> => {
  // 下の3つのバリデータを combineWithAllErrors にまとめて使う（この void は未使用警告を避けるためのダミー）
  void [validateName, validateEmail, validateAge];
  throw new Error(
    `TODO: combineWithAllErrors で全フィールドのエラーを集約してください (name=${form.name}, email=${form.email}, age=${form.age})`,
  );
};
