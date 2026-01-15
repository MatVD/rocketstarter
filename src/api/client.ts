import axios from "axios";
import { logError } from "../utils/errorHandler";

// Get API base URL from environment or default to localhost
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${API_BASE_URL}`,
  withCredentials: true, // CRITICAL: Enables sending/receiving httpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor - no need to manually add Authorization header
// The httpOnly cookie is automatically sent by the browser with credentials: 'include'
api.interceptors.request.use(
  (config) => {
    // Cookie is sent automatically - no manual header needed
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
      // Don't trigger logout for auth endpoints (challenge/verify/logout)
      // or for checkAuthStatus (/users/me during initial check)
      // These have their own error handling
      const isAuthEndpoint = error.config?.url?.includes('/auth/');
      const isCheckingAuth = error.config?.url?.includes('/users/me');
      
      if (!isAuthEndpoint && !isCheckingAuth) {
        // Handle unauthorized access - JWT cookie invalid or expired
        logError(
          "API Client",
          "Unauthorized access - JWT token invalid or expired"
        );
        // Trigger logout event to clear user state
        window.dispatchEvent(new Event("auth:logout"));
      }
    } else if (error.response?.status >= 500) {
      // Handle server errors
      const errorData = error.response?.data;
      console.error("Server error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: errorData,
        url: error.config?.url,
        method: error.config?.method,
      });
      logError("API Client", `Server error: ${JSON.stringify(errorData)}`);
    } else if (error.code === "ECONNREFUSED") {
      // Handle connection errors
      logError("API Client", "Backend server is not running");
    }
    return Promise.reject(error);
  }
);

// Auth state check - since JWT is in httpOnly cookie, we can't read it
// We'll verify auth status by calling a protected endpoint
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    // Try to fetch current user - if cookie is valid, it will succeed
    await api.get("/users/me");
    return true;
  } catch (error) {
    // Silently fail - this is expected when no cookie exists yet
    return false;
  }
};

// Health check function
export const checkBackendHealth = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL.replace("/api/v1", "")}/health`
    );
    return response.data;
  } catch {
    throw new Error("Backend server is not running");
  }
};

// Database test function
export const checkDatabaseConnection = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL.replace("/api/v1", "")}/db-test`
    );
    return response.data;
  } catch {
    throw new Error("Database connection failed");
  }
};

// API info function
export const getApiInfo = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch {
    throw new Error("Could not retrieve API info");
  }
};

export default api;
