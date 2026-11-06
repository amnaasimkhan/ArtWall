import { Box, Typography, Button, Stack, Divider, Select, MenuItem, Tooltip, IconButton, Snackbar, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageGrid from '../../components/ImageGrid';
import ReviewCard from '../../components/ReviewCard';
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ArtworkDetail = () => {
  const { artwork_id } = useParams();
  const [variants, setVariants] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const res = await axios.get(`/api/variant/getByArtwork/${artwork_id}`);
        setVariants(res.data.variants || []);
        if (res.data.variants?.length > 0) setSelectedSize(res.data.variants[0].size_id);
      } catch (err) {
        console.log(err);
      }
    };
    fetchVariants();
  }, [artwork_id]);

  const variantsForSize = variants.filter(v => v.size_id === selectedSize);
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const artworkPrice = variantsForSize[0] ? parseFloat(variantsForSize[0].artwork_base_price) : 0;
  const sizePrice = variantsForSize[0] ? parseFloat(variantsForSize[0].size_price || 0) : 0
  const framePrice = selectedFrame ? parseFloat(selectedFrame.frame_price || 0) : 0
  const totalPrice = artworkPrice + sizePrice + framePrice

  const sizes = Array.from(new Map(variants.map(v => [v.size_id, v])).values());

  //select corrects variant
  const selectedVariant = variants.find(v =>
    v.size_id === selectedSize &&
    v.variant_id === selectedFrame?.variant_id
  );

  const addToCart = async () => {
    if (!selectedVariant) {
      setError("Please select a size and frame first.");
      return;
    }
    if (!token) {
      setError("Please login first.");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "/api/cart/addToCart",
        {
          variant_id: selectedVariant.variant_id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <Box sx={{ padding: 4 }}>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError(null)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success">Added to Cart</Alert>
      </Snackbar>
      <Box sx={{ display: "flex", gap: 4 }}>

        <Box sx={{ width: "60%", display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: "60%", display: "flex", justifyContent: "center", position: "relative" }}>
            <Box sx={{ width: "90%", display: "flex", justifyContent: "center", alignItems: "center", padding: 10, backgroundColor: "primary.main" }}>
              <Box sx={{ width: "100%", aspectRatio: "1/1.414", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", position: "relative" }}>
                {variantsForSize[0] && (
                  <img
                    src={`/api/images${variantsForSize[0].first_image_URL}`}
                    alt={variantsForSize[0].artwork_title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
              </Box>

              {selectedFrame && (
                <img
                  src={`/api/images${selectedFrame.frame_preview}`}
                  alt="frame overlay"
                  style={{ position: "absolute", width: "79%", height: "79%", objectFit: "contain", transform: "scale(1.1)" }}
                />
              )}
            </Box>

            {selectedFrame && (
              <IconButton onClick={() => setSelectedFrame(null)} sx={{ position: "absolute", top: 8, right: 8, bgcolor: "white" }}>
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        <Box sx={{ width: "40%", display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h4" fontWeight="bold" fontFamily="PlayFair Display" sx={{ textTransform: 'capitalize' }}>
            {variantsForSize[0]?.artwork_title || "Artwork Title"}
          </Typography>
          <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{variantsForSize[0]?.artist_name}</Typography>
          <Typography variant="h6" fontWeight="bold">${totalPrice.toFixed(2)}</Typography>
          <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
            {variantsForSize[0]?.detail}
          </Typography>

          <Divider />
          <Typography variant="subtitle1">Choose Size</Typography>
          <Select
            value={selectedSize || ""}
            onChange={(e) => { setSelectedSize(e.target.value); setSelectedFrame(null); }}
          >
            {sizes.map(v => (
              <MenuItem key={v.size_id} value={v.size_id}>
                {v.size_name} (+${v.size_price})
              </MenuItem>
            ))}
          </Select>

          <Divider />
          <Typography variant="h6">Choose Frame</Typography>
          <Stack direction="row" spacing={2}>
            {variantsForSize.map(frameVariant => (
              <Tooltip key={frameVariant.variant_id} title={`+ $${frameVariant.frame_price}`}>
                <Box
                  onClick={() => setSelectedFrame(frameVariant)}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "4px",
                    cursor: "pointer",
                    overflow: "hidden",
                    border: selectedFrame?.variant_id === frameVariant.variant_id ? "2px solid black" : "1px solid #ccc",
                  }}
                >
                  <img
                    src={`/api/images${frameVariant.frame_preview}`}
                    alt={frameVariant.frame_name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              </Tooltip>
            ))}
          </Stack>

          <Divider />
          <Button variant="contained" sx={{ width: "550px", bgcolor: "contrast.main" }} onClick={addToCart}>
            Add to Cart
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 9 }}>
        <Divider />
        <Typography variant="h4" fontFamily="PlayFair Display" mt={3} align="center">
          Others also got
        </Typography>
        <ImageGrid size={{ width: 280, height: 'auto' }} num={3} type="misc" />
        <ReviewCard />
      </Box>
    </Box>
  );
};

export default ArtworkDetail;
