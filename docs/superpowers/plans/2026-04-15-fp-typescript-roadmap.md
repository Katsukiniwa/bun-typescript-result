# TypeScript関数型プログラミング習得ロードマップ 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** neverthrow / byethrow / fp-ts の3ライブラリを並行比較学習し、Railway Oriented Programmingやドメインモデリングを習得する

**Architecture:** 各フェーズのお題を `src/exercises/` 配下に配置し、同一仕様を3ライブラリで実装して比較する。テストは `bun:test` で各実装を同一ファイル内で検証する。

**Tech Stack:** Bun, TypeScript (strictest), neverthrow, @praha/byethrow, fp-ts, ts-pattern, bun:test, biome

---

## Task 0: 依存関係のインストール

**Files:**
- Modify: `package.json`

- [ ] **Step 1: ライブラリをインストール**

```bash
cd /Users/katsukiniwa/ghq/github.com/katsukiniwa/bun-typescript-result
bun add @praha/byethrow fp-ts ts-pattern
```

Expected: `package.json` の `dependencies` に3つ追加される

- [ ] **Step 2: 型チェックが通ることを確認**

```bash
bun run check
```

Expected: エラーなし

- [ ] **Step 3: exercisesディレクトリを作成**

```bash
mkdir -p src/exercises/phase1/01-validation
mkdir -p src/exercises/phase1/02-composing-validations
mkdir -p src/exercises/phase1/03-async
mkdir -p src/exercises/phase2/04-railway-oriented-programming
mkdir -p src/exercises/phase2/05-error-union-types
mkdir -p src/exercises/phase2/06-validator-array-pattern
mkdir -p src/exercises/phase2/07-adapter-layer
mkdir -p src/exercises/phase3/08-branded-types
mkdir -p src/exercises/phase3/09-state-machine
mkdir -p src/exercises/phase3/10-partial-application-di
mkdir -p src/exercises/phase4/11-usecase-refactor
mkdir -p src/exercises/phase4/12-repository-result
mkdir -p src/exercises/phase4/13-cli-error-handling
```

---

## Task 1: [Phase 1] お題1 — バリデーション基本

**目的:** Result型の基本（ok/err生成、型ガード）を習得する

**Files:**
- Create: `src/exercises/phase1/01-validation/neverthrow.ts`
- Create: `src/exercises/phase1/01-validation/byethrow.ts`
- Create: `src/exercises/phase1/01-validation/fp-ts.ts`
- Create: `src/exercises/phase1/01-validation/index.test.ts`
- Create: `src/exercises/phase1/01-validation/README.md`

- [ ] **Step 1: テストを書く（失敗することを確認）**

`src/exercises/phase1/01-validation/index.test.ts` を作成:

```typescript
import { describe, expect, it } from "bun:test";
import * as E from "fp-ts/Either";
import { Result } from "@praha/byethrow";
import { validateName as validateNeverthrow } from "./neverthrow";
import { validateName as validateByethrow } from "./byethrow";
import { validateName as validateFpts } from "./fp-ts";

// --- neverthrow ---
describe("neverthrow: validateName", () => {
  it("3文字以上で成功Resultを返す", () => {
    const result = validateNeverthrow("Alice");
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual({ name: "Alice" });
    }
  });

  it("空文字でエラーResultを返す", () => {
    const result = validateNeverthrow("");
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toBe("名前は必須です");
    }
  });

  it("2文字以下でエラーResultを返す", () => {
    const result = validateNeverthrow("Bo");
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toBe("名前は3文字以上必要です");
    }
  });
});

// --- byethrow ---
describe("byethrow: validateName", () => {
  it("3文字以上で成功Resultを返す", () => {
    const result = validateByethrow("Alice");
    expect(Result.isSuccess(result)).toBe(true);
    if (Result.isSuccess(result)) {
      expect(result.value).toEqual({ name: "Alice" });
    }
  });

  it("空文字でエラーResultを返す", () => {
    const result = validateByethrow("");
    expect(Result.isFailure(result)).toBe(true);
    if (Result.isFailure(result)) {
      expect(result.error.message).toBe("名前は必須です");
    }
  });

  it("2文字以下でエラーResultを返す", () => {
    const result = validateByethrow("Bo");
    expect(Result.isFailure(result)).toBe(true);
    if (Result.isFailure(result)) {
      expect(result.error.message).toBe("名前は3文字以上必要です");
    }
  });
});

// --- fp-ts ---
describe("fp-ts: validateName", () => {
  it("3文字以上で成功Resultを返す", () => {
    const result = validateFpts("Alice");
    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toEqual({ name: "Alice" });
    }
  });

  it("空文字でエラーResultを返す", () => {
    const result = validateFpts("");
    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left.message).toBe("名前は必須です");
    }
  });

  it("2文字以下でエラーResultを返す", () => {
    const result = validateFpts("Bo");
    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left.message).toBe("名前は3文字以上必要です");
    }
  });
});
```

- [ ] **Step 2: テストが失敗することを確認**

```bash
bun test src/exercises/phase1/01-validation/index.test.ts
```

Expected: `Cannot find module './neverthrow'` などのエラー

- [ ] **Step 3: neverthrow実装を書く**

`src/exercises/phase1/01-validation/neverthrow.ts` を作成:

```typescript
import { err, ok, type Result } from "neverthrow";

type ValidatedName = { name: string };
type ValidationError = { message: string };

export const validateName = (name: string): Result<ValidatedName, ValidationError> => {
  if (name.trim().length === 0) {
    return err({ message: "名前は必須です" });
  }
  if (name.trim().length < 3) {
    return err({ message: "名前は3文字以上必要です" });
  }
  return ok({ name: name.trim() });
};
```

- [ ] **Step 4: byethrow実装を書く**

`src/exercises/phase1/01-validation/byethrow.ts` を作成:

```typescript
import { Result } from "@praha/byethrow";

type ValidatedName = { name: string };
type ValidationError = { message: string };

export const validateName = (name: string): Result<ValidatedName, ValidationError> => {
  if (name.trim().length === 0) {
    return Result.fail({ message: "名前は必須です" });
  }
  if (name.trim().length < 3) {
    return Result.fail({ message: "名前は3文字以上必要です" });
  }
  return Result.succeed({ name: name.trim() });
};
```

- [ ] **Step 5: fp-ts実装を書く**

`src/exercises/phase1/01-validation/fp-ts.ts` を作成:

```typescript
import * as E from "fp-ts/Either";

type ValidatedName = { name: string };
type ValidationError = { message: string };

export const validateName = (name: string): E.Either<ValidationError, ValidatedName> => {
  if (name.trim().length === 0) {
    return E.left({ message: "名前は必須です" });
  }
  if (name.trim().length < 3) {
    return E.left({ message: "名前は3文字以上必要です" });
  }
  return E.right({ name: name.trim() });
};
```

- [ ] **Step 6: テストが通ることを確認**

```bash
bun test src/exercises/phase1/01-validation/index.test.ts
```

Expected: `9 pass, 0 fail`

- [ ] **Step 7: lintチェック**

```bash
bun run check
```

Expected: エラーなし

- [ ] **Step 8: READMEを書く**

`src/exercises/phase1/01-validation/README.md` を作成:

```markdown
# お題1: バリデーション基本

## 学んだこと

- neverthrow: `ok()` / `err()` で Result を生成。`.isOk()` / `.isErr()` で型ガード
- byethrow: `Result.succeed()` / `Result.fail()` で生成。`Result.isSuccess()` / `Result.isFailure()` で型ガード
- fp-ts: `E.right()` / `E.left()` で Either を生成。`E.isRight()` / `E.isLeft()` で型ガード

## 比較ポイント

| | neverthrow | byethrow | fp-ts |
|---|---|---|---|
| 成功値 | `result.value` | `result.value` | `result.right` |
| 失敗値 | `result.error` | `result.error` | `result.left` |
| 命名 | ok/err | succeed/fail | right/left |

## Why not throw?

例外は型に現れないため、呼び出し元がエラーを処理し忘れてもコンパイラが検知できない。
Result型はエラーを値として返すため、型レベルで処理が強制される。
```

- [ ] **Step 9: コミット**

```bash
git add src/exercises/phase1/01-validation/
git commit -m "feat: お題1 バリデーション基本の3実装とテストを追加"
```

---

## Task 2: [Phase 1] お題2 — 複数バリデーションの合成

**目的:** `andThen` / `map` / `mapErr` による Result の連鎖を習得する

**Files:**
- Create: `src/exercises/phase1/02-composing-validations/neverthrow.ts`
- Create: `src/exercises/phase1/02-composing-validations/byethrow.ts`
- Create: `src/exercises/phase1/02-composing-validations/fp-ts.ts`
- Create: `src/exercises/phase1/02-composing-validations/index.test.ts`
- Create: `src/exercises/phase1/02-composing-validations/README.md`

- [ ] **Step 1: テストを書く**

`src/exercises/phase1/02-composing-validations/index.test.ts` を作成:

