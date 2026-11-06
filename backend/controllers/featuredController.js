import db from '../config/dbConnection.js'

export const getFeaturedArtists = async (req, res) => {
  try {
    const [artworks] = await db.query(  //cuz in frontend array name is artwork and i dont wanna change it now
      `SELECT 
          fa.feature_id AS artwork_id, 
          fa.third_feature_image AS first_image_URL,
          a.artist_id, a.name AS title
        FROM featured_artists fa
        JOIN artists a ON fa.artist_id = a.artist_id
        WHERE fa.is_active = 1
          AND fa.start_date <= NOW()
          AND fa.end_date >= NOW();
    `);

    return res.status(200).json({ message: "here you go", artworks });

  } catch (error) {
    console.error("Error fetching featured artists:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getFeaturedArtistDetail = async (req, res) => {
  try {
    
    const [rows] = await db.query(`
      SELECT 
          fa.feature_id, 
          fa.first_feature_image, 
          fa.second_feature_image, 
          fa.third_feature_image, 
          fa.feature_video, 
          fa.is_active,
          a.artist_id,
          a.name AS artist_name
      FROM featured_artists fa
      JOIN artists a ON fa.artist_id = a.artist_id
      WHERE fa.feature_id = ?;`
      , [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Featured artist not found", featured :[] });
    }

    return res.status(200).json({ message: "here you go", featured: rows[0] });
  } catch (error) {
    console.error("Error fetching featured artist detail:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createFeaturedArtist = async(req,res) =>{
  try {
    
    const [exists] = await db.query("SELECT * FROM artists WHERE artist_id =?", [req.params.id])
    if (!exists.length) {
      return res.status(404).json({message: "Artist doesnt exists!"})
    }


  } catch (error) {
    
  }
}