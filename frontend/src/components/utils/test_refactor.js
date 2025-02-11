import React, { useState } from "react";
import { Grid } from "@mui/material";
import BreadcrumbNavigation from "../utils/BreadcrumbNavigation";
import FilterSelect from "../utils/FilterSelect";
import DeviceCard from "../utils/DeviceCard";
import DevicePieChart from "../utils/DevicePieChart";
import DeviceBarChart from "../utils/DeviceBarChart";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const InfraDashboard = ({ navigate, deviceSummary, locationSummary }) => {
  const [selectedDeviceType, setSelectedDeviceType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleDeviceTypeChange = (event) => setSelectedDeviceType(event.target.value);
  const handleLocationChange = (event) => setSelectedLocation(event.target.value);
  const handleSelectType = (type) => setSelectedDeviceType(type);

  const filteredDeviceSummary = selectedLocation
    ? locationSummary.find((loc) => loc.location === selectedLocation)?.devices || []
    : deviceSummary;

  const displayedDeviceData = filteredDeviceSummary.map((d) => ({ name: d.type, count: d.count }));
  const displayedLocationData = locationSummary.map((l) => ({ name: l.location, count: l.count }));

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
        {filteredDeviceSummary.map((device, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <DeviceCard device={device} color={COLORS[index % COLORS.length]} onClick={handleSelectType} />
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <DevicePieChart data={displayedDeviceData} dataKey="count" nameKey="name" title="Device Distribution by Type" colors={COLORS} onClick={setSelectedDeviceType} />
        </Grid>
        <Grid item xs={12} md={6}>
          <DevicePieChart data={displayedLocationData} dataKey="count" nameKey="name" title="Device Distribution by Location" colors={COLORS} onClick={setSelectedDeviceType} />
        </Grid>
        <Grid item xs={12} md={6}>
          <DeviceBarChart data={displayedDeviceData} dataKey="count" nameKey="name" title="Device Distribution by Type" colors={COLORS} />
        </Grid>
        <Grid item xs={12} md={6}>
          <DeviceBarChart data={displayedLocationData} dataKey="count" nameKey="name" title="Device Distribution by Location" colors={COLORS} />
        </Grid>
      </Grid>
    </div>
  );
};

export default InfraDashboard;
