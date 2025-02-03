import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, CircularProgress, Grid } from "@mui/material";

const DeviceDetails = ({ deviceId }) => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/device/details/${deviceId}`)
      .then((res) => setDetails(res.data))
      .catch((err) => console.error("Error fetching device details:", err));
  }, [deviceId]);

  if (!details)
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <CircularProgress />
      </div>
    );

  return (
    <Card sx={{ mt: 3, p: 2, maxWidth: 600, mx: "auto", boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" color="primary" gutterBottom>
          {details.name} - {details.type}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>OEM:</strong> {details.oem}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Serial Number:</strong> {details.serial_number}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Firmware:</strong> {details.firmware_version}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Installation Date:</strong> {details.installation_date || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Bandwidth Usage:</strong> {details.bandwidth_usage} Mbps
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Uptime:</strong> {details.uptime} days
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DeviceDetails;
