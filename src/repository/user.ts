import { User } from "../domain/user";
import { BaseRepository } from ".";

export class UserRepository extends BaseRepository {
  public getUsers(): User[] {
    return this.db.query("SELECT * FROM users").values().map(raw => new User(
      raw[0] as number,
      raw[1] as string,
      raw[2] as string,
    ));
  }

  public create(user: User): User {
    const newUser = this
      .db
      .query(
        "INSERT INTO users (name, email) VALUES ($name, $email) RETURNING *"
      )
      .as(User)
      .get(user.name, user.email)
    if (!newUser) {
      throw new Error("Failed to create user");
    }
    console.log(`User created: ${JSON.stringify(newUser)}`);

    return newUser;
  }
}
