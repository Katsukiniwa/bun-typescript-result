# TypeScript関数型プログラミング習得ロードマップ 設計仕様

## 概要

neverthrow / byethrow / fp-ts の3ライブラリを使った並行比較学習により、TypeScript関数型バックエンド開発を習得する。以下の参考資料を読みこなせるレベルを目標とする。

**目標資料：**
- [TypeScript関数型スタイルでバックエンド開発のリアル（naoya）](https://speakerdeck.com/naoya/typescript-guan-shu-xing-sutairudebatukuendokai-fa-noriaru)
- [関数型プログラミングの設計テクニック（matarillo）](https://speakerdeck.com/matarillo/guan-shu-xing-puroguramingunoshe-ji-tekunituku)
- [Railway Oriented Programming in TypeScript（Sansan）](https://buildersbox.corp-sansan.com/entry/2024/03/26/110000)
- [TypeScript ROPとResult型によるバリデーション設計（kaminashi）](https://kaminashi-developer.hatenablog.jp/entry/typescript-rop-result-validation-design)

## 学習方針

- **並行比較学習**: 同じお題をneverthrow / byethrow / fp-tsで実装し、設計の違いを体感する
- **テストコードセット**: 各お題にBunテストを必ず書く（What: 振る舞いの検証）
- **READMEに記録**: 設計判断のWhy notをREADMEに残す
- **既存プロジェクトを活用**: Phase 4でこのプロジェクトのコードを書き直すことで実践力を習得
- **ペース**: 毎日1〜2時間、週5日想定（全8週）

## ディレクトリ構成

```
src/exercises/
  phase1/
    01-validation/
      neverthrow.ts
      byethrow.ts
      fp-ts.ts
      index.test.ts
      README.md
    02-composing-validations/
    03-async/
  phase2/
    04-railway-oriented-programming/
    05-error-union-types/
    06-validator-array-pattern/
    07-adapter-layer/
  phase3/
    08-branded-types/
    09-state-machine/
    10-partial-application-di/
  phase4/
    11-usecase-refactor/
    12-repository-result/
    13-cli-error-handling/
```

各お題の内部構成：
```
お題N/
  neverthrow.ts   # neverthrowによる実装
  byethrow.ts     # byethrowによる実装
  fp-ts.ts        # fp-tsによる実装
  index.test.ts   # 3実装を同一インターフェースで検証するテスト
  README.md       # 設計判断・比較・Why not
```

## フェーズ詳細

### Phase 1：基本API習得（Week 1-2）

#### お題1: バリデーション

**目的**: Result型の基本（ok/err生成、型ガード）を習得する

**仕様**:
- 入力: `name: string`
- ルール: 3文字以上、空文字不可
- 成功: `{ name: string }` を返す
- 失敗: `ValidationError` を返す

**習得API**:
- neverthrow: `ok()`, `err()`, `result.isOk()`, `result.isErr()`
- byethrow: `Result.succeed()`, `Result.fail()`, `Result.isSuccess()`, `Result.isFailure()`
- fp-ts: `E.right()`, `E.left()`, `E.isRight()`, `E.isLeft()`

**テスト観点**:
- 正常値で成功Resultが返る
- 空文字でエラーResultが返る
- 2文字以下でエラーResultが返る

---

#### お題2: 複数バリデーションの合成

**目的**: Result型の変換・連鎖（andThen/map/mapError）を習得する

**仕様**:
- 入力: `{ name: string, email: string, age: number }`
- ルール: 名前3文字以上、メール形式チェック、年齢0以上
- 成功: `User` ドメインオブジェクトを返す
- 失敗: 最初に失敗したバリデーションのエラーを返す（Short-circuit）

**習得API**:
- neverthrow: `andThen()`, `map()`, `mapErr()`
- byethrow: `Result.andThen()`, `Result.map()`, `Result.mapError()`
- fp-ts: `E.chain()`, `E.map()`, `E.mapLeft()`

**テスト観点**:
- 全項目正常で成功
- 名前不正で失敗（最初のエラー）
- メール不正で失敗
- 年齢不正で失敗

---

#### お題3: 非同期処理

**目的**: 非同期Result（ResultAsync / Promise<Result>）を習得する

**仕様**:
- 入力: `userId: string`
- 処理: DBからユーザーを取得（モック可）
- 成功: `User` を返す
- 失敗: `NotFoundError` または `DatabaseError` を返す

**習得API**:
- neverthrow: `ResultAsync`, `fromPromise()`, `fromSafePromise()`
- byethrow: `Promise<Result>`, `Result.fn({ try, catch })`
- fp-ts: `TE.tryCatch()`, `TE.TaskEither`

**テスト観点**:
- 存在するIDで成功
- 存在しないIDでNotFoundError
- DB接続失敗でDatabaseError

---

### Phase 2：ROPとパイプライン（Week 3-4）

#### お題4: Railway Oriented Programming

**目的**: パイプライン設計と2レールモデルを習得する

**仕様**:
- 入力: `{ name: string, email: string }`
- 処理: バリデーション → 重複チェック（非同期） → ユーザー作成 → ウェルカムメール送信
- 各ステップはResult型を返す関数として独立させる
- パイプラインで合成する

**習得パターン**:
- neverthrow: `andThen()` チェーン + `ResultAsync`
- byethrow: `Result.pipe()` + `Result.andThen()` + `Result.andThrough()`
- fp-ts: `pipe()` + `TE.chain()` + `TE.chainFirst()`

**テスト観点**:
- 全ステップ成功でユーザー作成
- バリデーション失敗で早期終了
- 重複チェック失敗で早期終了（DBは呼ばれない）
- 各ステップが独立してテスト可能

---

#### お題5: エラー型のUnion設計

**目的**: Discriminated Unionによるエラー型設計とts-patternによる網羅的ハンドリングを習得する

**仕様**:
- エラー型: `ValidationError | NotFoundError | DuplicateError | DatabaseError`
- 各エラーに `_tag` フィールドを持たせる
- コール側でts-patternを使ったパターンマッチング

**習得パターン**:
```typescript
type AppError =
  | { _tag: "ValidationError"; message: string; field: string }
  | { _tag: "NotFoundError"; id: string }
  | { _tag: "DuplicateError"; field: string }
  | { _tag: "DatabaseError"; cause: unknown }
```

**テスト観点**:
- 全エラー種別のマッチングが網羅されている（ts-patternのexhaustiveで検証）
- 新しいエラー追加時にコンパイルエラーになる

---

#### お題6: バリデーターアレイパターン

**目的**: バリデーション関数を配列で管理し、全エラーを収集するパターンを習得する

**仕様**:
- バリデーター型: `(input: T) => Result<T, ValidationError>`
- バリデーターを配列に並べる
- 全バリデーターを実行し、失敗を全て収集（Short-circuitしない）
- `collect` / `sequence` / `combine` を使う

**習得API**:
- neverthrow: `combine()`, `combineWithAllErrors()`
- byethrow: `Result.collect()`, `Result.sequence()`
- fp-ts: `A.sequence()`, `E.sequenceArray()`, `AP.sequenceT()`

**テスト観点**:
- 全バリデーション成功で単一成功Result
- 複数バリデーション失敗で全エラーが収集される
- バリデーター追加が配列への追記だけで完結する

---

#### お題7: Adapter層で副作用を分離

**目的**: 純粋なバリデーション/ドメイン関数と副作用（DB/外部API）をAdapter層で分離する設計を習得する

**仕様**:
- 純粋層: 入力バリデーション、ビジネスルール（副作用なし）
- Adapter層: DBアクセス、外部APIコール（副作用）
- Usecase: 純粋層とAdapter層を合成するオーケストレーター

**テスト観点**:
- 純粋層はモックなしでテスト可能
- Adapter層はモックで差し替え可能
- Usecaseはモック済みAdapterで統合テスト

---

### Phase 3：ドメインモデリング（Week 5-6）

#### お題8: Branded型（Nominal型）

**目的**: プリミティブ型をブランド化してドメイン語彙を型で表現することを習得する

**仕様**:
```typescript
type UserId = string & { readonly _brand: "UserId" }
type Email = string & { readonly _brand: "Email" }
type Amount = number & { readonly _brand: "Amount" }
```
- スマートコンストラクタでバリデーションと型生成を一体化
- `UserId` と `AccountId` を混同するとコンパイルエラー

**テスト観点**:
- 正常値でBranded型が生成される
- 不正値でエラーResultが返る
- 異なるBranded型の混同がコンパイルエラーになる（型テスト）

---

#### お題9: ステートマシン設計

**目的**: ドメインオブジェクトの状態遷移を型で表現し、不正な遷移をコンパイル時に防ぐことを習得する

**仕様**: 銀行口座の状態遷移
```typescript
type BankAccount =
  | { _state: "Active"; balance: Amount }
  | { _state: "Frozen"; balance: Amount; reason: string }
  | { _state: "Closed" }

// Active → Frozen: freeze(account: Active, reason: string): Result<Frozen, never>
// Frozen → Active: unfreeze(account: Frozen): Result<Active, never>
// Active → Closed: close(account: Active): Result<Closed, FundsRemainingError>
// Closed への入金は型レベルで不可能
```

**テスト観点**:
- 各遷移関数が正しい状態を返す
- 残高ありでCloseしようとするとエラー

---

#### お題10: 部分適用でDI

**目的**: 高階関数による依存注入とWorkflow設計を習得する

**仕様**:
```typescript
// 依存関係を先に受け取り、Workflowを返す
type CreateUserWorkflow = (deps: {
  findByEmail: (email: Email) => Promise<Result<User, NotFoundError>>
  save: (user: User) => Promise<Result<User, DatabaseError>>
}) => (input: CreateUserInput) => Promise<Result<User, AppError>>
```

**テスト観点**:
- 依存関係をモックで差し替えてテスト
- 実装を差し替えても型が保証される

---

### Phase 4：実プロジェクト統合（Week 7-8）

#### お題11: usecaseをROPで書き直す

既存の `src/usecase/` 配下のusecaseを、Phase 1-3で学んだパターンで書き直す。

**対象**:
- `createUser` → Branded型 + ROPパイプライン
- `deposit` → ステートマシン + ROPパイプライン
- `withdraw` → エラーUnion型 + バリデーターアレイ

---

#### お題12: repository層にResult型を適用

既存の `src/repository/` 配下のリポジトリを書き直す。

**目的**: 現在throwしているDBエラーをResult型に変換する

---

#### お題13: CLIエラーハンドリングを統一

既存の `src/index.ts` のエラーハンドリングを統一する。

**目的**: `AppError` のUnion型に対してts-patternで網羅的にハンドリングする

---

## 使用ライブラリ

| ライブラリ | 用途 |
|-----------|------|
| `neverthrow` | 既存実装（基準） |
| `@praha/byethrow` | 比較実装 |
| `fp-ts` | 比較実装（高度な関数型） |
| `ts-pattern` | パターンマッチング |
| `bun:test` | テストランナー（既存） |

## テストコードの方針

- **What を書く**: 振る舞いの検証（「〜のとき〜を返す」）
- **3実装を同一テストで検証**: インターフェースを統一して同じテストを通す
- **純粋関数はモックなし**: 副作用のない関数はそのままテスト
- **副作用は型でモック**: Adapter層の依存関係は型で差し替え

```typescript
// 3実装を同一テストで検証する例
import { validate as validateNeverthrow } from "./neverthrow"
import { validate as validateByethrow } from "./byethrow"
import { validate as validateFpts } from "./fp-ts"

const implementations = [
  { name: "neverthrow", validate: validateNeverthrow },
  { name: "byethrow", validate: validateByethrow },
  { name: "fp-ts", validate: validateFpts },
]

for (const { name, validate } of implementations) {
  describe(name, () => {
    it("3文字以上で成功する", () => { ... })
    it("2文字以下でValidationErrorを返す", () => { ... })
  })
}
```
