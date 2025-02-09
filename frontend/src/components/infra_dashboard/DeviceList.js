import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CircularProgress,
  Container,
  Breadcrumbs,
  Link,
  Box,
  CardMedia,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
} from "@mui/material";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DeviceList = ({ selectedType, onSelectDevice }) => {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [viewMode, setViewMode] = useState("cards");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedType) return;
    setLoading(true);
    axios
      .get(`http://172.19.100.110:5000/api/devices/${selectedType}`)
      .then((res) => {
        setDevices(res.data);
        setFilteredDevices(res.data);
        generateChartData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load devices");
        setLoading(false);
      });
  }, [selectedType]);

  useEffect(() => {
    let filtered = devices;
    if (searchTerm) {
      filtered = filtered.filter((device) =>
        device.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (locationFilter) {
      filtered = filtered.filter((device) => device.location === locationFilter);
    }
    setFilteredDevices(filtered);
  }, [searchTerm, locationFilter, devices]);

  const generateChartData = (devices) => {
    const locations = {};
    devices.forEach((device) => {
      locations[device.location] = (locations[device.location] || 0) + 1;
    });
    const labels = Object.keys(locations);
    const data = Object.values(locations);

    setChartData({
      pie: { labels, datasets: [{ label: "Device Distribution", data, backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4caf50", "#ff9800"], hoverOffset: 4 }] },
      bar: { labels, datasets: [{ label: "Devices per Location", data, backgroundColor: "#36a2eb", borderColor: "#1e88e5", borderWidth: 1 }] },
    });
  };

  const handleSelectDevice = (id) => {
    onSelectDevice(id);
    navigate(`/device/${id}`);
  };

  const COLORS = [
    // Original colors
    "#0088FE", // Blue
    "#00C49F", // Teal
    "#FFBB28", // Yellow
    "#FF8042", // Orange
    "#AF19FF", // Purple
  
    // New additions (10 vibrant colors)
    "#FF4565", // Coral Red
    "#00D0D6", // Cyan
    "#A463F2", // Lavender
    "#FF6E4A", // Salmon
    "#7C4DFF", // Deep Blue
    "#00FF99", // Mint Green
    "#FF55A3", // Pink
    "#40E0D0", // Turquoise
    "#FFA343", // Peach
    "#9C27B0", // Dark Purple
  ];

  // const getDynamicColor = (id) => {
  //   const hue = (id * 137) % 360; // Generate a unique color based on ID
  //   return `hsl(${hue}, 70%, 80%)`; // Soft pastel colors
  // };

  const getDynamicColor = () => {
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    return COLORS[randomIndex];
  };

  if (!selectedType) {
    return <Typography variant="h6" align="center">Please select a device type.</Typography>;
  }

  if (devices.length === 0) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 3, display: "flex", flexDirection: "column" }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
        <Link color="inherit" href="/" onClick={() => navigate("/")}>Home</Link>
        <Typography color="textPrimary">{selectedType} Devices</Typography>
      </Breadcrumbs>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Search Device"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TextField
          select
          label="Filter by Location"
          variant="outlined"
          size="small"
          fullWidth
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <MenuItem value="">All Locations</MenuItem>
          {[...new Set(devices.map((d) => d.location))].map((location) => (
            <MenuItem key={location} value={location}>{location}</MenuItem>
          ))}
        </TextField>
      </Box>
      <Button variant="contained" onClick={() => setViewMode(viewMode === "cards" ? "table" : "cards")} sx={{ mb: 2 }}>
        Switch to {viewMode === "cards" ? "Table" : "Cards"} View
      </Button>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : viewMode === "cards" ? (
        <Grid container spacing={2}>
          {filteredDevices.map((device) => (
            <Grid item key={device.id} xs={6} sm={4} md={3} lg={2}>
              <Card sx={{ boxShadow: 2, transition: "0.3s", "&:hover": { boxShadow: 4 }, maxWidth: 140, maxHeight: 130, backgroundColor: getDynamicColor(device.id) }}>
                <CardActionArea onClick={() => handleSelectDevice(device.id)}>
                  <CardMedia
                    component="img"
                    height="70"
                    image={device.image || "https://via.placeholder.com/100"}
                    alt={device.name}
                    sx={{ objectFit: "contain", p: 1, backgroundColor: "#f8f9fa" }}
                  />
                  <CardContent>
                    <Typography variant="subtitle2">{device.name}</Typography>
                    <Typography variant="caption" color="textSecondary">{device.location}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>{device.id}</TableCell>
                  <TableCell>{device.name}</TableCell>
                  <TableCell>{device.location}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => handleSelectDevice(device.id)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Right Side: Charts (20%) */}
      <Grid item xs={12} md={3}>
          {chartData && (
            <>
              {/* Pie Chart */}
              <Card sx={{ p: 2, mb: 2, boxShadow: 3 }}>
                <Typography variant="subtitle1" align="center">Device Distribution</Typography>
                <Box sx={{ height: 220 }}>
                  <Pie data={chartData.pie} />
                </Box>
              </Card>

              {/* Bar Chart */}
              <Card sx={{ p: 2, boxShadow: 3 }}>
                <Typography variant="subtitle1" align="center">Devices per Location</Typography>
                <Box sx={{ height: 220 }}>
                  <Bar
                    data={chartData.bar}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </Box>
              </Card>
            </>
          )}
        </Grid>
    </Container>
  );
};

export default DeviceList;
