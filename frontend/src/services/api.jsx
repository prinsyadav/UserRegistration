import axios from "axios";

const API_URL = "http://localhost:8080/api/v1"; // Your Spring Boot backend URL

// Function to get the JWT token
const getToken = () => localStorage.getItem("jwtToken");

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors by redirecting to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("jwtToken");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const login = (credentials) => {
  return apiClient.post("/authenticate", credentials);
};

// Registration API with Client_id header
export const registerUser = (userData, clientId) => {
  return apiClient.post("/register", userData, {
    headers: {
      Client_id: clientId,
    },
  });
};

// User list API
export const fetchUsers = () => {
  return apiClient.get("/users");
};

export default apiClient;
