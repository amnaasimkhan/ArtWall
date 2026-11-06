import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Box, Typography, Avatar, Divider, Card, CardContent, Stack, Chip } from "@mui/material";
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext); // fixed missing import
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`/api/user/profile/${currentUser.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  if (!user) return null;

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          sx={{ width: 70, height: 70, bgcolor: "primary.main" }}
          src={user.profile_image}
        >
          {user.name[0].toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h5" fontFamily="PlayFair Display" fontWeight="bold">{user.name}</Typography>
          <Typography color="contrast.main">{user.email}</Typography>
          <Typography variant="body2">
            Member since {new Date(user.created_at).toLocaleDateString()}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Order History
      </Typography>

      {user.order_history.length === 0 && (
        <Typography variant="body2" color="text.secondary">No orders yet.</Typography>
      )}

      {user.order_history.map((order) => (
        <Card key={order.order_detail_id} sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight={600} sx={{ textTransform: "capitalize" }}>
                {order.artwork_title}
              </Typography>
              <Chip label={order.status} size="large" sx={{ bgcolor: "secondary.main" }} />
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ textTransform: "capitalize" }}>
              Size: {order.size_name} | Frame: {order.frame_name}
            </Typography>
            <Typography variant="body2">
              Quantity: {order.quantity} | Price: ${order.variant_price}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ordered on: {new Date(order.order_created_at).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
