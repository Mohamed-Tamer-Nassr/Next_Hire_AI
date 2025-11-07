"use server";

import {
  cancelSubscription,
  createPayment,
} from "@/backend/controller/payment.controller";
import { getCurrentUser } from "@/backend/utils/auth";

/**
 * Server action to create a payment intent and subscription
 */
export async function createPaymentIntent(
  email: string,
  paymentMethodId: string
) {
  try {
    // Validate inputs
    if (!email || !paymentMethodId) {
      return {
        error: "Email and payment method are required",
        subscriptionId: null,
      };
    }

    // Create subscription
    const result = await createPayment(email, paymentMethodId);

    if (!result) {
      return {
        error: "Failed to create subscription",
        subscriptionId: null,
      };
    }

    // Return flat structure for frontend
    return {
      subscriptionId: result.subscriptionId,
      customerId: result.customerId,
      status: result.status,
      clientSecret: result.clientSecret,
      currentPeriodEnd: result.currentPeriodEnd,
      startDate: result.startDate,
      error: null,
    };
  } catch (error: any) {
    console.error("❌ createPaymentIntent error:", error);
    return {
      error: error.message || "Failed to create subscription",
      subscriptionId: null,
    };
  }
}

/**
 * Server action to cancel user subscription
 */
export async function cancelUserSubscription(email: string) {
  try {
    // Validate input
    if (!email) {
      return {
        success: false,
        error: "Email is required",
        subscription: { id: "", status: "" },
      };
    }

    // Cancel subscription
    const result = await cancelSubscription(email);

    return {
      success: result.success,
      message: result.message,
      subscription: result.subscription,
      error: null,
    };
  } catch (error: any) {
    console.error("❌ cancelUserSubscription error:", error);
    return {
      success: false,
      error: error.message || "Failed to cancel subscription",
      subscription: { id: "", status: "" },
    };
  }
}

/**
 * Server action to get current user's subscription status
 */
export async function getUserSubscription(request: Request) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return {
        success: false,
        error: "User not authenticated",
        subscription: null,
      };
    }

    // Return subscription data
    return {
      success: true,
      subscription: user.subscription || null,
      error: null,
    };
  } catch (error: any) {
    console.error("❌ getUserSubscription error:", error);
    return {
      success: false,
      error: error.message || "Failed to get subscription",
      subscription: null,
    };
  }
}
