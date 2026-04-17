import { err, ok, type Result } from "neverthrow";

export const wrapValue = <T>(value: T): Result<T, never> => ok(value);

export const wrapError = <E>(error: E): Result<never, E> => err(error);
