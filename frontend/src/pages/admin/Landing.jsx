// ========== src/pages/admin/Landing.jsx ==========
import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import axios from "axios";

const Landing = () => {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const COLORS = ["#915b5dff", "#d5b9b2", "#c07300ff", "#e9a239ff"];
  const token = localStorage.getItem("token")
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStats(res.data.stats || {});
        setSalesData(res.data.salesData || []);
        setCategoryData(res.data.categoryData || []);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      }
    };
    fetchDashboard();
  }, []);

  if (!stats) return <div>Loading...</div>;


  return (
    <Box sx={{ p: 5, width: "95%", minHeight: "100vh", bgcolor: "background.main" }}>
      <Typography variant="h4" sx={{ mb: 6 }}>
        Dashboard
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 4,
          mb: 8
        }}
      >
        {[
          { label: "Total Artworks", value: stats.totalArtworks },
          { label: "Total Artists", value: stats.totalArtists },
          { label: "Total Revenue", value: `$${stats.totalRevenue }`},
          { label: "Total Orders", value: stats.totalOrders },
          { label: "Pending Orders", value: stats.pendingOrders },
        ].map((item, i) => (
          <Card
            key={i}
            elevation={5}
            sx={{
              borderRadius: 3,
              width: 200,
              height: 140,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              bgcolor: "secondary.main",
              flexDirection: "column",
              ...(item.label === "Total Revenue" && {
                bgcolor: "contrast.main",
                color: "white"
              })
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" color={item.label === "Total Revenue" ? "white" : "#542a2cff"}>
                {item.label}
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                {item.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 5
        }}
      >

        <Card elevation={5} sx={{ borderRadius: 3, width: 600, height: 450 }}>
          <CardContent sx={{ height: "100%" }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3, textAlign: "center" }}>
              Monthly Sales
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill={"#915b5dff"} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>


        <Card elevation={5} sx={{ borderRadius: 3, width: 500, height: 450 }}>
          <CardContent sx={{ height: "100%" }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3, textAlign: "center" }}>
              Sales by Categories
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  label
                  dataKey="value"
                >
                  {(categoryData || []).map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Landing;
