import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {Grid,Card,CardActionArea,CardContent,Typography,CircularProgress,Container,Breadcrumbs,Link,Box,CardMedia,} from "@mui/material";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DeviceList = ({ selectedType, onSelectDevice }) => {
  const [devices, setDevices] = useState([]);
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedType) return;

    axios.get(`http://172.19.100.110:5000/api/devices/${selectedType}`)
      .then((res) => {
        setDevices(res.data);
        generateChartData(res.data);
      })
      .catch((err) => console.error("Error fetching devices:", err));
  }, [selectedType]);

  const generateChartData = (devices) => {
    const locations = {};
    devices.forEach((device) => {
      locations[device.location] = (locations[device.location] || 0) + 1;
    });

    const labels = Object.keys(locations);
    const data = Object.values(locations);

    setChartData({
      pie: {
        labels,
        datasets: [
          {
            label: "Device Distribution",
            data,
            backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4caf50", "#ff9800"],
            hoverOffset: 4,
          },
        ],
      },
      bar: {
        labels,
        datasets: [
          {
            label: "Devices per Location",
            data,
            backgroundColor: "#36a2eb",
            borderColor: "#1e88e5",
            borderWidth: 1,
          },
        ],
      },
    });
  };

  const handleSelectDevice = (id) => {
    onSelectDevice(id);
    navigate(`/device/${id}`); // Navigate to DeviceDetails
  };

  const getDynamicColor = (id) => {
    const hue = (id * 137) % 360; // Generate a unique color based on ID
    return `hsl(${hue}, 70%, 80%)`; // Soft pastel colors
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
    <Container sx={{ mt: 3 }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
        <Link color="inherit" href="/" onClick={() => navigate("/")}>
          Home
        </Link>
        <Typography color="textPrimary">{selectedType} Devices</Typography>
      </Breadcrumbs>

      <Grid container spacing={2}>
        {/* Left Side: Devices (80%) */}
        <Grid item xs={12} md={9}>
          <Typography variant="h6" gutterBottom align="center" color="primary">
            {selectedType} Devices
          </Typography>

          <Grid container spacing={1} justifyContent="center">
            {devices.map((device) => (
              <Grid item key={device.id} xs={6} sm={4} md={3} lg={2}>
                <Card
                  sx={{
                    boxShadow: 2,
                    transition: "0.3s",
                    "&:hover": { boxShadow: 4 },
                    maxWidth: 140,
                    maxHeight: 130,
                    backgroundColor: getDynamicColor(device.id), // Dynamic color
                  }}
                >
                  <CardActionArea onClick={() => handleSelectDevice(device.id)}>
                    <CardMedia
                      component="img"
                      height="70"
                      image={device.image || "https://via.placeholder.com/100"}
                      alt={device.name}
                      sx={{ objectFit: "contain", p: 1, backgroundColor: "#f8f9fa" }}
                    />
                    <CardContent sx={{ p: 1, textAlign: "center" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {device.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {device.location}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

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
      </Grid>
    </Container>
  );
};

export default DeviceList;