```typescript
import { describe, expect, it } from "bun:test";
import * as E from "fp-ts/Either";
import { Result } from "@praha/byethrow";
import { validateUser as validateUserNeverthrow } from "./neverthrow";
import { validateUser as validateUserByethrow } from "./byethrow";
import { validateUser as validateUserFpts } from "./fp-ts";

const validInput = { name: "Alice", email: "alice@example.com", age: 25 };

describe("neverthrow: validateUser", () => {
  it("全項目正常で成功する", () => {
    const result = validateUserNeverthrow(validInput);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.name).toBe("Alice");
      expect(result.value.email).toBe("alice@example.com");
    }
  });

  it("名前が短すぎる場合は名前のエラーを返す", () => {
    const result = validateUserNeverthrow({ ...validInput, name: "Bo" });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.field).toBe("name");
    }
  });

  it("メール形式が不正な場合はメールのエラーを返す", () => {
    const result = validateUserNeverthrow({ ...validInput, email: "invalid" });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.field).toBe("email");
    }
  });

  it("年齢が負の場合は年齢のエラーを返す", () => {
    const result = validateUserNeverthrow({ ...validInput, age: -1 });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.field).toBe("age");
    }
  });

  it("名前とメール両方不正でも最初のエラーのみ返す（Short-circuit）", () => {
    const result = validateUserNeverthrow({ name: "Bo", email: "invalid", age: 25 });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.field).toBe("name");
    }
  });
});

describe("byethrow: validateUser", () => {
  it("全項目正常で成功する", () => {
    const result = validateUserByethrow(validInput);
    expect(Result.isSuccess(result)).toBe(true);
    if (Result.isSuccess(result)) {
      expect(result.value.name).toBe("Alice");
    }
  });

  it("名前が短すぎる場合は名前のエラーを返す", () => {
    const result = validateUserByethrow({ ...validInput, name: "Bo" });
    expect(Result.isFailure(result)).toBe(true);
    if (Result.isFailure(result)) {
      expect(result.error.field).toBe("name");
    }
  });

  it("メール形式が不正な場合はメールのエラーを返す", () => {
    const result = validateUserByethrow({ ...validInput, email: "invalid" });
    expect(Result.isFailure(result)).toBe(true);
    if (Result.isFailure(result)) {
      expect(result.error.field).toBe("email");
    }
  });

  it("年齢が負の場合は年齢のエラーを返す", () => {
    const result = validateUserByethrow({ ...validInput, age: -1 });
    expect(Result.isFailure(result)).toBe(true);
    if (Result.isFailure(result)) {
      expect(result.error.field).toBe("age");
    }
  });
});

describe("fp-ts: validateUser", () => {
  it("全項目正常で成功する", () => {
    const result = validateUserFpts(validInput);
    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right.name).toBe("Alice");
    }
  });

  it("名前が短すぎる場合は名前のエラーを返す", () => {
    const result = validateUserFpts({ ...validInput, name: "Bo" });
    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left.field).toBe("name");
    }
  });

  it("メール形式が不正な場合はメールのエラーを返す", () => {
    const result = validateUserFpts({ ...validInput, email: "invalid" });
    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left.field).toBe("email");
    }
  });

  it("年齢が負の場合は年齢のエラーを返す", () => {
    const result = validateUserFpts({ ...validInput, age: -1 });
    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left.field).toBe("age");
    }
  });
});
```

- [ ] **Step 2: テストが失敗することを確認**

```bash
bun test src/exercises/phase1/02-composing-validations/index.test.ts
```

Expected: `Cannot find module` エラー

- [ ] **Step 3: neverthrow実装を書く**

`src/exercises/phase1/02-composing-validations/neverthrow.ts` を作成:

```typescript
import { err, ok, type Result } from "neverthrow";

type UserInput = { name: string; email: string; age: number };
type ValidatedUser = { name: string; email: string; age: number };
type ValidationError = { message: string; field: string };

const validateName = (input: UserInput): Result<UserInput, ValidationError> => {
  if (input.name.trim().length < 3) {
    return err({ message: "名前は3文字以上必要です", field: "name" });
  }
  return ok(input);
};

const validateEmail = (input: UserInput): Result<UserInput, ValidationError> => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return err({ message: "メール形式が不正です", field: "email" });
  }
  return ok(input);
};

const validateAge = (input: UserInput): Result<UserInput, ValidationError> => {
  if (input.age < 0) {
    return err({ message: "年齢は0以上が必要です", field: "age" });
  }
  return ok(input);
};

export const validateUser = (input: UserInput): Result<ValidatedUser, ValidationError> =>
  ok(input)
    .andThen(validateName)
    .andThen(validateEmail)
    .andThen(validateAge)
    .map((i) => ({ name: i.name.trim(), email: i.email, age: i.age }));
```

- [ ] **Step 4: byethrow実装を書く**

`src/exercises/phase1/02-composing-validations/byethrow.ts` を作成:

```typescript
import { Result } from "@praha/byethrow";

type UserInput = { name: string; email: string; age: number };
type ValidatedUser = { name: string; email: string; age: number };
type ValidationError = { message: string; field: string };

const validateName = (input: UserInput): Result<UserInput, ValidationError> => {
  if (input.name.trim().length < 3) {
    return Result.fail({ message: "名前は3文字以上必要です", field: "name" });
  }
  return Result.succeed(input);
};

const validateEmail = (input: UserInput): Result<UserInput, ValidationError> => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return Result.fail({ message: "メール形式が不正です", field: "email" });
  }
  return Result.succeed(input);
};

const validateAge = (input: UserInput): Result<UserInput, ValidationError> => {
  if (input.age < 0) {
    return Result.fail({ message: "年齢は0以上が必要です", field: "age" });
  }
  return Result.succeed(input);
};

export const validateUser = (input: UserInput): Result<ValidatedUser, ValidationError> =>
  Result.pipe(
    Result.succeed(input),
    Result.andThen(validateName),
    Result.andThen(validateEmail),
    Result.andThen(validateAge),
    Result.map((i) => ({ name: i.name.trim(), email: i.email, age: i.age })),
  );
```

- [ ] **Step 5: fp-ts実装を書く**

`src/exercises/phase1/02-composing-validations/fp-ts.ts` を作成:

```typescript
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

type UserInput = { name: string; email: string; age: number };
type ValidatedUser = { name: string; email: string; age: number };
type ValidationError = { message: string; field: string };

const validateName = (input: UserInput): E.Either<ValidationError, UserInput> => {
  if (input.name.trim().length < 3) {
    return E.left({ message: "名前は3文字以上必要です", field: "name" });
  }
  return E.right(input);
};

const validateEmail = (input: UserInput): E.Either<ValidationError, UserInput> => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return E.left({ message: "メール形式が不正です", field: "email" });
  }
  return E.right(input);
};

const validateAge = (input: UserInput): E.Either<ValidationError, UserInput> => {
  if (input.age < 0) {
    return E.left({ message: "年齢は0以上が必要です", field: "age" });
  }
  return E.right(input);
};

export const validateUser = (input: UserInput): E.Either<ValidationError, ValidatedUser> =>
  pipe(
    E.right(input),
    E.chain(validateName),
    E.chain(validateEmail),
    E.chain(validateAge),
    E.map((i) => ({ name: i.name.trim(), email: i.email, age: i.age })),
  );
```

- [ ] **Step 6: テストが通ることを確認**

```bash
bun test src/exercises/phase1/02-composing-validations/index.test.ts
```

Expected: `15 pass, 0 fail`

- [ ] **Step 7: コミット**

```bash
git add src/exercises/phase1/02-composing-validations/
git commit -m "feat: お題2 複数バリデーション合成の3実装とテストを追加"
```

---

## Task 3: [Phase 1] お題3 — 非同期処理

**目的:** `ResultAsync` / `Promise<Result>` / `TaskEither` による非同期Result処理を習得する

**Files:**
- Create: `src/exercises/phase1/03-async/neverthrow.ts`
- Create: `src/exercises/phase1/03-async/byethrow.ts`
- Create: `src/exercises/phase1/03-async/fp-ts.ts`
- Create: `src/exercises/phase1/03-async/index.test.ts`

- [ ] **Step 1: テストを書く**

`src/exercises/phase1/03-async/index.test.ts` を作成:

```typescript
import { describe, expect, it } from "bun:test";
import * as E from "fp-ts/Either";
import { Result } from "@praha/byethrow";
import { findUser as findUserNeverthrow } from "./neverthrow";
import { findUser as findUserByethrow } from "./byethrow";
import { findUser as findUserFpts } from "./fp-ts";

// モックDB（3実装共通で使う）
export const mockDb: Record<string, { id: string; name: string }> = {
  "user-1": { id: "user-1", name: "Alice" },
};

describe("neverthrow: findUser", () => {
  it("存在するIDでユーザーを返す", async () => {
    const result = await findUserNeverthrow("user-1", mockDb);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.name).toBe("Alice");
    }
  });

  it("存在しないIDでNotFoundErrorを返す", async () => {
    const result = await findUserNeverthrow("unknown", mockDb);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error._tag).toBe("NotFoundError");
    }
  });
});

describe("byethrow: findUser", () => {
  it("存在するIDでユーザーを返す", async () => {
    const result = await findUserByethrow("user-1", mockDb);
    expect(Result.isSuccess(result)).toBe(true);
    if (Result.isSuccess(result)) {
      expect(result.value.name).toBe("Alice");
    }
  });

  it("存在しないIDでNotFoundErrorを返す", async () => {
    const result = await findUserByethrow("unknown", mockDb);
    expect(Result.isFailure(result)).toBe(true);
    if (Result.isFailure(result)) {
      expect(result.error._tag).toBe("NotFoundError");
    }
  });
});

describe("fp-ts: findUser", () => {
  it("存在するIDでユーザーを返す", async () => {
    const result = await findUserFpts("user-1", mockDb)();
    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right.name).toBe("Alice");
    }
  });

  it("存在しないIDでNotFoundErrorを返す", async () => {
    const result = await findUserFpts("unknown", mockDb)();
    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left._tag).toBe("NotFoundError");
    }
  });
});
```

- [ ] **Step 2: テストが失敗することを確認**

```bash
bun test src/exercises/phase1/03-async/index.test.ts
```

Expected: `Cannot find module` エラー

- [ ] **Step 3: neverthrow実装を書く**

`src/exercises/phase1/03-async/neverthrow.ts` を作成:

```typescript
import { err, ok, ResultAsync } from "neverthrow";

type User = { id: string; name: string };
type NotFoundError = { _tag: "NotFoundError"; id: string };
type Db = Record<string, User>;

export const findUser = (
  id: string,
  db: Db,
): ResultAsync<User, NotFoundError> =>
  ResultAsync.fromSafePromise(
    Promise.resolve(db[id]),
  ).andThen((user) =>
    user ? ok(user) : err({ _tag: "NotFoundError" as const, id }),
  );
```

- [ ] **Step 4: byethrow実装を書く**

`src/exercises/phase1/03-async/byethrow.ts` を作成:

