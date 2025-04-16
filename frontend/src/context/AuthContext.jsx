import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user has a token on app load
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsAuthenticated(true);
      // You could decode the JWT here to get the username
      setUser({ username: "User" }); // Default or decode from token
    }
    setIsLoading(false);
  }, []);

  const login = (token, userData = null) => {
    localStorage.setItem("jwtToken", token);
    setIsAuthenticated(true);
    setUser(userData || { username: "User" });
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
