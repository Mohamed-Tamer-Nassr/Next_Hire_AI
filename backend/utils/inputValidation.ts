import validator from "validator";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email || email.trim() === "") {
    errors.push("Email is required");
    return { isValid: false, errors };
  }

  // Sanitize
  const sanitizedEmail =
    validator.normalizeEmail(email.trim().toLowerCase()) || email;

  // Validate format
  if (!validator.isEmail(sanitizedEmail)) {
    errors.push("Invalid email format");
  }

  // Check length
  if (sanitizedEmail.length > 254) {
    errors.push("Email is too long (max 254 characters)");
  }

  // Block disposable emails (optional, for spam prevention)
  const disposableDomains = [
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
  ];
  const domain = sanitizedEmail.split("@")[1];
  if (disposableDomains.includes(domain)) {
    errors.push("Disposable email addresses are not allowed");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate and sanitize name
 */
export function validateName(name: string): ValidationResult {
  const errors: string[] = [];

  if (!name || name.trim() === "") {
    errors.push("Name is required");
    return { isValid: false, errors };
  }

  const sanitizedName = name.trim();

  // Check length
  if (sanitizedName.length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (sanitizedName.length > 100) {
    errors.push("Name is too long (max 100 characters)");
  }

  // Allow letters, spaces, hyphens, apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(sanitizedName)) {
    errors.push(
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate token format
 */
export function validateToken(token: string): ValidationResult {
  const errors: string[] = [];

  if (!token || token.trim() === "") {
    errors.push("Token is required");
    return { isValid: false, errors };
  }

  // Tokens should be hex strings of specific length (40 chars for 20 bytes)
  if (!/^[a-f0-9]{40}$/i.test(token)) {
    errors.push("Invalid token format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize and validate avatar base64 data
 */
export function validateAvatarData(avatarData: string): ValidationResult {
  const errors: string[] = [];

  if (!avatarData || avatarData.trim() === "") {
    return { isValid: true, errors }; // Avatar is optional
  }

  // Check if it's a valid data URL
  if (!avatarData.startsWith("data:image/")) {
    errors.push("Invalid image format");
    return { isValid: false, errors };
  }

  // Extract mime type
  const mimeMatch = avatarData.match(/^data:image\/(\w+);base64,/);
  if (!mimeMatch) {
    errors.push("Invalid image data");
    return { isValid: false, errors };
  }

  const mimeType = mimeMatch[1];
  const allowedTypes = ["jpeg", "jpg", "png", "gif", "webp"];

  if (!allowedTypes.includes(mimeType.toLowerCase())) {
    errors.push(
      `Image type ${mimeType} is not allowed. Allowed types: ${allowedTypes.join(
        ", "
      )}`
    );
  }

  // Check file size (base64 increases size by ~33%)
  const base64Data = avatarData.split(",")[1];
  const sizeInBytes = (base64Data.length * 3) / 4;
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

  if (sizeInBytes > maxSizeInBytes) {
    errors.push("Image size exceeds 5MB limit");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generic sanitization for string inputs
 */
export function sanitizeString(input: string): string {
  if (!input) return "";

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ""); // Remove event handlers
}
