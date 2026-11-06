// One-off schema loader: `npm run db:init` (or `docker compose exec app npm run db:init`).
// Uses the same DB_* environment variables as the app, so no credentials are typed by hand.
// The schema uses CREATE TABLE IF NOT EXISTS, so running it twice is harmless.
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const here = path.dirname(fileURLToPath(import.meta.url));
const schema = fs.readFileSync(path.join(here, "../migrations/dbSchema.sql"), "utf8");

const conn = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

try {
  await conn.query(schema);
  const [tables] = await conn.query("SHOW TABLES");
  console.log(`Schema applied. ${tables.length} tables present.`);
} finally {
  await conn.end();
}
