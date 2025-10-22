import { Database } from "bun:sqlite";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const db = new Database("app.db");

db.run(`
  CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const migrationsDir = path.resolve("migrations");
const files = readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"));

// 既に適用済みのファイル名を取得
const applied = new Set(
  db
    .query("SELECT name FROM migrations")
    .all()
    .map((row: unknown) => (row as { name: string }).name),
);

for (const file of files) {
  if (applied.has(file)) {
    console.log(`✅ Skipped: ${file}`);
    continue;
  }

  const sql = readFileSync(path.join(migrationsDir, file), "utf8");
  console.log(`🚀 Applying: ${file}`);
  db.run(sql);

  db.run("INSERT INTO migrations (name) VALUES (?)", [file]);
}

console.log("✅ All migrations applied!");
