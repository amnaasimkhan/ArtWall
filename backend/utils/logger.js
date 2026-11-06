import db from "../config/dbConnection.js";

export const logAnalytics = async ({ req, action, artworkId = null }) => {
  try {
    const sessionId = req.headers["x-session-id"] || null; // optional guest session ID
    const userId = req.user ? req.user.id : null;

    await db.query(
      `INSERT INTO analytics (session_id, user_id, action, artwork_id) VALUES (?, ?, ?, ?)`,
      [sessionId, userId, action, artworkId]
    );
  } catch (err) {
    console.error("Analytics logging failed:", err);
  }
};