```typescript
import { Result } from "@praha/byethrow";

type User = { id: string; name: string };
type NotFoundError = { _tag: "NotFoundError"; id: string };
type Db = Record<string, User>;

export const findUser = async (
  id: string,
  db: Db,
): Promise<Result<User, NotFoundError>> => {
  const user = await Promise.resolve(db[id]);
  if (!user) {
    return Result.fail({ _tag: "NotFoundError" as const, id });
  }
  return Result.succeed(user);
};
```

- [ ] **Step 5: fp-ts実装を書く**

`src/exercises/phase1/03-async/fp-ts.ts` を作成:

```typescript
import * as TE from "fp-ts/TaskEither";

type User = { id: string; name: string };
type NotFoundError = { _tag: "NotFoundError"; id: string };
type Db = Record<string, User>;

export const findUser = (
  id: string,
  db: Db,
): TE.TaskEither<NotFoundError, User> =>
  TE.tryCatch(
    async () => {
      const user = await Promise.resolve(db[id]);
      if (!user) throw new Error("not found");
      return user;
    },
    () => ({ _tag: "NotFoundError" as const, id }),
  );
```

- [ ] **Step 6: テストが通ることを確認**

```bash
bun test src/exercises/phase1/03-async/index.test.ts
```

Expected: `6 pass, 0 fail`

- [ ] **Step 7: コミット**

```bash
git add src/exercises/phase1/03-async/
git commit -m "feat: お題3 非同期処理の3実装とテストを追加"
```

---

## Task 4: [Phase 2] お題4 — Railway Oriented Programming

**目的:** パイプライン設計と2レールモデルを習得する

**Files:**
- Create: `src/exercises/phase2/04-railway-oriented-programming/neverthrow.ts`
- Create: `src/exercises/phase2/04-railway-oriented-programming/byethrow.ts`
- Create: `src/exercises/phase2/04-railway-oriented-programming/fp-ts.ts`
- Create: `src/exercises/phase2/04-railway-oriented-programming/index.test.ts`

- [ ] **Step 1: テストを書く**

`src/exercises/phase2/04-railway-oriented-programming/index.test.ts` を作成:

```typescript
import { describe, expect, it, mock } from "bun:test";
import * as E from "fp-ts/Either";
import { Result } from "@praha/byethrow";
import {
  createUserPipeline as createUserNeverthrow,
  type Deps as NTDeps,
} from "./neverthrow";
import {
  createUserPipeline as createUserByethrow,
  type Deps as BTDeps,
} from "./byethrow";
import {
  createUserPipeline as createUserFpts,
  type Deps as FPDeps,
} from "./fp-ts";

const validInput = { name: "Alice", email: "alice@example.com" };

// --- neverthrow ---
describe("neverthrow: createUserPipeline", () => {
  it("全ステップ成功でユーザーを返す", async () => {
    const deps: NTDeps = {
      checkDuplicate: async () => ({ isDuplicate: false }),
      saveUser: async (u) => u,
      sendWelcomeEmail: async () => {},
    };
    const result = await createUserNeverthrow(validInput, deps);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.name).toBe("Alice");
    }
  });

  it("バリデーション失敗で早期終了（DBは呼ばれない）", async () => {
    const checkDuplicate = mock(async () => ({ isDuplicate: false }));
    const deps: NTDeps = {
      checkDuplicate,
      saveUser: async (u) => u,
      sendWelcomeEmail: async () => {},
    };
    const result = await createUserNeverthrow({ name: "Bo", email: "alice@example.com" }, deps);
    expect(result.isErr()).toBe(true);
    expect(checkDuplicate).not.toHaveBeenCalled();
  });

  it("重複チェック失敗で早期終了", async () => {
    const saveUser = mock(async (u: { name: string; email: string }) => u);
    const deps: NTDeps = {
      checkDuplicate: async () => ({ isDuplicate: true }),
      saveUser,
      sendWelcomeEmail: async () => {},
    };
    const result = await createUserNeverthrow(validInput, deps);
    expect(result.isErr()).toBe(true);
    expect(saveUser).not.toHaveBeenCalled();
  });
});

// --- byethrow ---
describe("byethrow: createUserPipeline", () => {
  it("全ステップ成功でユーザーを返す", async () => {
    const deps: BTDeps = {
      checkDuplicate: async () => ({ isDuplicate: false }),
      saveUser: async (u) => u,
      sendWelcomeEmail: async () => {},
    };
    const result = await createUserByethrow(validInput, deps);
    expect(Result.isSuccess(result)).toBe(true);
    if (Result.isSuccess(result)) {
      expect(result.value.name).toBe("Alice");
    }
  });

  it("バリデーション失敗で早期終了", async () => {
    const checkDuplicate = mock(async () => ({ isDuplicate: false }));
    const deps: BTDeps = {
      checkDuplicate,
      saveUser: async (u) => u,
      sendWelcomeEmail: async () => {},
    };
    const result = await createUserByethrow({ name: "Bo", email: "alice@example.com" }, deps);
    expect(Result.isFailure(result)).toBe(true);
    expect(checkDuplicate).not.toHaveBeenCalled();
  });
});

// --- fp-ts ---
describe("fp-ts: createUserPipeline", () => {
  it("全ステップ成功でユーザーを返す", async () => {
    const deps: FPDeps = {
      checkDuplicate: async () => ({ isDuplicate: false }),
      saveUser: async (u) => u,
      sendWelcomeEmail: async () => {},
    };
    const result = await createUserFpts(validInput, deps)();
    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right.name).toBe("Alice");
    }
  });

  it("バリデーション失敗で早期終了", async () => {
    const checkDuplicate = mock(async () => ({ isDuplicate: false }));
    const deps: FPDeps = {
      checkDuplicate,
      saveUser: async (u) => u,
      sendWelcomeEmail: async () => {},
    };
    const result = await createUserFpts({ name: "Bo", email: "alice@example.com" }, deps)();
    expect(E.isLeft(result)).toBe(true);
    expect(checkDuplicate).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: テストが失敗することを確認**

```bash
bun test src/exercises/phase2/04-railway-oriented-programming/index.test.ts
```

Expected: `Cannot find module` エラー

- [ ] **Step 3: neverthrow実装を書く**

`src/exercises/phase2/04-railway-oriented-programming/neverthrow.ts` を作成:

```typescript
import { err, ok, ResultAsync } from "neverthrow";

type Input = { name: string; email: string };
type User = { name: string; email: string };
type AppError =
  | { _tag: "ValidationError"; message: string }
  | { _tag: "DuplicateError"; email: string };

export type Deps = {
  checkDuplicate: (email: string) => Promise<{ isDuplicate: boolean }>;
  saveUser: (user: User) => Promise<User>;
  sendWelcomeEmail: (email: string) => Promise<void>;
};

const validate = (input: Input): ResultAsync<Input, AppError> => {
  if (input.name.trim().length < 3) {
    return ResultAsync.fromSafePromise(
      Promise.resolve(err<Input, AppError>({ _tag: "ValidationError", message: "名前は3文字以上" })),
    ).andThen((r) => r);
  }
  return ResultAsync.fromSafePromise(Promise.resolve(ok(input)));
};

export const createUserPipeline = (
  input: Input,
  deps: Deps,
): ResultAsync<User, AppError> => {
  if (input.name.trim().length < 3) {
    return ResultAsync.fromSafePromise(Promise.resolve(null)).andThen(() =>
      ResultAsync.fromSafePromise(
        Promise.resolve(err<User, AppError>({ _tag: "ValidationError", message: "名前は3文字以上" })),
      ).andThen((r) => r),
    );
  }

  return ResultAsync.fromSafePromise(deps.checkDuplicate(input.email))
    .andThen((check) =>
      check.isDuplicate
        ? err<User, AppError>({ _tag: "DuplicateError", email: input.email })
        : ok({ name: input.name.trim(), email: input.email }),
    )
    .andThen((user) => ResultAsync.fromSafePromise(deps.saveUser(user)))
    .andThen((user) =>
      ResultAsync.fromSafePromise(deps.sendWelcomeEmail(user.email)).map(
        () => user,
      ),
    );
};
```

- [ ] **Step 4: byethrow実装を書く**

`src/exercises/phase2/04-railway-oriented-programming/byethrow.ts` を作成:

```typescript
import { Result } from "@praha/byethrow";

type Input = { name: string; email: string };
type User = { name: string; email: string };
type AppError =
  | { _tag: "ValidationError"; message: string }
  | { _tag: "DuplicateError"; email: string };

export type Deps = {
  checkDuplicate: (email: string) => Promise<{ isDuplicate: boolean }>;
  saveUser: (user: User) => Promise<User>;
  sendWelcomeEmail: (email: string) => Promise<void>;
};

const validate = (input: Input): Result<Input, AppError> => {
  if (input.name.trim().length < 3) {
    return Result.fail({ _tag: "ValidationError", message: "名前は3文字以上" });
  }
  return Result.succeed(input);
};

export const createUserPipeline = async (
  input: Input,
  deps: Deps,
): Promise<Result<User, AppError>> => {
  const validated = validate(input);
  if (Result.isFailure(validated)) return validated;

  const check = await deps.checkDuplicate(input.email);
  if (check.isDuplicate) {
    return Result.fail({ _tag: "DuplicateError", email: input.email });
  }

  const user = { name: input.name.trim(), email: input.email };
  const saved = await deps.saveUser(user);
  await deps.sendWelcomeEmail(saved.email);
  return Result.succeed(saved);
};
```

- [ ] **Step 5: fp-ts実装を書く**

`src/exercises/phase2/04-railway-oriented-programming/fp-ts.ts` を作成:

```typescript
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

type Input = { name: string; email: string };
type User = { name: string; email: string };
type AppError =
  | { _tag: "ValidationError"; message: string }
  | { _tag: "DuplicateError"; email: string };

export type Deps = {
  checkDuplicate: (email: string) => Promise<{ isDuplicate: boolean }>;
  saveUser: (user: User) => Promise<User>;
  sendWelcomeEmail: (email: string) => Promise<void>;
};

const validate = (input: Input): E.Either<AppError, Input> => {
  if (input.name.trim().length < 3) {
    return E.left({ _tag: "ValidationError", message: "名前は3文字以上" });
  }
  return E.right(input);
};

