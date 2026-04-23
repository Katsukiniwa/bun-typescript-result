import { err, ok, type Result } from "neverthrow";

type ProcessedInput = {
  name: string;
  age: number;
};

/**
 * 生入力データを処理して検証済みオブジェクトを返す
 *
 * 処理ステップ:
 * 1. rawName をトリム・大文字化（map）→ 空文字ならErr（andThen）
 * 2. rawAge を数値に変換（andThen）→ 0以上でないならErr（andThen）
 * 3. 成功なら { name, age } を返す
 *
 * @hint map() は変換（失敗しない）、andThen() は検証（失敗する可能性がある）
 */
export const processInput = (input: {
  rawName: string;
  rawAge: string;
}): Result<ProcessedInput, string> => {
  // TODO: 以下のステップを map と andThen で組み合わせて実装してください
  // ステップ1: ok(input.rawName).map(s => s.trim().toUpperCase()) でトリム・大文字化
  // ステップ2: andThen で空文字チェック
  // ステップ3: andThen で年齢を数値に変換（NaNのときErr）
  // ステップ4: andThen で年齢が0以上かチェック
  // ステップ5: map で { name, age } を作る
  return ok(input.rawName)
    .map(s => s.trim().toUpperCase())
    .andThen(s => s.length !== 0 ? ok(s) : err(""))
    .andThen(name => {
      const age = Number(input.rawAge);
      if (Number.isNaN(age)) return err("age は数値にしてください");
      if (age < 0) return err("age は0以上にしてください");
      return ok({ name, age });
    })
};
