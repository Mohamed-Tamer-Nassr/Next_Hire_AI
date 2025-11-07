"use client";

import { cancelUserSubscription } from "@/actions/payment.action";
import { Logo } from "@/config/logoSite";
import { Button, Input, Radio, RadioGroup } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Unsubscribe = () => {
  const { data, update } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);

  useEffect(() => {
    if (data?.user?.email) {
      setEmail(data.user.email);
      // ✅ FIXED: Properly check subscription status from session
      const subscriptionStatus = (data as any)?.user?.subscription?.status;
      setHasSubscription(
        subscriptionStatus === "active" || subscriptionStatus === "trialing"
      );
    }
  }, [data]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!hasSubscription) {
      toast.error("No active subscription found");
      return;
    }

    // Confirm before canceling
    const confirmed = window.confirm(
      "Are you sure you want to cancel your subscription? You will lose access to premium features."
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const result = await cancelUserSubscription(email);

      if (result.success) {
        // ✅ FIXED: Update session with canceled status
        await update({
          subscription: {
            id: result.subscription.id,
            status: result.subscription.status,
          },
        });

        toast.success("Subscription canceled successfully! Redirecting...");

        setTimeout(() => {
          router.push("/");
          router.refresh(); // Force refresh to update UI
        }, 1000);
      } else {
        toast.error(result.error || "Failed to cancel subscription");
      }
    } catch (error: any) {
      console.error("❌ Unsubscribe error:", error);
      toast.error(error.message || "Failed to cancel subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <div className="flex flex-col items-center pb-6">
          <Logo />
          <p className="text-xl font-medium">Unsubscribe</p>
          <p className="text-small text-default-500">
            Cancel your current subscription
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleUnsubscribe}>
          <RadioGroup isDisabled label="Your Plan" defaultValue="9.99">
            <Radio value="9.99">$9.99 per month</Radio>
          </RadioGroup>

          <Input
            type="email"
            label="Email Address"
            placeholder="Email"
            variant="bordered"
            value={email}
            isDisabled
            isRequired
          />

          {!hasSubscription ? (
            <div className="rounded-medium bg-warning-50 p-3 text-small text-warning">
              <p className="font-semibold">No Active Subscription</p>
              <p>You don't have an active subscription to cancel.</p>
            </div>
          ) : (
            <div className="rounded-medium bg-danger-50 p-3 text-small text-danger">
              <p className="font-semibold">Warning:</p>
              <p>
                Canceling your subscription will remove access to all premium
                features at the end of your billing period.
              </p>
            </div>
          )}

          <Button
            className="w-full"
            color="danger"
            type="submit"
            startContent={
              !loading && <Icon icon="solar:card-recive-bold" fontSize={19} />
            }
            isLoading={loading}
            isDisabled={loading || !email || !hasSubscription}
          >
            {loading ? "Canceling..." : "Cancel Subscription"}
          </Button>

          <Button
            className="w-full"
            variant="bordered"
            onPress={() => router.push("/app/dashboard")}
            isDisabled={loading}
          >
            Go Back
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Unsubscribe;
