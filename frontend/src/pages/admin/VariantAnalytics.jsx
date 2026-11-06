import React, { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer
} from "recharts";
import axios from "axios";

const VariantAnalytics = () => {
  const [variantStats, setVariantStats] = useState([]);
  const [quantityPerSize, setQuantityPerSize] = useState([]);
  const [quantityPerFrame, setQuantityPerFrame] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const variantRes = await axios.get("/api/admin/variantStats");

        // Convert totalSold to number and create combined label for variants
        const variants = (variantRes.data.variantStats || []).map(v => ({
          ...v,
          totalSold: Number(v.totalSold),
          label: `${v.sizeName} / ${v.frameName}`
        }));
        setVariantStats(variants);

        // Aggregate per size
        const sizeAgg = [];
        variants.forEach(v => {
          const existing = sizeAgg.find(s => s.size_id === v.size_id);
          if (existing) existing.totalSold += v.totalSold;
          else sizeAgg.push({ size_id: v.size_id, sizeName: v.sizeName, totalSold: v.totalSold });
        });
        setQuantityPerSize(sizeAgg);

        // Aggregate per frame
        const frameAgg = [];
        variants.forEach(v => {
          const existing = frameAgg.find(f => f.frame_id === v.frame_id);
          if (existing) existing.totalSold += v.totalSold;
          else frameAgg.push({ frame_id: v.frame_id, frameName: v.frameName, totalSold: v.totalSold });
        });
        setQuantityPerFrame(frameAgg);

      } catch (err) {
        console.error("Error fetching variant analytics:", err);
      }
    };
    fetchData();
  }, []);

  const cardStyle = { p: 4, mb: 6, borderRadius: 3, boxShadow: 3 };

  return (
    <Box sx={{ p: 5, width: "95%", minHeight: "100vh",  bgcolor: "background.main" }}>
      <Typography variant="h4" sx={{ mb: 6}}>
        Variant & Artwork Analytics
      </Typography>

      <Paper sx={cardStyle}>
        <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
          Quantity Sold per Variant
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={variantStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="label" 
              interval={0} 
              angle={-20} 
              textAnchor="end" 
              height={60} 
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => [value, "Total Sold"]}
              labelFormatter={(label) => label}
            />
            <Legend />
            <Bar dataKey="totalSold" fill="#c07300ff"  name="Total Sold" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Quantity per Size & Frame */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", mt: 5 }}>
        
        <Paper sx={{ ...cardStyle, width: 450, height: 350 }}>
          <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
            Quantity Sold per Size
          </Typography>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={quantityPerSize}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sizeName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalSold" fill="#915b5dff" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper sx={{ ...cardStyle, width: 450, height: 350 }}>
          <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
            Quantity Sold per Frame
          </Typography>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={quantityPerFrame}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="frameName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalSold" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

      </Box>
    </Box>
  );
};

export default VariantAnalytics;
