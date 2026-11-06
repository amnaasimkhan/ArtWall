import { Drawer, Box, Button, Snackbar, Alert } from '@mui/material'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const GallerySidebar = ({ size, activeVariantURL, onSelectVariant, onSelectFrame, allVariantsSelected, activeRectangleId }) => {
  const [mode, setMode] = useState('artworks')
  const [sizeVariant, setSizeVariant] = useState([])
  const [frame, setFrame] = useState([])
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  // store variant_id/frame_id for Add to Cart
  const [selectedVariantIds, setSelectedVariantIds] = useState({})
  const [selectedFrameIds, setSelectedFrameIds] = useState({})

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!size) return
    const fetchVariants = async () => {
      const res = await axios.get(`/api/variant/getBySize/1`)
      setSizeVariant(res.data.variants || [])
    }
    fetchVariants()
  }, [size])

  useEffect(() => {
    if (!activeVariantURL) {
      setFrame([])
      return
    }
    const matchingFrames = sizeVariant
      .filter(v => v.first_image_URL === activeVariantURL)
      .map(v => ({ frame_id: v.frame_id, frame_preview: v.frame_preview }))
    setFrame(matchingFrames)
  }, [activeVariantURL, sizeVariant])

  const addToCart = async () => {
    if (Object.keys(selectedVariantIds).length === 0) {
      setError("Please select at least one artwork.");
      return;
    }

    if (!token) {
      setError("Please login first.");
      navigate("/login");
      return;
    }

    try {
      // iterate over all selected variants
      const requests = Object.keys(selectedVariantIds).map(roomId => {
        return axios.post(
          "/api/cart/addToCart",
          {
            variant_id: selectedVariantIds[roomId],
            frame_id: selectedFrameIds[roomId] || null,
            quantity: 1,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      });

      await Promise.all(requests); 
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to add items to cart.");
    }
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 300,
        zIndex: 100,
        '& .MuiDrawer-paper': {
          width: 300,
          bgcolor: "primary.main",
          border: "1px solid lightgrey",
          position: "fixed",
          top: isScrolled ? "65px" : "105px",
          transition: "top 0.2s ease, height 0.2s ease",
          padding: 0
        }
      }}
    >
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Added to Cart Successfully
        </Alert>
      </Snackbar>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={mode === 'artworks' ? () => setMode('frames') : addToCart}
          sx={{ bgcolor: 'contrast.main', width: '100%' }}
          disabled={mode === 'artworks' && !activeVariantURL || !allVariantsSelected}
        >
          {mode === 'artworks' ? 'Try Frames' : 'Add to Cart'}
        </Button>

      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {mode === 'artworks'
          ? sizeVariant.map((variant) => (
            <Box
              component="button"
              key={variant.variant_id}
              sx={{
                cursor: 'pointer',
                overflow: 'hidden',
                border: '1px solid lightgray',
                transition: 'box-shadow 0.3s',
                '&:hover': { boxShadow: 3 }
              }}
              onClick={() => {
                onSelectVariant?.(variant)
                setSelectedVariantIds(prev => ({ ...prev, [activeRectangleId]: variant.variant_id }))
              }}
            >
              <img
                src={`/api/images${variant.first_image_URL}`}
                alt={variant.artwork_title}
                style={{ width: '40%', objectFit: 'cover' }}
              />
            </Box>
          ))
          : frame.map((f) => (
            <Box
              component="button"
              key={f.frame_id}
              sx={{
                cursor: 'pointer',
                overflow: 'hidden',
                border: '1px solid lightgray',
                transition: 'box-shadow 0.3s',
                '&:hover': { boxShadow: 3 }
              }}
              onClick={() => {
                onSelectFrame?.(f)
                setSelectedFrameIds(prev => ({ ...prev, [activeRectangleId]: f.frame_id }))
              }}
            >
              <img
                src={`/api/images${f.frame_preview}`}
                alt={f.frame_id}
                style={{ width: '40%', display: 'block', objectFit: 'cover' }}
              />
            </Box>
          ))}
      </Box>


    </Drawer>
  )
}

export default GallerySidebar

