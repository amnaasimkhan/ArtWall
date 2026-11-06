import { Box, Typography, Paper, TextField, Button, MenuItem } from '@mui/material';
import { useState } from 'react';

const CreateVariant = ({ sizeOptions, frameOptions, basePrice, variants, setVariants }) => {
  const [variantForm, setVariantForm] = useState({ size_id: '', frame_id: '', price: 0 });

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setVariantForm(prev => ({ ...prev, [name]: value }));
  };

  const addVariant = () => {
    if (!variantForm.size_id) return;

    // Prevent duplicates
    const exists = variants.some(v => v.size_id === variantForm.size_id && v.frame_id === variantForm.frame_id);
    if (exists) {
      alert("This variant already exists!");
      return;
    }

    // Calculate price
    const sizeObj = sizeOptions.find(s => s.size_id === variantForm.size_id);
    const frameObj = frameOptions.find(f => f.frame_id === variantForm.frame_id);

    const calculatedPrice = Number(basePrice || 0) 
                          + Number(sizeObj?.price || 0) 
                          + Number(frameObj?.price || 0);

    const newVariant = {
      size_id: variantForm.size_id,
      frame_id: variantForm.frame_id || null,
      price: calculatedPrice
    };

    setVariants(prev => [...prev, newVariant]);
    setVariantForm({ size_id: '', frame_id: '', price: 0 });
  };

  return (
    <Paper sx={{ p: 2, mt: 2, bgcolor: "secondary.main", width: '30vw' }}>
      <Typography variant="h6" mb={2}>Add Artwork Variants</Typography>

      <TextField
        select
        name="size_id"
        label="Size"
        fullWidth
        margin="normal"
        value={variantForm.size_id}
        onChange={handleVariantChange}
      >
        {sizeOptions.map((s) => (
          <MenuItem key={s.size_id} value={s.size_id}>
            {s.name} (${s.price})
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        name="frame_id"
        label="Frame"
        fullWidth
        margin="normal"
        value={variantForm.frame_id}
        onChange={handleVariantChange}
      >
        <MenuItem value="">None</MenuItem>
        {frameOptions.map((f) => (
          <MenuItem key={f.frame_id} value={f.frame_id}>
            {f.name} (${f.price})
          </MenuItem>
        ))}
      </TextField>

      <Box mt={1}>
        <Typography>Variant Price: ${variantForm.size_id 
          ? (Number(basePrice || 0) + Number(sizeOptions.find(s => s.size_id === variantForm.size_id)?.price || 0) 
          + Number(frameOptions.find(f => f.frame_id === variantForm.frame_id)?.price || 0))
          : 0
        }</Typography>
      </Box>

      <Button 
        variant="contained" 
        sx={{ mt: 1, bgcolor: 'contrast.main' }}
        onClick={addVariant}
      >
        Add Variant
      </Button>

      {variants.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle1">Added Variants:</Typography>
          {variants.map((v, i) => (
            <Typography key={i}>
              • Size {v.size_id}, Frame {v.frame_id || "None"}, Price ${v.price}
            </Typography>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default CreateVariant;
