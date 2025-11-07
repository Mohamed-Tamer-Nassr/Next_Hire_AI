"use client";

import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SubscriptionData {
  id: string;
  customerId: string;
  status: string;
  created: string;
  startDate: string | null;
  currentPeriodEnd: string | null;
  nextPaymentAttempt: string | null;
}

const SubscriptionStatus = () => {
  const { data } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch subscription status from your API
    const fetchSubscription = async () => {
      if (!data?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        // You'll need to create this API endpoint
        const response = await fetch("/api/subscription/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.user.email }),
        });

        if (response.ok) {
          const data = await response.json();
          setSubscription(data.subscription);
        }
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [data]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "past_due":
        return "warning";
      case "canceled":
      case "inactive":
        return "danger";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardBody>
          <div className="flex items-center justify-center p-8">
            <Icon icon="svg-spinners:180-ring" fontSize={48} />
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!subscription || subscription.status === "inactive") {
    return (
      <Card className="w-full">
        <CardHeader className="flex-col items-start px-6 pb-0 pt-6">
          <h3 className="text-large font-semibold">Subscription Status</h3>
        </CardHeader>
        <CardBody className="px-6 py-4">
          <div className="flex flex-col gap-4">
            <p className="text-small text-default-500">
              You don't have an active subscription.
            </p>
            <Button
              color="primary"
              onPress={() => router.push("/subscribe")}
              startContent={<Icon icon="solar:card-send-bold" />}
            >
              Subscribe Now
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex-col items-start px-6 pb-0 pt-6">
        <div className="flex w-full items-center justify-between">
          <h3 className="text-large font-semibold">Subscription Status</h3>
          <Chip color={getStatusColor(subscription.status)} variant="flat">
            {subscription.status.toUpperCase()}
          </Chip>
        </div>
      </CardHeader>
      <CardBody className="px-6 py-4">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-small font-semibold text-default-500">
                Plan Price
              </p>
              <p className="text-medium font-semibold">$9.99/month</p>
            </div>
            <div>
              <p className="text-small font-semibold text-default-500">
                Started On
              </p>
              <p className="text-medium font-semibold">
                {formatDate(subscription.startDate)}
              </p>
            </div>
          </div>

          {subscription.currentPeriodEnd && (
            <div>
              <p className="text-small font-semibold text-default-500">
                Next Billing Date
              </p>
              <p className="text-medium font-semibold">
                {formatDate(subscription.currentPeriodEnd)}
              </p>
            </div>
          )}

          {subscription.status === "active" && (
            <div className="flex gap-2 pt-2">
              <Button
                color="danger"
                variant="flat"
                onPress={() => router.push("/unsubscribe")}
                startContent={<Icon icon="solar:card-recive-bold" />}
              >
                Cancel Subscription
              </Button>
            </div>
          )}

          {subscription.status === "past_due" && (
            <div className="rounded-medium bg-warning-50 p-3">
              <p className="text-small text-warning-700">
                <Icon
                  icon="solar:danger-triangle-bold"
                  className="inline"
                  fontSize={18}
                />{" "}
                Your payment failed. Please update your payment method.
              </p>
            </div>
          )}

          {subscription.status === "canceled" && (
            <div className="rounded-medium bg-danger-50 p-3">
              <p className="text-small text-danger-700">
                Your subscription has been canceled. You can resubscribe
                anytime.
              </p>
              <Button
                color="primary"
                size="sm"
                className="mt-2"
                onPress={() => router.push("/subscribe")}
              >
                Resubscribe
              </Button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default SubscriptionStatus;
