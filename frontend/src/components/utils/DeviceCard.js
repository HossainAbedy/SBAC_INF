import React from "react";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

const DeviceCard = ({ device, color, onClick }) => {
  return (
    <Card
      sx={{
        boxShadow: 3,
        backgroundColor: color,
        color: "#fff",
        "&:hover": { transform: "scale(1.05)", transition: "0.3s" },
      }}
    >
      <CardActionArea onClick={() => onClick(device.type)}>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {device.type}
          </Typography>
          <Typography variant="body2">{device.count} devices</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default DeviceCard;
