import { Grid, Card, CardContent, Typography, Box } from "@mui/material"
import { useState, useEffect } from "react"
import '../stylesheets/imagegrid.scss'
import axios from "axios"
import { Link } from 'react-router-dom'
const ImageGrid = ({ key, size, num, type, style, artist_id }) => {

  //TBD
  //first write api that will go to getartwork in backend

  const [error, setError] = useState(null)

  const fetchArtworks = async () => {
    let url = ""

    switch (type) { 
      case 'browse':
        url = "/api/artwork/getArtworks"
        break;
      case 'bestseller': //get bestseller 
        url = "/api/artwork/getBestsellers"
        break;
      case 'limitedBestseller': //get bestseller 
        url = "/api/artwork/getBestsellers?limit=3"
        break;
      case 'new':
        url = "/api/artwork/getArtworks?sort=new"
        break;
      case 'artist':   //filter by artist(featured page)
        url = `/api/artwork/getArtworks?artist=${artist_id}`
        break;
      case 'sortedArtist':   //filter by artist(featured page)
        url = `/api/artwork/getArtworks?artist=${artist_id}&sort=new`
        break;
      case 'featured': //get featured artists 
        url = "/api/artist/getFeaturedArtists"
        break;
      case 'style':   //filter by style (style page)
        url = `/api/style/filterByStyle/${style}`
        break;
      default:
        url = "/api/artwork/getArtworks"
        break;
    }

    try {
      const response = await axios.get(url)
      return response.data.artworks;
    } catch (error) {
      setError(error?.response?.data);
      return [];
    }
  }

  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchArtworks();
      setArtworks(data);
      console.log("Fetched:", data);

    }
    load();
  }, []);

  return (

    <div className="container">
      <Grid
        container
        spacing={6}
        justifyContent="center"
        sx={{
          padding: 2
        }}
      >
        {artworks.slice(0, num).map((art) => (
          <Grid item xs={12} sm={6} md={3} key={art.artwork_id}>
            {/* art.artwork_id here refers to featured_id */}
            <Link to={type == 'featured' ? `/feature/${art.artwork_id}` : `/detail/${art.artwork_id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <Card className="card"
                sx={{
                  width: size.width,
                  height: size.height,
                  padding: 3,
                  boxShadow: 1,
                  transition: 'box-shadow 0.3s, transform 0.3s ease',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'scale(1.02)',
                  }
                }}
              >
                <Box
                  sx={{
                    px: type !== 'featured' ? 10 : 0,
                    py: type !== 'featured' ? 15 : 0,
                    height: type == 'featured' ? 400 : 'auto',
                    bgcolor: 'primary.main',
                  }}
                >
                  <img src={`/api/images${art.first_image_URL}`} alt={art.title} className="main-img" />
                  {type != 'featured' ? <img src={`/api/images${art.second_image_URL}`} alt={art.title} className="hover-img" />
                    : <img src={`/api/images${art.first_image_URL}`} alt={art.title} className="hover-img" />}
                </Box>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h5"
                    textTransform='capitalize'
                    sx={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {art.title}
                  </Typography>
                  {type != 'featured' &&
                    <Typography variant="body" color="contrast.main">
                      ${art.price}
                    </Typography>
                  }
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </div >

  )
}

export default ImageGrid