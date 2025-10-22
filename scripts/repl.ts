import { Database } from "bun:sqlite";
import readline from "node:readline";

const db = new Database("app.db");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "sqlite> ",
});

console.log("SQLite REPL. 'exit'で終了");

rl.prompt();

rl.on("line", (line) => {
  const trimmed = line.trim();
  if (trimmed === "exit") {
    rl.close();
    return;
  }

  try {
    if (/^\s*select/i.test(trimmed)) {
      const rows = db.query(trimmed).all();
      console.table(rows);
    } else {
      db.run(trimmed);
      console.log("OK");
    }
  } catch (err) {
    console.error("Error:", err);
  }

  rl.prompt();
});

rl.on("close", () => {
  console.log("Bye!");
  db.close();
  process.exit(0);
});
