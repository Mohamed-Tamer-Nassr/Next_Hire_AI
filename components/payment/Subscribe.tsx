"use client";

import { createPaymentIntent } from "@/actions/payment.action";
import { Logo } from "@/config/logoSite";
import { Button, Input, Radio, RadioGroup } from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const Subscribe = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

const CheckoutForm = () => {
  const { data, update } = useSession();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (data?.user?.email) {
      setEmail(data.user.email);
    }

    // 🔍 DEBUG: Log session data
    // console.log("=== SUBSCRIBE PAGE DEBUG ===");
    // console.log("Full session data:", data);
    // console.log("User object:", data?.user);
    // console.log("Subscription object:", (data?.user as any)?.subscription);
    // console.log("========================");

    // ✅ Redirect if already subscribed
    const user = data?.user as any;
    if (
      user?.subscription?.status === "active" ||
      user?.subscription?.status === "trialing"
    ) {
      // console.log("⚠️ User already subscribed, redirecting to dashboard");
      // toast.error("You already have an active subscription!");
      router.push("/app/dashboard");
    }
  }, [data, router]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element not found");
      setLoading(false);
      return;
    }

    try {
      // Create payment method
      const { paymentMethod, error: stripeError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            email: email,
          },
        });

      if (stripeError) {
        const errorMsg = stripeError.message || "An unexpected error occurred.";
        setError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
        return;
      }

      if (!paymentMethod) {
        setError("Failed to create payment method");
        toast.error("Failed to create payment method");
        setLoading(false);
        return;
      }

      // console.log("💳 Payment method created:", paymentMethod.id);

      // Create subscription
      const res = await createPaymentIntent(email, paymentMethod.id);

      // console.log("📦 Subscription response:", res);

      if (res?.error) {
        const errorMsg = res.error || "Failed to create subscription";
        setError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
        return;
      }

      // ✅ FIXED: Check for subscriptionId in flat response structure
      if (res?.subscriptionId) {
        console.log("=== SUBSCRIPTION SUCCESS DEBUG ===");
        console.log("Response from server:", res);
        console.log("About to update session with:", {
          subscription: {
            id: res.subscriptionId,
            status: res.status,
            customerId: res.customerId,
            currentPeriodEnd: res.currentPeriodEnd,
            startDate: res.startDate,
          },
        });

        // Update session with new subscription data
        const updateResult = await update({
          subscription: {
            id: res.subscriptionId,
            status: res.status,
            customerId: res.customerId,
            currentPeriodEnd: res.currentPeriodEnd,
            startDate: res.startDate,
          },
        });

        // console.log("Session update result:", updateResult);
        // console.log("================================");

        toast.success("Subscription successful! Redirecting...");

        // Wait a bit for session to update
        redirectTimeoutRef.current = setTimeout(() => {
          router.push("/app/dashboard");
          router.refresh(); // Force refresh to update UI
        }, 1000);
      } else {
        setError("Subscription created but no ID returned");
        toast.error("Something went wrong. Please contact support.");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("❌ Subscription error:", err);
      const errorMsg = err.message || "An unexpected error occurred.";
      setError(errorMsg);
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <div className="flex flex-col items-center pb-6">
          <Logo />
          <p className="text-xl font-medium">Subscribe</p>
          <p className="text-small text-default-500">
            Enter your email and card details to subscribe
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <RadioGroup isDisabled label="Your Plan" defaultValue="9.99">
            <Radio value="9.99">$9.99 per month</Radio>
          </RadioGroup>

          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            variant="bordered"
            value={email}
            isDisabled
            isRequired
          />

          <div className="rounded-medium border-2 border-default-200 px-3 py-2">
            <CardElement
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>

          <Button
            className="w-full"
            color="primary"
            type="submit"
            startContent={
              !loading && <Icon icon="solar:card-send-bold" fontSize={19} />
            }
            isLoading={loading}
            isDisabled={!stripe || loading || !email}
          >
            {loading ? "Processing..." : "Subscribe Now"}
          </Button>

          {error && (
            <p className="text-center text-small text-danger">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Subscribe;
