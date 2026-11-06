import db from "../config/dbConnection.js";

//admin only
//add artwork for an artist 
export const createArtwork = async (req, res) => {
    try {
        const [artist_exists] = await db.query(
            "SELECT * FROM artists WHERE artist_id = ?",
            [req.body.artist_id]
        );
        if (!artist_exists.length) {
            return res.status(409).json({ message: "Create artist first!" });
        }

        const [exists] = await db.query(
            "SELECT * FROM artworks WHERE title = ? AND artist_id = ?",
            [req.body.title, req.body.artist_id]
        );
        if (exists.length) {
            return res.status(409).json({ message: "Artwork already exists!" });
        }

        const artworkValues = [
            req.body.title,
            req.body.artist_id,
            req.body.style_id,
            req.body.detail,
            req.body.price,
            req.body.first_image_url,
            req.body.second_image_url
        ];

        const [artworkResult] = await db.query(
            "INSERT INTO artworks (`title`,`artist_id`, `style_id`, `detail`, `price`, `first_image_url`, `second_image_url`) VALUES (?,?,?,?,?,?,?)",
            artworkValues
        );

        const artworkId = artworkResult.insertId;

        const variants = req.body.variants;

        if (!variants || !variants.length) {
            return res.status(400).json({ message: "At least one variant required!" });
        }

        const variantValues = variants.map(v => [
            artworkId,
            v.size_id,
            v.frame_id || null,
            v.price
        ]);

        await db.query(
            "INSERT INTO artwork_variants (artwork_id, size_id, frame_id, price) VALUES ?",
            [variantValues]
        );


        return res.status(200).json({ message: "Artwork and variants created successfully" });

    } catch (error) {
        console.error("Error creating artwork:", error);
        return res.status(500).json(error);
    }
};


