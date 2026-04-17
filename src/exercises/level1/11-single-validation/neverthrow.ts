import { err, ok, type Result } from "neverthrow";

/** バリデーションエラーの型 */
type ValidationError = {
  field: string;
  message: string;
};

/**
 * 名前のバリデーション（3文字以上）
 * @hint 条件を満たさない場合は err({ field: "name", message: "..." }) を返す
 */
export const validateName = (name: string): Result<string, ValidationError> => {
  // TODO: 空文字のとき、または3文字未満のとき err() を返し、それ以外は ok(name) を返してください
  throw new Error("TODO: ok() と err() を使って実装してください");
};

/**
 * メールアドレスのバリデーション（@を含む）
 * @hint "@" が含まれているかチェックしてください
 */
export const validateEmail = (email: string): Result<string, ValidationError> => {
  // TODO: email に "@" が含まれていない、または空文字のとき err() を返してください
  throw new Error("TODO: ok() と err() を使って実装してください");
};

/**
 * 年齢のバリデーション（0以上150以下）
 */
export const validateAge = (age: number): Result<number, ValidationError> => {
  // TODO: 0未満または150より大きいとき err() を返してください
  throw new Error("TODO: ok() と err() を使って実装してください");
};
