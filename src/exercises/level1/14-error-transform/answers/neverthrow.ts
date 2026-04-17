import { err, type Result } from "neverthrow";

type InternalError = {
  code: string;
  detail: string;
};

type HttpError = {
  statusCode: number;
  message: string;
};

const makeError = (error: InternalError): Result<never, InternalError> => err(error);

export const toHttpError = (error: InternalError): Result<never, HttpError> =>
  makeError(error).mapErr((e) => {
    const statusCode =
      e.code === "NOT_FOUND" ? 404 : e.code === "UNAUTHORIZED" ? 401 : 500;
    return { statusCode, message: e.detail };
  });

export const toUserFacingMessage = (error: InternalError): Result<never, string> =>
  makeError(error).mapErr((e) => `エラーが発生しました: ${e.detail}`);
