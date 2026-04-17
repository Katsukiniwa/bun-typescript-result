import { Result } from "@praha/byethrow";

type User = { id: string; name: string };
type AppError = { type: "NotFoundError"; id: string } | { type: "DatabaseError"; message: string };

const mockDb: Record<string, User> = {
  "1": { id: "1", name: "Alice" },
  "2": { id: "2", name: "Bob" },
};

const fetchUserFn = Result.fn({
  try: async (id: string): Promise<User> => {
    const user = mockDb[id];
    if (!user) throw { type: "NotFoundError", id };
    return user;
  },
  catch: (e: unknown): AppError => {
    if (typeof e === "object" && e !== null && "type" in e) return e as AppError;
    return { type: "DatabaseError", message: String(e) };
  },
});

export const fetchUser = (id: string): Result.ResultAsync<User, AppError> => fetchUserFn(id);
