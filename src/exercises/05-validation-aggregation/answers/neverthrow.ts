import { err, ok, Result } from "neverthrow";

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

// combineWithAllErrors で全エラーを集約する（短絡せず3つすべて評価される）
export const validateForm = (form: Form): Result<ValidUser, FieldError[]> =>
  Result.combineWithAllErrors([
    validateName(form.name),
    validateEmail(form.email),
    validateAge(form.age),
  ]).map(([name, email, age]) => ({ name, email, age }));
