import { useState, useEffect } from 'react'
import GalleryItem from '../../components/GalleryItem.jsx'
import axios from 'axios'
import { Typography, Box } from '@mui/material'

const GalleryLanding = () => {
    const [gallery, setGallery] = useState(null)

    const fetchGallery = async () => {
        const res = await axios.get("/api/gallery/get")
        setGallery(res.data.backgrounds)
    }


    useEffect(() => {
        fetchGallery()
    }, [])

    return (
        <>
            <div style={{ marginLeft: 30, marginRight: '40%' , marginTop:90}}>

                <Typography variant="h4" gutterBottom fontStyle='italic' fontFamily='Playfair Display' >
                    Preview Rooms
                </Typography>
                <Typography variant="subtitle">
                    Find inspiration for your home interior among our gallery walls! Check out our Inspiration rooms to get ideas on how to use our posters and prints in different combinations together with other colours, interior styles and materials. Explore the different rooms and designs – click the picture to buy the poster collage that’s perfect for you!
                </Typography>
            </div>
            <Box
                sx={{
                    mt: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    maxWidth: 900,
                    mx: "auto"
                }}
            >
                {gallery && gallery.map((gallery, index) => (
                    <GalleryItem key={index} item={gallery} />
                ))}
            </Box>

        </>
    )
}



export default GalleryLanding
