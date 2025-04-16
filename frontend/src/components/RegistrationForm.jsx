import React, { useState } from "react";
import { registerUser } from "../services/api";
import {
  TextField,
  Button,
  Grid,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
  Paper,
  Fade,
  Typography,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function RegistrationForm({ onSubmissionResult }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [animateField, setAnimateField] = useState("");

  // Hardcode or get from config/context
  const CLIENT_ID = "10";

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Set animation for field being edited
    setAnimateField(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser(formData, CLIENT_ID);
      onSubmissionResult(true, response.data || "Registration successful!");
      setFormData({ name: "", email: "", mobile: "", city: "" }); // Clear form
    } catch (err) {
      const errorMsg =
        err.response?.data || err.message || "Registration failed.";
      console.error("Registration Error:", err.response || err);
      onSubmissionResult(false, `Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 0, bgcolor: "transparent" }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography
          variant="h6"
          color="textSecondary"
          gutterBottom
          sx={{ mb: 2 }}
        >
          Enter your details below
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Fade in={true} timeout={animateField === "name" ? 400 : 0}>
              <TextField
                fullWidth
                required
                id="name"
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                error={Boolean(errors.name)}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Fade>
          </Grid>

          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={animateField === "email" ? 400 : 0}>
              <TextField
                fullWidth
                required
                id="email"
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Fade>
          </Grid>

          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={animateField === "mobile" ? 400 : 0}>
              <TextField
                fullWidth
                required
                id="mobile"
                name="mobile"
                label="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                error={Boolean(errors.mobile)}
                helperText={errors.mobile}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Fade>
          </Grid>

          <Grid item xs={12}>
            <Fade in={true} timeout={animateField === "city" ? 400 : 0}>
              <TextField
                fullWidth
                required
                id="city"
                name="city"
                label="City"
                value={formData.city}
                onChange={handleChange}
                error={Boolean(errors.city)}
                helperText={errors.city}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationCityIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Fade>
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CheckCircleOutlineIcon />
                )
              }
              sx={{ py: 1.5 }}
            >
              {isLoading ? "Submitting..." : "Register"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default RegistrationForm;