export const createUserPipeline = (
  input: Input,
  deps: Deps,
): TE.TaskEither<AppError, User> =>
  pipe(
    TE.fromEither(validate(input)),
    TE.chain((validInput) =>
      TE.tryCatch(
        () => deps.checkDuplicate(validInput.email),
        () => ({ _tag: "ValidationError" as const, message: "重複チェック失敗" }),
      ),
    ),
    TE.chain((check) =>
      check.isDuplicate
        ? TE.left({ _tag: "DuplicateError" as const, email: input.email })
        : TE.right({ name: input.name.trim(), email: input.email }),
    ),
    TE.chain((user) =>
      TE.tryCatch(
        () => deps.saveUser(user),
        () => ({ _tag: "ValidationError" as const, message: "保存失敗" }),
      ),
    ),
    TE.chainFirst((user) =>
      TE.tryCatch(
        () => deps.sendWelcomeEmail(user.email),
        () => ({ _tag: "ValidationError" as const, message: "メール送信失敗" }),
      ),
    ),
  );
```

- [ ] **Step 6: テストが通ることを確認**

```bash
bun test src/exercises/phase2/04-railway-oriented-programming/index.test.ts
```

Expected: `7 pass, 0 fail`

- [ ] **Step 7: コミット**

```bash
git add src/exercises/phase2/04-railway-oriented-programming/
git commit -m "feat: お題4 ROPパイプラインの3実装とテストを追加"
```

---

## Task 5: [Phase 2] お題5 — エラー型のUnion設計

**目的:** Discriminated Unionによるエラー型設計とts-patternによる網羅的ハンドリングを習得する

**Files:**
- Create: `src/exercises/phase2/05-error-union-types/errors.ts`
- Create: `src/exercises/phase2/05-error-union-types/neverthrow.ts`
- Create: `src/exercises/phase2/05-error-union-types/byethrow.ts`
- Create: `src/exercises/phase2/05-error-union-types/fp-ts.ts`
- Create: `src/exercises/phase2/05-error-union-types/index.test.ts`

- [ ] **Step 1: 共通エラー型を定義する**

`src/exercises/phase2/05-error-union-types/errors.ts` を作成:

```typescript
export type ValidationError = {
  _tag: "ValidationError";
  message: string;
  field: string;
};

export type NotFoundError = {
  _tag: "NotFoundError";
  id: string;
};

export type DuplicateError = {
  _tag: "DuplicateError";
  field: string;
  value: string;
};

export type DatabaseError = {
  _tag: "DatabaseError";
  cause: unknown;
};

export type AppError = ValidationError | NotFoundError | DuplicateError | DatabaseError;
```

- [ ] **Step 2: テストを書く**

`src/exercises/phase2/05-error-union-types/index.test.ts` を作成:

```typescript
import { describe, expect, it } from "bun:test";
import { match, P } from "ts-pattern";
import * as E from "fp-ts/Either";
import { Result } from "@praha/byethrow";
import { processUser as processUserNeverthrow } from "./neverthrow";
import { processUser as processUserByethrow } from "./byethrow";
import { processUser as processUserFpts } from "./fp-ts";
import type { AppError } from "./errors";

// エラーをメッセージ文字列に変換するハンドラー（ts-pattern使用）
const handleError = (error: AppError): string =>
  match(error)
    .with({ _tag: "ValidationError" }, (e) => `バリデーションエラー: ${e.message} (${e.field})`)
    .with({ _tag: "NotFoundError" }, (e) => `見つかりません: ${e.id}`)
    .with({ _tag: "DuplicateError" }, (e) => `重複: ${e.field}=${e.value}`)
    .with({ _tag: "DatabaseError" }, () => "DBエラー")
    .exhaustive();

describe("neverthrow: processUser", () => {
  it("存在するユーザーを返す", () => {
    const result = processUserNeverthrow("user-1");
    expect(result.isOk()).toBe(true);
  });

  it("存在しないIDでNotFoundErrorを返す", () => {
    const result = processUserNeverthrow("unknown");
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error._tag).toBe("NotFoundError");
      expect(handleError(result.error)).toBe("見つかりません: unknown");
    }
  });

  it("空IDでValidationErrorを返す", () => {
    const result = processUserNeverthrow("");
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error._tag).toBe("ValidationError");
    }
  });
});

describe("byethrow: processUser", () => {
  it("存在するユーザーを返す", () => {
    const result = processUserByethrow("user-1");
    expect(Result.isSuccess(result)).toBe(true);
  });

  it("存在しないIDでNotFoundErrorを返す", () => {
    const result = processUserByethrow("unknown");
    expect(Result.isFailure(result)).toBe(true);
    if (Result.isFailure(result)) {
      expect(result.error._tag).toBe("NotFoundError");
      expect(handleError(result.error)).toBe("見つかりません: unknown");
    }
  });
});

describe("fp-ts: processUser", () => {
  it("存在するユーザーを返す", () => {
    const result = processUserFpts("user-1");
    expect(E.isRight(result)).toBe(true);
  });

  it("存在しないIDでNotFoundErrorを返す", () => {
    const result = processUserFpts("unknown");
    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left._tag).toBe("NotFoundError");
      expect(handleError(result.left)).toBe("見つかりません: unknown");
    }
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
bun test src/exercises/phase2/05-error-union-types/index.test.ts
```

- [ ] **Step 4: neverthrow実装を書く**

`src/exercises/phase2/05-error-union-types/neverthrow.ts` を作成:

```typescript
import { err, ok, type Result } from "neverthrow";
import type { AppError } from "./errors";

type User = { id: string; name: string };

const db: Record<string, User> = { "user-1": { id: "user-1", name: "Alice" } };

export const processUser = (id: string): Result<User, AppError> => {
  if (!id || id.trim().length === 0) {
    return err({ _tag: "ValidationError", message: "IDは必須です", field: "id" });
  }
  const user = db[id];
  if (!user) {
    return err({ _tag: "NotFoundError", id });
  }
  return ok(user);
};
```

- [ ] **Step 5: byethrow実装を書く**

`src/exercises/phase2/05-error-union-types/byethrow.ts` を作成:

```typescript
import { Result } from "@praha/byethrow";
import type { AppError } from "./errors";

type User = { id: string; name: string };

const db: Record<string, User> = { "user-1": { id: "user-1", name: "Alice" } };

export const processUser = (id: string): Result<User, AppError> => {
  if (!id || id.trim().length === 0) {
    return Result.fail({ _tag: "ValidationError", message: "IDは必須です", field: "id" });
  }
  const user = db[id];
  if (!user) {
    return Result.fail({ _tag: "NotFoundError", id });
  }
  return Result.succeed(user);
};
```

- [ ] **Step 6: fp-ts実装を書く**

`src/exercises/phase2/05-error-union-types/fp-ts.ts` を作成:

```typescript
import * as E from "fp-ts/Either";
import type { AppError } from "./errors";

type User = { id: string; name: string };

const db: Record<string, User> = { "user-1": { id: "user-1", name: "Alice" } };

export const processUser = (id: string): E.Either<AppError, User> => {
  if (!id || id.trim().length === 0) {
    return E.left({ _tag: "ValidationError", message: "IDは必須です", field: "id" });
  }
  const user = db[id];
  if (!user) {
    return E.left({ _tag: "NotFoundError", id });
  }
  return E.right(user);
};
```

- [ ] **Step 7: テストが通ることを確認**

```bash
bun test src/exercises/phase2/05-error-union-types/index.test.ts
```

Expected: `7 pass, 0 fail`

- [ ] **Step 8: コミット**

```bash
git add src/exercises/phase2/05-error-union-types/
git commit -m "feat: お題5 エラーUnion型とts-patternの3実装とテストを追加"
```

---

## Task 6: [Phase 2] お題6 — バリデーターアレイパターン

**目的:** バリデーション関数を配列で管理し、全エラーを収集するパターンを習得する

**Files:**
- Create: `src/exercises/phase2/06-validator-array-pattern/neverthrow.ts`
- Create: `src/exercises/phase2/06-validator-array-pattern/byethrow.ts`
- Create: `src/exercises/phase2/06-validator-array-pattern/fp-ts.ts`
- Create: `src/exercises/phase2/06-validator-array-pattern/index.test.ts`

- [ ] **Step 1: テストを書く**

`src/exercises/phase2/06-validator-array-pattern/index.test.ts` を作成:

```typescript
import { describe, expect, it } from "bun:test";
import * as E from "fp-ts/Either";
import { Result } from "@praha/byethrow";
import { validateAll as validateAllNeverthrow } from "./neverthrow";
import { validateAll as validateAllByethrow } from "./byethrow";
import { validateAll as validateAllFpts } from "./fp-ts";

type Input = { name: string; email: string; age: number };

const valid: Input = { name: "Alice", email: "alice@example.com", age: 25 };
const allInvalid: Input = { name: "Bo", email: "invalid", age: -1 };

describe("neverthrow: validateAll", () => {
  it("全項目正常で成功する", () => {
    const result = validateAllNeverthrow(valid);
    expect(result.isOk()).toBe(true);
  });

  it("複数エラーがある場合に全て収集する", () => {
    const result = validateAllNeverthrow(allInvalid);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.length).toBe(3);
      const fields = result.error.map((e) => e.field);
      expect(fields).toContain("name");
      expect(fields).toContain("email");
      expect(fields).toContain("age");
    }
  });

  it("1つだけエラーがある場合に1つ収集する", () => {
    const result = validateAllNeverthrow({ ...valid, name: "Bo" });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.length).toBe(1);
      expect(result.error[0].field).toBe("name");
    }
  });
});

describe("byethrow: validateAll", () => {
  it("全項目正常で成功する", () => {
    const result = validateAllByethrow(valid);
    expect(Result.isSuccess(result)).toBe(true);
  });

  it("複数エラーがある場合に全て収集する", () => {
    const result = validateAllByethrow(allInvalid);
    expect(Result.isFailure(result)).toBe(true);
    if (Result.isFailure(result)) {
      expect(result.error.length).toBe(3);
    }
  });
});

