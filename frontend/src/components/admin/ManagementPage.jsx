import axios from "axios";
import ListItem from "../../components/admin/ListItem";
import { useState, useEffect } from "react";
import { Box, Button, Typography, TextField, Stack } from "@mui/material";
import { Link } from "react-router-dom";

const ManagementPage = ({ fetchUrl, header, arrayName, keyName, fields, updateStatusUrl, enableStatusUpdate, deleteUrl, editUrl }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token")
  const fetchData = async () => {
    try {
      const response = await axios.get(fetchUrl);
      return response.data[arrayName] || [];
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
      return [];
    }
  };

  const handleDelete = deleteUrl
    ? async (id) => {
      try {
        await axios.delete(`${deleteUrl}/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          });
        setData(prev =>
          prev.filter(item => item[keyName + "_id"] !== id)
        );
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to delete item");
      }
    }
    : null;


  const loadData = async () => {
    const result = await fetchData();
    setData(result);
  };

  useEffect(() => {
    loadData();
  }, [fetchUrl]);


  const filteredData = data.filter((item) =>
    String(item[fields.titleKey]).toLowerCase().includes(search.toLowerCase())
  );


const handleStatusUpdate = async (id, newStatus) => {
  try {
    
    await axios.put(`${updateStatusUrl}/${id}`, { status: newStatus },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setData((prev) =>
      prev.map((item) => (item[keyName + "_id"] === id ? { ...item, status: newStatus } : item))
    );
  } catch (err) {
    console.error("Status update failed:", err);
    setError(err?.response?.data?.message || "Failed to update status");
  }
};

  return (
    <Box sx={{ mt: 4, px: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={3}
        gap={2}
      >
        <Typography variant="h4">{header}</Typography>

        <Stack direction="row" spacing={2}>
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {header !== "Orders" && header !== "Customers" ? (
            <Button
              component={Link}
              to="create"
              variant="contained"
              sx={{ bgcolor: "contrast.main", color: "white" }}
            >
              Add
            </Button>
          ) : null}

        </Stack>
      </Stack>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}


      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
        }}
      >
        {filteredData.length ? (
          filteredData.map((item) => (
            <ListItem
              key={item[keyName + "_id"]}
              data={item}
              fields={fields}
              enableStatusUpdate={enableStatusUpdate}
              onStatusChange={(newStatus) =>
                handleStatusUpdate(item[keyName + "_id"], newStatus)
              }

              onDelete={deleteUrl ? () => handleDelete(item[keyName + "_id"]) : null}
              onEdit={editUrl ? () => handleEdit(item[keyName + "_id"]) : null}
            />

          ))
        ) : (
          <Typography>No items found</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ManagementPage;
