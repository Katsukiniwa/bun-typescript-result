import { Database } from "bun:sqlite";
import { faker } from '@faker-js/faker';

export const seed = () => {
  console.log("Seeding database...");
  const db = new Database("app.db");

  db.query('DELETE FROM users');
  const insert = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
  db.run("BEGIN");
  for (let i = 0; i < 1000; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    insert.run(name, email);
  }
  db.run("COMMIT");
  console.log("Seeding completed.");
}

seed();
