import { err, ok, type Result } from "neverthrow";

type ValidationError = {
  field: string;
  message: string;
};

export type User = {
  name: string;
  email: string;
  age: number;
};

type UserInput = {
  name: string;
  email: string;
  age: number;
};

// ヒント: これらのバリデーション関数を使って createUser を実装してください
const validateName = (name: string): Result<string, ValidationError> => {
  if (name.length === 0) return err({ field: "name", message: "名前は必須です" });
  if (name.length < 3) return err({ field: "name", message: "名前は3文字以上にしてください" });
  return ok(name);
};

const validateEmail = (email: string): Result<string, ValidationError> => {
  if (email.length === 0) return err({ field: "email", message: "メールアドレスは必須です" });
  if (!email.includes("@"))
    return err({ field: "email", message: "メールアドレスの形式が正しくありません" });
  return ok(email);
};

const validateAge = (age: number): Result<number, ValidationError> => {
  if (age < 0) return err({ field: "age", message: "年齢は0以上にしてください" });
  if (age > 150) return err({ field: "age", message: "年齢は150以下にしてください" });
  return ok(age);
};

/**
 * ユーザーを作成する（3ステップのバリデーション付き）
 * @hint validateName(input.name).andThen(name => validateEmail(input.email).andThen(...))
 * @hint andThen でResultを返す関数を連鎖するとShort-circuit評価になります
 */
export const createUser = (input: UserInput): Result<User, ValidationError> => {
  return validateName(input.name).andThen((name) =>
    validateEmail(input.email).andThen((email) =>
      validateAge(input.age).map((age) => ({ name, email, age })),
    ),
  );
};
