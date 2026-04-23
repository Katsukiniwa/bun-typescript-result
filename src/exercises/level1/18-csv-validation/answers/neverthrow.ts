import { Result } from "neverthrow";
import {
  type CsvRow,
  type ValidRow,
  type ValidationError,
  validateAge,
  validateEmail,
  validateName,
} from "../neverthrow";

export const validateRow = (row: CsvRow): Result<ValidRow, ValidationError[]> =>
  Result.combineWithAllErrors([validateName(row), validateEmail(row), validateAge(row)]).map(
    ([name, email, age]) => ({ name, email, age }),
  );

export const processCsv = (rows: CsvRow[]) => {
  const successes: ValidRow[] = [];
  const errors: { lineNumber: number; errors: ValidationError[] }[] = [];

  for (const row of rows) {
    const result = validateRow(row);
    if (result.isOk()) {
      successes.push(result.value);
    } else {
      errors.push({ lineNumber: row.lineNumber, errors: result.error });
    }
  }

  return { successes, errors };
};
