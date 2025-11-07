import { headers } from "next/headers";
import dbConnect from "../config/dbConnect";
import { User } from "../config/models/user.model";
import { catchAsyncError } from "../middleware/cachAsyncError";
import { getCurrentUser } from "../utils/auth";
import stripe from "../utils/stripe";

export const createPayment = catchAsyncError(
  async (email: string, paymentMethodId: string) => {
    try {
      await dbConnect();

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new Error("User not found. Please create an account first.");
      }

      // Check if user already has an active subscription
      if (
        existingUser.subscription?.status === "active" ||
        existingUser.subscription?.status === "trialing"
      ) {
        throw new Error(
          "You already have an active subscription. Please go to your dashboard."
        );
      }

      const customer = await stripe.customers.create({
        email,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // Create subscription with expand to get period dates
      const subscription = (await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: "price_1SOtwkRudxHO3hurGGCF1ozp" }],
        expand: ["latest_invoice.payment_intent"],
      })) as any;

      // console.log("📊 Initial subscription created:", subscription.id);
      // console.log(
      //   "📊 Raw subscription object:",
      //   JSON.stringify(subscription, null, 2)
      // );

      // ✅ FIXED: Get period dates correctly from the subscription object
      const currentPeriodStart = subscription.current_period_start;
      const currentPeriodEnd = subscription.current_period_end;
      const subscriptionDate = new Date();

      // console.log("📊 Subscription data:", {
      //   id: subscription.id,
      //   status: subscription.status,
      //   created: subscription.created,
      //   current_period_start: currentPeriodStart,
      //   current_period_end: currentPeriodEnd,
      //   subscription_date: subscriptionDate,
      // });

      // Build update data with all required fields
      const updateData: any = {
        "subscription.id": subscription.id,
        "subscription.customerId": customer.id,
        "subscription.status": subscription.status,
        "subscription.subscription_date": subscriptionDate,
      };

      // ✅ FIXED: Properly handle date conversions with fallbacks
      if (subscription.created) {
        const createdDate = new Date(subscription.created * 1000);
        updateData["subscription.created"] = createdDate;
        // console.log("✅ Created date:", createdDate.toISOString());
      }

      // ✅ Use current_period_start OR created as fallback
      if (currentPeriodStart) {
        const startDate = new Date(currentPeriodStart * 1000);
        updateData["subscription.startDate"] = startDate;
        // console.log("✅ Start date:", startDate.toISOString());
      } else if (subscription.created) {
        // Fallback to created date
        const startDate = new Date(subscription.created * 1000);
        updateData["subscription.startDate"] = startDate;
        // console.log("✅ Start date (fallback):", startDate.toISOString());
      }

      // ✅ Calculate end date if missing (30 days from start for monthly)
      if (currentPeriodEnd) {
        const endDate = new Date(currentPeriodEnd * 1000);
        updateData["subscription.currentPeriodEnd"] = endDate;
        // console.log("✅ End date:", endDate.toISOString());
      } else if (subscription.created) {
        // Fallback: Calculate 30 days from created date
        const endDate = new Date(subscription.created * 1000);
        endDate.setDate(endDate.getDate() + 30);
        updateData["subscription.currentPeriodEnd"] = endDate;
        // console.log("✅ End date (calculated):", endDate.toISOString());
      }

      // console.log("📝 Update data being saved:", updateData);

      const updatedUser = await User.findOneAndUpdate(
        { email },
        { $set: updateData },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("Failed to update user subscription");
      }

      // console.log(
      //   "✅ Subscription saved to database:",
      //   updatedUser.subscription
      // );

      // Get client secret for payment confirmation
      let clientSecret: string | null = null;

      if (subscription.latest_invoice) {
        const invoice: any =
          typeof subscription.latest_invoice === "string"
            ? await stripe.invoices.retrieve(subscription.latest_invoice)
            : subscription.latest_invoice;

        if (invoice.payment_intent) {
          const paymentIntent: any =
            typeof invoice.payment_intent === "string"
              ? await stripe.paymentIntents.retrieve(invoice.payment_intent)
              : invoice.payment_intent;

          clientSecret = paymentIntent.client_secret || null;
        }
      }

      // Return flat structure for easier frontend handling
      return {
        subscriptionId: subscription.id,
        customerId: customer.id,
        status: subscription.status,
        clientSecret: clientSecret,
        currentPeriodEnd: updateData["subscription.currentPeriodEnd"],
        startDate: updateData["subscription.startDate"],
      };
    } catch (error: any) {
      console.error("❌ Subscription error:", error);
      throw new Error(error.message || "Failed to create subscription");
    }
  }
);