describe("fp-ts: validateAll", () => {
  it("全項目正常で成功する", () => {
    const result = validateAllFpts(valid);
    expect(E.isRight(result)).toBe(true);
  });

  it("複数エラーがある場合に全て収集する", () => {
    const result = validateAllFpts(allInvalid);
    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left.length).toBe(3);
    }
  });
});
```

- [ ] **Step 2: テストが失敗することを確認**

```bash
bun test src/exercises/phase2/06-validator-array-pattern/index.test.ts
```

- [ ] **Step 3: neverthrow実装を書く**

`src/exercises/phase2/06-validator-array-pattern/neverthrow.ts` を作成:

```typescript
import { err, ok, type Result } from "neverthrow";

type Input = { name: string; email: string; age: number };
type ValidationError = { message: string; field: string };

type Validator = (input: Input) => Result<Input, ValidationError>;

// バリデーターを配列で管理 — 追加はここに追記するだけ
const validators: Validator[] = [
  (input) =>
    input.name.trim().length < 3
      ? err({ message: "名前は3文字以上", field: "name" })
      : ok(input),
  (input) =>
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)
      ? err({ message: "メール形式不正", field: "email" })
      : ok(input),
  (input) =>
    input.age < 0
      ? err({ message: "年齢は0以上", field: "age" })
      : ok(input),
];

export const validateAll = (input: Input): Result<Input, ValidationError[]> => {
  const errors = validators
    .map((v) => v(input))
    .filter((r): r is ReturnType<typeof err<Input, ValidationError>> => r.isErr())
    .map((r) => r.error);

  if (errors.length > 0) return err(errors);
  return ok(input);
};
```

- [ ] **Step 4: byethrow実装を書く**

`src/exercises/phase2/06-validator-array-pattern/byethrow.ts` を作成:

```typescript
import { Result } from "@praha/byethrow";

type Input = { name: string; email: string; age: number };
type ValidationError = { message: string; field: string };

type Validator = (input: Input) => Result<Input, ValidationError>;

const validators: Validator[] = [
  (input) =>
    input.name.trim().length < 3
      ? Result.fail({ message: "名前は3文字以上", field: "name" })
      : Result.succeed(input),
  (input) =>
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)
      ? Result.fail({ message: "メール形式不正", field: "email" })
      : Result.succeed(input),
  (input) =>
    input.age < 0
      ? Result.fail({ message: "年齢は0以上", field: "age" })
      : Result.succeed(input),
];

export const validateAll = (input: Input): Result<Input, ValidationError[]> => {
  const errors = validators
    .map((v) => v(input))
    .filter(Result.isFailure)
    .map((r) => r.error);

  if (errors.length > 0) return Result.fail(errors);
  return Result.succeed(input);
};
```

- [ ] **Step 5: fp-ts実装を書く**

`src/exercises/phase2/06-validator-array-pattern/fp-ts.ts` を作成:

```typescript
import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import { pipe } from "fp-ts/function";

type Input = { name: string; email: string; age: number };
type ValidationError = { message: string; field: string };

type Validator = (input: Input) => E.Either<ValidationError, Input>;

const validators: Validator[] = [
  (input) =>
    input.name.trim().length < 3
      ? E.left({ message: "名前は3文字以上", field: "name" })
      : E.right(input),
  (input) =>
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)
      ? E.left({ message: "メール形式不正", field: "email" })
      : E.right(input),
  (input) =>
    input.age < 0
      ? E.left({ message: "年齢は0以上", field: "age" })
      : E.right(input),
];

export const validateAll = (input: Input): E.Either<ValidationError[], Input> => {
  const errors = pipe(
    validators.map((v) => v(input)),
    A.filter(E.isLeft),
    A.map((r) => r.left),
  );

  if (errors.length > 0) return E.left(errors);
  return E.right(input);
};
```

- [ ] **Step 6: テストが通ることを確認**

```bash
bun test src/exercises/phase2/06-validator-array-pattern/index.test.ts
```

Expected: `8 pass, 0 fail`

- [ ] **Step 7: コミット**

```bash
git add src/exercises/phase2/06-validator-array-pattern/
git commit -m "feat: お題6 バリデーターアレイパターンの3実装とテストを追加"
```

---

## Task 7: [Phase 2] お題7 — Adapter層で副作用を分離

**目的:** 純粋関数とAdapter（副作用）を層で切り分ける設計を習得する

**Files:**
- Create: `src/exercises/phase2/07-adapter-layer/types.ts`
- Create: `src/exercises/phase2/07-adapter-layer/domain.ts`
- Create: `src/exercises/phase2/07-adapter-layer/usecase.ts`
- Create: `src/exercises/phase2/07-adapter-layer/index.test.ts`

- [ ] **Step 1: 型定義とドメイン純粋関数を書く**

`src/exercises/phase2/07-adapter-layer/types.ts` を作成:

```typescript
export type User = { id: string; name: string; email: string };
export type CreateUserInput = { name: string; email: string };
export type ValidationError = { _tag: "ValidationError"; message: string; field: string };
export type DuplicateError = { _tag: "DuplicateError"; email: string };
export type DatabaseError = { _tag: "DatabaseError"; cause: unknown };
export type AppError = ValidationError | DuplicateError | DatabaseError;

// Adapter層のインターフェース（副作用の境界）
export type UserAdapter = {
  findByEmail: (email: string) => Promise<User | null>;
  save: (user: Omit<User, "id">) => Promise<User>;
};
```

`src/exercises/phase2/07-adapter-layer/domain.ts` を作成:

```typescript
import { err, ok, type Result } from "neverthrow";
import type { CreateUserInput, User, ValidationError } from "./types";

// 純粋関数 — 副作用なし、モックなしでテスト可能
export const validateInput = (
  input: CreateUserInput,
): Result<CreateUserInput, ValidationError> => {
  if (input.name.trim().length < 3) {
    return err({ _tag: "ValidationError", message: "名前は3文字以上", field: "name" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return err({ _tag: "ValidationError", message: "メール形式不正", field: "email" });
  }
  return ok(input);
};

export const buildUser = (input: CreateUserInput): Omit<User, "id"> => ({
  name: input.name.trim(),
  email: input.email.toLowerCase(),
});
```

- [ ] **Step 2: Usecaseを書く（Adapterを注入）**

`src/exercises/phase2/07-adapter-layer/usecase.ts` を作成:

```typescript
import { err, ResultAsync } from "neverthrow";
import { validateInput, buildUser } from "./domain";
import type { AppError, CreateUserInput, User, UserAdapter } from "./types";

export const createUser = (
  input: CreateUserInput,
  adapter: UserAdapter,
): ResultAsync<User, AppError> => {
  const validated = validateInput(input);
  if (validated.isErr()) return ResultAsync.fromSafePromise(Promise.resolve(validated.error)).andThen(() => ResultAsync.fromSafePromise(Promise.reject(validated.error)));

  return ResultAsync.fromPromise(
    adapter.findByEmail(input.email),
    (cause): AppError => ({ _tag: "DatabaseError", cause }),
  )
    .andThen((existing) =>
      existing
        ? err<User, AppError>({ _tag: "DuplicateError", email: input.email })
        : ResultAsync.fromPromise(
            adapter.save(buildUser(input)),
            (cause): AppError => ({ _tag: "DatabaseError", cause }),
          ),
    );
};
```

- [ ] **Step 3: テストを書く**

`src/exercises/phase2/07-adapter-layer/index.test.ts` を作成:

```typescript
import { describe, expect, it } from "bun:test";
import { validateInput, buildUser } from "./domain";
import { createUser } from "./usecase";
import type { UserAdapter } from "./types";

// 純粋層のテスト — モック不要
describe("domain: validateInput（純粋関数）", () => {
  it("正常入力で成功する", () => {
    const result = validateInput({ name: "Alice", email: "alice@example.com" });
    expect(result.isOk()).toBe(true);
  });

  it("名前が短すぎる場合はエラー", () => {
    const result = validateInput({ name: "Bo", email: "alice@example.com" });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) expect(result.error.field).toBe("name");
  });
});

describe("domain: buildUser（純粋関数）", () => {
  it("入力をトリム・小文字変換する", () => {
    const user = buildUser({ name: " Alice ", email: "ALICE@example.com" });
    expect(user.name).toBe("Alice");
    expect(user.email).toBe("alice@example.com");
  });
});

// Usecase層のテスト — Adapterをモックで差し替え
describe("usecase: createUser", () => {
  const mockAdapter = (overrides: Partial<UserAdapter> = {}): UserAdapter => ({
    findByEmail: async () => null,
    save: async (u) => ({ ...u, id: "new-id" }),
    ...overrides,
  });

  it("正常フローでユーザーを作成する", async () => {
    const result = await createUser(
      { name: "Alice", email: "alice@example.com" },
      mockAdapter(),
    );
    expect(result.isOk()).toBe(true);
    if (result.isOk()) expect(result.value.id).toBe("new-id");
  });

  it("メール重複でDuplicateErrorを返す", async () => {
    const result = await createUser(
      { name: "Alice", email: "alice@example.com" },
      mockAdapter({
        findByEmail: async () => ({ id: "existing", name: "Alice", email: "alice@example.com" }),
      }),
    );
    expect(result.isErr()).toBe(true);
    if (result.isErr()) expect(result.error._tag).toBe("DuplicateError");
  });
});
```

- [ ] **Step 4: テストが通ることを確認**

```bash
bun test src/exercises/phase2/07-adapter-layer/index.test.ts
```

Expected: `5 pass, 0 fail`

- [ ] **Step 5: コミット**

```bash
git add src/exercises/phase2/07-adapter-layer/
git commit -m "feat: お題7 Adapter層による副作用分離とテストを追加"
```

---

## Task 8: [Phase 3] お題8 — Branded型（Nominal型）

**目的:** プリミティブ型をブランド化してドメイン語彙を型で表現することを習得する

**Files:**
- Create: `src/exercises/phase3/08-branded-types/brands.ts`
- Create: `src/exercises/phase3/08-branded-types/neverthrow.ts`
- Create: `src/exercises/phase3/08-branded-types/byethrow.ts`
- Create: `src/exercises/phase3/08-branded-types/fp-ts.ts`
- Create: `src/exercises/phase3/08-branded-types/index.test.ts`

- [ ] **Step 1: Branded型の基盤を定義する**

`src/exercises/phase3/08-branded-types/brands.ts` を作成:

```typescript
// Branded型の汎用定義
declare const __brand: unique symbol;
type Brand<T, B> = T & { readonly [__brand]: B };

export type UserId = Brand<string, "UserId">;
export type AccountId = Brand<string, "AccountId">;
export type Email = Brand<string, "Email">;
export type Amount = Brand<number, "Amount">;

// UserId と AccountId は混同するとコンパイルエラーになる
// 例: const fn = (id: UserId) => id; fn("abc" as AccountId) → エラー
```

- [ ] **Step 2: テストを書く**

`src/exercises/phase3/08-branded-types/index.test.ts` を作成:

```typescript
import { describe, expect, it } from "bun:test";
import * as E from "fp-ts/Either";
import { Result } from "@praha/byethrow";
import { createUserId, createEmail, createAmount } from "./neverthrow";
import { createUserId as createUserIdBT, createEmail as createEmailBT } from "./byethrow";
import { createUserId as createUserIdFP, createEmail as createEmailFP } from "./fp-ts";

describe("neverthrow: Branded型スマートコンストラクタ", () => {
  it("正常なUUIDでUserIdを生成する", () => {
    const result = createUserId("550e8400-e29b-41d4-a716-446655440000");
    expect(result.isOk()).toBe(true);
  });

  it("空文字でエラーを返す", () => {
    const result = createUserId("");
    expect(result.isErr()).toBe(true);
    if (result.isErr()) expect(result.error.field).toBe("userId");
  });

  it("正常なメールでEmailを生成する", () => {
    const result = createEmail("alice@example.com");
    expect(result.isOk()).toBe(true);
  });

  it("不正なメール形式でエラーを返す", () => {
    const result = createEmail("invalid");
    expect(result.isErr()).toBe(true);
  });

  it("正の数でAmountを生成する", () => {
    const result = createAmount(100);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) expect(result.value).toBe(100);
  });

  it("負の数でエラーを返す", () => {
    const result = createAmount(-1);
    expect(result.isErr()).toBe(true);
  });
});

