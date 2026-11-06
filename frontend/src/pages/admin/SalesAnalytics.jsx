import React, { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import axios from "axios";

const RevenueDashboard = () => {
  const [revenueStats, setRevenueStats] = useState({});
  const [monthlyOrders, setMonthlyOrders] = useState([]);
  const [cumulativeRevenue, setCumulativeRevenue] = useState([]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    const fetchData = async () => {
      try {

        const revRes = await axios.get("/api/admin/revenueStats");
        const rev = (revRes.data.revenueStats && revRes.data.revenueStats[0]) || {};
        setRevenueStats(rev);

        const ordersRes = await axios.get("/api/admin/orderPerMonth");
        const orders = ordersRes.data.ordersPerMonth || [];
        const sortedOrders = orders.sort((a, b) => a.month - b.month)
          .map(o => ({ month: monthNames[o.month - 1], orders: Number(o.orders) }));

        setMonthlyOrders(sortedOrders);

        const cumulative = [];
        let total = 0;
        const AOV = rev.AOV || 0; 
        sortedOrders.forEach((o) => {
          total += AOV * o.orders;
          cumulative.push({ month: o.month, cumulativeRevenue: total });
        });
        setCumulativeRevenue(cumulative);


      } catch (err) {
        console.error("Error fetching revenue data:", err);
      }
    };
    fetchData();
  }, []);



  return (
    <Box sx={{ p: 5, width: "95%", minHeight: "100vh", bgcolor: "background.main", ml: 5 }}>
      <Typography variant="h4" sx={{ mb: 6 }}>Revenue & Orders Analytics</Typography>


      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", mb: 8 }}>
        <Paper sx={{ p: 3, mb: 5, borderRadius: 3, textAlign: "center", width: 220, bgcolor: "#915b5dff", color: "#fff" }}>
          <Typography>Total Revenue</Typography>
          <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>${Number(revenueStats.totalRevenue)?.toLocaleString()}</Typography>
        </Paper>
        <Paper sx={{ p: 3, mb: 5, borderRadius: 3, textAlign: "center", width: 220, bgcolor: "#d5b9b2" }}>
          <Typography>Paid Orders</Typography>
          <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>{revenueStats.totalOrders}</Typography>
        </Paper>
        <Paper sx={{ p: 3, mb: 5, borderRadius: 3, textAlign: "center", width: 220, bgcolor: "#915b5dff", color: "#fff" }}>
          <Typography>AOV</Typography>
          <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>${revenueStats.AOV?.toFixed(2)}</Typography>
        </Paper>
      </Box>
      <Paper sx={{ p: 3, mb: 5, borderRadius: 3, elevation: 5 }}>
        <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>Monthly Orders</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyOrders}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="orders" stroke="#c07300ff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>


      <Paper sx={{ p: 3, mb: 5, borderRadius: 3, elevation: 5 }}>
        <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>Cumulative Revenue</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cumulativeRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="cumulativeRevenue" stroke="#915b5dff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default RevenueDashboard;
