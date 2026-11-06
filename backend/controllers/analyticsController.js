import db from "../config/dbConnection.js";


export const getRevenueStats = async (req, res) => {
    try {
        const [totalRevenueResult] = await db.query(`
            SELECT IFNULL(SUM(od.price * od.quantity), 0) AS totalRevenue
            FROM order_details od
            JOIN orders o ON od.order_id = o.order_id
            WHERE status IN ('paid', 'shipped');
        `);

        const [totalOrdersResult] = await db.query(`
            SELECT COUNT(*) AS totalOrders
            FROM orders
            WHERE status IN ('paid', 'shipped');
        `);

        const totalRevenue = totalRevenueResult[0].totalRevenue;
        const totalOrders = totalOrdersResult[0].totalOrders;

        const AOV = totalOrders ? totalRevenue / totalOrders : 0;

        res.json({
            revenueStats: [
                { totalRevenue, totalOrders, AOV }
            ]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getOrdersPerMonth = async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT MONTH(created_at) AS month, COUNT(*) AS orders
            FROM orders
            GROUP BY MONTH(created_at)
            ORDER BY month
        `);
        res.json({ ordersPerMonth: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getBestsellingArtworks = async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT 
                a.artwork_id,
                a.title,
                SUM(od.quantity) AS totalSold
            FROM order_details od
            JOIN artwork_variants av ON od.variant_id = av.variant_id
            JOIN artworks a ON av.artwork_id = a.artwork_id
            GROUP BY a.artwork_id
            ORDER BY totalSold DESC
            LIMIT 10
        `);
        res.json({ bestsellingArtworks: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getBestsellingStyles = async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT 
                s.style_id, 
                s.name, 
                SUM(od.quantity) AS totalSold
            FROM orders o    
            JOIN order_details od ON o.order_id = od.order_id
            JOIN artwork_variants av ON od.variant_id = av.variant_id
            JOIN artworks a ON av.artwork_id = a.artwork_id
            JOIN styles s ON a.style_id = s.style_id
            WHERE o.status IN ('paid', 'shipped')
            GROUP BY s.style_id
            ORDER BY totalSold DESC
            LIMIT 10
        `);
        res.json({ bestsellingStyles: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getBestPerformingArtists = async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT
                ar.artist_id,
                ar.name,
                SUM(od.quantity * od.price) AS revenue
            FROM orders o
            JOIN order_details od ON o.order_id = od.order_id
            JOIN artwork_variants av ON od.variant_id = av.variant_id
            JOIN artworks a ON av.artwork_id = a.artwork_id
            JOIN artists ar ON a.artist_id = ar.artist_id
            WHERE o.status IN ('paid', 'shipped')
            GROUP BY ar.artist_id
            ORDER BY revenue DESC
            LIMIT 10;

        `);
        res.json({ bestPerformingArtists: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getVariantStats = async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT 
                av.size_id,
                s.name AS sizeName,
                av.frame_id,
                f.name AS frameName,
                SUM(od.quantity) AS totalSold
            FROM orders o
            JOIN order_details od ON o.order_id = od.order_id
            JOIN artwork_variants av ON od.variant_id = av.variant_id
            JOIN sizes s ON av.size_id = s.size_id
            JOIN frames f ON av.frame_id = f.frame_id
            WHERE o.status IN ('paid', 'shipped')
            GROUP BY av.size_id, av.frame_id
            ORDER BY totalSold DESC
        `);

        res.json({ variantStats: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
