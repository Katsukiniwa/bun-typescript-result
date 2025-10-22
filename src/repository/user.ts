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
}
