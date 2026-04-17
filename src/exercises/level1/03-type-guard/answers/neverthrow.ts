import { type Result } from "neverthrow";

export const getStatus = (result: Result<unknown, unknown>): "ok" | "err" =>
  result.isOk() ? "ok" : "err";

export const doubleIfOk = (result: Result<number, number>): number => {
  if (result.isOk()) return result.value * 2;
  return result.error;
};

export const countResults = (
  results: Result<unknown, unknown>[],
): { ok: number; err: number } => ({
  ok: results.filter((r) => r.isOk()).length,
  err: results.filter((r) => r.isErr()).length,
});
