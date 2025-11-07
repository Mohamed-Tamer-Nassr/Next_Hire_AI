import { isValidObjectId } from "mongoose";

// ✅ NEW: Centralized validation utilities

/**
 * Validates if a string is a valid MongoDB ObjectId
 */
export function validateObjectId(id: string, fieldName: string = "ID"): void {
  if (!id) {
    throw new Error(`${fieldName} is required`);
  }

  if (!isValidObjectId(id)) {
    throw new Error(`Invalid ${fieldName}`);
  }
}

/**
 * Validates and parses a numeric string
 */
export function validateNumeric(
  value: string | number,
  fieldName: string,
  min?: number,
  max?: number
): number {
  const numValue = Number(value);

  if (isNaN(numValue)) {
    throw new Error(`${fieldName} must be a valid number`);
  }

  if (min !== undefined && numValue < min) {
    throw new Error(`${fieldName} must be at least ${min}`);
  }

  if (max !== undefined && numValue > max) {
    throw new Error(`${fieldName} must be at most ${max}`);
  }

  return numValue;
}

/**
 * Validates time left value
 */
export function validateTimeLeft(timeLeft: string | number): number {
  const timeLeftNum = validateNumeric(timeLeft, "Time left", 0);
  return timeLeftNum;
}

/**
 * Validates question count
 */
export function validateQuestionCount(count: number): void {
  validateNumeric(count, "Number of questions", 1, 50);
}

/**
 * Validates duration in minutes
 */
export function validateDuration(duration: number): void {
  validateNumeric(duration, "Duration", 2, 120);
}

/**
 * Sanitizes user input text
 */
export function sanitizeText(text: string, maxLength: number = 5000): string {
  if (!text) return "";

  // Remove any HTML tags
  const stripped = text.replace(/<[^>]*>/g, "");

  // Trim whitespace
  const trimmed = stripped.trim();

  // Limit length
  return trimmed.slice(0, maxLength);
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates date range
 */
export function validateDateRange(
  start: Date | string,
  end: Date | string
): { start: Date; end: Date } {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime())) {
    throw new Error("Invalid start date");
  }

  if (isNaN(endDate.getTime())) {
    throw new Error("Invalid end date");
  }

  if (startDate > endDate) {
    throw new Error("Start date must be before end date");
  }

  return { start: startDate, end: endDate };
}

/**
 * Validates pagination parameters
 */
export function validatePagination(
  page?: number | string,
  limit?: number | string
): { page: number; limit: number } {
  const pageNum = page ? validateNumeric(page, "Page", 1) : 1;
  const limitNum = limit ? validateNumeric(limit, "Limit", 1, 50) : 10;

  return { page: pageNum, limit: limitNum };
}

/**
 * Validates string length
 */
export function validateStringLength(
  value: string,
  fieldName: string,
  min?: number,
  max?: number
): void {
  if (!value) {
    throw new Error(`${fieldName} is required`);
  }

  if (min !== undefined && value.length < min) {
    throw new Error(`${fieldName} must be at least ${min} characters`);
  }

  if (max !== undefined && value.length > max) {
    throw new Error(`${fieldName} must be at most ${max} characters`);
  }
}

/**
 * Validates enum value
 */
export function validateEnum<T extends string>(
  value: string,
  validValues: readonly T[],
  fieldName: string
): T {
  if (!validValues.includes(value as T)) {
    throw new Error(`${fieldName} must be one of: ${validValues.join(", ")}`);
  }
  return value as T;
}
