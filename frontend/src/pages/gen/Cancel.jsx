import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { CancelOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 10, textAlign: "center" }}>
      <CancelOutlined sx={{ fontSize: 80, color: "red" }} />
      <Typography variant="h4" fontWeight="bold" sx={{ mt: 3 }}>
        Payment Cancelled
      </Typography>
      <Typography sx={{ mt: 2, mb: 4 }}>
        Your payment was not completed. You can try again or return to the store.
      </Typography>
      <Box>
        <Button
          variant="contained"
          sx={{bgcolor:'contrast.main', color:"white", mr: 2}}
          onClick={() => navigate("/cart")}
        >
          Back to Cart
        </Button>
        <Button
          variant="outlined"
          sx={{bgcolor:'contrast.main', color:"white"}}
          onClick={() => navigate("/")}
        >
          Home
        </Button>
      </Box>
    </Container>
  );
};

export default Cancel;
