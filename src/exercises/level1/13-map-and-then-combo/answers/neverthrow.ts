import { err, ok, type Result } from "neverthrow";

type ProcessedInput = {
  name: string;
  age: number;
};

export const processInput = (input: {
  rawName: string;
  rawAge: string;
}): Result<ProcessedInput, string> =>
  ok(input.rawName)
    .map((s) => s.trim().toUpperCase())
    .andThen((name) => (name.length === 0 ? err("name は空にできません") : ok(name)))
    .andThen((name) => {
      const age = Number(input.rawAge);
      if (Number.isNaN(age)) return err("age は数値にしてください");
      if (age < 0) return err("age は0以上にしてください");
      return ok({ name, age });
    });
