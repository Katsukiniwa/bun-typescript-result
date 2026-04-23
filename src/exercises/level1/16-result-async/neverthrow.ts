import { ok, Result, ResultAsync } from "neverthrow";

type User = { id: number; name: string; email: string };
type ApiError = { type: "NotFound" | "NetworkError"; message: string };

// APIモック（外部APIの代わり）
export const userApi = {
  getUser: async (id: number): Promise<User> => {
    if (id <= 0) throw new Error("IDは1以上を指定してください");
    if (id === 999) throw new Error("ユーザーが見つかりません");
    return { id, name: `User${id}`, email: `user${id}@example.com` };
  },
  getRole: async (userId: number): Promise<string> => {
    if (userId === 1) return "admin";
    return "member";
  },
};

/**
 * ユーザーを取得する（失敗する可能性のある非同期処理）
 * @hint ResultAsync.fromPromise(promise, e => エラーマッパー) を使います
 * @hint getUser が throw した場合は type: "NetworkError" のエラーに変換してください
 */
export const fetchUser = (id: number): ResultAsync<User, ApiError> => {
  const result = ResultAsync.fromPromise(
    userApi.getUser(id),
    (e) => ({ type: "NetworkError" as const, message: String(e) })  // エラーマッパー
  );
  return result;
};

/**
 * ユーザー名だけ取得する
 * @hint fetchUser(id).map(user => user.name) のように .map() で変換できます
 */
export const fetchUserName = (id: number): ResultAsync<string, ApiError> => {
  return ResultAsync.fromPromise(
    userApi.getUser(id),
    (e) => ({ type: "NetworkError" as const, message: String(e) })  // エラーマッパー
  ).andThen(r => {
    return ok(r.name)
  })
};

/**
 * ユーザー情報にロールを付与する（2つの非同期処理をチェーン）
 * @hint fetchUser(id).andThen(user => ...) で ResultAsync を繋げます
 * @hint getRole は失敗しない Promise なので ResultAsync.fromSafePromise() を使えます
 */
export const fetchUserWithRole = (
  id: number,
): ResultAsync<{ user: User; role: string }, ApiError> => {
  return fetchUser(id).andThen((user) =>
    ResultAsync.fromSafePromise(
      userApi.getRole(user.id).then((role) => ({ user, role })),
    ),
  );
};
