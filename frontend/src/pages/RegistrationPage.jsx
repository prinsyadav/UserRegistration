import React, { useState } from "react";
import RegistrationForm from "../components/RegistrationForm";
import {
  Container,
  Paper,
  Typography,
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
  Grow,
} from "@mui/material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

function RegistrationPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState({
    success: false,
    message: "",
  });

  const handleFormSubmissionResult = (success, message) => {
    setSubmitResult({ success, message });
    setFormSubmitted(true);

    // Clear success message after 5 seconds
    if (success) {
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          color="primary"
          sx={{ mb: 4, fontWeight: "bold" }}
        >
          User Registration
        </Typography>
      </Grid>

      <Grid item xs={12} md={5}>
        <Card
          elevation={3}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <AppRegistrationIcon
                sx={{ fontSize: 80, color: "primary.main", opacity: 0.8 }}
              />
            </Box>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              align="center"
              color="primary"
            >
              Welcome to Registration Portal
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              paragraph
              align="center"
            >
              Fill out the registration form to submit your details for
              processing. Your information will be securely stored in our
              database after validation.
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              paragraph
              align="center"
              sx={{ mt: 3 }}
            >
              All fields marked with * are required. Please ensure you provide
              accurate information to avoid processing delays.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {formSubmitted && (
            <Grow in={formSubmitted}>
              <Box sx={{ mb: 3 }}>
                <Alert
                  severity={submitResult.success ? "success" : "error"}
                  onClose={() => setFormSubmitted(false)}
                  variant="filled"
                >
                  {submitResult.message}
                </Alert>
              </Box>
            </Grow>
          )}

          <RegistrationForm onSubmissionResult={handleFormSubmissionResult} />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default RegistrationPage;
