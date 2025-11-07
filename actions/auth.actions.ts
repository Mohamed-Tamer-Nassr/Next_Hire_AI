"use server";

import {
  forgetUserPassword,
  register, // ✅ Add this
  resendVerificationEmail,
  resetUserPassword,
  updateUserPassword,
  updateUserProfile,
  updateWithAdmin,
  verifyEmail, // ✅ Add this
} from "@/backend/controller/auth.controller";

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  return await register(name, email, password);
}
export async function updateProfile({
  name,
  email,
  avatar,
  oldAvatar,
}: {
  name: string;
  email: string;
  avatar?: string;
  oldAvatar?: string;
}) {
  return await updateUserProfile({ name, userEmail: email, avatar, oldAvatar });
}

export async function updatePassword({
  newPassword,
  confirmPassword,
  userEmail,
}: {
  newPassword: string;
  userEmail: string;
  confirmPassword: string;
}) {
  return await updateUserPassword({ confirmPassword, userEmail, newPassword });
}
export async function forgotPassword(email: string) {
  return await forgetUserPassword(email);
}
export async function resetPassword(
  resetId: string,
  password: string,
  confirmPassword: string
) {
  return await resetUserPassword(resetId, password, confirmPassword);
}

export async function verifyUserEmail(token: string) {
  return await verifyEmail(token);
}

export async function resendVerification(email: string) {
  return await resendVerificationEmail(email);
}

// ✅ UPDATED: Added subscription status parameter
export async function updateUserByAdmin(
  userId: string,
  userData: {
    name: string;
    roles: string[];
    avatar?: string;
    subscriptionStatus?: string;
  }
) {
  return await updateWithAdmin(userId, userData);
}
