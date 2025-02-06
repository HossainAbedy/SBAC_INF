import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, CircularProgress, Grid, Breadcrumbs, Link } from "@mui/material";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const DeviceDetails = ({ deviceId }) => {
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://172.19.100.110:5000/api/device/details/${deviceId}`)
      .then((res) => setDetails(res.data))
      .catch((err) => console.error("Error fetching device details:", err));
  }, [deviceId]);

  if (!details)
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <CircularProgress />
      </div>
    );

  // Determine card border color based on status
  const getStatusColor = () => {
    switch (details.status) {
      case "Online":
        return "green";
      case "Offline":
        return "red";
      case "Maintenance":
        return "orange";
      default:
        return "gray";
    }
  };

  // Sample data for charts (replace with real data)
  const pieData = {
    labels: ["Used Bandwidth", "Available Bandwidth"],
    datasets: [
      {
        data: [details.bandwidth_usage, 100 - details.bandwidth_usage], // Assuming 100 Mbps total
        backgroundColor: ["#4caf50", "#ccc"],
      },
    ],
  };

  const barData = {
    labels: ["Uptime"],
    datasets: [
      {
        label: "Days Online",
        data: [details.uptime],
        backgroundColor: "#2196f3",
      },
    ],
  };

  return (
    <Grid container spacing={2} sx={{ mt: 3, px: 2 }}>
      {/* Breadcrumb Navigation */}
      <Grid item xs={12}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
          <Link 
            underline="hover" 
            color="inherit" 
            href="#" 
            onClick={() => navigate("/")}
            sx={{ display: "flex", alignItems: "center" }}
          >
            Home
          </Link>
          <Link 
            underline="hover" 
            color="inherit" 
            href="#" 
            onClick={() => navigate("/devices")}
            sx={{ display: "flex", alignItems: "center" }}
          >
            Devices
          </Link>
          <Typography color="text.primary">{details.name}</Typography>
        </Breadcrumbs>
      </Grid>

      {/* Device Details Section (80%) */}
      <Grid item xs={9}>
        <Card
          sx={{
            p: 3,
            boxShadow: 3,
            borderLeft: `5px solid ${getStatusColor()}`,
            borderRadius: "10px",
          }}
        >
          <CardContent>
            <Typography variant="h5" color="primary" gutterBottom>
              {details.name} - {details.type}
            </Typography>

            <Grid container spacing={2}>
              {[
                ["OEM", details.oem],
                ["Serial Number", details.serial_number],
                ["Firmware", details.firmware_version],
                ["Installation Date", details.installation_date || "N/A"],
                ["Bandwidth Usage", `${details.bandwidth_usage} Mbps`],
                ["Uptime", `${details.uptime} days`],
              ].map(([label, value], index) => (
                <Grid item xs={6} key={index}>
                  <Typography variant="body1">
                    <strong>{label}:</strong> {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Charts Section (20%) */}
      <Grid item xs={3} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Card sx={{ p: 2, boxShadow: 2, borderRadius: "10px" }}>
          <Typography variant="subtitle1" align="center">
            Bandwidth Usage
          </Typography>
          <Pie data={pieData} />
        </Card>

        <Card sx={{ p: 2, boxShadow: 2, borderRadius: "10px" }}>
          <Typography variant="subtitle1" align="center">
            Uptime
          </Typography>
          <Bar data={barData} />
        </Card>
      </Grid>
    </Grid>
  );
};

export default DeviceDetails;
