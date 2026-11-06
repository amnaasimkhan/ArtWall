// getGallery -> gets the image, coordinates, name , dominant color(to render as list or display on customer end)
// createGallery -> admin createGallery page
// update Gallery -> admin open an exisiting page on the gallery editor and update coordinates
// deleteGallery
import db from '../config/dbConnection.js'

export const getRoomRectangles = async (req, res) => {
    try {
        const [rectangles] = await db.query(
            `SELECT room_frame_id, position_x, position_y, width, height, size_id FROM room_frames WHERE room_id = ?;`, [req.params.room_id]
        );

        return res.status(200).json({ message: "Retcnagles here:", rectangles });

    } catch (error) {
        console.error("Error :", error);
        return res.status(500).json(error);
    }
}

export const getRooms = async (req, res) => {
    try {
        const [backgrounds] = await db.query(
            `SELECT 
                room_id,
                title,
                dominant_color,
                image_URL
            FROM room_backgrounds`
        );

        return res.status(200).json({ message: "Background here:", backgrounds });

    } catch (error) {
        console.error("Error :", error);
        return res.status(500).json(error);
    }

}


export const createRoomBackground = async (req, res) => {
  try {
    const { title, image_URL, frames } = req.body;

    const [result] = await db.query(
      `INSERT INTO room_backgrounds (title, image_URL) VALUES (?, ?)`,
      [title, image_URL]
    );

    const roomId = result.insertId;

    const frameValues = frames.map(f => [roomId, f.size_id, f.x, f.y, f.width, f.height]);
    if (frameValues.length > 0) {
      await db.query(
        `INSERT INTO room_frames (room_id, size_id, position_x, position_y, width, height)
         VALUES ?`,
        [frameValues]
      );
    }

    return res.status(201).json({ message: "Gallery created successfully", room_id: roomId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};


export const deleteRoom =async (req, res) => {
    try {
        const [exists] = await db.query(
            "SELECT * FROM room_backgrounds WHERE room_id = ?", [req.params.id] 
        );
        if (!exists.length) {
            return res.status(404).json("Gallery doesn't exist!")
        }

        await db.query("DELETE FROM room_backgrounds WHERE room_id = ?", [req.params.id])
        return res.status(200).json({ message: "Room deleted successfully" });

    } catch (error) {
        console.error("Error updating:", error);
        return res.status(500).json(error);
    }
}