describe("byethrow: Branded型スマートコンストラクタ", () => {
  it("正常なUUIDでUserIdを生成する", () => {
    const result = createUserIdBT("550e8400-e29b-41d4-a716-446655440000");
    expect(Result.isSuccess(result)).toBe(true);
  });

  it("不正なメール形式でエラーを返す", () => {
    const result = createEmailBT("invalid");
    expect(Result.isFailure(result)).toBe(true);
  });
});

describe("fp-ts: Branded型スマートコンストラクタ", () => {
  it("正常なUUIDでUserIdを生成する", () => {
    const result = createUserIdFP("550e8400-e29b-41d4-a716-446655440000");
    expect(E.isRight(result)).toBe(true);
  });

  it("不正なメール形式でエラーを返す", () => {
    const result = createEmailFP("invalid");
    expect(E.isLeft(result)).toBe(true);
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
bun test src/exercises/phase3/08-branded-types/index.test.ts
```

- [ ] **Step 4: neverthrow実装を書く**

`src/exercises/phase3/08-branded-types/neverthrow.ts` を作成:

```typescript
import { err, ok, type Result } from "neverthrow";
import type { UserId, Email, Amount } from "./brands";

type BrandError = { message: string; field: string };

export const createUserId = (value: string): Result<UserId, BrandError> => {
  if (!value || value.trim().length === 0) {
    return err({ message: "UserIdは必須です", field: "userId" });
  }
  return ok(value as UserId);
};

export const createEmail = (value: string): Result<Email, BrandError> => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return err({ message: "メール形式が不正です", field: "email" });
  }
  return ok(value as Email);
};

export const createAmount = (value: number): Result<Amount, BrandError> => {
  if (value < 0) {
    return err({ message: "金額は0以上が必要です", field: "amount" });
  }
  return ok(value as Amount);
};
```

- [ ] **Step 5: byethrow実装を書く**

`src/exercises/phase3/08-branded-types/byethrow.ts` を作成:

```typescript
import { Result } from "@praha/byethrow";
import type { UserId, Email } from "./brands";

type BrandError = { message: string; field: string };

export const createUserId = (value: string): Result<UserId, BrandError> => {
  if (!value || value.trim().length === 0) {
    return Result.fail({ message: "UserIdは必須です", field: "userId" });
  }
  return Result.succeed(value as UserId);
};

export const createEmail = (value: string): Result<Email, BrandError> => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return Result.fail({ message: "メール形式が不正です", field: "email" });
  }
  return Result.succeed(value as Email);
};
```

- [ ] **Step 6: fp-ts実装を書く**

`src/exercises/phase3/08-branded-types/fp-ts.ts` を作成:

```typescript
import * as E from "fp-ts/Either";
import type { UserId, Email } from "./brands";

type BrandError = { message: string; field: string };

export const createUserId = (value: string): E.Either<BrandError, UserId> => {
  if (!value || value.trim().length === 0) {
    return E.left({ message: "UserIdは必須です", field: "userId" });
  }
  return E.right(value as UserId);
};

export const createEmail = (value: string): E.Either<BrandError, Email> => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return E.left({ message: "メール形式が不正です", field: "email" });
  }
  return E.right(value as Email);
};
```

- [ ] **Step 7: テストが通ることを確認**

```bash
bun test src/exercises/phase3/08-branded-types/index.test.ts
```

Expected: `10 pass, 0 fail`

- [ ] **Step 8: コミット**

```bash
git add src/exercises/phase3/08-branded-types/
git commit -m "feat: お題8 Branded型スマートコンストラクタの3実装とテストを追加"
```

---

## Task 9: [Phase 3] お題9 — ステートマシン設計

**目的:** ドメインオブジェクトの状態遷移を型で表現し、不正な遷移をコンパイル時に防ぐ

**Files:**
- Create: `src/exercises/phase3/09-state-machine/types.ts`
- Create: `src/exercises/phase3/09-state-machine/transitions.ts`
- Create: `src/exercises/phase3/09-state-machine/index.test.ts`

- [ ] **Step 1: 状態型と遷移関数の型を定義する**

`src/exercises/phase3/09-state-machine/types.ts` を作成:

```typescript
import { err, ok, type Result } from "neverthrow";

declare const __brand: unique symbol;
type Brand<T, B> = T & { readonly [__brand]: B };
export type Amount = Brand<number, "Amount">;
export const createAmount = (n: number): Amount => n as Amount;

// 状態を別の型として定義 — 不正な状態はコンパイル時に排除
export type ActiveAccount = {
  _state: "Active";
  id: string;
  balance: Amount;
};

export type FrozenAccount = {
  _state: "Frozen";
  id: string;
  balance: Amount;
  reason: string;
};

export type ClosedAccount = {
  _state: "Closed";
  id: string;
};

export type BankAccount = ActiveAccount | FrozenAccount | ClosedAccount;

export type FundsRemainingError = {
  _tag: "FundsRemainingError";
  balance: Amount;
};
```

- [ ] **Step 2: テストを書く**

`src/exercises/phase3/09-state-machine/index.test.ts` を作成:

```typescript
import { describe, expect, it } from "bun:test";
import { freeze, unfreeze, close, deposit, withdraw } from "./transitions";
import { createAmount, type ActiveAccount } from "./types";

const activeAccount: ActiveAccount = {
  _state: "Active",
  id: "acc-1",
  balance: createAmount(1000),
};

