import { Typography, Button, Box, ButtonGroup, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const GalleryItem = ({ item }) => {
    return (
        <Paper
            elevation={3}
            sx={{
                width:"75vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                mb: 2,
                borderRadius: 2
            }}
        >
            <Box
                sx={{
                    width: 150,
                    height: 100,
                    overflow: "hidden",
                    borderRadius: 2,
                    mr: 2,
                    flexShrink: 0,
                }}
            >
                <img
                    src={`/api/images${item.image_URL}`}
                    alt={item.title}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </Box>

            <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                    {item.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Color: {item.dominant_color}
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    ml: 3,
                }}
            >
                <Button 
                component={Link}
                to= {`/gallery/${item.room_id}`}
                sx={{ backgroundColor: "contrast.main" }}>OPEN IN GALLERY</Button>

            </Box>
        </Paper>
    );
};

export default GalleryItem;
