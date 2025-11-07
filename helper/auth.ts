import { IUser } from "@/backend/config/models/user.model";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const getAuthCookieName = () =>
  process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";

export const getAuthHeader = (nextCookies: ReadonlyRequestCookies) => {
  const cookieName = getAuthCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  if (!nextAuthSessionToken?.value) {
    throw new Error("No session token found in cookies");
  }

  return {
    headers: {
      Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
    },
  };
};

// ✅ FIXED: Now accepts both IUser and session user with subscription
export const isUserSubscribe = (User?: IUser | any | null): boolean => {
  // console.log("=== isUserSubscribe DEBUG ===");
  // console.log("Input User:", User);
  // console.log("Subscription:", User?.subscription);
  // console.log("Status:", User?.subscription?.status);

  // Check if user exists
  if (!User) {
    // console.log("Result: FALSE (no user)");
    // console.log("===========================");
    return false;
  }

  // Handle subscription from session (User.subscription)
  const subscription = User.subscription;

  if (!subscription || !subscription.status) {
    // console.log("Result: FALSE (no subscription or status)");
    // console.log("===========================");
    return false;
  }

  // Check if subscription is active or past_due (grace period)
  const result =
    subscription.status === "active" ||
    subscription.status === "trialing" ||
    subscription.status === "past_due";

  // console.log("Result:", result);
  // console.log("===========================");
  return result;
};

export const isUserAdmin = (User?: IUser | any | null): boolean => {
  // Check if user exists and has roles
  if (!User || !User.roles || !Array.isArray(User.roles)) {
    return false;
  }

  return User.roles.includes("admin");
};

// ✅ NEW: Check if subscription button should be shown
export const shouldShowSubscribeButton = (
  User?: IUser | any | null
): boolean => {
  if (!User) {
    return false; // Not logged in
  }

  // Don't show if user is admin
  if (isUserAdmin(User)) {
    return false;
  }

  // Show if user is NOT subscribed
  return !isUserSubscribe(User);
};

// ✅ NEW: Get subscription status display
export const getSubscriptionStatus = (User?: IUser | any | null): string => {
  if (!User || !User.subscription) {
    return "No subscription";
  }

  const status = User.subscription.status;

  switch (status) {
    case "active":
      return "Active";
    case "trialing":
      return "Trial";
    case "past_due":
      return "Past Due";
    case "canceled":
      return "Canceled";
    case "incomplete":
      return "Incomplete";
    case "incomplete_expired":
      return "Expired";
    default:
      return "Inactive";
  }
};

export const isAdminPath = (pathname: string): boolean => {
  return pathname.includes("/admin");
};
