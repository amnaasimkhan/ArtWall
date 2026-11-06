import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import HeroBanner from "../../components/HeroBanner";
import ImageGrid from "../../components/ImageGrid";
import { Typography, Box, Divider } from "@mui/material";

const Featured = () => {
  const { feature_id } = useParams();
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await axios.get(
          `/api/artist/getFeaturedArtist/${feature_id}`
        );
        setArtist(res.data.featured || null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchArtist();
  }, [feature_id]);

  if (!artist) return null; 

  return (
    <div>

      <HeroBanner
        picture={`/api/images${artist.first_feature_image}`}
        direction="left"
      />

      <Box sx={{ textAlign: "center", mt: 4, mb: 6 }}>
        <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", textTransform: 'capitalize' }}>
          {artist.artist_name}
        </Typography>
        <Typography variant="body1" align='center' sx={{ maxWidth: 700, mx: "auto", mt: 2 }}>
          Explore the world of {artist.artist_name.toUpperCase()}. A curated selection of their finest
          works, featuring exclusive styles, canvases, and variants.
        </Typography>
      </Box>
      <Typography variant="h4" align='center' sx={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
        Check out their best-selling designs:
      </Typography>
      <ImageGrid
        size={{ width: 280, height: "auto" }}
        type="sortedArtist"
        num={8}
        artist_id={artist.artist_id}
      />

      <Divider />
         <Typography variant="h4" align='center' sx={{mt:2, fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
        Know the artist:
      </Typography>
      <Box sx={{ mt: 4, mb: 8, textAlign: "center" }}>
        <video
          src={`/api/images${artist.feature_video}`}
          autoPlay
          muted
          loop
          style={{ width: "80%", borderRadius: 16 }}
        />
      </Box>

      <Divider />
      <ImageGrid
        size={{ width: 480, height: "auto" }}
        type="artist"
        num={2}
        artist_id={artist.artist_id}
      />

    </div>
  );
};

export default Featured;
