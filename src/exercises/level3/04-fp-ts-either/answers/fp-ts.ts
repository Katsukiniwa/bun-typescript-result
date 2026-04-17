import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

export const wrapValue = <A>(value: A): E.Either<never, A> => E.right(value);

export const wrapError = <L>(error: L): E.Either<L, never> => E.left(error);

export const double = (result: E.Either<string, number>): E.Either<string, number> =>
  pipe(result, E.map((n) => n * 2));

export const toInt = (s: string): E.Either<string, number> =>
  pipe(
    E.right(s),
    E.chain((str) => {
      const n = Number.parseInt(str, 10);
      return Number.isNaN(n) ? E.left(`"${str}" は整数に変換できません`) : E.right(n);
    }),
  );

export const validateUser = (input: {
  name: string;
  email: string;
}): E.Either<string, { name: string; email: string }> =>
  pipe(
    E.right(input),
    E.chain(({ name, email }) =>
      name.length < 3 ? E.left("名前は3文字以上にしてください") : E.right({ name, email }),
    ),
    E.chain(({ name, email }) =>
      !email.includes("@")
        ? E.left("メールアドレスの形式が正しくありません")
        : E.right({ name, email }),
    ),
  );
