import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

type User = { id: string; name: string };
type AppError = { type: "NotFoundError"; id: string } | { type: "DatabaseError"; message: string };

const mockDb: Record<string, User> = {
  "1": { id: "1", name: "Alice" },
  "2": { id: "2", name: "Bob" },
};

export const fetchUser = (id: string): TE.TaskEither<AppError, User> =>
  TE.tryCatch(
    async () => {
      const user = mockDb[id];
      if (!user) throw { type: "NotFoundError", id } as AppError;
      return user;
    },
    (e): AppError =>
      typeof e === "object" && e !== null && "type" in e
        ? (e as AppError)
        : { type: "DatabaseError", message: String(e) },
  );

export const fetchUserMessage = (id: string): TE.TaskEither<AppError, string> =>
  pipe(
    fetchUser(id),
    TE.map((user) => `こんにちは、${user.name}さん！`),
  );
