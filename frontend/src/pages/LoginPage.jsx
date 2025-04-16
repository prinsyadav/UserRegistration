import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Grid,
  Card,
  CardMedia,
  Slide,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    if (error) setError("");
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!credentials.username || !credentials.password) {
      setError("Username and password are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await login(credentials);
      // Store the JWT token via auth context
      authLogin(response.data.token, { username: credentials.username });
      // Redirect to registration page after successful login
      navigate("/register");
    } catch (err) {
      console.error("Login failed:", err);
      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else {
        setError(
          err.response?.data || err.message || "Login failed. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid
        container
        spacing={0}
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid item xs={12} md={8} lg={6}>
          <Slide direction="up" in={true} timeout={500}>
            <Paper
              elevation={6}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                height: { sm: "500px" },
              }}
            >
              {/* Left side - Login form */}
              <Box
                sx={{
                  flex: { xs: "1", sm: "1 1 55%" },
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <Typography
                    variant="h4"
                    component="h1"
                    color="primary"
                    fontWeight="bold"
                  >
                    Login
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1 }}
                  >
                    Sign in to access the registration portal
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={credentials.username}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    value={credentials.password}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isLoading}
                    startIcon={
                      isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <LoginIcon />
                      )
                    }
                    sx={{ mt: 4, mb: 2, py: 1.5 }}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>

                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Typography variant="body2" color="textSecondary">
                      Default test accounts: admin/admin123 or user/user123
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Right side - Info/Welcome Card */}
              <Box
                sx={{
                  flex: { xs: "1", sm: "1 1 45%" },
                  bgcolor: "primary.main",
                  color: "white",
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <AppRegistrationIcon sx={{ fontSize: 60, mb: 3 }} />
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  fontWeight="bold"
                >
                  Registration Portal
                </Typography>
                <Divider
                  sx={{ width: "40%", my: 2, bgcolor: "rgba(255,255,255,0.3)" }}
                />
                <Typography variant="body1" paragraph>
                  Welcome to our secure user registration system
                </Typography>
                <Typography variant="body2" sx={{ maxWidth: "80%" }}>
                  This application processes registration data using Redis
                  validation and Kafka messaging to ensure reliable data
                  processing.
                </Typography>
              </Box>
            </Paper>
          </Slide>
        </Grid>
      </Grid>
    </Container>
  );
}

export default LoginPage;
