import type * as E from "fp-ts/Either";

type Form = { name: string; email: string; age: number };

type ValidUser = { name: string; email: string; age: number };

type FieldError = { field: string; message: string };

// 各バリデータは E.Either<FieldError[], value> を返す（Left は単一要素配列 [err]）
const validateName = (name: string): E.Either<FieldError[], string> => {
  throw new Error(`TODO: name を検証して E.right / E.left([...]) を返してください (name=${name})`);
};

const validateEmail = (email: string): E.Either<FieldError[], string> => {
  throw new Error(
    `TODO: email を検証して E.right / E.left([...]) を返してください (email=${email})`,
  );
};

const validateAge = (age: number): E.Either<FieldError[], number> => {
  throw new Error(`TODO: age を検証して E.right / E.left([...]) を返してください (age=${age})`);
};

/**
 * フォームを検証し、全フィールドのエラーを集約して返す（applicative validation）。
 * fp-ts では Left のエラー配列を結合するために Semigroup が必要。getApplicativeValidation に
 * A.getSemigroup<FieldError>() を渡すと、Left 同士が配列 concat されて全エラーが溜まる。
 * @hint まず型のみの import を値の import に変える:
 *   import * as A from "fp-ts/Array";
 *   import * as E from "fp-ts/Either";
 *   import { sequenceT } from "fp-ts/Apply";
 *   import { pipe } from "fp-ts/function";
 * 次に各バリデータ本体を E.right / E.left([err]) で実装し、
 *   const V = E.getApplicativeValidation(A.getSemigroup<FieldError>());
 *   pipe(sequenceT(V)(validateName(form.name), validateEmail(form.email), validateAge(form.age)),
 *        E.map(([name, email, age]) => ({ name, email, age })))
 * で組み立てる。
 */
export const validateForm = (form: Form): E.Either<FieldError[], ValidUser> => {
  // 上の3つのバリデータを sequenceT にまとめて使う（この void は未使用警告を避けるためのダミー）
  void [validateName, validateEmail, validateAge];
  throw new Error(
    `TODO: getApplicativeValidation + sequenceT で全フィールドのエラーを集約してください (name=${form.name}, email=${form.email}, age=${form.age})`,
  );
};
