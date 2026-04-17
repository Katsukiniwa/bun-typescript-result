import { type ResultAsync, errAsync, fromPromise } from "neverthrow";

type User = { id: string; name: string };
type AppError = { type: "NotFoundError"; id: string } | { type: "DatabaseError"; message: string };

const mockDb: Record<string, User> = {
  "1": { id: "1", name: "Alice" },
  "2": { id: "2", name: "Bob" },
};

export const fetchUser = (id: string): ResultAsync<User, AppError> => {
  const user = mockDb[id];
  if (!user) return errAsync({ type: "NotFoundError", id });
  return fromPromise(Promise.resolve(user), (e) => ({
    type: "DatabaseError",
    message: String(e),
  }));
};
