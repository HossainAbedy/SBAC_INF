import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COLORS, getRandomColor } from "../utils/RandomColors"; // Import a function for random color generation
import BreadcrumbNavigation from "../utils/BreadcrumbNavigation";
import FilterSelect from "../utils/FilterSelect";
import DeviceCard from "../utils/DeviceCard";
import PieChartComponent from "../utils/PieChartComponent";
import BarChartComponent from "../utils/BarChartComponent";
import { Grid, CircularProgress } from "@mui/material";

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
      <BreadcrumbNavigation navigate={navigate} />

      {/* Filters */}
      <Grid container spacing={3} sx={{ mb: 3, alignItems: "center" }}>
        <Grid item xs={12} sm={6} md={4}>
          <FilterSelect
            label="Filter by Device Type"
            value={selectedDeviceType}
            onChange={handleDeviceTypeChange}
            options={deviceSummary.map((d) => ({ value: d.type, label: d.type }))}
            disabled={!!selectedLocation}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FilterSelect
            label="Filter by Location"
            value={selectedLocation}
            onChange={handleLocationChange}
            options={locationSummary.map((l) => ({ value: l.location, label: l.location }))}
            disabled={!!selectedDeviceType}
          />
        </Grid>
      </Grid>

      {/* Device Type Cards */}
      <Grid container spacing={3} justifyContent="center">
        {(selectedLocation ? filteredLocationSummary[0]?.devices :filteredDeviceSummary).map((device, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <DeviceCard device={device} color={COLORS[index % COLORS.length]} onClick={handleSelectType} />
          </Grid>
        ))}
      </Grid>

      {/* Charts Section (Device)*/ }
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <PieChartComponent title="Device Distribution by Type" data={displayedDeviceData} dataKey="count" nameKey="type" onLegendClick={setSelectedDeviceType} selectedKey={selectedDeviceType} />
        <PieChartComponent title="Device Distribution by Location" data={displayedLocationData} dataKey="count" nameKey="location" onLegendClick={setSelectedLocation} selectedKey={selectedLocation} />
      </Grid>
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <BarChartComponent title="Device Count by Type" data={filteredDeviceSummary} dataKey="count" nameKey="type" onLegendClick={setSelectedDeviceType} selectedKey={selectedDeviceType} />
        <BarChartComponent title="Device Count by Location" data={filteredLocationSummary} dataKey="count" nameKey="location" onLegendClick={setSelectedLocation} selectedKey={selectedLocation} />
      </Grid>
    </div>
  );
};

export default InfraDashboard;
