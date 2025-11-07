import fs from "fs";
import path from "path";

interface SecurityLogEntry {
  timestamp: string;
  event: string;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  success: boolean;
  details?: string;
}

class SecurityLogger {
  private logFilePath: string;

  constructor() {
    const logsDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    this.logFilePath = path.join(logsDir, "security.log");
  }

  private formatLog(entry: SecurityLogEntry): string {
    return (
      JSON.stringify({
        ...entry,
        timestamp: new Date().toISOString(),
      }) + "\n"
    );
  }

  private writeLog(entry: SecurityLogEntry): void {
    try {
      const logLine = this.formatLog(entry);
      fs.appendFileSync(this.logFilePath, logLine);

      // Also log to console in development
      if (process.env.NODE_ENV === "development") {
        // console.log(`[SECURITY] ${entry.event}:`, entry);
      }
    } catch (error) {
      console.error("Failed to write security log:", error);
    }
  }

  logRegistration(email: string, success: boolean, details?: string): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      event: "REGISTRATION",
      email,
      success,
      details,
    });
  }

  logLogin(
    email: string,
    success: boolean,
    ip?: string,
    userAgent?: string,
    details?: string
  ): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      event: "LOGIN",
      email,
      ip,
      userAgent,
      success,
      details,
    });
  }

  logPasswordChange(
    userId: string,
    email: string,
    success: boolean,
    details?: string
  ): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      event: "PASSWORD_CHANGE",
      userId,
      email,
      success,
      details,
    });
  }

  logPasswordReset(email: string, success: boolean, details?: string): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      event: "PASSWORD_RESET_REQUEST",
      email,
      success,
      details,
    });
  }

  logPasswordResetComplete(
    email: string,
    success: boolean,
    details?: string
  ): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      event: "PASSWORD_RESET_COMPLETE",
      email,
      success,
      details,
    });
  }

  logEmailVerification(
    email: string,
    success: boolean,
    details?: string
  ): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      event: "EMAIL_VERIFICATION",
      email,
      success,
      details,
    });
  }

  logProfileUpdate(
    userId: string,
    email: string,
    success: boolean,
    details?: string
  ): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      event: "PROFILE_UPDATE",
      userId,
      email,
      success,
      details,
    });
  }

  logFailedAuthentication(email: string, reason: string, ip?: string): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      event: "FAILED_AUTHENTICATION",
      email,
      ip,
      success: false,
      details: reason,
    });
  }

  logSuspiciousActivity(event: string, email?: string, details?: string): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      event: "SUSPICIOUS_ACTIVITY",
      email,
      success: false,
      details: `${event}: ${details}`,
    });
  }
}

export const securityLogger = new SecurityLogger();
