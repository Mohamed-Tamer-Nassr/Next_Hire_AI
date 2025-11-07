import crypto from "crypto";
import dbConnect from "../config/dbConnect";
import { IUser, User } from "../config/models/user.model";
import { catchAsyncError } from "../middleware/cachAsyncError";
import {
  checkPasswordChangeRateLimit,
  checkPasswordResetRateLimit,
  checkRegisterRateLimit,
} from "../middleware/rateLimiter";
import { delete_file, upload_file } from "../utils/cloudinary";
import { resetPasswordHTMLTemplate } from "../utils/emailTemplate";
import {
  sanitizeString,
  validateAvatarData,
  validateEmail,
  validateName,
  validateToken,
} from "../utils/inputValidation";
import {
  isCommonPassword,
  validatePassword,
} from "../utils/passwordValidation";
import sendEmail from "../utils/sendEmail";

import { getFirstDayOfMonth, getToday } from "@/helper/helpers";
import Interview from "../config/models/interview.model";
import APIFilter from "../utils/apiFilter";
import { verificationEmailHTMLTemplate } from "../utils/emailTemplate";
import { securityLogger } from "../utils/securityLogger";
import { getQueryStr } from "../utils/utils";

export const register = catchAsyncError(
  async (name: string, email: string, password: string) => {
    try {
      await dbConnect();

      // Check rate limit
      const rateLimitCheck = await checkRegisterRateLimit(email);
      if (!rateLimitCheck.allowed) {
        throw new Error(
          rateLimitCheck.error || "Too many registration attempts"
        );
      }

      // Validate name
      const nameValidation = validateName(name);
      if (!nameValidation.isValid) {
        throw new Error(nameValidation.errors.join(". "));
      }

      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.errors.join(". "));
      }

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(". "));
      }

      // Check common passwords
      if (isCommonPassword(password)) {
        throw new Error(
          "This password is too common. Please choose a more secure password."
        );
      }

      // Sanitize inputs
      const sanitizedName = sanitizeString(name);
      const sanitizedEmail = email.trim().toLowerCase();

      const newUser = await User.create({
        name: sanitizedName,
        email: sanitizedEmail,
        password,
        emailVerified: false,
        authProviders: [
          { provider: "credentials", providerId: sanitizedEmail },
        ],
      });

      // Generate verification token
      const verificationToken = newUser.getEmailVerificationToken();
      await newUser.save({ validateBeforeSave: false });

      // Send verification email
      const verificationUrl = `${process.env.API_URL}/verify-email/${verificationToken}`;
      const message = verificationEmailHTMLTemplate(
        newUser.name,
        verificationUrl
      );

      securityLogger.logRegistration(
        sanitizedEmail,
        true,
        "User registered successfully"
      );

      try {
        await sendEmail({
          email: newUser.email,
          subject: "Next Hire AI - Verify Your Email Address",
          message,
        });
      } catch (error) {
        console.error("Failed to send verification email:", error);
      }

      return {
        created: true,
        message:
          "Account created! Please check your email to verify your account.",
      };
    } catch (error: any) {
      securityLogger.logRegistration(email, false, error.message);
      return {
        created: false,
        error: {
          message: error.message || "Registration failed",
        },
      };
    }
  }
);

export const verifyEmail = catchAsyncError(async (token: string) => {
  await dbConnect();

  const tokenValidation = validateToken(token);
  if (!tokenValidation.isValid) {
    throw new Error("Invalid verification token");
  }

  const emailVerificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken,
    emailVerificationExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired verification token");
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;

  await user.save({ validateBeforeSave: false });

  return { verified: true };
});

