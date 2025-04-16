import React from "react";
import UserTable from "../components/UserTable";
import { Paper, Typography, Box, Grid, Card, CardContent } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";

function UserListPage() {
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
          Registered Users
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Card elevation={1} sx={{ mb: 3, bgcolor: "#f8f9fa" }}>
          <CardContent sx={{ display: "flex", alignItems: "center" }}>
            <PeopleIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                User Directory
              </Typography>
              <Typography variant="body2" color="textSecondary">
                This table shows all users who have successfully registered
                through our portal. You can sort by any column, search for
                specific users, and navigate through pages.
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <UserTable />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default UserListPage;
