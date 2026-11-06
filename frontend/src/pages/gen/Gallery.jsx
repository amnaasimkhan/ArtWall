import { Alert, Box, Snackbar } from '@mui/material'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import GallerySidebar from '../../components/GallerySidebar';

const Gallery = () => {

  const { room_id } = useParams(); // bg img from url

  const [rectangle, setRectangle] = useState([]);          // from API
  const [frame_url, setFrameURL] = useState({});           // from sidebar
  const [activeRectangleId, setActiveRectangleId] = useState(null); // selected rectangle
  const [variant_url, setVariantURL] = useState({});       // received from child
  const [selectedVariantIds, setSelectedVariantIds] = useState({}); // track variant_id
  const [selectedFrameIds, setSelectedFrameIds] = useState({});     // track frame_id
  const [error, setError] = useState(false)

  const fetchRectangle = async (room_id) => {
    const res = await axios.get(`/api/gallery/getRectangles/${room_id}`);
    setRectangle(res.data.rectangles);
  };

  useEffect(() => {
    if (room_id) fetchRectangle(room_id);
  }, [room_id]);

  const allVariantsSelected = rectangle.every(r => variant_url[r.room_frame_id]); // ensure try frame is disabled unless all have a variant

  // extract usable size_ids for sidebar
  const size_id = Array.from(new Set(rectangle.map(r => r.size_id)));

  return (
    <div style={{ display: "flex" }}>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError(false)}>
        <Alert severity="error">Please Select A Rectangle First</Alert>
      </Snackbar>

      <GallerySidebar
        size={size_id[0]} // hardcoded rn for same size variants only
        activeVariantURL={variant_url[activeRectangleId]}
        onSelectVariant={(variant) => {
          if (!activeRectangleId) {
            setError(true)
            return;
          }
          setVariantURL(prev => ({ ...prev, [activeRectangleId]: variant.first_image_URL }));
          setSelectedVariantIds(prev => ({ ...prev, [activeRectangleId]: variant.variant_id }));
        }}
        onSelectFrame={(frame) => {
          if (!activeRectangleId) {
            setError(true)
            return;
          }
          setFrameURL(prev => ({ ...prev, [activeRectangleId]: frame.frame_preview }))
          setSelectedFrameIds(prev => ({ ...prev, [activeRectangleId]: frame.frame_id }))
        }}
        allVariantsSelected={allVariantsSelected}
        activeRectangleId={activeRectangleId}
      />

      <Box sx={{ position: "relative", width: "100%", height: "auto" }}>
        <img
          src={`/api/images/bg${room_id}.png`}
          alt=""
          style={{ width: "100%", height: "auto", display: "block" }}
        />

        {rectangle.map((item) => (
          <Box
            key={item.room_frame_id}
            onClick={() => setActiveRectangleId(item.room_frame_id)}
            sx={{
              position: "absolute",
              left: `${item.position_x}%`,
              top: `${item.position_y}%`,
              width: `${item.width}%`,
              height: `${item.height}%`,
              overflow: "hidden",
              backgroundColor: activeRectangleId === item.room_frame_id ? "rgba(0,0,0,0.15)" : "transparent",
              border: activeRectangleId === item.room_frame_id ? "2px solid #333" : "1px solid transparent",
              transition: "0.2s"
            }}
          >
            <img
              src={`/api/images${variant_url[item.room_frame_id]}`}
              alt={variant_url[item.room_frame_id]}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center"
              }}
            />
            {frame_url[item.room_frame_id] && (
              <img
                src={`/api/images${frame_url[item.room_frame_id]}`}
                alt="frame"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  pointerEvents: "none"
                }}
              />
            )}
          </Box>
        ))}

      </Box>
    </div>
  )
}

export default Gallery
