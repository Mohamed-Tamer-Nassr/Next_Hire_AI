export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong";
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let strength: "weak" | "medium" | "strong" = "weak";

  // Check length
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  // Check for uppercase
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  // Check for lowercase
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  // Check for numbers
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  // Check for special characters
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  // Calculate strength
  if (errors.length === 0) {
    if (password.length >= 12) {
      strength = "strong";
    } else {
      strength = "medium";
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

// Check against common passwords
const COMMON_PASSWORDS = [
  "password",
  "password123",
  "12345678",
  "qwerty",
  "abc123",
  "monkey",
  "1234567",
  "letmein",
  "trustno1",
  "dragon",
  "baseball",
  "iloveyou",
  "master",
  "sunshine",
  "ashley",
  "bailey",
  "passw0rd",
  "shadow",
  "123123",
  "654321",
];

export function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.includes(password.toLowerCase());
}
