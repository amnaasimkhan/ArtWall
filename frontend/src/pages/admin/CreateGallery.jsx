import GalleryEditor from '../../components/admin/GalleryEditor';
import { useState } from "react";
import { Button, Box, TextField, Typography, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import axios from "axios";

const CreateGallery = () => {
  const [frames, setFrames] = useState([]);
  const [title, setTitle] = useState("");
  const [imageURL] = useState("");
  const [bgImageURL, setBgImageURL] = useState("");
  const [success, setSuccess] = useState(false);

  function handleFreeze(updatedFrames) {
    setFrames(updatedFrames);
  }

  function handleSizeChange(index, value) {
    const updated = [...frames];
    updated[index].size_id = value;
    setFrames(updated);
  }

  const token = localStorage.getItem("token");

  async function handleSubmit() {
    try {
      await axios.post(
        "/api/gallery/create",
        {
          title,
          image_URL: `/${bgImageURL}`,
          frames
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Failed to save gallery");
    }
  }

  return (
    <>
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success">Gallery Saved Successfully</Alert>
      </Snackbar>

      <Box sx={{ display: "flex", gap: 3 }}>
        <div style={{ flexShrink: 0 }}>
          <GalleryEditor onFreeze={handleFreeze} bgImage={bgImageURL || "bg1.png"}/>
        </div>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
          <TextField
            label="Gallery Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <TextField
            label="Background Image URL"
            value={bgImageURL}
            onChange={(e) => setBgImageURL(e.target.value)}
            required
          />

          {frames.map((f, index) => (
            <Box key={index} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography sx={{ width: 80 }}>Frame {index + 1}</Typography>

              <TextField label="X (%)" value={f.x.toFixed(1)} readOnly />
              <TextField label="Y (%)" value={f.y.toFixed(1)} readOnly />
              <TextField label="W (%)" value={f.width.toFixed(1)} readOnly />
              <TextField label="H (%)" value={f.height.toFixed(1)} readOnly />

              <Select
                value={f.size_id || ""}
                onChange={(e) => handleSizeChange(index, Number(e.target.value))}
                required
              >
                <MenuItem value={1}>A1</MenuItem>
                <MenuItem value={2}>A2</MenuItem>
                <MenuItem value={3}>A3</MenuItem>
                <MenuItem value={4}>A4</MenuItem>
              </Select>
            </Box>
          ))}

          {frames.length > 0 && (
            <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: "contrast.main", mt: 2 }}>
              Confirm & Save Gallery
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};


export default CreateGallery;
