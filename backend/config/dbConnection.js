//connect from here to db
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
    // DB_* names avoid clashing with OS variables like USER / HOST
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    // RDS enforces TLS-capable connections; enable when DB_SSL=true
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
})

export default db