export const resendVerificationEmail = catchAsyncError(
  async (email: string) => {
    await dbConnect();

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.errors.join(". "));
    }

    const sanitizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: sanitizedEmail });

    if (!user) {
      return { sent: true };
    }

    if (user.emailVerified) {
      throw new Error("Email is already verified");
    }

    const rateLimitCheck = await checkPasswordResetRateLimit(sanitizedEmail);
    if (!rateLimitCheck.allowed) {
      throw new Error(rateLimitCheck.error || "Too many requests");
    }

    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${process.env.API_URL}/verify-email/${verificationToken}`;
    const message = verificationEmailHTMLTemplate(user.name, verificationUrl);

    try {
      await sendEmail({
        email: user.email,
        subject: "Next Hire AI - Verify Your Email Address",
        message,
      });
    } catch (error) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpire = undefined;
      await user.save({ validateBeforeSave: false });
      throw new Error("Failed to send verification email");
    }

    return { sent: true };
  }
);

// ✅ FIXED: Complete rewrite with proper error handling
export const updateUserProfile = catchAsyncError(
  async ({
    name,
    userEmail,
    avatar,
    oldAvatar,
  }: {
    name: string;
    userEmail: string;
    avatar?: string;
    oldAvatar?: string;
  }) => {
    await dbConnect();

    // ✅ FIX 1: Find user first to ensure they exist
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      throw new Error("User not found");
    }

    // ✅ FIX 2: Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      throw new Error(nameValidation.errors.join(". "));
    }

    // ✅ FIX 3: Validate avatar if provided
    if (avatar) {
      const avatarValidation = validateAvatarData(avatar);
      if (!avatarValidation.isValid) {
        throw new Error(avatarValidation.errors.join(". "));
      }
    }

    const data: {
      name: string;
      profilePicture?: { id: string; url: string };
    } = { name: sanitizeString(name) };

    // ✅ FIX 4: Handle avatar upload with proper error handling
    let uploadedAvatar: { id: string; url: string } | null = null;

    if (avatar) {
      try {
        uploadedAvatar = await upload_file(avatar, "Next-Hire-AI/avatars");
        data.profilePicture = uploadedAvatar;
      } catch (uploadError: any) {
        console.error("Avatar upload failed:", uploadError);
        throw new Error(
          `Failed to upload avatar: ${uploadError.message || "Unknown error"}`
        );
      }
    }

    // ✅ FIX 5: Update user in database
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      data,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      // ✅ FIX 6: Rollback avatar upload if user update fails
      if (uploadedAvatar) {
        try {
          await delete_file(uploadedAvatar.id);
        } catch (deleteError) {
          console.error("Failed to rollback avatar upload:", deleteError);
        }
      }
      throw new Error("Failed to update user profile");
    }

    // ✅ FIX 7: Only delete old avatar after successful update
    if (oldAvatar && uploadedAvatar) {
      try {
        await delete_file(oldAvatar);
      } catch (deleteError) {
        console.error("Failed to delete old avatar:", deleteError);
        // Don't throw - new avatar is already uploaded and saved
      }
    }

    // ✅ FIX 8: Log successful update
    securityLogger.logProfileUpdate(
      updatedUser._id.toString(),
      updatedUser.email,
      true,
      `Profile updated. Name: ${name}. Avatar: ${!!avatar}`
    );

    return {
      updated: true,
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
      },
    };
  }
);

export const updateUserPassword = catchAsyncError(
  async ({
    newPassword,
    confirmPassword,
    userEmail,
  }: {
    newPassword: string;
    userEmail: string;
    confirmPassword: string;
  }) => {
    try {
      await dbConnect();

      const rateLimitCheck = await checkPasswordChangeRateLimit(userEmail);
      if (!rateLimitCheck.allowed) {
        throw new Error(
          rateLimitCheck.error || "Too many password change attempts"
        );
      }

      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(". "));
      }

      if (isCommonPassword(newPassword)) {
        throw new Error(
          "This password is too common. Please choose a more secure password."
        );
      }

      const user = await User.findOne({ email: userEmail }).select("+password");

      if (!user) {
        throw new Error("User not found");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (
        !user?.authProviders?.some(
          (p: { provider: string }) => p.provider === "credentials"
        )
      ) {
        user?.authProviders?.push({
          provider: "credentials",
          providerId: userEmail,
        });
      }

      user.password = newPassword;
      user.passwordChangedAt = new Date();

      await user.save();

      securityLogger.logPasswordChange(
        user._id.toString(),
        userEmail,
        true,
        "Password changed successfully"
      );

      return { updated: true, shouldInvalidateSession: true };
    } catch (error: any) {
      securityLogger.logPasswordChange("", userEmail, false, error.message);
      throw error;
    }
  }
);

// export const forgetUserPassword = catchAsyncError(async (email: string) => {
//   await dbConnect();

//   const emailValidation = validateEmail(email);
//   if (!emailValidation.isValid) {
//     throw new Error(emailValidation.errors.join(". "));
//   }

//   const sanitizedEmail = email.trim().toLowerCase();

//   const rateLimitCheck = await checkPasswordResetRateLimit(sanitizedEmail);
//   if (!rateLimitCheck.allowed) {
//     throw new Error(rateLimitCheck.error || "Too many password reset attempts");
//   }

//   const user = await User.findOne({ email: sanitizedEmail });

//   if (!user) {
//     securityLogger.logPasswordReset(
//       sanitizedEmail,
//       true,
//       "Password reset requested (user not found)"
//     );
//     return { emailSent: true };
//   }

//   // ✅ FIX: Destructure to get the 'id' (public reset ID)
//   const { id: resetId } = user.getResetPasswordToken();
//   await user.save({ validateBeforeSave: false });

//   // ✅ FIX: Pass resetId directly to template
//   const message = resetPasswordHTMLTemplate(user.name, resetId);

//   securityLogger.logPasswordReset(
//     sanitizedEmail,
//     true,
//     "Password reset email sent"
//   );

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: "Next Hire AI - Password Reset Request",
//       message,
//     });
//   } catch (error) {
//     user.resetPasswordToken = undefined;
//     user.resetPasswordId = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save({ validateBeforeSave: false });
//     throw new Error("Email could not be sent. Please try again later.");
//   }

//   return { emailSent: true };
// });

export const forgetUserPassword = catchAsyncError(async (email: string) => {
  await dbConnect();

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    throw new Error(emailValidation.errors.join(". "));
  }

  const sanitizedEmail = email.trim().toLowerCase();

  const rateLimitCheck = await checkPasswordResetRateLimit(sanitizedEmail);
  if (!rateLimitCheck.allowed) {
    throw new Error(rateLimitCheck.error || "Too many password reset attempts");
  }

  const user = await User.findOne({ email: sanitizedEmail });

  // ✅ FIX: Return success false if user not found (but don't reveal this to frontend)
  if (!user) {
    securityLogger.logPasswordReset(
      sanitizedEmail,
      false,
      "Password reset requested for non-existent user"
    );
    // Return generic success to prevent email enumeration
    // But mark it internally so we can handle it on frontend
    return {
      emailSent: true,
      userExists: false, // ✅ Added flag
    };
  }

  // ✅ User exists - proceed with sending email
  const { id: resetId } = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const message = resetPasswordHTMLTemplate(user.name, resetId);

  try {
    await sendEmail({
      email: user.email,
      subject: "Next Hire AI - Password Reset Request",
      message,
    });

    securityLogger.logPasswordReset(
      sanitizedEmail,
      true,
      "Password reset email sent successfully"
    );

    return {
      emailSent: true,
      userExists: true, // ✅ Added flag
    };
  } catch (error) {
    // Rollback if email fails
    user.resetPasswordToken = undefined;
    user.resetPasswordId = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    throw new Error("Email could not be sent. Please try again later.");
  }
});

export const resetUserPassword = catchAsyncError(
  async (resetId: string, password: string, confirmPassword: string) => {
    await dbConnect();

    if (!resetId || !/^[a-f0-9]{32}$/i.test(resetId)) {
      throw new Error("Invalid reset link");
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(". "));
    }

    if (isCommonPassword(password)) {
      throw new Error(
        "This password is too common. Please choose a more secure password."
      );
    }

    const user = await User.findOne({
      resetPasswordId: resetId,
      resetPasswordExpire: { $gt: Date.now() },
      resetPasswordUsed: { $ne: true },
    });

    if (!user) {
      securityLogger.logSuspiciousActivity(
        "INVALID_RESET_TOKEN",
        undefined,
        `Attempted to use invalid or expired reset token: ${resetId.substring(
          0,
          8
        )}...`
      );
      throw new Error("Invalid or expired reset link");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordId = undefined;
    user.resetPasswordExpire = undefined;
    user.resetPasswordUsed = true;
    user.passwordChangedAt = new Date();

    await user.save({ validateBeforeSave: false });

    securityLogger.logPasswordResetComplete(
      user.email,
      true,
      "Password reset completed successfully"
    );

    try {
      await sendEmail({
        email: user.email,
        subject: "Your Password Has Been Successfully Updated | Next Hire AI",
        message: `
      <h2 style="font-family: Arial, sans-serif; color: #333;">Password Update Confirmation</h2>
      <p style="font-family: Arial, sans-serif; color: #555;">
        Hi ${user.name},
      </p>
      <p style="font-family: Arial, sans-serif; color: #555;">
        We wanted to let you know that your account password was successfully updated.
      </p>
      <p style="font-family: Arial, sans-serif; color: #555;">
        If you did not make this change, please contact our support team immediately at 
        <a href="mailto:support@nexthire.ai" style="color: #007bff; text-decoration: none;">support@nexthire.ai</a>.
      </p>
      <p style="font-family: Arial, sans-serif; color: #555;">
        Thank you,<br>
        <strong>The Next Hire AI Team</strong>
      </p>
    `,
      });
    } catch (error) {
      console.error("Failed to send confirmation email:", error);
    }

    return { passwordUpdated: true };
  }
);

export const getDashboardStats = catchAsyncError(async (req: Request) => {
  await dbConnect();

  const subscriptionPackage = 9.99;
  const { searchParams } = new URL(req.url);
  const queryStr = getQueryStr(searchParams);

  const start = new Date(queryStr.start || getFirstDayOfMonth());
  const end = new Date(queryStr.end || getToday());

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  const totalUser = await User.countDocuments({
    createdAt: { $gte: start, $lte: end },
  });

  const totalSubscription = await User.countDocuments({
    "subscription.created": { $gte: start, $lte: end },
    "subscription.status": "active",
  });

  const totalSubscriptionWorth = totalSubscription * subscriptionPackage;

  const totalInterviews = await Interview.countDocuments({
    createdAt: { $gte: start, $lte: end },
    status: "completed",
  });

  const totalCompletedInterviews = await Interview.countDocuments({
    createdAt: { $gte: start, $lte: end },
  });

  const interviewCompletionRate =
    totalCompletedInterviews > 0
      ? ((totalCompletedInterviews / totalInterviews) * 100).toFixed(2)
      : 0;

  const averageInterviewPerUser =
    totalUser > 0 ? ((totalInterviews / totalUser) * 100).toFixed(2) : 0;

  return {
    totalUser,
    totalSubscription,
    totalSubscriptionWorth,
    totalInterviews,
    totalCompletedInterviews,
    interviewCompletionRate,
    averageInterviewPerUser,
  };
});

export const getAllUsers = catchAsyncError(async (request: Request) => {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const queryStr = getQueryStr(searchParams);

  // ✅ Make resultPerPage configurable (default 10, max 50)
  const resultPerPage = Number(queryStr.limit) || 10;
  const validatedResultPerPage = Math.min(Math.max(resultPerPage, 1), 50);

  // ✅ FIXED: Use User model, not Interview model
  const apiFilter = new APIFilter(User, queryStr).filter().sort();

  // ✅ FIXED: Count users, not interviews
  const filteredUsersCount = await User.countDocuments(
    apiFilter.query.getFilter()
  );

  const totalPages = Math.ceil(filteredUsersCount / validatedResultPerPage);

  let currentPage = Number(queryStr.page) || 1;
  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }

  // Apply pagination after sorting
  apiFilter.pagination(validatedResultPerPage);
  const users: IUser[] = await apiFilter.query;

  return {
    users,
    pagination: {
      currentPage,
      resultPerPage: validatedResultPerPage,
      totalCount: filteredUsersCount, // ✅ FIXED: Use correct count
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  };
});

// ✅ ENHANCED: Added subscription status update capability
export const updateWithAdmin = catchAsyncError(
  async (
    userId: string,
    userData: {
      name: string;
      roles: string[];
      avatar?: string;
      subscriptionStatus?: string;
    }
  ) => {
    await dbConnect();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Validate name
    const nameValidation = validateName(userData.name);
    if (!nameValidation.isValid) {
      throw new Error(nameValidation.errors.join(". "));
    }

    // Validate avatar if provided
    if (userData.avatar) {
      const avatarValidation = validateAvatarData(userData.avatar);
      if (!avatarValidation.isValid) {
        throw new Error(avatarValidation.errors.join(". "));
      }
    }

    // Validate roles
    if (!userData.roles || userData.roles.length === 0) {
      throw new Error("User must have at least one role");
    }

    const validRoles = ["user", "admin", "moderator"];
    const invalidRoles = userData.roles.filter(
      (role) => !validRoles.includes(role)
    );
    if (invalidRoles.length > 0) {
      throw new Error(`Invalid roles: ${invalidRoles.join(", ")}`);
    }

    const data: {
      name: string;
      profilePicture?: { id: string; url: string };
      roles: string[];
      subscription?: {
        status: string;
      };
    } = {
      name: sanitizeString(userData.name),
      roles: userData.roles,
    };

    // ✅ Handle subscription status update
    if (userData.subscriptionStatus) {
      const validStatuses = ["active", "inactive", "cancelled", "trialing"];
      if (!validStatuses.includes(userData.subscriptionStatus)) {
        throw new Error("Invalid subscription status");
      }

      // Update subscription status
      data.subscription = {
        ...user.subscription,
        status: userData.subscriptionStatus,
      };
    }

    let uploadedAvatar: { id: string; url: string } | null = null;
    const oldAvatarId = user.profilePicture?.id;

    // Handle avatar upload
    if (userData.avatar) {
      try {
        uploadedAvatar = await upload_file(
          userData.avatar,
          "Next-Hire-AI/avatars"
        );
        data.profilePicture = uploadedAvatar;
      } catch (uploadError: any) {
        console.error("Avatar upload failed:", uploadError);
        throw new Error(
          `Failed to upload avatar: ${uploadError.message || "Unknown error"}`
        );
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      // Rollback avatar upload if user update fails
      if (uploadedAvatar) {
        try {
          await delete_file(uploadedAvatar.id);
        } catch (deleteError) {
          console.error("Failed to rollback avatar upload:", deleteError);
        }
      }
      throw new Error("Failed to update user profile");
    }

    // Clean up old avatar if new one was uploaded
    if (oldAvatarId && uploadedAvatar) {
      try {
        await delete_file(oldAvatarId);
      } catch (deleteError) {
        console.error("Failed to delete old avatar:", deleteError);
      }
    }

    // Log the admin update
    securityLogger.logProfileUpdate(
      updatedUser._id.toString(),
      updatedUser.email,
      true,
      `Admin updated profile. Name: ${
        userData.name
      }. Roles: ${userData.roles.join(
        ", "
      )}. Avatar: ${!!userData.avatar}. Subscription: ${
        userData.subscriptionStatus || "unchanged"
      }`
    );

    return {
      updated: true,
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        roles: updatedUser.roles,
        subscription: updatedUser.subscription,
      },
    };
  }
);
