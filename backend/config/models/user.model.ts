import { userRoles } from "@/constants/constants";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import mongoose, { Document } from "mongoose";

// ✅ COMPLETE and CORRECT Interface with ALL fields INCLUDING TIMESTAMPS
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpire?: Date;
  roles: string[];
  profilePicture: {
    id: string;
    url: string | null;
  };
  password?: string | null;
  authProviders: {
    provider: string;
    providerId: string;
  }[];
  subscription: {
    id: string;
    customerId: string;
    status: string;
    created: Date;
    startDate: Date | null;
    currentPeriodEnd: Date | null;
    nextPaymentAttempt: Date | null;
    subscription_date: Date | null;
  };
  resetPasswordToken?: string;
  resetPasswordId?: string;
  resetPasswordExpire?: Date;
  resetPasswordUsed?: boolean;
  passwordChangedAt?: Date;

  // ✅ FIXED: Add timestamp fields
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  getResetPasswordToken(): { token: string; id: string };
  getEmailVerificationToken(): string;
}

const authProviderSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
    enum: ["google", "github", "credentials"],
  },
  providerId: { type: String, required: true },
});

// ✅ Helper function for password validation
function validatePasswordStrength(password: string): boolean {
  if (!password) return true; // Allow null for OAuth users

  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~]/.test(password);

  return (
    hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
  );
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    roles: {
      type: [String],
      enum: userRoles,
      default: ["user"],
    },
    profilePicture: {
      id: String,
      url: {
        type: String,
        default: null,
      },
    },
    password: {
      type: String,
      select: false,
      minLength: [8, "Password must be at least 8 characters"],
      validate: {
        validator: validatePasswordStrength,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      },
      default: null,
    },
    authProviders: {
      type: [authProviderSchema],
      default: [],
    },
    subscription: {
      id: { type: String, default: "" },
      customerId: { type: String, default: "" },
      status: { type: String, default: "inactive" },
      created: { type: Date, default: Date.now },
      startDate: { type: Date, default: null },
      currentPeriodEnd: { type: Date, default: null },
      nextPaymentAttempt: { type: Date, default: null },
      subscription_date: { type: Date, default: null },
    },

    resetPasswordToken: String,
    resetPasswordId: String,
    resetPasswordExpire: Date,
    resetPasswordUsed: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: Date,
  },
  {
    timestamps: true, // ✅ This automatically creates createdAt and updatedAt
  }
);

// Encrypt password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get reset password token with both token and ID
userSchema.methods.getResetPasswordToken = function (): {
  token: string;
  id: string;
} {
  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetId = crypto.randomBytes(16).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordId = resetId;
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 min
  this.resetPasswordUsed = false;

  return { token: resetToken, id: resetId };
};

// Get email verification token
userSchema.methods.getEmailVerificationToken = function (): string {
  const verificationToken = crypto.randomBytes(20).toString("hex");

  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
