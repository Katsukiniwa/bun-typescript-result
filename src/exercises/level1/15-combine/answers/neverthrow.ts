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

export const validateForm = (
  input: FormInput,
): Result<[string, string, number], ValidationError> =>
  Result.combine([validateName(input.name), validateEmail(input.email), validateAge(input.age)]);

export const validateFormAllErrors = (
  input: FormInput,
): Result<[string, string, number], ValidationError[]> =>
  Result.combineWithAllErrors([
    validateName(input.name),
    validateEmail(input.email),
    validateAge(input.age),
  ]);
