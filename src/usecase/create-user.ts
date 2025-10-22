import { err, ok, type Result } from "neverthrow";
import { User } from "../domain/user";
import { database, users } from "../repository";

export const createUser = (name: string | undefined): Result<User, string> => {
  if (!name || name.trim().length === 0) {
    return err("name must not be empty");
  }
  if (name.trim().length < 3) {
    return err("Name must be at least 3 characters");
  }
  database.nextUserId += 1;
  const u = new User(database.nextUserId, name.trim(), `${name.trim().toLowerCase()}@example.com`);
  users.set(u.id, u);

  return ok(u);
};
