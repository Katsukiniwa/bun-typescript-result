import { Result } from "@praha/byethrow";

type ValidationError = { field: string; message: string };
type UserInput = { name: string; email: string; age: number };
type User = { name: string; email: string; age: number };

const validateName = (name: string): Result.Result<string, ValidationError> =>
  name.length < 2
    ? Result.fail({ field: "name", message: "名前は2文字以上にしてください" })
    : Result.succeed(name);

const validateEmail = (email: string): Result.Result<string, ValidationError> =>
  !email.includes("@")
    ? Result.fail({ field: "email", message: "メールアドレスの形式が正しくありません" })
    : Result.succeed(email);

const validateAge = (age: number): Result.Result<number, ValidationError> =>
  age < 0 || age > 150
    ? Result.fail({ field: "age", message: "年齢は0〜150の範囲にしてください" })
    : Result.succeed(age);

/**
 * ユーザー入力を検証してUserを生成する
 * @hint Result.pipe(validateName(input.name), Result.andThen(name => Result.pipe(validateEmail(...), ...))) のようにネストしてください
 * @note byethrow にはフラットなチェーンがないため、andThen の中で再度 Result.pipe を使います
 */
export const createUser = (input: UserInput): Result.Result<User, ValidationError> => {
  throw new Error("TODO: Result.pipe() + Result.andThen() をネストして実装してください");
};
