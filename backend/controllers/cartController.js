//so cart is generated once user is created. and its singleton so it cant be made again (user_id unique constraint)
//cart item is generated when user hits add to cart button from anywhere
//when cart item is pushed to order, it is deleted from cart (delete or filter out from display?) (orderMade==true)
// plus minus buttons on UI plus minus the quantity of cart item
//getCart to display cart items

// addItemToCart – create cart_item when user clicks “Add to Cart”.
// updateItemQuantity – increment/decrement via plus/minus buttons. if decrement makes it zero then remove from cart
// getCart – fetch all items in user’s cart.

import db from "../config/dbConnection.js";

export const addToCart = async (req, res) => {

    //get user id from context
    //get cart id from user id
    //insert row into cart items where cart id 

    try {

        const [row] = await db.query(
            "SELECT cart_id FROM carts WHERE user_id = ?", [req.user.id]
        );
        if (!row.length) {
            return res.status(409).json({ message: "Cart doesn't exist!" })
        }

        const cart_id = row[0].cart_id;
        const values = [
            cart_id,
            req.body.variant_id,
            req.body.quantity,
        ]
        await db.query(
            "INSERT INTO cart_items (`cart_id`,`variant_id`, `quantity`) VALUES (?,?,?)", values
        )

        return res.status(200).json({ message: "Item added successfully" });

    } catch (error) {
        console.error("Error adding:", error);
        return res.status(500).json(error);
    }
}

export const updateItemQuantity = async (req, res) => {
    try {
        const sign = req.body.sign === "+" ? "+" : "-";

        await db.query(
            `UPDATE cart_items SET quantity = quantity ${sign} 1 WHERE cart_item_id = ?`,
            [req.body.cart_item_id]
        );

        // Remove item if quantity hits 0
        await db.query(
            "DELETE FROM cart_items WHERE cart_item_id = ? AND quantity <= 0",
            [req.body.cart_item_id]
        );

        return res.status(200).json({ message: "Quantity updated successfully" });

    } catch (error) {
        console.error("Error updating quantity:", error);
        return res.status(500).json(error);
    }
};


export const fetchCart = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT 
          ci.cart_item_id,
          ci.quantity,
          av.variant_id,
          av.price,
          s.name AS size,
          f.name AS frame,
          a.artwork_id,
          a.title AS artwork_title,
          a.first_image_url AS artwork_image
       FROM carts c
       JOIN cart_items ci ON c.cart_id = ci.cart_id
       JOIN artwork_variants av ON ci.variant_id = av.variant_id
       JOIN artworks a ON av.artwork_id = a.artwork_id
       JOIN sizes s ON av.size_id = s.size_id
       LEFT JOIN frames f ON av.frame_id = f.frame_id
       WHERE c.user_id = ?`,
            [req.user.id]
        );

        return res.status(200).json(rows);

    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json(error);
    }
};




// CREATE TABLE
//     carts(
//         cart_id INT AUTO_INCREMENT PRIMARY KEY,
//         user_id INT UNIQUE NOT NULL,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE --customer gaya to cart bhi gyi
//     );

// CREATE TABLE
//     cart_items(
//         cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
//         cart_id INT NOT NULL,
//         variant_id INT NOT NULL,
//         quantity INT NOT NULL DEFAULT 1,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         FOREIGN KEY (variant_id) REFERENCES artwork_variants (variant_id) ON DELETE RESTRICT,  --if cart-item is deleted variant still exists (?)
//         FOREIGN KEY (cart_id) REFERENCES carts (cart_id) ON DELETE CASCADE  --no cart item without cart
//     );