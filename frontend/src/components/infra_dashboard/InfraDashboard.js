import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Grid, Card, CardActionArea, CardContent, Typography, CircularProgress } from "@mui/material";

const InfraDashboard = ({ onSelectType }) => {
  const [deviceSummary, setDeviceSummary] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/devices/summary")
      .then((res) => setDeviceSummary(res.data))
      .catch((err) => console.error("Error fetching device summary:", err));
  }, []);

  const handleSelectType = (type) => {
    onSelectType(type);
    navigate("/devices");  // Navigate to DeviceList
  };

  if (deviceSummary.length === 0) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
      {deviceSummary.map((device) => (
        <Grid item key={device.type} xs={12} sm={6} md={4} lg={3}>
          <Card sx={{ boxShadow: 3 }}>
            <CardActionArea onClick={() => handleSelectType(device.type)}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="primary">
                  {device.type}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {device.count} devices
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default InfraDashboard;
