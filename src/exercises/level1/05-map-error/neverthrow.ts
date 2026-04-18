import { type Result } from "neverthrow";

/**
 * エラーメッセージにprefixを追加する
 * @hint result.mapErr(e => prefix + e) の形で使います
 */
export const addErrorPrefix = (
  result: Result<number, string>,
  prefix: string,
): Result<number, string> => {
  return result.mapErr(e => prefix + e)
};

/**
 * エラー文字列をHTTPステータスコードに変換する
 * @hint .mapErr() の中でswitch/ifを使いましょう
 */
export const toErrorCode = (result: Result<string, string>): Result<string, number> => {
  if(result.isOk()) {
    return result.mapErr(e => Number(e))
  } else {
    return result.mapErr(e => {
      if (e === 'not_found') {
        return 404
      } else if (e === 'unauthorized') {
        return 401
      } else {
        return 500
      }
    })
  }
};

/**
 * 文字列エラーを構造化エラーオブジェクトに変換する
 * @hint Date.now() でタイムスタンプを取得できます
 */
export const wrapInErrorObject = (
  result: Result<string, string>,
): Result<string, { message: string; timestamp: number }> => {
  return result.mapErr(e => ({ message: e, timestamp: Date.now() }));
};
