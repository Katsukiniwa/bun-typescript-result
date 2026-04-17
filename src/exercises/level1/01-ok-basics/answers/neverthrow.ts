import { ok, type Result } from "neverthrow";

export const wrapNumber = (n: number): Result<number, never> => ok(n);

export const wrapString = (s: string): Result<string, never> => ok(s);

export const wrapObject = (obj: {
  id: number;
  name: string;
}): Result<{ id: number; name: string }, never> => ok(obj);
