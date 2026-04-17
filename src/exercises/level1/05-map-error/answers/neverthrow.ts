import { type Result } from "neverthrow";

export const addErrorPrefix = (
  result: Result<number, string>,
  prefix: string,
): Result<number, string> => result.mapErr((e) => `${prefix}${e}`);

export const toErrorCode = (result: Result<string, string>): Result<string, number> =>
  result.mapErr((e) => {
    if (e === "not_found") return 404;
    if (e === "unauthorized") return 401;
    return 500;
  });

export const wrapInErrorObject = (
  result: Result<string, string>,
): Result<string, { message: string; timestamp: number }> =>
  result.mapErr((e) => ({ message: e, timestamp: Date.now() }));
