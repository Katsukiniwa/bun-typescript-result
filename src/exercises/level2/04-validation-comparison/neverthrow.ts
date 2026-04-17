import { err, ok, type Result } from "neverthrow";

type ValidationError = { field: string; message: string };
type UserInput = { name: string; email: string; age: number };
type User = { name: string; email: string; age: number };

const validateName = (name: string): Result<string, ValidationError> =>
  name.length < 2
    ? err({ field: "name", message: "名前は2文字以上にしてください" })
    : ok(name);

const validateEmail = (email: string): Result<string, ValidationError> =>
  !email.includes("@")
    ? err({ field: "email", message: "メールアドレスの形式が正しくありません" })
    : ok(email);

const validateAge = (age: number): Result<number, ValidationError> =>
  age < 0 || age > 150
    ? err({ field: "age", message: "年齢は0〜150の範囲にしてください" })
    : ok(age);

/**
 * ユーザー入力を検証してUserを生成する
 * @hint validateName(input.name).andThen(name => validateEmail(...).andThen(...)) のようにチェーンしてください
 */
export const createUser = (input: UserInput): Result<User, ValidationError> => {
  throw new Error("TODO: .andThen() をチェーンして実装してください");
};
