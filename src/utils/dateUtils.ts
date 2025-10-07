/**
 * Date utility functions for consistent date formatting across the application
 */

/**
 * Format a date string to a human-readable format
 * @param dateString - Date string in ISO format (YYYY-MM-DD)
 * @param format - The format to return ('short', 'medium', 'full')
 * @returns Formatted date string or fallback text if date is invalid
 */
export function formatDate(
  dateString: string | undefined | null,
  format: "short" | "medium" | "full" = "medium"
): string {
  if (!dateString) return "No date";

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    // Different format options
    switch (format) {
      case "short":
        // Oct 7 or 7 Oct depending on locale
        return date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });

      case "full":
        // October 7, 2025 or similar depending on locale
        return date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

      case "medium":
      default:
        // Oct 7, 2025 or similar depending on locale
        return date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

/**
 * Gets a relative time string (e.g., "2 days ago", "in 3 hours")
 * @param dateString - Date string in ISO format
 * @returns Relative time string
 */
export function getRelativeTimeString(
  dateString: string | undefined | null
): string {
  if (!dateString) return "No date";

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    // Use the Intl.RelativeTimeFormat API if available
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
    const now = new Date();
    const diffInSeconds = (date.getTime() - now.getTime()) / 1000;

    // Convert to appropriate unit
    const seconds = Math.abs(diffInSeconds);

    if (seconds < 60) {
      return rtf.format(Math.round(diffInSeconds), "second");
    }

    const minutes = seconds / 60;
    if (minutes < 60) {
      return rtf.format(Math.round(diffInSeconds / 60), "minute");
    }

    const hours = minutes / 60;
    if (hours < 24) {
      return rtf.format(Math.round(diffInSeconds / 3600), "hour");
    }

    const days = hours / 24;
    if (days < 30) {
      return rtf.format(Math.round(diffInSeconds / 86400), "day");
    }

    const months = days / 30;
    if (months < 12) {
      return rtf.format(Math.round(diffInSeconds / 2592000), "month");
    }

    return rtf.format(Math.round(diffInSeconds / 31536000), "year");
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "Unknown time";
  }
}
