import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";

type User = { id: number; name: string };
type Account = { id: number; ownerId: number; balance: number };

type AppError =
  | { type: "ValidationError"; message: string }
  | { type: "DuplicateError"; name: string }
  | { type: "NegativeDeposit"; amount: number };

// 名前のバリデーション: 3文字未満は ValidationError
const validateName = (name: string): E.Either<AppError, string> =>
  name.length < 3
    ? E.left({ type: "ValidationError", message: `名前は3文字以上必要です: "${name}"` })
    : E.right(name);

// 重複チェック: "taken" は DuplicateError
const checkDuplicate = (name: string): E.Either<AppError, string> =>
  name === "taken" ? E.left({ type: "DuplicateError", name }) : E.right(name);

// ユーザー登録: ROP チェーンで validate → checkDuplicate → build
export const registerUser = (name: string): E.Either<AppError, User> =>
  pipe(
    validateName(name),
    E.chain(checkDuplicate),
    E.chain((n) => E.right({ id: 1, name: n })),
  );

// アカウント開設（同期）: registerUser → 残高チェック → Account 生成
export const openAccount = (name: string, deposit: number): E.Either<AppError, Account> =>
  pipe(
    registerUser(name),
    E.chain((user) =>
      deposit < 0
        ? E.left<AppError, Account>({ type: "NegativeDeposit", amount: deposit })
        : E.right<AppError, Account>({ id: 100, ownerId: user.id, balance: deposit }),
    ),
  );

// アカウント開設（非同期）: TaskEither でラップした同じロジック
export const openAccountAsync = (name: string, deposit: number): TE.TaskEither<AppError, Account> =>
  pipe(
    TE.fromEither(registerUser(name)),
    TE.chain((user) =>
      deposit < 0
        ? TE.left<AppError, Account>({ type: "NegativeDeposit", amount: deposit })
        : TE.right<AppError, Account>({ id: 100, ownerId: user.id, balance: deposit }),
    ),
  );
