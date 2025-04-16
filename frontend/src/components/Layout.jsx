import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Container,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import PeopleIcon from "@mui/icons-material/People";

const Layout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <AppBar position="static" color="primary" sx={{ marginBottom: 4 }}>
        <Container maxWidth="xl">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Registration Portal
            </Typography>

            {/* Desktop Navigation */}
            <Box
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
            >
              <Button
                color="inherit"
                component={Link}
                to="/register"
                sx={{
                  mx: 1,
                  fontWeight: isActive("/register") ? "bold" : "normal",
                  borderBottom: isActive("/register")
                    ? "2px solid white"
                    : "none",
                }}
                startIcon={<AppRegistrationIcon />}
              >
                Register
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/users"
                sx={{
                  mx: 1,
                  fontWeight: isActive("/users") ? "bold" : "normal",
                  borderBottom: isActive("/users") ? "2px solid white" : "none",
                }}
                startIcon={<PeopleIcon />}
              >
                Users
              </Button>

              <IconButton
                onClick={handleMenuClick}
                color="inherit"
                edge="end"
                aria-label="account menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
              >
                <Avatar
                  sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}
                >
                  <PersonIcon />
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                {user && (
                  <MenuItem disabled>
                    <Typography variant="body2">
                      Logged in as: {user.username}
                    </Typography>
                  </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>

            {/* Mobile Navigation */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                color="inherit"
                onClick={handleMobileMenuToggle}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-mobile-appbar"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={mobileMenuOpen}
                onClose={handleMobileMenuToggle}
                keepMounted
              >
                <MenuItem
                  component={Link}
                  to="/register"
                  onClick={handleMobileMenuToggle}
                  selected={isActive("/register")}
                >
                  <AppRegistrationIcon sx={{ mr: 1 }} fontSize="small" />
                  Register
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/users"
                  onClick={handleMobileMenuToggle}
                  selected={isActive("/users")}
                >
                  <PeopleIcon sx={{ mr: 1 }} fontSize="small" />
                  User List
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <main>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Outlet />
        </Container>
      </main>

      <Box
        component="footer"
        sx={{ py: 3, bgcolor: "background.paper", textAlign: "center" }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Registration Portal. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default Layout;
