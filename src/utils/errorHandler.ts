/**
 * Error Handler Utility
 * Provides centralized error handling and user-friendly error messages
 */

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

/**
 * Extract a user-friendly error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return "An unexpected error occurred";
};

/**
 * Convert technical error messages to user-friendly ones
 */
export const getFriendlyErrorMessage = (error: unknown): string => {
  const message = getErrorMessage(error);

  // Network errors
  if (message.includes("Network Error") || message.includes("ECONNREFUSED")) {
    return "Unable to connect to the server. Please check your connection.";
  }

  // Timeout errors
  if (message.includes("timeout")) {
    return "The request took too long. Please try again.";
  }

  // Unauthorized errors
  if (message.includes("401") || message.includes("Unauthorized")) {
    return "You are not authorized to perform this action.";
  }

  // Not found errors
  if (message.includes("404") || message.includes("Not Found")) {
    return "The requested resource was not found.";
  }

  // Validation errors
  if (message.includes("validation") || message.includes("invalid")) {
    return "Please check your input and try again.";
  }

  // Server errors
  if (message.includes("500") || message.includes("Internal Server")) {
    return "A server error occurred. Please try again later.";
  }

  // Database errors
  if (message.includes("database") || message.includes("SQL")) {
    return "A database error occurred. Please contact support.";
  }

  // Return the original message if no pattern matches
  return message;
};

/**
 * Log error for debugging (in development only)
 */
export const logError = (context: string, error: unknown): void => {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
};
