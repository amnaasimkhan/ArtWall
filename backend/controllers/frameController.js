import db from "../config/dbConnection.js";

//admin only
export const getFrames = async(req,res)=>{
    try {
        const [frames] = await db.query(
            "SELECT frame_id, name, material, image_URL, price FROM frames"
        )

        if(!frames.length){
            return res.status(400).json({message :"No frames found"})
        }
        
        return res.status(200).json({
            message: "Here you go :D",
            frames,
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json(error);
    }
}


export const createFrame = async(req, res) => {
    try {

         //check if artist exists 
        const [exists] = await db.query(
            "SELECT * FROM frames WHERE name =?", [req.body.name]
        );
        if (exists.length) {
            return res.status(409).json({ message: "Already exists!" })
        }

        const values =[
            req.body.name,
            req.body.material,      //dropdown of exisiting, can fill a new one (im NOT gonna make a material table ong)
            req.body.image_url,
            req.body.price
        ]

        await db.query(
            "INSERT INTO frames (`name`, `material`,`image_URL`, `price`) VALUES (?,?,?,?)", values
        )

        return res.status(200).json({ message: "Frame created successfully" });

    } catch (error) {
        console.error("Error :", error);
        return res.status(500).json(error);
    }
}

export const updateFrame = async(req, res) => {
    try {
        const [exists] = await db.query(
            "SELECT * FROM frames WHERE name =?", [req.body.name]
        );
        if (exists.length) {
            return res.status(409).json({ message: "Already exists, try a new name!" })
        }
        const values =[
            req.body.name,
            req.body.material,      //dropdown of exisiting, can fill a new one (im NOT gonna make a material table ong)
            req.body.image_url,
            req.body.price
        ]

        const [result] =await db.query(
            `UPDATE frames SET name=?, material=?,image_URL=?, price=?`, values
        )
         if (result.affectedRows === 0) {
            return res.status(400).json("No changes made.");
        }

        return res.status(200).json({ message: "Frame updated successfully" });

    } catch (error) {
        console.error("Error :", error);
        return res.status(500).json(error);
    }
}

export const deleteFrame =async (req, res) => {
    try {
        const [exists] = await db.query(
            "SELECT * FROM frames WHERE frame_id = ?", [req.params.id]   //in the list theres gon be a delete button, so req.body
        );
        if (!exists.length) {
            return res.status(404).json("Frame doesn't exist!")
        }

        await db.query("DELETE FROM frames WHERE frame_id = ?", [req.params.id])
        return res.status(200).json({ message: "Frame deleted successfully" });

    } catch (error) {
        console.error("Error updating:", error);
        return res.status(500).json(error);
    }
}


//  frames(
//         frame_id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(255),
//         material VARCHAR (255), --for filtering
//         image_URL VARCHAR(255), --svg trasparent
//         price DECIMAL(10, 2) NOT NULL,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     );