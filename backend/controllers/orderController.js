import db from "../config/dbConnection.js";

// checkout – move items to orders and delete from cart 
export const checkout = async (req, res) => {
    try {
        const user_id = req.user.id;

        //find cart of said user
        const [cart_rows] = await db.query(
            "SELECT cart_id FROM carts WHERE user_id = ?",
            [user_id]
        );

        if (!cart_rows.length) {
            return res.status(409).json({ message: "Cart doesn't exist!" });
        }

        const cart_id = cart_rows[0].cart_id;

        //get variant info
        const [cart_items] = await db.query(
            `SELECT ci.variant_id, ci.quantity, av.price
       FROM cart_items ci
       JOIN artwork_variants av ON ci.variant_id = av.variant_id
       WHERE ci.cart_id = ?`,
            [cart_id]
        );

        if (!cart_items.length) {
            return res.status(409).json({ message: "Cart is empty!" });
        }

        //calculate total amount
        const total_amount = cart_items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        // Insert order
        const order_result = await db.query(
            "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
            [user_id, total_amount]
        );
        const order_id = order_result[0].insertId;

        //create order details on that order_id
        const order_details_values = cart_items.map(item => [
            order_id,
            item.variant_id,
            item.quantity,
            item.price
        ]);

        await db.query(
            "INSERT INTO order_details (order_id, variant_id, quantity, price) VALUES ?",
            [order_details_values]
        );

        //clear cart
        await db.query("DELETE FROM cart_items WHERE cart_id = ?", [cart_id]);

        return res.status(200).json({ message: "Checkout successful", order_id });

    } catch (error) {
        console.error("Error in checkout :", error);
        return res.status(500).json(error);
    }
};


// admin only
// to get all orders for dashboard
export const getOrders = async (req, res) => {
    try {
        const [orders] = await db.query(
            `SELECT o.order_id, o.user_id, u.name AS user_name, u.email AS user_email, 
              o.total_amount, o.status, o.created_at
            FROM orders o
            JOIN users u ON o.user_id = u.user_id
            ORDER BY o.created_at DESC`
        );

        return res.status(200).json({message: "here you go", orders});

    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json(error);
    }
};

// get order details for dashboard
export const getOrderById = async (req, res) => {
    try {
        const order_id = req.params.id;

        const [order_details] = await db.query(
            `SELECT od.order_detail_id, od.variant_id, od.quantity, od.price,
              av.artwork_id, a.title AS artwork_title, av.size_id, av.frame_id
            FROM order_details od
            JOIN artwork_variants av ON od.variant_id = av.variant_id
            JOIN artworks a ON av.artwork_id = a.artwork_id
            WHERE od.order_id = ?`,
            [order_id]
        );

        if (!order_details.length)
            return res.status(404).json({ message: "Order not found" });

        return res.status(200).json(order_details);

    } catch (error) {
        console.error("Error fetching order details:", error);
        return res.status(500).json(error);
    }
};

//update order status (pending, paid, shipped, cancelled)
export const updateOrderStatus = async (req, res) => {
    try {
        const order_id = req.params.id;
        const { status } = req.body;
        
        console.log(status)
        //input validation middleware moment
        const valid_status = ["pending", "paid", "shipped", "cancelled"];
        if (!valid_status.includes(status))
            return res.status(400).json({ message: "Invalid status" });
        
        const [result] = await db.query(
            "UPDATE orders SET status = ? WHERE order_id = ?",
            [status, order_id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Order not found" });

        return res.status(200).json({ message: "Order status updated successfully" });

    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json(error);
    }
};
