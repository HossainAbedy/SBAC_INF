import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import HomeIcon from "@mui/icons-material/Home";
import DevicesIcon from "@mui/icons-material/Devices";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { getRandomColor } from "../utils/RandomColors"; // Import a function for random color generation
import {
  Grid, Card, CardActionArea, CardContent, FormControl, CircularProgress,
  Breadcrumbs, Link, MenuItem,Select, Typography, InputLabel 
} from "@mui/material";

// Define chart colors
const COLORS = [
  // Original colors
  "#FF4565", // Coral Red
  "#00D0D6", // Cyan
  "#00FF99", // Mint Green
  "#FFBB28", // Yellow
  "#FF8042", // Orange
  
  // New additions (10 vibrant colors)
  "#0088FE", // Blue
  "#00C49F", // Teal
  "#A463F2", // Lavender
  "#FF6E4A", // Salmon
  "#7C4DFF", // Deep Blue
  "#AF19FF", // Purple
  "#FF55A3", // Pink
  "#40E0D0", // Turquoise
  "#FFA343", // Peach
  "#9C27B0", // Dark Purple
];

const InfraDashboard = ({ onSelectType }) => {
  const [deviceSummary, setDeviceSummary] = useState([]);
  const [locationSummary, setLocationSummary] = useState([]);
  const [filteredDeviceSummary, setFilteredDeviceSummary] = useState([]);
  const [filteredLocationSummary, setFilteredLocationSummary] = useState([]);
  const [selectedDeviceType, setSelectedDeviceType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://172.19.100.110:5000/api/devices/summary")
      .then((res) => {
        setDeviceSummary(res.data);
        setFilteredDeviceSummary(res.data);
        // console.log(res.data);
      })
      .catch((err) => console.error("Error fetching device summary:", err));

    axios.get("http://172.19.100.110:5000/api/devices/by-location")
      .then((res) => {
        setLocationSummary(res.data);
        setFilteredLocationSummary(res.data);
        // console.log(res.data);
      })
      .catch((err) => console.error("Error fetching devices by location:", err));
  }, []);

  const handleDeviceTypeChange = (event) => {
    const selectedType = event.target.value;
    setSelectedDeviceType(selectedType);

    const filtered = (selectedLocation 
        ? locationSummary.find(l => l.location === selectedLocation)?.devices || deviceSummary 
        : deviceSummary
    )
    .filter(device => !selectedType || device.type === selectedType)
    .reduce((acc, device) => {
        const existing = acc.find(d => d.type === device.type);
        if (existing) {
            existing.count += device.count; // Accumulate count for the same type
        } else {
            acc.push({ type: device.type, count: device.count });
        }
        return acc;
    }, []);
    setFilteredDeviceSummary(filtered);
};
  

  // Filter Device data based on legend click
  const displayedDeviceData = selectedDeviceType
    ? filteredDeviceSummary.filter((entry) => entry.type === selectedDeviceType)
    : filteredDeviceSummary;

  // Handle Location Filter
  const handleLocationChange = (event) => {
    const selectedLoc = event.target.value;
    setSelectedLocation(selectedLoc);

    if (!selectedLoc) {
        setFilteredLocationSummary(locationSummary);
        return;
    }

    const filteredLocations = locationSummary.filter(l => l.location === selectedLoc);

    console.log("Filtered Locations:", filteredLocations);
    filteredLocations.forEach(loc => {
        console.log("Devices at", loc.location, ":", loc.devices);
    });

    // Aggregate device counts per type
    const aggregatedDevices = filteredLocations
        .flatMap(l => l.devices)
        .reduce((acc, device) => {
            const deviceType = device.type;

            if (!acc[deviceType]) {
                acc[deviceType] = { type: deviceType, count: 1 }; // Initialize count
            } else {
                acc[deviceType].count += 1; // Increment count
            }
            return acc;
        }, {});

    // Convert object to array
    const deviceSummaryArray = Object.values(aggregatedDevices);

    console.log("Final Aggregated Devices:", deviceSummaryArray);
    setFilteredLocationSummary([{ location: selectedLoc, devices: deviceSummaryArray }]);
  };

  // Filter Location data based on legend click
  const displayedLocationData = selectedLocation
    ? filteredLocationSummary.filter((entry) => entry.location === selectedLocation)
    : filteredLocationSummary;

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
      <Grid container spacing={3} sx={{ mb: 3, alignItems: "center" }}>
        {/* Filter by Device Type */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl 
            fullWidth 
            sx={{ bgcolor: "white", borderRadius: 2, boxShadow: 1 }}
            disabled={!!selectedLocation} // Disable if a location is selected
          >
            <InputLabel sx={{ fontSize: 14 }}>Filter by Device Type</InputLabel>
            <Select
              value={selectedDeviceType}
              onChange={handleDeviceTypeChange}
              sx={{ height: 45, fontSize: 14 }}
            >
              <MenuItem value="">All</MenuItem>
              {deviceSummary.map((device) => (
                <MenuItem key={device.type} value={device.type}>
                  {device.type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Filter by Location */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl 
            fullWidth 
            sx={{ bgcolor: "white", borderRadius: 2, boxShadow: 1 }}
            disabled={!!selectedDeviceType} // Disable if a device type is selected
          >
            <InputLabel sx={{ fontSize: 14 }}>Filter by Location</InputLabel>
            <Select
              value={selectedLocation}
              onChange={handleLocationChange}
              sx={{ height: 45, fontSize: 14 }}
            >
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
        {(selectedLocation ? filteredLocationSummary[0]?.devices : filteredDeviceSummary).map((device, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
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
                data={displayedDeviceData}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                // label={({ name, count }) => `${name} ${(percent * 100).toFixed(1)}%`}
                label={({ name, count }) => `${name} ${count}`}
              >
                {displayedDeviceData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ overflowY: "auto", maxHeight: "150px", marginLeft: "20px" }} // Add spacing
                onClick={(e) => setSelectedDeviceType(e.value === selectedDeviceType ? null : e.value)} // Toggle selection
              />
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
                data={displayedLocationData}
                dataKey="count"
                nameKey="location"
                cx="50%" // Shift left for better spacing
                cy="50%"
                outerRadius={100} // Increase for better visibility
                fill="#8884d8"
                label={({ value, x, y }) => (
                  <text x={x} y={y} textAnchor="middle" fontSize={16} fill={getRandomColor()}>
                    {value}
                  </text>
                )}
              >
                {displayedLocationData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={getRandomColor()} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ overflowY: "auto", maxHeight: "150px", marginLeft: "20px" }} // Add spacing
                onClick={(e) => setSelectedLocation(e.value === selectedLocation ? null : e.value)} // Toggle selection
              />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>

      {/* Charts Section (Location)*/ }
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {/* Pie Chart: Devices by Location */}
        <Grid item xs={12} md={6}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={filteredDeviceSummary}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.1)" }} />
              <Legend />
              <Bar dataKey="count" barSize={40}>
                {filteredDeviceSummary.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getRandomColor()} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Grid>

        {/* Bar Chart: Devices by Location */}
        <Grid item xs={12} md={6}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={filteredLocationSummary}>
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.1)" }} />
              <Legend />
              <Bar dataKey="count" barSize={40}>
                {filteredLocationSummary.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getRandomColor()} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default InfraDashboard;