//the inventory on admin panel will have a update button that will take it to update page and put the id in url
//so getArtwork -> put in list -> click will give id to url
export const updateArtwork = async (req, res) => {

    try {
        //check if artwork exists
        const [exists] = await db.query(
            "SELECT * FROM artworks WHERE artwork_id = ?", [req.params.id]   //yep URL se ayega
        );
        if (!exists.length) {
            return res.status(404).json("artwork doesn't exist!")
        }

        //forgot to put unique constraint in the table so we do it here lolz
        if (req.body.title) {
            const [duplicate] = await db.query(
                "SELECT * FROM artworks WHERE title = ? AND artwork_id != ?",
                [req.body.title, req.params.id]
            );
            if (duplicate.length) {
                return res.status(409).json({ message: "Another artwork with this title already exists!" });
            }
        }

        //update it
        const values = [
            req.body.title,
            req.body.artist_id,        //frontend will get getArtist and put in a dropdown and get its id like that 
            req.body.style_id,         //frontend will getStyle and put in a dropwdown, and send back id
            req.body.detail,        //make frontend so that it will get, fill the fields, then give option ot edit
            req.body.price,
            req.body.first_image_url,
            req.body.second_image_url,
            req.body.available,
            req.params.id
        ]
        const [result] = await db.query(
            `UPDATE artworks SET title = ?, artist_id = ?, style_id = ?, detail = ?, price = ?, first_image_URL = ?, second_image_URL = ?, is_available = ? WHERE artwork_id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(400).json("No changes made.");
        }

        return res.status(200).json({ message: "Artwork updated successfully" });

    } catch (error) {
        console.error("Error updating:", error);
        return res.status(500).json(error);
    }
};

//remove artwork
export const deleteArtwork = async (req, res) => {
    try {
        const [exists] = await db.query(
            "SELECT * FROM artworks WHERE artwork_id = ?", [req.body.artwork_id]   //in the list theres gon be a delete button, so req.body
        );
        if (!exists.length) {
            return res.status(404).json("Artwork doesn't exist!")
        }

        await db.query("DELETE FROM artworks WHERE artwork_id = ?", [req.body.artwork_id])
        return res.status(200).json({ message: "Artwork delete successfully" });

    } catch (error) {
        console.error("Error updating:", error);
        return res.status(500).json(error);
    }
};

//details of one artwork 
export const getArtworkById = async (req, res) => {
    try {
        const [artwork_detail] = await db.query(
            `SELECT 
                a.title,
                a.price,
                a.detail,
                a.first_image_URL,
                a.second_image_URL,
                ar.name AS artist_name,
                s.name AS style_name
            FROM artworks a
            JOIN artists ar ON a.artist_id = ar.artist_id
            JOIN styles s ON a.style_id = s.style_id
            WHERE a.is_available = 1 
            AND a.artwork_id = ?`,
            [req.params.id]
        );

        if (!artwork_detail.length) {
            return res.status(404).json({ message: "Artwork not available", artwork: [] });
        }

        return res.status(200).json({ message: "Here you go :D", artwork: artwork_detail[0], });

    } catch (error) {
        console.error("Internal Server Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


//gen------------------------------------------

//list all artworks
export const getArtworks = async (req, res) => {
    try {
        const { sort, artist } = req.query;

        // Base query
        let q = `
            SELECT 
                a.artwork_id,
                a.title,
                a.price,
                a.first_image_URL,
                a.second_image_URL,
                ar.name AS artist_name,
                s.name AS style_name
            FROM artworks a
            JOIN artists ar ON a.artist_id = ar.artist_id
            JOIN styles s ON a.style_id = s.style_id
            WHERE a.is_available = 1
        `;

        const params = [];

        if (artist) {
            q += " AND a.artist_id = ?";
            params.push(artist);
        }

        // Sorting
        if (sort === "new") {
            q += " ORDER BY a.created_at DESC";
        } else if (sort === "price_low") {
            q += " ORDER BY a.price ASC";
        } else if (sort === "price_high") {
            q += " ORDER BY a.price DESC";
        }

        const [artworks] = await db.query(q, params);

        if (!artworks.length) {
            return res.status(200).json({ message: "No artworks found", artworks: [] });
        }

        return res.status(200).json({
            message: "Here you go :D",
            artworks,
        });

    } catch (error) {
        console.error("Internal Server Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getBestsellers = async (req, res) => {
    try {
        let q =
            `SELECT 
            a.artwork_id,
            a.title,
            a.first_image_URL,
            a.second_image_URL,
            a.price,
            ar.name AS artist_name,
            s.name AS style_name,
            SUM(od.quantity) AS total_sold
        FROM order_details od
        JOIN artwork_variants av ON od.variant_id = av.variant_id
        JOIN artworks a ON av.artwork_id = a.artwork_id
        JOIN artists ar ON a.artist_id = ar.artist_id
        JOIN styles s ON a.style_id = s.style_id
        WHERE a.is_available = 1
        GROUP BY a.artwork_id
        ORDER BY total_sold DESC`;

        const { limit } = req.query;
        if (limit) {
            q += ` LIMIT ${parseInt(limit, 10)}`;
        }

        const [artworks] = await db.query(q);

        if (!artworks.length) {
            return res.status(200).json({ message: "No artworks available", artworks: [] });
        }

        return res.status(200).json({
            message: "Here you go :D",
            artworks,
        });

    } catch (error) {
        console.error("Internal Server Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


//         artwork_id INT AUTO_INCREMENT PRIMARY KEY,
//         artist_id INT NOT NULL,
//         style_id INT NOT NULL, --will tell style kya hai, needed for filters
//         title VARCHAR(255) NOT NULL,
//         detail TEXT,
//         price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,  --for profit calc? and for filters
//         first_image_URL VARCHAR(255),
//         second_image_URL VARCHAR(255),
//         is_available BOOLEAN NOT NULL DEFAULT TRUE,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         FOREIGN KEY (artist_id) REFERENCES artists (artist_id) ON DELETE CASCADE,   --artist is deleted, artworks are too
//         FOREIGN KEY (style_id) REFERENCES styles (style_id) ON DELETE RESTRICT