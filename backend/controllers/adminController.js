import db from "../config/dbConnection.js";

export const getAdminDashboard = async (req, res) => {
    try {

        const [[artworks]] = await db.query(
            "SELECT COUNT(*) AS totalArtworks FROM artworks"
        );

        const [[artists]] = await db.query(
            "SELECT COUNT(*) AS totalArtists FROM artists"
        );

        const [[orders]] = await db.query(
            "SELECT COUNT(*) AS totalOrders FROM orders"
        );

        const [[pendingOrders]] = await db.query(
            "SELECT COUNT(*) AS pendingOrders FROM orders WHERE status = 'pending'"
        );


        const [salesRows] = await db.query(`
        SELECT 
                DATE_FORMAT(created_at, '%b') AS month,
                SUM(total_amount) AS sales
            FROM orders
            WHERE status IN ('paid', 'shipped')
            GROUP BY DATE_FORMAT(created_at, '%b'), YEAR(created_at), MONTH(created_at)
            ORDER BY MIN(created_at) DESC
            LIMIT 6;`
        );

          const [totalRevenueResult] = await db.query(`
            SELECT IFNULL(SUM(od.price * od.quantity), 0) AS totalRevenue
            FROM order_details od
            JOIN orders o ON od.order_id = o.order_id
            WHERE o.status IN ('paid', 'shipped')
        `);
         const totalRevenue = Number(totalRevenueResult[0].totalRevenue);
         
        const salesData = salesRows.reverse();

        const [categoryRows] = await db.query(`
            SELECT 
                s.name AS name,
                COUNT(DISTINCT o.order_id) AS value
            FROM styles s
            LEFT JOIN artworks a ON s.style_id = a.style_id
            LEFT JOIN order_details od ON od.variant_id = a.artwork_id
            LEFT JOIN orders o ON o.order_id = od.order_id 
            WHERE o.status IN ('paid', 'shipped')
            GROUP BY s.style_id;
        `);


        return res.json({
            stats: {
                totalArtworks: artworks.totalArtworks,
                totalArtists: artists.totalArtists,
                totalOrders: orders.totalOrders,
                pendingOrders: pendingOrders.pendingOrders,
                totalRevenue: totalRevenue
            },
            salesData,
            categoryData: categoryRows
        });

    } catch (err) {
        console.error("error:", err);
        return res.status(500).json({ error: "dashboard fetch failed" });
    }
};
