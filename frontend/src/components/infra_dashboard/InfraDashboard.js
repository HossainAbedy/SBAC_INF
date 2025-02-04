import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Grid, Card, CardActionArea, CardContent, Typography, CircularProgress,
  Breadcrumbs, Link, Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import HomeIcon from "@mui/icons-material/Home";
import DevicesIcon from "@mui/icons-material/Devices";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { getRandomColor } from "../utils/RandomColors"; // Import a function for random color generation

// Define chart colors
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const InfraDashboard = ({ onSelectType }) => {
  const [deviceSummary, setDeviceSummary] = useState([]);
  const [locationSummary, setLocationSummary] = useState([]);
  const [filteredDeviceSummary, setFilteredDeviceSummary] = useState([]);
  const [filteredLocationSummary, setFilteredLocationSummary] = useState([]);
  const [selectedDeviceType, setSelectedDeviceType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/devices/summary")
      .then((res) => {
        setDeviceSummary(res.data);
        setFilteredDeviceSummary(res.data);
      })
      .catch((err) => console.error("Error fetching device summary:", err));

    axios.get("http://localhost:5000/api/devices/by-location")
      .then((res) => {
        setLocationSummary(res.data);
        setFilteredLocationSummary(res.data);
      })
      .catch((err) => console.error("Error fetching devices by location:", err));
  }, []);

  // Handle Device Type Filter
  const handleDeviceTypeChange = (event) => {
    const selectedType = event.target.value;
    setSelectedDeviceType(selectedType);
    setFilteredDeviceSummary(
      selectedType ? deviceSummary.filter((d) => d.type === selectedType) : deviceSummary
    );
  };

  // Handle Location Filter
  const handleLocationChange = (event) => {
    const selectedLoc = event.target.value;
    setSelectedLocation(selectedLoc);
    setFilteredLocationSummary(
      selectedLoc ? locationSummary.filter((l) => l.location === selectedLoc) : locationSummary
    );
  };

  const handleSelectType = (type) => {
    onSelectType(type);
    navigate("/devices"); // Navigate to DeviceList
  };

  if (deviceSummary.length === 0) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
        <Link 
          underline="hover" 
          color="inherit" 
          href="#" 
          onClick={() => navigate("/")}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Typography color="text.primary" sx={{ display: "flex", alignItems: "center" }}>
          <DevicesIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Infrastructure Dashboard
        </Typography>
      </Breadcrumbs>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Filter by Device Type</InputLabel>
            <Select value={selectedDeviceType} onChange={handleDeviceTypeChange}>
              <MenuItem value="">All</MenuItem>
              {deviceSummary.map((device) => (
                <MenuItem key={device.type} value={device.type}>
                  {device.type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Filter by Location</InputLabel>
            <Select value={selectedLocation} onChange={handleLocationChange}>
              <MenuItem value="">All</MenuItem>
              {locationSummary.map((location) => (
                <MenuItem key={location.location} value={location.location}>
                  {location.location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Device Type Cards */}
      <Grid container spacing={3} justifyContent="center">
        {filteredDeviceSummary.map((device, index) => (
          <Grid item key={device.type} xs={12} sm={6} md={4} lg={3}>
            <Card 
              sx={{ 
                boxShadow: 3, 
                backgroundColor: COLORS[index % COLORS.length], 
                color: "#fff",
                "&:hover": { transform: "scale(1.05)", transition: "0.3s" }
              }}
            >
              <CardActionArea onClick={() => handleSelectType(device.type)}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {device.type}
                  </Typography>
                  <Typography variant="body2">
                    {device.count} devices
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section (Device)*/ }
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {/* Pie Chart: Devices by Type */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 0, textAlign: "center" }}>
            Device Distribution by Type
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={filteredDeviceSummary}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              >
                {filteredDeviceSummary.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Grid>

        {/* Bar Chart: Devices by Type */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Device Distribution by Location
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={filteredLocationSummary}
                dataKey="count"
                nameKey="location"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              >
                {filteredLocationSummary.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={getRandomColor()} />
                ))}
              </Pie>
              <Tooltip />
              {/* <Legend /> */}
            </PieChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>

      {/* Charts Section (Location)*/ }
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {/* Pie Chart: Devices by Location */}
        <Grid item xs={12} md={6}>
          {/* <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Devices by Location
          </Typography> */}
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={filteredDeviceSummary}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.1)" }} />
              <Legend />
              <Bar dataKey="count" fill={getRandomColor()} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Grid>

        {/* Bar Chart: Devices by Location */}
        <Grid item xs={12} md={6}>
          {/* <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Devices by Location
          </Typography> */}
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={filteredLocationSummary}>
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.1)" }} />
              <Legend />
              <Bar dataKey="count" fill={getRandomColor()} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default InfraDashboard;