describe("ステートマシン: 状態遷移", () => {
  it("ActiveアカウントをFrozenにできる", () => {
    const frozen = freeze(activeAccount, "不審な取引");
    expect(frozen._state).toBe("Frozen");
    expect(frozen.reason).toBe("不審な取引");
    expect(frozen.balance).toBe(1000);
  });

  it("FrozenアカウントをActiveに戻せる", () => {
    const frozen = freeze(activeAccount, "理由");
    const active = unfreeze(frozen);
    expect(active._state).toBe("Active");
  });

  it("残高がある場合はCloseできない", () => {
    const result = close(activeAccount);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error._tag).toBe("FundsRemainingError");
    }
  });

  it("残高0でCloseできる", () => {
    const zeroBalance: ActiveAccount = { ...activeAccount, balance: createAmount(0) };
    const result = close(zeroBalance);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value._state).toBe("Closed");
    }
  });

  it("Activeアカウントに入金できる", () => {
    const result = deposit(activeAccount, createAmount(500));
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.balance).toBe(1500);
    }
  });

  it("残高不足の場合は出金できない", () => {
    const result = withdraw(activeAccount, createAmount(2000));
    expect(result.isErr()).toBe(true);
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
bun test src/exercises/phase3/09-state-machine/index.test.ts
```

- [ ] **Step 4: 遷移関数を実装する**

`src/exercises/phase3/09-state-machine/transitions.ts` を作成:

```typescript
import { err, ok, type Result } from "neverthrow";
import {
  type ActiveAccount,
  type FrozenAccount,
  type ClosedAccount,
  type FundsRemainingError,
  type Amount,
  createAmount,
} from "./types";

// Active → Frozen（必ず成功する遷移）
export const freeze = (account: ActiveAccount, reason: string): FrozenAccount => ({
  _state: "Frozen",
  id: account.id,
  balance: account.balance,
  reason,
});

// Frozen → Active（必ず成功する遷移）
export const unfreeze = (account: FrozenAccount): ActiveAccount => ({
  _state: "Active",
  id: account.id,
  balance: account.balance,
});

// Active → Closed（残高があると失敗）
export const close = (
  account: ActiveAccount,
): Result<ClosedAccount, FundsRemainingError> => {
  if (account.balance > 0) {
    return err({ _tag: "FundsRemainingError", balance: account.balance });
  }
  return ok({ _state: "Closed", id: account.id });
};

// Active → Active（入金）
export const deposit = (
  account: ActiveAccount,
  amount: Amount,
): Result<ActiveAccount, never> =>
  ok({ ...account, balance: createAmount(account.balance + amount) });

type InsufficientFundsError = { _tag: "InsufficientFundsError"; balance: Amount; amount: Amount };

// Active → Active（出金）
export const withdraw = (
  account: ActiveAccount,
  amount: Amount,
): Result<ActiveAccount, InsufficientFundsError> => {
  if (account.balance < amount) {
    return err({
      _tag: "InsufficientFundsError",
      balance: account.balance,
      amount,
    });
  }
  return ok({ ...account, balance: createAmount(account.balance - amount) });
};
```

- [ ] **Step 5: テストが通ることを確認**

```bash
bun test src/exercises/phase3/09-state-machine/index.test.ts
```

Expected: `6 pass, 0 fail`

- [ ] **Step 6: コミット**

```bash
git add src/exercises/phase3/09-state-machine/
git commit -m "feat: お題9 ステートマシン設計とテストを追加"
```

---

## Task 10: [Phase 3] お題10 — 部分適用でDI

**目的:** 高階関数による依存注入とWorkflow設計を習得する

**Files:**
- Create: `src/exercises/phase3/10-partial-application-di/types.ts`
- Create: `src/exercises/phase3/10-partial-application-di/workflow.ts`
- Create: `src/exercises/phase3/10-partial-application-di/index.test.ts`

- [ ] **Step 1: 型を定義する**

`src/exercises/phase3/10-partial-application-di/types.ts` を作成:

```typescript
import type { ResultAsync } from "neverthrow";

export type User = { id: string; name: string; email: string };
export type CreateUserInput = { name: string; email: string };

export type ValidationError = { _tag: "ValidationError"; message: string; field: string };
export type DuplicateError = { _tag: "DuplicateError"; email: string };
export type DatabaseError = { _tag: "DatabaseError"; cause: unknown };
export type AppError = ValidationError | DuplicateError | DatabaseError;

// Workflowの型 — 依存関係を受け取り、実行関数を返す
export type CreateUserWorkflowDeps = {
  findByEmail: (email: string) => Promise<User | null>;
  save: (user: Omit<User, "id">) => Promise<User>;
};

export type CreateUserWorkflow = (
  deps: CreateUserWorkflowDeps,
) => (input: CreateUserInput) => ResultAsync<User, AppError>;
```

- [ ] **Step 2: テストを書く**

`src/exercises/phase3/10-partial-application-di/index.test.ts` を作成:

```typescript
import { describe, expect, it } from "bun:test";
import { createUserWorkflow } from "./workflow";
import type { CreateUserWorkflowDeps } from "./types";

const makeDeps = (overrides: Partial<CreateUserWorkflowDeps> = {}): CreateUserWorkflowDeps => ({
  findByEmail: async () => null,
  save: async (u) => ({ ...u, id: "new-id" }),
  ...overrides,
});

describe("createUserWorkflow（部分適用DI）", () => {
  it("依存関係を注入してWorkflowを生成できる", async () => {
    // 依存関係を先に注入してWorkflow（実行関数）を生成
    const workflow = createUserWorkflow(makeDeps());

    const result = await workflow({ name: "Alice", email: "alice@example.com" });
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.id).toBe("new-id");
      expect(result.value.name).toBe("Alice");
    }
  });

  it("バリデーション失敗でValidationErrorを返す", async () => {
    const workflow = createUserWorkflow(makeDeps());
    const result = await workflow({ name: "Bo", email: "alice@example.com" });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) expect(result.error._tag).toBe("ValidationError");
  });

  it("メール重複でDuplicateErrorを返す", async () => {
    const workflow = createUserWorkflow(
      makeDeps({
        findByEmail: async () => ({ id: "existing", name: "Alice", email: "alice@example.com" }),
      }),
    );
    const result = await workflow({ name: "Alice", email: "alice@example.com" });
    expect(result.isErr()).toBe(true);
    if (result.isErr()) expect(result.error._tag).toBe("DuplicateError");
  });

  it("同じWorkflowを別の依存関係で生成できる（差し替え可能）", async () => {
    const prodWorkflow = createUserWorkflow(makeDeps());
    const testWorkflow = createUserWorkflow(
      makeDeps({ save: async (u) => ({ ...u, id: "test-id" }) }),
    );

    const prodResult = await prodWorkflow({ name: "Alice", email: "a@example.com" });
    const testResult = await testWorkflow({ name: "Alice", email: "a@example.com" });

    expect(prodResult.isOk() && prodResult.value.id).toBe("new-id");
    expect(testResult.isOk() && testResult.value.id).toBe("test-id");
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
bun test src/exercises/phase3/10-partial-application-di/index.test.ts
```

- [ ] **Step 4: Workflowを実装する**

`src/exercises/phase3/10-partial-application-di/workflow.ts` を作成:

```typescript
import { err, ResultAsync } from "neverthrow";
import type { AppError, CreateUserWorkflow } from "./types";

// 依存関係を先に受け取り、入力を受け取る関数を返す（部分適用パターン）
export const createUserWorkflow: CreateUserWorkflow = (deps) => (input) => {
  if (input.name.trim().length < 3) {
    return ResultAsync.fromSafePromise(
      Promise.resolve(err<never, AppError>({ _tag: "ValidationError", message: "名前は3文字以上", field: "name" })),
    ).andThen((r) => r);
  }

  return ResultAsync.fromPromise(
    deps.findByEmail(input.email),
    (cause): AppError => ({ _tag: "DatabaseError", cause }),
  )
    .andThen((existing) =>
      existing
        ? err<never, AppError>({ _tag: "DuplicateError", email: input.email })
        : ResultAsync.fromPromise(
            deps.save({ name: input.name.trim(), email: input.email }),
            (cause): AppError => ({ _tag: "DatabaseError", cause }),
          ),
    );
};
```

- [ ] **Step 5: テストが通ることを確認**

```bash
bun test src/exercises/phase3/10-partial-application-di/index.test.ts
```

Expected: `4 pass, 0 fail`

- [ ] **Step 6: コミット**

```bash
git add src/exercises/phase3/10-partial-application-di/
git commit -m "feat: お題10 部分適用によるDIとWorkflow設計のテストを追加"
```

---

## Task 11: [Phase 4] お題11 — usecaseをROPで書き直す

**目的:** Phase 1-3の学習成果を使い、既存usecaseをBranded型+ROPパイプラインで書き直す

**Files:**
- Create: `src/exercises/phase4/11-usecase-refactor/types.ts`
- Create: `src/exercises/phase4/11-usecase-refactor/create-user.ts`
- Create: `src/exercises/phase4/11-usecase-refactor/deposit.ts`
- Create: `src/exercises/phase4/11-usecase-refactor/index.test.ts`

- [ ] **Step 1: Branded型とエラー型を定義する**

`src/exercises/phase4/11-usecase-refactor/types.ts` を作成:

```typescript
import { err, ok, type Result } from "neverthrow";

declare const __brand: unique symbol;
type Brand<T, B> = T & { readonly [__brand]: B };

export type UserId = Brand<number, "UserId">;
export type AccountId = Brand<number, "AccountId">;
export type Amount = Brand<number, "Amount">;
export type Email = Brand<string, "Email">;
export type UserName = Brand<string, "UserName">;

export type ValidationError = { _tag: "ValidationError"; message: string; field: string };
export type NotFoundError = { _tag: "NotFoundError"; id: string };
export type InsufficientFundsError = { _tag: "InsufficientFundsError"; balance: Amount; requested: Amount };
export type AppError = ValidationError | NotFoundError | InsufficientFundsError;

export const createUserName = (value: string): Result<UserName, ValidationError> => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return err({ _tag: "ValidationError", message: "名前は必須", field: "name" });
  if (trimmed.length < 3) return err({ _tag: "ValidationError", message: "名前は3文字以上", field: "name" });
  return ok(trimmed as UserName);
};

export const createAmount = (value: number): Result<Amount, ValidationError> => {
  if (value <= 0) return err({ _tag: "ValidationError", message: "金額は1以上", field: "amount" });
  return ok(value as Amount);
};

export type User = { id: UserId; name: UserName; email: Email };
export type BankAccount = {
  _state: "Active";
  id: AccountId;
  balance: Amount;
};
```

- [ ] **Step 2: テストを書く**

`src/exercises/phase4/11-usecase-refactor/index.test.ts` を作成:

```typescript
import { describe, expect, it } from "bun:test";
import { createUserUsecase } from "./create-user";
import { depositUsecase } from "./deposit";
import type { BankAccount, Amount, AccountId } from "./types";

describe("createUserUsecase（Branded型 + ROPパイプライン）", () => {
  it("正常な名前でユーザーを作成する", () => {
    const result = createUserUsecase("Alice");
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(typeof result.value.name).toBe("string");
    }
  });

  it("短い名前でValidationErrorを返す", () => {
    const result = createUserUsecase("Bo");
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error._tag).toBe("ValidationError");
      expect(result.error.field).toBe("name");
    }
  });

  it("空文字でValidationErrorを返す", () => {
    const result = createUserUsecase("");
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error._tag).toBe("ValidationError");
    }
  });
});

describe("depositUsecase（ステートマシン + ROPパイプライン）", () => {
  const activeAccount: BankAccount = {
    _state: "Active",
    id: 1 as unknown as AccountId,
    balance: 1000 as unknown as Amount,
  };

  it("正の金額で残高が増える", () => {
    const result = depositUsecase(activeAccount, 500);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.balance).toBe(1500);
    }
  });

  it("0以下の金額でValidationErrorを返す", () => {
    const result = depositUsecase(activeAccount, 0);
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error._tag).toBe("ValidationError");
    }
  });

  it("負の金額でValidationErrorを返す", () => {
    const result = depositUsecase(activeAccount, -100);
    expect(result.isErr()).toBe(true);
  });
});
```

- [ ] **Step 3: テストが失敗することを確認**

```bash
bun test src/exercises/phase4/11-usecase-refactor/index.test.ts
```

- [ ] **Step 4: createUserを実装する**

`src/exercises/phase4/11-usecase-refactor/create-user.ts` を作成:

```typescript
import { ok, type Result } from "neverthrow";
import { createUserName, type AppError, type User, type UserId, type Email } from "./types";

