import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import ImageGrid from "../../components/ImageGrid";
import HeroBanner from "../../components/HeroBanner";
import picture_2 from "../../assets/hero_2.jpg";

const StylePage = () => {
  const [styles, setStyles] = useState([]);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const res = await axios.get("/api/style/getStyles");
        setStyles(res.data.styles || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStyles();
  }, []);

  return (
    <div>
      {styles.map((style) => (
        <Box key={style.style_id} sx={{ mb: 6 }}>
          <div style={{ marginLeft: 30, marginTop:95 }}>

            <Typography variant="h4" gutterBottom fontStyle='italic' fontFamily='Playfair Display' >
              Our {style.name} Collection
            </Typography>
          </div>
          <ImageGrid
            type="style"
            style={style.style_id}
            size={{ width: 280, height: "auto" }}
            num={style.num_items || 3} 
          />
        </Box>
      ))}

      <HeroBanner picture={picture_2} direction="right" />
    </div>
  );
};

export default StylePage;
