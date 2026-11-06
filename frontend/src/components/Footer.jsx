import { Box, Typography, Stack, Button, TextField } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.main",
        color: "#222",
        mt: 6,
        pt: 3,
        pb: 2,
        textAlign: "center",
      }}
    >
      <Stack
        direction="row"
        justifyContent="center"
        padding={2}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <LocalShippingOutlinedIcon />
          <Typography>FAST DELIVERY</Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <SpaOutlinedIcon />
          <Typography>ECO FRIENDLY</Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <CreditScoreOutlinedIcon />
          <Typography>SAFE PAYMENTS</Typography>
        </Stack>
      </Stack>

   
      <Typography variant="h5" sx={{ mb: 1 }}>
        ARTFRAME
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Join our newsletter
      </Typography>
      <Stack
        direction="row"
        justifyContent="center"
        padding={2}
      >
        <TextField
          size="small"
          label="Email"
          variant="outlined"
          sx={{ width: 250 }}
        />
        <Button variant="contained" sx={{ bgcolor: "contrast.main", color: 'white' }}>
          Submit
        </Button>
      </Stack>

      <Stack
        direction="row"
        justifyContent="center"
        spacing={3}
      >
        <Typography>About Us</Typography>
        <Typography>Privacy Policy</Typography>
        <Typography>Terms and Conditions</Typography>
        <Typography>Customer Service</Typography>
      </Stack>

      <Typography variant="caption" color="contrast.main">
        © 2025 Artframe
      </Typography>
    </Box>
  );
};

export default Footer;
