import db from "../config/dbConnection.js";

//admin only
//create 
export const createStyle = async (req, res) => {
    try {
        const [style_exists] = await db.query(
            "SELECT * FROM styles WHERE name = ?", [req.body.style_name]
        );
        if (style_exists.length) {
            return res.status(409).json({ message: "Style already exists!" })
        }

        const values = [
            req.body.name,
            req.body.detail
        ];
        await db.query(
            "INSERT INTO styles (`name`, `detail`) VALUES (?,?)", values
        )

        return res.status(200).json({ message: "Style created successfully" });
    } catch (error) {
        console.error("Error creating:", error);
        return res.status(500).json(error);
    }
}

export const getStyles = async (req, res) => {
    try {
        const [styles] = await db.query(
            "SELECT style_id, name, detail FROM styles"
        )

        if (!styles.length) {
            return res.status(200).json({ message: "No styles available", styles: [] });
        }
        return res.status(200).json({ message: "Styles: ", styles, });
    } catch (error) {
        console.error("Error getting:", error);
        return res.status(500).json(error);
    }
}

export const deleteStyle = async (req, res) => {
    try {
        const [exists] = await db.query(
            "SELECT * FROM styles WHERE name = ?", [req.body.style_name]
        );
        if (!exists.length) {
            return res.status(409).json({ message: "Style doesn't exist!" })
        }

        await db.query("DELETE FROM styles WHERE style_id = ?", [req.body.style_id])
        return res.status(200).json({ message: "Style deleted successfully" });


    } catch (error) {

        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(400).json({
                message: "Cannot delete this style because it is being used by one or more artworks."
            });
        }
        
        console.error("Error deleting:", error);
        return res.status(500).json(error);
    }
}


export const filterByStyle = async(req,res)=>{
    try {
        const [artworks] = await db.query(
            `SELECT 
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
            WHERE a.is_available = TRUE
            AND a.style_id = ?`, [req.params.id]  
        );

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
    
}

//--------------------TBD------------------------
export const getStyleById = async (req, res) => {
    try {

        console.log("im not sure we need this one lol")

    } catch (error) {
        console.error("Error getting:", error);
        return res.status(500).json(error);
    }
}

export const updateStyle = async (req, res) => {
    try {
        console.log("seems useless will do later")

    } catch (error) {
        console.error("Error updating:", error);
        return res.status(500).json(error);
    }
}
// styles(
//         style_id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         detail TEXT ,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     );