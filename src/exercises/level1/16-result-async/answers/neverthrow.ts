import { ResultAsync } from "neverthrow";
import { userApi } from "../neverthrow";

type User = { id: number; name: string; email: string };
type ApiError = { type: "NotFound" | "NetworkError"; message: string };

export const fetchUser = (id: number): ResultAsync<User, ApiError> =>
  ResultAsync.fromPromise(userApi.getUser(id), (e) => ({
    type: "NetworkError" as const,
    message: String(e),
  }));

export const fetchUserName = (id: number): ResultAsync<string, ApiError> =>
  fetchUser(id).map((user) => user.name);

export const fetchUserWithRole = (
  id: number,
): ResultAsync<{ user: User; role: string }, ApiError> =>
  fetchUser(id).andThen((user) =>
    ResultAsync.fromSafePromise(
      userApi.getRole(user.id).then((role) => ({ user, role })),
    ),
  );
