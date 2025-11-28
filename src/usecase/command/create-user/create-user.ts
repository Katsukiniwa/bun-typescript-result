import { err, ok, type Result } from "neverthrow";
import { User } from "../../../domain/user";
import { UserRepository } from "../../../repository/user";

export const createUser = (name: string | undefined): Result<User, string> => {
  if (!name || name.trim().length === 0) {
    return err("name must not be empty");
  }
  if (name.trim().length < 3) {
    return err("Name must be at least 3 characters");
  }
  const u = new User(0, name.trim(), `${name.trim().toLowerCase()}@example.com`);
  new UserRepository().create(u);

  return ok(u);
};
