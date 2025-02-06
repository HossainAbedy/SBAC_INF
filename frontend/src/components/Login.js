import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, TextField, Button, Typography, Checkbox, FormControlLabel, Box, Grid, Paper, Alert } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS for styling

const Login = ({ setToken }) => {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://172.19.100.110:5000/logintoken", {
        email: loginForm.email,
        password: loginForm.password
      });
      setToken(response.data.access_token);
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("email", loginForm.email);
      toast.success("Successfully Logged In!");  // Toast notification
      navigate("/infra");
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Invalid credentials. Please try again.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }

    setLoginForm({ email: "", password: "" });
  };

  return (
    <Container maxWidth="xl">
      <Paper elevation={3} sx={{ p: 4, mt: 5, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <img
              src="https://as1.ftcdn.net/v2/jpg/03/39/70/90/1000_F_339709048_ZITR4wrVsOXCKdjHncdtabSNWpIhiaR7.jpg"
              alt="Login"
              style={{ width: "100%", borderRadius: "10px" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
              Log Into Your Account
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleChange}
                margin="normal"
                required
              />

              <FormControlLabel control={<Checkbox />} label="Remember me" />

              <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                Login
              </Button>

              <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                Don't have an account? <Link to="/register" style={{ color: "#1976d2", textDecoration: "none" }}>Register</Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      {/* Toast container for showing toasts */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
    </Container>
  );
};

export default Login;
