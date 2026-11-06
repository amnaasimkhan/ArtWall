import db from "../config/dbConnection.js";

// List variants for a product detail page
export const getVariantsByArtwork = async (req, res) => {
    try {
        const [exists] = await db.query(
            "SELECT 1 FROM artworks WHERE artwork_id = ?",
            [req.params.id]
        );

        if (!exists.length) {
            return res.status(404).json({ message: "Variant not found." });
        }

        const [variants] = await db.query(
            `SELECT 
                av.variant_id,
                av.artwork_id,

                a.title AS artwork_title,
                a.first_image_URL,
                a.second_image_URL,
                a.price AS artwork_base_price,
                a.detail,

                ar.artist_id,
                ar.name AS artist_name,

                s.size_id,
                s.name AS size_name,
                s.price AS size_price,

                f.frame_id,
                f.name AS frame_name,
                f.material AS frame_material,
                f.image_URL AS frame_preview,
                f.price AS frame_price,

                av.price AS variant_price,
                av.is_available

            FROM artwork_variants av
            JOIN artworks a ON av.artwork_id = a.artwork_id
            JOIN artists ar ON a.artist_id = ar.artist_id        
            JOIN sizes s ON av.size_id = s.size_id
            LEFT JOIN frames f ON av.frame_id = f.frame_id
            WHERE av.artwork_id = ?
            AND av.is_available = 1`,
            [req.params.id]
        );


        return res.status(200).json({
            message: "here you go",
            variants,
        });

    } catch (error) {
        return res.status(500).json({ message: "Error getting", error });
    }
};

export const getVariantsBySize = async (req, res) => {
    try {
        const size_id = req.params.id;

        const [variants] = await db.query(
            `SELECT 
                av.variant_id,
                av.artwork_id,
                a.title AS artwork_title,
                a.first_image_URL,
                s.size_id,
                s.name AS size_name,
                f.frame_id,
                f.name AS frame_name,
                f.image_URL AS frame_preview,
                av.price AS variant_price
                
            FROM artwork_variants av
            JOIN artworks a ON av.artwork_id = a.artwork_id
            JOIN sizes s ON av.size_id = s.size_id
            LEFT JOIN frames f ON av.frame_id = f.frame_id
            WHERE av.size_id = ? 
              AND av.is_available = 1`,
            [size_id]
        );

        return res.status(200).json({
            message: "Variants for this size",
            variants
        });

    } catch (error) {
        return res.status(500).json({ message: "Error getting variant.", error });

    }
}
// admin only
export const createVariant = async (req, res) => {
    try {
        const values = [
            req.body.artwork_id,
            req.body.size_id,
            req.body.frame_id || null,
            req.body.price
        ]

        await db.query(
            `INSERT INTO artwork_variants (artwork_id, size_id, frame_id, price) VALUES (?, ?, ?, ?)`,
            values
        );

        return res.status(201).json({ message: "created successfully." });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "This artwork-size-frame combination already exists." });
        }
        return res.status(500).json({ message: "Error creating variant.", error });
    }
};

export const updateVariant = async (req, res) => {
    try {
        const { variant_id } = req.params;
        const { size_id, frame_id = null, price, is_available } = req.body;

        const values = [
            req.body.size_id,
            req.body.frame_id,
            req.body.price,
            req.body.is_available,
            req.body.variant_id
        ]
        await db.query(
            `UPDATE artwork_variants SET size_id = ?, frame_id = ?, price = ?, is_available = ? WHERE variant_id = ?`,
            values
        );

        return res.status(200).json({ message: "Variant updated successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Error updating variant.", error });
    }
};


export const deleteVariant = async (req, res) => {
    try {
        await db.query(
            "DELETE FROM artwork_variants WHERE variant_id = ?", [req.body.variant_id]
        );

        return res.status(200).json({ message: "deleted" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting", error });
    }
};


// CREATE TABLE
//     artwork_variants(
//         variant_id INT AUTO_INCREMENT PRIMARY KEY,
//         artwork_id INT NOT NULL,
//         size_id INT NOT NULL,
//         frame_id INT,
//         price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,    --will be calculated at backend, left manual so admin can override for discounts etc
//         is_available BOOLEAN NOT NULL DEFAULT TRUE,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         FOREIGN KEY (artwork_id) REFERENCES artworks (artwork_id) ON DELETE CASCADE,
//         FOREIGN KEY (size_id) REFERENCES sizes (size_id) ON DELETE RESTRICT,
//         FOREIGN KEY (frame_id) REFERENCES frames (frame_id) ON DELETE RESTRICT,
//         UNIQUE KEY artwork_size_frame (artwork_id, size_id, frame_id)    --ensure only one artwork-size-frame combo exists
//     );