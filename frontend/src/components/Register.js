import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS for styling
import { 
  Container, TextField, Button, Typography, Grid, Box, Card, CardContent, Alert 
} from "@mui/material";

function Register() {
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRegisterForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  const btnRegister = async (event) => {
    event.preventDefault();
    
    // Check for empty fields
    if (!registerForm.username || !registerForm.email || !registerForm.password) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/register", registerForm);
      console.log(response);
      
      // Display success message and redirect to login
      toast.success("Registration Successful!");
      navigate("/login");
      
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        setError("Registration failed. Please check your details.");
        toast.error("Registration failed. Please check your details.");
      }
    }

    // Reset form after submission
    setRegisterForm({
      username: "",
      email: "",
      password: ""
    });
  };

  return (
    <Container maxWidth="sm">
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "90vh" }}>
        
        <Grid item xs={12}>
          <Card elevation={3} sx={{ padding: 3, borderRadius: 3 }}>
            <CardContent>
              <Grid item xs={12} sm={6}>
                <img
                  src="https://as1.ftcdn.net/v2/jpg/03/39/70/90/1000_F_339709048_ZITR4wrVsOXCKdjHncdtabSNWpIhiaR7.jpg"
                  alt="Login"
                  style={{ width: "100%", borderRadius: "10px" }}
                />
              </Grid>
              <Typography variant="h5" align="center" gutterBottom>
                Create Your Account
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Box component="form" onSubmit={btnRegister} noValidate>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={registerForm.username}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  required
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  required
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 3 }}
                >
                  Register
                </Button>
              </Box>

              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Already have an account?{" "}
                <Button href="/login" color="secondary">
                  Login
                </Button>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Toast container for showing toasts */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
    </Container>
  );
}

export default Register;
