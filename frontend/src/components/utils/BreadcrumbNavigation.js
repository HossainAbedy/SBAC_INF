import React from "react";
import { Breadcrumbs, Typography, Link } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import DevicesIcon from "@mui/icons-material/Devices";

const BreadcrumbNavigation = ({ navigate }) => {
  return (
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
  );
};

export default BreadcrumbNavigation;
