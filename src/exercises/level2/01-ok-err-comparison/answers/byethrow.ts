import { Result } from "@praha/byethrow";

export const wrapValue = <T>(value: T): Result.Result<T, never> => Result.succeed(value);

export const wrapError = <E>(error: E): Result.Result<never, E> => Result.fail(error);
