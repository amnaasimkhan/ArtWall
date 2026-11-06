import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext"
import HeroBanner from "../../components/HeroBanner"
import ImageGrid from "../../components/ImageGrid"
import { Divider, Typography } from "@mui/material";
import axios from "axios"


const Homepage = () => {

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'visible' }}>
      <HeroBanner
        picture={"/api/images/hero_1.jpg"}
        direction={'left'} 
        title={"Discover Art That Speaks"}
        text={"Curated pieces to elevate your space."}
        buttonText = {"Shop Now"}
        buttonLink={"/browse"}
      />

      <Typography variant="h4" fontFamily={"PlayFair Display"} align="center" fontStyle="italic">New in</Typography>

      <ImageGrid size={{ width: 280, height: 'auto' }} num={4} type={'new'}/> {/*New in 4 cards*/}

      <HeroBanner
        picture={"/api/images/hero_3.jpg"}
        title={"Designed For Every Room"}
        text={"Turn your walls into galleries."}
        direction={'right'}
        buttonText={"Explore Gallery"}
        buttonLink={"/gallery"}
      />

      <Typography variant="h4" fontFamily={"PlayFair Display"} align="center" fontStyle="italic">Bestsellers</Typography>

      <ImageGrid size={{ width: 400, height: 'auto' }} num={3} type={'limitedBestseller'}/>    {/* Bestselling 3 cards*/}
      <Divider sx={{ mb: 2 }} />

      <HeroBanner
        video={"/api/images/hero_vid.mp4"}
        title={"Make Your Walls Come Alive"}
        text={"Simple, beautiful, and timeless prints."}
        direction={'left'}
        buttonText={"Explore styles"}
        buttonLink={"/style"}
      />
      <Typography variant="h4" fontFamily={"PlayFair Display"} align="center" fontStyle="italic">Check out our Featured Artists</Typography>
      <ImageGrid size={{ width: 280, height: 'auto' }} num={3} type={'featured'} />    {/*this will have 3 images linking to 3 featured artists*/}
      <HeroBanner
        picture={"/api/images/hero_4.jpg"}
        title={"Create Your Atmosphere"}
        text={"Styles that reflect what you love."}
        direction={'right'}
      />
    </div>
  )
}

export default Homepage