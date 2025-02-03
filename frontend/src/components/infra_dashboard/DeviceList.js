import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Grid, Card, CardActionArea, CardContent, Typography, CircularProgress, Container } from "@mui/material";

const DeviceList = ({ selectedType, onSelectDevice }) => {
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedType) return;
    axios.get(`http://localhost:5000/api/devices/${selectedType}`)
      .then((res) => setDevices(res.data))
      .catch((err) => console.error("Error fetching devices:", err));
  }, [selectedType]);

  const handleSelectDevice = (id) => {
    onSelectDevice(id);
    navigate(`/device/${id}`);  // Navigate to DeviceDetails
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
      <Typography variant="h5" gutterBottom align="center" color="primary">
        {selectedType} Devices
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {devices.map((device) => (
          <Grid item key={device.id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ boxShadow: 3 }}>
              <CardActionArea onClick={() => handleSelectDevice(device.id)}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6">{device.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {device.location}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DeviceList;
