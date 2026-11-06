import db from "../config/dbConnection.js";
///admin only
//CRUD artists

export const createArtist = async (req, res) => {
    try {
        //check if artist exists (email cant be same) names arent unique
        const [artist_exists] = await db.query(
            "SELECT * FROM artists WHERE email = ?", [req.body.email]
        );
        if (artist_exists.length) {
            return res.status(409).json({ message: "Artist already exists!" })
        }

        //if not then insert into database

        const values = [
            req.body.name,
            req.body.email,
        ]
        await db.query(
            "INSERT INTO artists (`name`,`email`) VALUES (?,?)", values
        )

        return res.status(200).json({ message: "Artist created successfully" });

    } catch (error) {
        console.error("Error creating:", error);
        return res.status(500).json(error);
    }
}

export const getArtists = async (req, res) => {
    try {
        const [artists] = await db.query(
            "SELECT artist_id, name, email, created_at FROM artists"
        )

        if (!artists.length) {
            return res.status(200).json({ message: "No artists available", artists: [] });
        }
        return res.status(200).json({ message: "Here you go :D", artists, });

    } catch (error) {
        console.error("Error getting:", error);
        return res.status(500).json(error);
    }
}

export const getArtistById = async (req, res) => {
    try {
        const [artist_detail] = await db.query(
            "SELECT name, email FROM artists WHERE artist_id=?", [req.params.id]
        )

        if (!artist_detail.length) {
            return res.status(404).json({ message: "Artist doesn't exist", artist: [] });
        }

        return res.status(200).json({message: "Here you go :D",artist:artist_detail[0],});


    } catch (error) {
        console.error("Error getting:", error);
        return res.status(500).json(error);
    }
}

export const updateArtist =async (req, res) => {
    
    try {
        const [exists]= await db.query( 
                "SELECT * FROM artists WHERE artist_id = ?",  [req.params.id]   //yep URL se ayega
        );
        if (!exists.length) {
            return res.status(404).json("artist doesn't exist!")
        }
    
        const values= [
            req.body.name,
            req.body.email,
            req.params.id
        ]

        //if some other artist has this email, dont let it update
         if (req.body.email) {
            const [duplicate] = await db.query(
                "SELECT * FROM artists WHERE email = ? AND artist_id != ?",
                [req.body.email, req.params.id]
            );
            if (duplicate.length) {
                return res.status(409).json({message:"Another artist with this email already exists!"});
            }
        }

        //actual updation 
       const [result] = await db.query(
            "UPDATE artists SET name = ?, email = ? WHERE artist_id = ?",
            values
        );

        if (result.affectedRows === 0) {
            return res.status(400).json("No changes made.");
        }

        return res.status(200).json({ message: "Artist updated successfully" });
    
    } catch (error) {
        console.error("Error updating:", error);
        return res.status(500).json(error);
    }  
}
//cascade artwork
//list main - button hoga 
export const deleteArtist = async(req, res) => {
    try {
        const [exists]= await db.query( 
            "SELECT * FROM artists WHERE artist_id = ?",  [req.params.id]   
        );
        if (!exists.length) {
            return res.status(404).json("artist doesn't exist!")
        }
        
        await db.query("DELETE FROM artists WHERE artist_id = ?", [req.params.id])
        return res.status(200).json({ message: "Artist deleted successfully" });
        
    } catch (error) {
        console.error("Error deleting:", error);
        return res.status(500).json(error);
    }
}

// CREATE TABLE
//     artists (
//         artist_id INT AUTO_INCREMENT PRIMARY KEY,
//         email VARCHAR(255) NOT NULL UNIQUE,   
//         name VARCHAR(255),
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//     );