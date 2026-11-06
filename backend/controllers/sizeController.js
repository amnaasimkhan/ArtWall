//crud of this dont make sense cuz in the db i used enum so only three possible entries lolz
import db from "../config/dbConnection.js"


export const getSizes =async(req, res)=>{
    try {
        const [sizes] = await db.query(
            "SELECT * FROM sizes"
        )
        if(!sizes.length){
            return res.status(200).json({ message: "No sizes available", sizes: [] });
        }

        return res.status(200).json({
            message: "Gotten",
            sizes,
        });

    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
}

//idk what this'd be used for lolz
export const getSizeById =async(req, res)=>{
    try {
        
    } catch (error) {
        res.status(500).json(error)
    }
}


// sizes(
//         size_id INT AUTO_INCREMENT PRIMARY KEY,
//         name ENUM('A1', 'A2', 'A3','A4') NOT NULL,
//         price DECIMAL(10, 2) NOT NULL,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     );