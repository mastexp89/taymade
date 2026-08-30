// Runs a real local Postgres from Node (no Docker / no system install).
// Keeps running in the background; the app connects on localhost:5433.
import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";

const pg = new EmbeddedPostgres({
  databaseDir: "./.pgdata",
  user: "taymade",
  password: "taymade",
  port: 5433,
  persistent: true,
});

if (!existsSync("./.pgdata")) {
  console.log("Initialising Postgres data dir (first run — downloading binaries if needed)...");
  await pg.initialise();
}
await pg.start();
try {
  await pg.createDatabase("taymade");
  console.log("Created database 'taymade'.");
} catch {
  console.log("Database 'taymade' already exists.");
}
console.log("PG_READY — Postgres on localhost:5433 (db: taymade)");

const shutdown = async () => {
  try { await pg.stop(); } catch {}
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
await new Promise(() => {}); // keep alive
