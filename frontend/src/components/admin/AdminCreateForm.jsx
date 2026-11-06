import { Box, Typography, Paper, TextField, Button, MenuItem, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import CreateVariant from './CreateVariant';
import { useState } from 'react';

const AdminCreateForm = ({
  title = "Create",
  fields = [],
  submitUrl = "",
  showVariantCreator = false,
  sizeOptions = [],
  frameOptions = [],
}) => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({});
  const [variants, setVariants] = useState([]);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: String(e.target.value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showVariantCreator && variants.length === 0) {
      alert("Please add at least one variant!");
      return;
    }

    try {
      const payload = { ...formData, variants };
      await axios.post(submitUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
      setSuccess(true);
      setFormData({});
      setVariants([]);
    } catch (err) {
      console.error(err);
      setSuccess(false);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 4, mt: 4 }}>
      <Snackbar open={success === true} autoHideDuration={3000} onClose={() => setSuccess(null)}>
        <Alert severity="success">Created successfully!</Alert>
      </Snackbar>

      <Snackbar open={success === false} autoHideDuration={3000} onClose={() => setSuccess(null)}>
        <Alert severity="error">Something went wrong</Alert>
      </Snackbar>

      <Paper sx={{ p: 4, width: 500, borderRadius: 2 }}>
        <Typography variant="h5" mb={3} align="center">{title}</Typography>

        <form onSubmit={handleSubmit}>
          {fields.map((field, idx) => (
            <TextField
              key={idx}
              fullWidth
              margin="normal"
              select={field.select}
              label={field.label}
              name={field.name}
              value={formData[field.name] ?? ""}
              onChange={handleChange}
              type={field.type || "text"}
            >
              {field.options?.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          ))}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, bgcolor: 'contrast.main' }}>
            Submit
          </Button>
        </form>
      </Paper>

      {showVariantCreator && (
        <CreateVariant
          sizeOptions={sizeOptions}
          frameOptions={frameOptions}
          variants={variants}
          setVariants={setVariants}
          basePrice={formData.price}
        />
      )}
    </Box>
  );
};

export default AdminCreateForm;
