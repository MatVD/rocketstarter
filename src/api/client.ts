import axios from "axios";

// Get API base URL from environment or default to localhost
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor to include user address in headers
api.interceptors.request.use(
  (config) => {
    // Get user address from localStorage or context if available
    const userAddress = localStorage.getItem("userAddress");
    if (userAddress) {
      config.headers["x-user-address"] = userAddress;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access - user address may be invalid");
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.error("Server error:", error.response.data);
    } else if (error.code === "ECONNREFUSED") {
      // Handle connection errors
      console.error("Backend server is not running");
    }
    return Promise.reject(error);
  }
);

// Function to set user address for authentication
export const setUserAddress = (address: string | null) => {
  if (address) {
    localStorage.setItem("userAddress", address);
    api.defaults.headers["x-user-address"] = address;
  } else {
    localStorage.removeItem("userAddress");
    delete api.defaults.headers["x-user-address"];
  }
};

// Health check function
export const checkBackendHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch {
    throw new Error("Backend server is not running");
  }
};

export default api;
