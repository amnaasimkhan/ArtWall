import db from "../config/dbConnection.js";
import bcrypt from "bcrypt";

//admin 
export const getUserInfo = async (req, res) => {
    try {

        const [users] = await db.query(
            `SELECT user_id, email, name, role, profile_image, created_at 
             FROM users`
        );

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found", users: [] });
        }
        return res.status(200).json({ message: "Users: ", users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//for user to see their own profile and their order history
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;


        const [profile] = await db.query(
            `SELECT user_id, email, name, role, profile_image, created_at FROM users WHERE user_id = ?`,
            [userId]
        );

        if (profile.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const [orders] = await db.query(
            `SELECT 
                o.order_id,
                o.total_amount,
                o.status,
                o.created_at AS order_created_at,
                od.order_detail_id,
                od.quantity,
                od.price AS variant_price,
                av.variant_id,
                a.title AS artwork_title,
                a.first_image_URL,
                s.name AS size_name,
                f.name AS frame_name
            FROM orders o
            JOIN order_details od ON o.order_id = od.order_id
            JOIN artwork_variants av ON od.variant_id = av.variant_id
            JOIN artworks a ON av.artwork_id = a.artwork_id
            JOIN sizes s ON av.size_id = s.size_id
            LEFT JOIN frames f ON av.frame_id = f.frame_id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC, od.order_detail_id;`,
            [userId]
        );

        res.json({
            ...profile[0],
            order_history: orders
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// export const updateProfile = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { name, email, password, profile_image } = req.body;

//         let updateFields = [];
//         let values = [];

//         if (name) {
//             updateFields.push("name = ?");
//             values.push(name);
//         }
//         if (email) {
//             updateFields.push("email = ?");
//             values.push(email);
//         }
//         if (profile_image) {
//             updateFields.push("profile_image = ?");
//             values.push(profile_image);
//         }
//         if (password) {
//             const hashed = await bcrypt.hash(password, 10);
//             updateFields.push("password = ?");
//             values.push(hashed);
//         }

//         if (updateFields.length === 0) {
//             return res.status(400).json({ message: "No fields to update" });
//         }

//         values.push(userId);

//         await db.query(
//             `UPDATE users SET ${updateFields.join(", ")} WHERE user_id = ?`,
//             values
//         );

//         res.json({ message: "Profile updated successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

export const deleteAccount = async (req, res) => {
    try {
        const userId = req.params.id;

        await db.query(`DELETE FROM users WHERE user_id = ?`, [userId]);

        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const saveShippingAddress = async (req, res) => {
    try {
        console.log("Received shipping data:", req.body);
        console.log("User from token:", req.user);

        const user_id = req.user?.id;
        if (!user_id) {
            return res.status(400).json({ error: "User ID missing from token" });
        }

        const {
            full_name,
            phone,
            street_address,
            city,
            province,
            postal_code,
            country
        } = req.body;

        // Validate required fields
        if (!full_name || !phone || !street_address || !city || !country) {
            return res.status(409).json({ error: "Missing required fields" });
        }

        const sql = `
      INSERT INTO shipping_addresses 
      (user_id, full_name, phone, street_address, city, province, postal_code, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

        await db.query(sql, [
            user_id,
            full_name,
            phone,
            street_address,
            city,
            province,
            postal_code,
            country
        ]);

        return res.json({ message: "Shipping address saved" });

    } catch (err) {
        console.log(err);
        return res.status(409).json({ message: err.message });
    }

};

