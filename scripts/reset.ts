import { Database } from "bun:sqlite";
import { existsSync, rmSync } from "node:fs";
import { spawnSync } from "bun";

export const reset = (() => {
  const dbFile = "app.db";
  if (existsSync(dbFile)) {
    rmSync(dbFile)
  };
  new Database(dbFile);
  const result = spawnSync(["bun", "run", "./scripts/migrate.ts"], {
    stdout: "pipe",
    stderr: "pipe",
  });

  console.log("stdout:", new TextDecoder().decode(result.stdout));
})()
