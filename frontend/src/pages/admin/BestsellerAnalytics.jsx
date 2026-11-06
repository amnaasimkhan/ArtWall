import React, { useEffect, useState } from "react";
import { Typography, Paper, Box } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import axios from "axios";

const TopListsDashboard = () => {
  const [artworks, setArtworks] = useState([]);
  const [styles, setStyles] = useState([]);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aRes = await axios.get("/api/admin/bestArtworks");
        setArtworks(aRes.data.bestsellingArtworks || []);

        const sRes = await axios.get("/api/admin/bestStyles");
        setStyles(sRes.data.bestsellingStyles || []);

        const arRes = await axios.get("/api/admin/bestArtists");
        setArtists(arRes.data.bestPerformingArtists || []);
      } catch (err) {
        console.error("Error fetching top lists:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Top Performance</Typography>

      <Paper sx={{ p: 3, mb: 4, width: "70vw" }}>
        <Typography variant="h6" gutterBottom>Bestselling Artworks</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={artworks} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="title" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="totalSold" fill="#915b5dff" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Bestselling Styles</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={styles} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="totalSold" fill="#c07300ff" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Best Performing Artists (Revenue)</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={artists} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Bar dataKey="revenue" fill="#e9a239ff" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default TopListsDashboard;
