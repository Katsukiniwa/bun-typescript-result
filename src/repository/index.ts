import { Database } from "bun:sqlite";

export abstract class BaseRepository {
  db: Database;

  constructor() {
    this.db = new Database("app.db");
  }
}
