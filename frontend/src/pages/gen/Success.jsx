import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 10, textAlign: "center" }}>
      <CheckCircleOutline sx={{ fontSize: 80, color: "green" }} />
      <Typography variant="h4" fontWeight="bold" sx={{ mt: 3 }}>
        Payment Successful!
      </Typography>
      <Typography sx={{ mt: 2, mb: 4 }}>
        Thank you for your purchase. Your order has been placed successfully.
      </Typography>
      <Box>
        <Button
          variant="contained"
          sx={{bgcolor:'contrast.main', color:"white"}}
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default Success;
