import { sequenceT } from "fp-ts/Apply";
import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

type Form = { name: string; email: string; age: number };

type ValidUser = { name: string; email: string; age: number };

type FieldError = { field: string; message: string };

// 各バリデータは E.Either<FieldError[], value> を返す（Left は単一要素配列 [err]）
const validateName = (name: string): E.Either<FieldError[], string> =>
  name.length >= 3 ? E.right(name) : E.left([{ field: "name", message: "名前は3文字以上" }]);

const validateEmail = (email: string): E.Either<FieldError[], string> =>
  email.includes("@") ? E.right(email) : E.left([{ field: "email", message: "メール形式が不正" }]);

const validateAge = (age: number): E.Either<FieldError[], number> =>
  age >= 0 && age <= 120 ? E.right(age) : E.left([{ field: "age", message: "年齢が範囲外" }]);

// applicative validation: Semigroup で Left のエラー配列を concat し全エラーを集約する
const V = E.getApplicativeValidation(A.getSemigroup<FieldError>());

export const validateForm = (form: Form): E.Either<FieldError[], ValidUser> =>
  pipe(
    sequenceT(V)(validateName(form.name), validateEmail(form.email), validateAge(form.age)),
    E.map(([name, email, age]) => ({ name, email, age })),
  );
