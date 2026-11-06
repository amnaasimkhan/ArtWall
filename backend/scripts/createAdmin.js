// Creates the admin account if it does not exist yet: `npm run db:admin`
// Reads ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD from the environment
// (on AWS they come from SSM Parameter Store; locally from .env), so no password is
// ever hard-coded. Safe to run on every deploy and on several hosts at once.
import "dotenv/config";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";

const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.log("ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD not set - skipping admin creation.");
  process.exit(0);
}

const conn = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

try {
  const [rows] = await conn.query("SELECT user_id FROM users WHERE name = ? AND role = 'admin'", [ADMIN_NAME]);
  if (rows.length) {
    console.log(`Admin "${ADMIN_NAME}" already exists.`);
  } else {
    const hash = bcrypt.hashSync(ADMIN_PASSWORD, 10);
    await conn.query(
      "INSERT INTO users (`name`, `email`, `role`, `password`) VALUES (?, ?, 'admin', ?)",
      [ADMIN_NAME, ADMIN_EMAIL, hash]
    );
    console.log(`Admin "${ADMIN_NAME}" created.`);
  }
} catch (err) {
  // Another host may have created it a moment earlier (unique email) - that's fine.
  if (err.code === "ER_DUP_ENTRY") console.log("Admin already exists.");
  else throw err;
} finally {
  await conn.end();
}
