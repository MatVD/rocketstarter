/**
 * Centralized validation utilities for consistent form validation throughout the app
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationRule<T = string> {
  message: string;
  validate: (value: T) => boolean;
}

/**
 * Common validation rules
 */
export const VALIDATION_RULES = {
  required: (message = "This field is required"): ValidationRule => ({
    message,
    validate: (value: string) => value.trim().length > 0,
  }),

  minLength: (length: number, message?: string): ValidationRule => ({
    message: message || `Must be at least ${length} characters`,
    validate: (value: string) => value.trim().length >= length,
  }),

  maxLength: (length: number, message?: string): ValidationRule => ({
    message: message || `Must be no more than ${length} characters`,
    validate: (value: string) => value.trim().length <= length,
  }),

  email: (message = "Please enter a valid email address"): ValidationRule => ({
    message,
    validate: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value.trim());
    },
  }),

  url: (message = "Please enter a valid URL"): ValidationRule => ({
    message,
    validate: (value: string) => {
      try {
        new URL(value.trim());
        return true;
      } catch {
        return false;
      }
    },
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    message,
    validate: (value: string) => regex.test(value.trim()),
  }),

  numeric: (message = "Please enter a valid number"): ValidationRule => ({
    message,
    validate: (value: string) =>
      !isNaN(Number(value.trim())) && value.trim() !== "",
  }),

  positiveNumber: (
    message = "Please enter a positive number"
  ): ValidationRule => ({
    message,
    validate: (value: string) => {
      const num = Number(value.trim());
      return !isNaN(num) && num > 0;
    },
  }),

  integer: (message = "Please enter a whole number"): ValidationRule => ({
    message,
    validate: (value: string) => {
      const num = Number(value.trim());
      return !isNaN(num) && Number.isInteger(num);
    },
  }),

  dateFormat: (
    message = "Please enter a valid date (YYYY-MM-DD)"
  ): ValidationRule => ({
    message,
    validate: (value: string) => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(value.trim())) return false;
      const date = new Date(value.trim());
      return date instanceof Date && !isNaN(date.getTime());
    },
  }),

  futureDate: (message = "Date must be in the future"): ValidationRule => ({
    message,
    validate: (value: string) => {
      const date = new Date(value.trim());
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today;
    },
  }),

  pastDate: (message = "Date must be in the past"): ValidationRule => ({
    message,
    validate: (value: string) => {
      const date = new Date(value.trim());
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return date < today;
    },
  }),

  ethereumAddress: (
    message = "Please enter a valid Ethereum address"
  ): ValidationRule => ({
    message,
    validate: (value: string) => {
      const address = value.trim();
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    },
  }),

  noSpecialChars: (
    message = "Special characters are not allowed"
  ): ValidationRule => ({
    message,
    validate: (value: string) => /^[a-zA-Z0-9\s]+$/.test(value.trim()),
  }),

  alphanumeric: (
    message = "Only letters and numbers are allowed"
  ): ValidationRule => ({
    message,
    validate: (value: string) => /^[a-zA-Z0-9]+$/.test(value.trim()),
  }),
} as const;

/**
 * Validate a single field against multiple rules
 */
export const validateField = (
  value: string,
  rules: ValidationRule[]
): ValidationResult => {
  const errors: string[] = [];

  for (const rule of rules) {
    if (!rule.validate(value)) {
      errors.push(rule.message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate multiple fields
 */
export const validateForm = <T extends Record<string, string>>(
  data: T,
  rules: Record<keyof T, ValidationRule[]>
): Record<keyof T, ValidationResult> & { isFormValid: boolean } => {
  const results = {} as Record<keyof T, ValidationResult>;
  let isFormValid = true;

  for (const [field, fieldRules] of Object.entries(rules) as [
    keyof T,
    ValidationRule[]
  ][]) {
    const fieldResult = validateField(data[field], fieldRules);
    results[field] = fieldResult;

    if (!fieldResult.isValid) {
      isFormValid = false;
    }
  }

  return {
    ...results,
    isFormValid,
  };
};

/**
 * Predefined validation schemas for common forms
 */
export const VALIDATION_SCHEMAS = {
  task: {
    title: [
      VALIDATION_RULES.required("Task title is required"),
      VALIDATION_RULES.minLength(3, "Task title must be at least 3 characters"),
      VALIDATION_RULES.maxLength(
        100,
        "Task title must be no more than 100 characters"
      ),
    ],
    description: [
      VALIDATION_RULES.maxLength(
        500,
        "Description must be no more than 500 characters"
      ),
    ],
    assignee: [
      VALIDATION_RULES.required("Assignee is required"),
      VALIDATION_RULES.minLength(
        2,
        "Assignee name must be at least 2 characters"
      ),
      VALIDATION_RULES.maxLength(
        50,
        "Assignee name must be no more than 50 characters"
      ),
    ],
    createdAt: [
      VALIDATION_RULES.required("Created date is required"),
      VALIDATION_RULES.dateFormat(),
    ],
  },

  project: {
    name: [
      VALIDATION_RULES.required("Project name is required"),
      VALIDATION_RULES.minLength(
        3,
        "Project name must be at least 3 characters"
      ),
      VALIDATION_RULES.maxLength(
        100,
        "Project name must be no more than 100 characters"
      ),
    ],
    description: [
      VALIDATION_RULES.maxLength(
        1000,
        "Description must be no more than 1000 characters"
      ),
    ],
  },

  user: {
    name: [
      VALIDATION_RULES.required("Name is required"),
      VALIDATION_RULES.minLength(2, "Name must be at least 2 characters"),
      VALIDATION_RULES.maxLength(50, "Name must be no more than 50 characters"),
    ],
    email: [
      VALIDATION_RULES.required("Email is required"),
      VALIDATION_RULES.email(),
    ],
  },

  smartContract: {
    address: [
      VALIDATION_RULES.required("Contract address is required"),
      VALIDATION_RULES.ethereumAddress(),
    ],
    name: [
      VALIDATION_RULES.required("Contract name is required"),
      VALIDATION_RULES.minLength(
        3,
        "Contract name must be at least 3 characters"
      ),
      VALIDATION_RULES.alphanumeric(
        "Contract name must contain only letters and numbers"
      ),
    ],
  },
} as const;

/**
 * Helper function to get validation schema by type
 */
export const getValidationSchema = <T extends keyof typeof VALIDATION_SCHEMAS>(
  schemaType: T
): (typeof VALIDATION_SCHEMAS)[T] => {
  return VALIDATION_SCHEMAS[schemaType];
};

/**
 * Custom validation hook (for React components)
 */
export const createValidator = <T extends Record<string, string>>(
  schema: Record<keyof T, ValidationRule[]>
) => {
  return (data: T) => validateForm(data, schema);
};

/**
 * Format validation errors for display
 */
export const formatValidationErrors = (errors: string[]): string => {
  if (errors.length === 0) return "";
  if (errors.length === 1) return errors[0];
  return errors.join(", ");
};

/**
 * Check if a form has any validation errors
 */
export const hasValidationErrors = (
  validation: Record<string, ValidationResult>
): boolean => {
  return Object.values(validation).some((result) => !result.isValid);
};

/**
 * Get all validation errors from a form
 */
export const getAllValidationErrors = (
  validation: Record<string, ValidationResult>
): string[] => {
  return Object.values(validation)
    .filter((result) => !result.isValid)
    .flatMap((result) => result.errors);
};
