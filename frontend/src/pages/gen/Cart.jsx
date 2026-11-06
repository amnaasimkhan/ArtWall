import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardMedia, Box, CardContent, IconButton, TextField, Button } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/login");
    fetchCart();
  }, [token]);

  const fetchCart = async () => {
    try {
      const res = await axios.get("/api/cart/fetchCart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
      const total = res.data.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotalAmount(total);
    } catch (err) { console.error(err); }
  };

  const updateQuantity = async (cart_item_id, sign) => {
    try {
      await axios.put("/api/cart/updateItemQuantity", { cart_item_id, sign }, { headers: { Authorization: `Bearer ${token}` } });
      fetchCart();
    } catch (err) { console.error(err); }
  };

  const goToPayment = () => {
    navigate("/payment", { state: { cartItems, totalAmount } });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontFamily={"PlayFair Display"}  fontStyle='italic' sx={{ mt: 10, mb: 3 }}>Shopping Cart</Typography>
      {cartItems.length === 0 ? (
        <Typography>Your cart is empty</Typography>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 4 }}>
          <Grid container spacing={2}>
            {cartItems.map(item => (
              <Grid item key={item.variant_id}>
                <Card sx={{ display: "flex", alignItems: "center", width: "50vw", bgcolor: "primary.main" }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 120, height: 120, ml: 3, borderRadius: 3 }}
                    image={`/api/images${item.artwork_image}`}
                    alt={item.artwork_title}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">{item.artwork_title.toUpperCase()}</Typography>
                    <Typography variant="body2">Size: {item.size}, Frame: {item.frame || "None"}</Typography>
                    <Typography variant="body2">Price: ${item.price}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1, justifyContent: "flex-end" }}>
                      <IconButton onClick={() => updateQuantity(item.cart_item_id, "-")}><Remove /></IconButton>
                      <TextField value={item.quantity} size="small" sx={{ width: 40, mx: 1 }} readOnly />
                      <IconButton onClick={() => updateQuantity(item.cart_item_id, "+")}><Add /></IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Card sx={{ display: 'flex', flexDirection: 'column', width: 400, p: 4 }}>
            <Typography variant="h5" fontWeight="bold">Total: ${totalAmount.toFixed(2)}</Typography>
            <Button variant="contained" sx={{ mt: 2, bgcolor: 'contrast.main' }} onClick={goToPayment}>
              Proceed to Payment
            </Button>
          </Card>
        </Box>
      )}
    </Container>
  );
};

export default CartPage;
