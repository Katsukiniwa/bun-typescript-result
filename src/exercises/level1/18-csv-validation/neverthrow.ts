import { type Result, err, ok } from "neverthrow";

export type CsvRow = {
  lineNumber: number;
  name: string;
  email: string;
  age: string; // CSVは全て文字列として渡される
};

export type ValidationError = {
  lineNumber: number;
  field: string;
  message: string;
};

export type ValidRow = {
  name: string;
  email: string;
  age: number;
};

// 各フィールドのバリデーション（実装済み）
export const validateName = (row: CsvRow): Result<string, ValidationError> => {
  if (row.name.trim().length === 0)
    return err({ lineNumber: row.lineNumber, field: "name", message: "名前は必須です" });
  if (row.name.trim().length < 2)
    return err({ lineNumber: row.lineNumber, field: "name", message: "名前は2文字以上です" });
  return ok(row.name.trim());
};

export const validateEmail = (row: CsvRow): Result<string, ValidationError> => {
  if (!row.email.includes("@"))
    return err({
      lineNumber: row.lineNumber,
      field: "email",
      message: "メールアドレスの形式が不正です",
    });
  return ok(row.email.trim());
};

export const validateAge = (row: CsvRow): Result<number, ValidationError> => {
  const age = parseInt(row.age, 10);
  if (Number.isNaN(age))
    return err({ lineNumber: row.lineNumber, field: "age", message: "年齢は数値で入力してください" });
  if (age < 0 || age > 150)
    return err({
      lineNumber: row.lineNumber,
      field: "age",
      message: "年齢は0〜150の範囲で入力してください",
    });
  return ok(age);
};

/**
 * 1行を全フィールドバリデーションし、全エラーを収集する
 * @hint Result.combineWithAllErrors([...]) を使うと全バリデーション結果のエラーをまとめられます
 * @hint 成功時は [name, email, age] のタプルが返るので .map() で ValidRow に変換してください
 */
export const validateRow = (row: CsvRow): Result<ValidRow, ValidationError[]> => {
  throw new Error("TODO: Result.combineWithAllErrors() を使って実装してください");
};

/**
 * CSV全行を処理して成功行とエラー行を分類する
 * @hint 各行に validateRow を適用して、isOk() / isErr() で振り分けてください
 */
export const processCsv = (rows: CsvRow[]): {
  successes: ValidRow[];
  errors: { lineNumber: number; errors: ValidationError[] }[];
} => {
  throw new Error("TODO: 実装してください");
};
