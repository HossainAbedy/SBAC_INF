import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, CardContent, Typography, Avatar, Grid, Box, Alert } from "@mui/material";

const Profile = ({ token, setToken }) => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState("");
  const email = localStorage.getItem("email");

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    axios({
      method: "GET",
      url: `http://127.0.0.1:5000/profile/${email}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const res = response.data;
        if (res.access_token) setToken(res.access_token);
        setProfileData({
          profile_name: res.name,
          profile_email: res.email,
          profile_role: res.role,
        });
      })
      .catch((error) => {
        if (error.response) {
          setError("Failed to load profile data. Please try again.");
        }
      });
  };

  const getRoleColor = (role) => {
    return role === 1 ? "error.main" : role === 2 ? "success.main" : "text.primary";
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      {error && <Alert severity="error">{error}</Alert>}

      {profileData && (
        <Card elevation={3} sx={{ borderRadius: 3, p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4} textAlign="center">
              <Avatar
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                sx={{ width: 120, height: 120, mx: "auto" }}
              />
              <Typography variant="h6" fontWeight="bold" mt={2}>
                {profileData.profile_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Coder
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Your Profile Details
                </Typography>

                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">Email</Typography>
                    <Typography>{profileData.profile_email}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">Name</Typography>
                    <Typography>{profileData.profile_name}</Typography>
                  </Box>
                </Box>

                <Box mt={2}>
                  <Typography variant="subtitle1" color="text.secondary">Role</Typography>
                  <Typography color={getRoleColor(profileData.profile_role)} fontWeight="bold">
                    {profileData.profile_role === 1 ? "ADMIN" : profileData.profile_role === 2 ? "USER" : "Unknown Role"}
                  </Typography>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      )}
    </Container>
  );
};

export default Profile;
