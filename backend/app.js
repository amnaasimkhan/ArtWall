import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./config/dbConnection.js";
import auth_route from "./routes/auth_route.js";
import frame_route from "./routes/frame_route.js";
import style_route from "./routes/style_route.js";
import artist_route from "./routes/artist_route.js";
import artwork_route from "./routes/artwork_route.js";
import cart_route from "./routes/cart_route.js";
import variant_route from "./routes/variant_route.js";
import user_route from "./routes/user_route.js";
import order_route from "./routes/order_route.js";
import gallery_route from "./routes/gallery_route.js";
import checkoutRoute from "./routes/checkout.js";
import admin_route from './routes/admin_route.js'
import size_route from './routes/size_route.js'

const app = express();

app.use(express.json())

// In production the browser talks to the same origin (Nginx proxies /api), so CORS
// only matters for local dev. The allowed origin comes from the environment.
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true                
}));

// Liveness probe: process is up (used by Docker healthcheck)
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// Readiness probe: can we reach the database?
app.get("/health/db", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.status(200).json({ status: "ok", db: "reachable" });
  } catch (err) {
    res.status(503).json({ status: "error", db: "unreachable" });
  }
});

export const connect = async () => {
  try {
    const [rows] = await db.query("SELECT NOW()");
    console.log(" Database connected successfully!", rows);
  } catch (err) {
    console.error(" Database connection failed:", err.message);
  }
};

app.use('/images', express.static('public/artworks'));

app.use("/auth", auth_route)
app.use("/frame", frame_route)
app.use("/artist", artist_route)
app.use("/style", style_route)
app.use("/artwork", artwork_route)
app.use("/cart", cart_route)
app.use("/variant", variant_route)
app.use("/user", user_route)
app.use("/order", order_route)
app.use("/gallery", gallery_route)
app.use("/checkout", checkoutRoute);
app.use("/admin", admin_route)
app.use("/size", size_route)

export default app;