export const createUserUsecase = (name: string): Result<User, AppError> =>
  createUserName(name).map((validName) => ({
    id: 0 as unknown as UserId,
    name: validName,
    email: `${validName.toLowerCase()}@example.com` as unknown as Email,
  }));
```

- [ ] **Step 5: depositを実装する**

`src/exercises/phase4/11-usecase-refactor/deposit.ts` を作成:

```typescript
import { type Result } from "neverthrow";
import { createAmount, type AppError, type BankAccount, type Amount } from "./types";

export const depositUsecase = (
  account: BankAccount,
  rawAmount: number,
): Result<BankAccount, AppError> =>
  createAmount(rawAmount).map((amount) => ({
    ...account,
    balance: (account.balance + amount) as Amount,
  }));
```

- [ ] **Step 6: テストが通ることを確認**

```bash
bun test src/exercises/phase4/11-usecase-refactor/index.test.ts
```

Expected: `6 pass, 0 fail`

- [ ] **Step 7: コミット**

```bash
git add src/exercises/phase4/11-usecase-refactor/
git commit -m "feat: お題11 usecase層をBranded型+ROPで書き直し"
```

---

## Task 12: [Phase 4] お題12 — repository層にResult型を適用

**目的:** throwしているDBエラーをResult型に変換する

**Files:**
- Create: `src/exercises/phase4/12-repository-result/user-repository.ts`
- Create: `src/exercises/phase4/12-repository-result/index.test.ts`

- [ ] **Step 1: テストを書く**

`src/exercises/phase4/12-repository-result/index.test.ts` を作成:

```typescript
import { describe, expect, it } from "bun:test";
import { UserRepository } from "./user-repository";

// SQLiteを使うためDB接続が必要 — in-memory DBでテスト
describe("UserRepository（Result型）", () => {
  const repo = new UserRepository(":memory:");

  it("createでユーザーを作成しResultを返す", async () => {
    const result = await repo.create({ name: "Alice", email: "alice@example.com" });
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.name).toBe("Alice");
      expect(typeof result.value.id).toBe("number");
    }
  });

  it("findByIdで存在するユーザーを返す", async () => {
    const created = await repo.create({ name: "Bob", email: "bob@example.com" });
    if (created.isErr()) throw new Error("セットアップ失敗");

    const result = await repo.findById(created.value.id);
    expect(result.isOk()).toBe(true);
    if (result.isOk() && result.value) {
      expect(result.value.name).toBe("Bob");
    }
  });

  it("findByIdで存在しないIDはnullを返す（エラーではない）", async () => {
    const result = await repo.findById(99999);
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBeNull();
    }
  });
});
```

- [ ] **Step 2: テストが失敗することを確認**

```bash
bun test src/exercises/phase4/12-repository-result/index.test.ts
```

- [ ] **Step 3: Result型を返すリポジトリを実装する**

`src/exercises/phase4/12-repository-result/user-repository.ts` を作成:

```typescript
import { Database } from "bun:sqlite";
import { err, ok, ResultAsync } from "neverthrow";

type User = { id: number; name: string; email: string };
type DatabaseError = { _tag: "DatabaseError"; cause: unknown };

export class UserRepository {
  private db: Database;

  constructor(dbPath: string = "app.db") {
    this.db = new Database(dbPath);
    // in-memoryテスト用のテーブル作成
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      )
    `);
  }

  create(user: Omit<User, "id">): ResultAsync<User, DatabaseError> {
    return ResultAsync.fromPromise(
      Promise.resolve(
        this.db
          .query("INSERT INTO users (name, email) VALUES ($name, $email) RETURNING *")
          .get(user.name, user.email) as User,
      ),
      (cause): DatabaseError => ({ _tag: "DatabaseError", cause }),
    );
  }

  findById(id: number): ResultAsync<User | null, DatabaseError> {
    return ResultAsync.fromPromise(
      Promise.resolve(
        (this.db.query("SELECT * FROM users WHERE id = ?").get(id) as User) ?? null,
      ),
      (cause): DatabaseError => ({ _tag: "DatabaseError", cause }),
    );
  }
}
```

- [ ] **Step 4: テストが通ることを確認**

```bash
bun test src/exercises/phase4/12-repository-result/index.test.ts
```

Expected: `3 pass, 0 fail`

- [ ] **Step 5: コミット**

```bash
git add src/exercises/phase4/12-repository-result/
git commit -m "feat: お題12 repository層のResult型化とテストを追加"
```

---

## Task 13: [Phase 4] お題13 — CLIエラーハンドリングを統一

**目的:** AppErrorのUnion型に対してts-patternで網羅的にハンドリングする

**Files:**
- Create: `src/exercises/phase4/13-cli-error-handling/error-handler.ts`
- Create: `src/exercises/phase4/13-cli-error-handling/index.test.ts`

- [ ] **Step 1: テストを書く**

`src/exercises/phase4/13-cli-error-handling/index.test.ts` を作成:

```typescript
import { describe, expect, it } from "bun:test";
import { formatError, handleResult } from "./error-handler";
import { ok, err } from "neverthrow";
import type { AppError } from "./error-handler";

describe("formatError", () => {
  it("ValidationErrorを日本語メッセージに変換する", () => {
    const error: AppError = { _tag: "ValidationError", message: "名前は必須", field: "name" };
    expect(formatError(error)).toBe("[バリデーションエラー] name: 名前は必須");
  });

  it("NotFoundErrorを日本語メッセージに変換する", () => {
    const error: AppError = { _tag: "NotFoundError", id: "user-1" };
    expect(formatError(error)).toBe("[見つかりません] ID: user-1");
  });

  it("DuplicateErrorを日本語メッセージに変換する", () => {
    const error: AppError = { _tag: "DuplicateError", field: "email", value: "a@b.com" };
    expect(formatError(error)).toBe("[重複エラー] email=a@b.com はすでに存在します");
  });

  it("DatabaseErrorを日本語メッセージに変換する", () => {
    const error: AppError = { _tag: "DatabaseError", cause: new Error("接続失敗") };
    expect(formatError(error)).toBe("[データベースエラー] 再試行してください");
  });
});

describe("handleResult", () => {
  it("成功時は値を返す", () => {
    const result = ok({ id: "1", name: "Alice" });
    const output = handleResult(result, (user) => `ユーザー: ${user.name}`);
    expect(output).toBe("ユーザー: Alice");
  });

  it("失敗時はエラーメッセージを返す", () => {
    const error: AppError = { _tag: "NotFoundError", id: "unknown" };
    const result = err(error);
    const output = handleResult(result, (user: { name: string }) => `ユーザー: ${user.name}`);
    expect(output).toBe("[見つかりません] ID: unknown");
  });
});
```

- [ ] **Step 2: テストが失敗することを確認**

```bash
bun test src/exercises/phase4/13-cli-error-handling/index.test.ts
```

- [ ] **Step 3: エラーハンドラーを実装する**

`src/exercises/phase4/13-cli-error-handling/error-handler.ts` を作成:

```typescript
import { match } from "ts-pattern";
import type { Result } from "neverthrow";

export type ValidationError = { _tag: "ValidationError"; message: string; field: string };
export type NotFoundError = { _tag: "NotFoundError"; id: string };
export type DuplicateError = { _tag: "DuplicateError"; field: string; value: string };
export type DatabaseError = { _tag: "DatabaseError"; cause: unknown };
export type AppError = ValidationError | NotFoundError | DuplicateError | DatabaseError;

// exhaustive() により、新しいエラー種別追加時にコンパイルエラーになる
export const formatError = (error: AppError): string =>
  match(error)
    .with(
      { _tag: "ValidationError" },
      (e) => `[バリデーションエラー] ${e.field}: ${e.message}`,
    )
    .with(
      { _tag: "NotFoundError" },
      (e) => `[見つかりません] ID: ${e.id}`,
    )
    .with(
      { _tag: "DuplicateError" },
      (e) => `[重複エラー] ${e.field}=${e.value} はすでに存在します`,
    )
    .with(
      { _tag: "DatabaseError" },
      () => "[データベースエラー] 再試行してください",
    )
    .exhaustive();

export const handleResult = <T>(
  result: Result<T, AppError>,
  onSuccess: (value: T) => string,
): string =>
  result.match(onSuccess, formatError);
```

- [ ] **Step 4: テストが通ることを確認**

```bash
bun test src/exercises/phase4/13-cli-error-handling/index.test.ts
```

Expected: `6 pass, 0 fail`

- [ ] **Step 5: 全テストが通ることを確認**

```bash
bun test src/exercises/
```

Expected: 全テスト pass

- [ ] **Step 6: lintチェック**

```bash
bun run check
```

Expected: エラーなし

- [ ] **Step 7: コミット**

```bash
git add src/exercises/phase4/13-cli-error-handling/
git commit -m "feat: お題13 CLIエラーハンドリングのts-pattern統一とテストを追加"
```

---

## 自己レビュー

**仕様カバレッジ確認:**
- ✅ Phase 1 (お題1-3): 基本API習得
- ✅ Phase 2 (お題4-7): ROPとパイプライン
- ✅ Phase 3 (お題8-10): ドメインモデリング
- ✅ Phase 4 (お題11-13): 実プロジェクト統合
- ✅ 全お題にテストコード付き
- ✅ neverthrow / byethrow / fp-ts の3実装（Phase 3-4はneverthrowベースで統合）
- ✅ ts-patternによるパターンマッチング（お題5, 13）

**型整合性:**
- `ValidationError`, `NotFoundError`, `DuplicateError`, `DatabaseError`, `AppError` は各ファイル内で一貫定義
- `Brand<T, B>` パターンは お題8, 11で統一
- `createAmount`, `createUserName` などのスマートコンストラクタはお題内で完結
