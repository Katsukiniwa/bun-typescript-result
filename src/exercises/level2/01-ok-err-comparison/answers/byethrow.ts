import { Result } from "@praha/byethrow";

export const wrapValue = <T>(value: T): Result.ResultFor<T, Awaited<T>, never> =>
  Result.succeed(value);

export const wrapError = <E>(error: E): Result.ResultFor<E, never, Awaited<E>> =>
  Result.fail(error);