export const cancelSubscription = catchAsyncError(async (email: string) => {
  try {
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.subscription?.id) {
      throw new Error("No active subscription found");
    }

    if (user.subscription.status === "canceled") {
      throw new Error("Subscription is already canceled");
    }

    // Cancel the subscription in Stripe
    const canceledSubscription = await stripe.subscriptions.cancel(
      user.subscription.id
    );

    // console.log("✅ Subscription canceled in Stripe:", canceledSubscription.id);

    // Update user subscription status in database
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          "subscription.status": "canceled",
          "subscription.currentPeriodEnd": null,
          "subscription.nextPaymentAttempt": null,
        },
      },
      { new: true }
    );

    // console.log("✅ Subscription canceled in database for:", email);

    return {
      success: true,
      message: "Subscription canceled successfully",
      subscription: {
        id: updatedUser?.subscription?.id || "",
        status: "canceled",
      },
    };
  } catch (error: any) {
    console.error("❌ Cancel subscription error:", error);
    throw new Error(error.message || "Failed to cancel subscription");
  }
});

export const subscriptionWebHook = async (req: Request) => {
  let event: any;
  const rowBody = await req.text();
  const header = await headers();
  const signature = header.get("stripe-signature");

  if (!signature) {
    console.error("❌ No stripe signature found");
    return { success: false, error: "No signature", status: 400 };
  }

  try {
    event = stripe.webhooks.constructEvent(
      rowBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    // console.log("✅ Webhook event constructed:", event.type);
  } catch (error) {
    console.error("❌ Webhook signature verification failed:", error);
    return {
      success: false,
      error: "Webhook signature verification failed",
      status: 400,
    };
  }

  await dbConnect();

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscriptionEvent = event.data.object;

        // console.log(
        //   "🔧 Processing subscription event for customer:",
        //   subscriptionEvent.customer
        // );

        // Retrieve full subscription with expanded data
        const fullSubscription = (await stripe.subscriptions.retrieve(
          subscriptionEvent.id,
          {
            expand: ["latest_invoice.payment_intent"],
          }
        )) as any;

        // ✅ Get period dates from the subscription
        const currentPeriodStart = fullSubscription.current_period_start;
        const currentPeriodEnd = fullSubscription.current_period_end;

        // console.log("📊 Full subscription data from webhook:", {
        //   id: fullSubscription.id,
        //   status: fullSubscription.status,
        //   created: fullSubscription.created,
        //   current_period_start: currentPeriodStart,
        //   current_period_end: currentPeriodEnd,
        //   raw: JSON.stringify(fullSubscription, null, 2),
        // });

        // Get customer email
        const customerId =
          typeof fullSubscription.customer === "string"
            ? fullSubscription.customer
            : fullSubscription.customer.id;

        const customer = (await stripe.customers.retrieve(customerId)) as any;
        const email = customer.email;

        if (!email) {
          console.error("❌ No email found for customer");
          break;
        }

        const updateData: any = {
          "subscription.id": fullSubscription.id,
          "subscription.customerId": customerId,
          "subscription.status": fullSubscription.status,
        };

        // Only set subscription_date on creation
        if (event.type === "customer.subscription.created") {
          updateData["subscription.subscription_date"] = new Date();
        }

        if (fullSubscription.created) {
          const createdDate = new Date(fullSubscription.created * 1000);
          updateData["subscription.created"] = createdDate;
          // console.log("✅ Webhook - Created date:", createdDate.toISOString());
        }

        // ✅ Use current_period_start OR created as fallback
        if (currentPeriodStart) {
          const startDate = new Date(currentPeriodStart * 1000);
          updateData["subscription.startDate"] = startDate;
          // console.log("✅ Webhook - Start date:", startDate.toISOString());
        } else if (fullSubscription.created) {
          const startDate = new Date(fullSubscription.created * 1000);
          updateData["subscription.startDate"] = startDate;
          // console.log(
          //   "✅ Webhook - Start date (fallback):",
          //   startDate.toISOString()
          // );
        }

        // ✅ Calculate end date if missing
        if (currentPeriodEnd) {
          const endDate = new Date(currentPeriodEnd * 1000);
          updateData["subscription.currentPeriodEnd"] = endDate;
          // console.log("✅ Webhook - End date:", endDate.toISOString());
        } else if (fullSubscription.created) {
          const endDate = new Date(fullSubscription.created * 1000);
          endDate.setDate(endDate.getDate() + 30);
          updateData["subscription.currentPeriodEnd"] = endDate;
          // console.log(
          //   "✅ Webhook - End date (calculated):",
          //   endDate.toISOString()
          // );
        }

        // console.log("📝 Webhook - Update data:", updateData);

        const result = await User.findOneAndUpdate(
          { email },
          { $set: updateData },
          { new: true }
        );

        if (result) {
          // console.log("✅ Subscription updated for:", email);
          // console.log("✅ Updated subscription data:", result.subscription);
        } else {
          console.error("❌ User not found for email:", email);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const email = invoice.customer_email;

        // console.log("🔧 Processing invoice.payment_succeeded for:", email);

        if (!email) {
          console.error("❌ No customer email found");
          break;
        }

        await User.findOneAndUpdate(
          { email },
          {
            $set: {
              "subscription.status": "active",
            },
          }
        );

        // console.log("✅ Subscription status updated to active for:", email);
        break;
      }

      case "invoice.payment_failed": {
        const failedInvoice = event.data.object;
        const email = failedInvoice.customer_email;
        const nextPaymentAttempt = failedInvoice.next_payment_attempt;

        if (!email) {
          console.error("❌ No customer email found");
          break;
        }

        await User.findOneAndUpdate(
          { email },
          {
            $set: {
              "subscription.status": "past_due",
              "subscription.nextPaymentAttempt": nextPaymentAttempt
                ? new Date(nextPaymentAttempt * 1000)
                : null,
            },
          }
        );
        // console.log("✅ Subscription marked as past_due");
        break;
      }

      case "customer.subscription.deleted": {
        const deletedSubscription = event.data.object;

        const customerId =
          typeof deletedSubscription.customer === "string"
            ? deletedSubscription.customer
            : deletedSubscription.customer.id;

        const customer = (await stripe.customers.retrieve(customerId)) as any;
        const email = customer.email;

        if (!email) {
          console.error("❌ No email found for customer");
          break;
        }

        await User.findOneAndUpdate(
          { email },
          {
            $set: {
              "subscription.status": "canceled",
              "subscription.currentPeriodEnd": null,
              "subscription.nextPaymentAttempt": null,
            },
          }
        );
        // console.log("✅ Subscription canceled for:", email);
        break;
      }

      default:
        // console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return { success: true, status: 200 };
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return { success: false, error: "Webhook processing failed", status: 500 };
  }
};

// Add this to your payment.controller.ts file

export const getInvoices = catchAsyncError(async (req: Request) => {
  try {
    await dbConnect();

    // ✅ FIX: Use getCurrentUser helper to get user from request
    const currentUser = await getCurrentUser(req);

    if (!currentUser) {
      throw new Error("Unauthorized - Please login");
    }

    // ✅ Find user in database
    const user = await User.findById(currentUser._id);

    if (!user) {
      throw new Error("User not found");
    }

    // ✅ Check if user has subscription with customer ID
    if (!user.subscription?.customerId) {
      return {
        invoices: [],
        message: "No subscription found",
      };
    }

    // ✅ Fetch invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: user.subscription.customerId,
      limit: 100, // Get last 100 invoices
    });

    // console.log(
    //   `✅ Fetched ${invoices.data.length} invoices for user: ${user.email}`
    // );

    return {
      invoices: invoices.data,
    };
  } catch (error: any) {
    console.error("❌ Error fetching invoices:", error);
    throw new Error(error.message || "Failed to fetch invoices");
  }
});
