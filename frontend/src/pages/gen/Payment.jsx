import { Box, Typography, TextField, Paper, Stack, Divider, Button, MenuItem } from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const Payment = () => {
  const location = useLocation();
  const { cartItems, totalAmount } = location.state || [];
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    street_address: "",
    city: "",
    province: "",
    postal_code: "",
    country: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStripeCheckout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const customerEmail = user?.email;

      // 1) Save shipping address
      await axios.post(
        "/api/user/addShippingAddress",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2) Create order in backend and get orderId
      const orderRes = await axios.post(
        "/api/order/checkout",
        { items: cartItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { orderId } = orderRes.data;

      // 3) Call Stripe checkout session
      const stripeRes = await axios.post(
        "/api/checkout/stripe",
        { items: cartItems, customerEmail, orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = stripeRes.data.url;

    } catch (err) {
      console.error("Stripe checkout error:", err);
      alert("Payment failed, please try again.");
    }
  };

  const pakProvinces = [
    "Punjab",
    "Sindh",
    "Khyber Pakhtunkhwa",
    "Balochistan",
    "Islamabad Capital Territory",
    "Gilgit-Baltistan",
    "Azad Kashmir"
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, p: 4, minHeight: "100vh" }}>

      <Box flex={2}>
        <Typography variant="h4" gutterBottom fontFamily={"PlayFair Display"} fontStyle={'italic'}>Shipping Address</Typography>
        <Paper sx={{ p: 4, borderRadius: 3 }}>

          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            <TextField name="full_name" label="Full Name" fullWidth onChange={handleChange} />
            <TextField name="phone" label="Phone Number" fullWidth onChange={handleChange} />
            <TextField name="street_address" label="Street Address" fullWidth multiline onChange={handleChange} />
            <TextField name="city" label="City" fullWidth onChange={handleChange} />

         
            <TextField
              select
              name="province"
              label="Province"
              fullWidth
              value={form.province}
              onChange={handleChange}
            >
              {pakProvinces.map((prov) => (
                <MenuItem key={prov} value={prov}>{prov}</MenuItem>
              ))}
            </TextField>

            <TextField name="postal_code" label="Postal Code" fullWidth onChange={handleChange} />
            <TextField name="country" label="Country" fullWidth onChange={handleChange} />
          </Stack>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, bgcolor: "contrast.main" }}
            onClick={handleStripeCheckout}
          >
            Pay Now
          </Button>
        </Paper>
      </Box>

      <Box flex={1}>
        <Paper sx={{ p: 4, borderRadius: 3, position: "sticky", top: 20 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Order Summary</Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={1}>
            <Typography display="flex" justifyContent="space-between">
              <span>Subtotal:</span>
              <strong>${totalAmount?.toLocaleString()}</strong>
            </Typography>
            <Typography display="flex" justifyContent="space-between">
              <span>Shipping:</span>
              <strong>$0</strong>
            </Typography>
            <Typography display="flex" justifyContent="space-between">
              <span>Total:</span>
              <strong>${totalAmount?.toLocaleString()}</strong>
            </Typography>
          </Stack>
        </Paper>
      </Box>

    </Box>
  );
};

export default Payment;
