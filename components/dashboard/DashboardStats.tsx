"use client";

import { Card, Chip, cn } from "@heroui/react";
import { Icon } from "@iconify/react";

type Props = {
  totalInterviews: number;
  completionRate: number;
  subscriptionStatus: string;
};

const SUBSCRIPTION_PRICE = "$9.99";

export default function DashboardStats({
  totalInterviews,
  completionRate,
  subscriptionStatus,
}: Props) {
  const capitalizeFirstLetter = (string: string) => {
    if (!string) return "No Subscription";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getSubscriptionDisplay = () => {
    const status = capitalizeFirstLetter(subscriptionStatus);
    return status === "Inactive" ? "No Subscription" : status;
  };

  const data = [
    {
      title: "Total Interviews",
      value: totalInterviews || 0,
      bgColor: "bg-gradient-to-br from-emerald-400/20 to-teal-400/20",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
      iconColor: "text-white",
      iconName: "solar:users-group-rounded-linear",
      ariaLabel: `Total interviews: ${totalInterviews || 0}`,
      glowColor: "emerald",
    },
    {
      title: "Completion Rate",
      value: completionRate ? `${completionRate}%` : "0%",
      bgColor: "bg-gradient-to-br from-green-400/20 to-emerald-400/20",
      iconBg: "bg-gradient-to-br from-green-500 to-emerald-500",
      iconColor: "text-white",
      iconName: "solar:chart-2-linear",
      ariaLabel: `Completion rate: ${completionRate || 0} percent`,
      glowColor: "green",
    },
    {
      title: "Subscription",
      value: getSubscriptionDisplay(),
      bgColor: "bg-gradient-to-br from-teal-400/20 to-cyan-400/20",
      iconBg: "bg-gradient-to-br from-teal-500 to-cyan-500",
      iconColor: "text-white",
      iconName: "solar:wallet-linear",
      change: subscriptionStatus === "active" ? SUBSCRIPTION_PRICE : undefined,
      ariaLabel: `Subscription status: ${getSubscriptionDisplay()}`,
      glowColor: "teal",
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      {data.map(
        (
          {
            title,
            value,
            bgColor,
            iconBg,
            iconColor,
            iconName,
            change,
            ariaLabel,
            glowColor,
          },
          index
        ) => (
          <Card
            key={index}
            className={cn(
              "border-2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group",
              `border-${glowColor}-200 dark:border-${glowColor}-800`,
              bgColor
            )}
            aria-label={ariaLabel}
          >
            {/* Animated glow effect on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-r from-${glowColor}-400/0 via-${glowColor}-400/20 to-${glowColor}-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
            ></div>

            <div className="flex p-5 relative z-10">
              <div
                className={cn(
                  "mt-1 flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110",
                  iconBg
                )}
                style={{
                  boxShadow: `0 8px 16px -4px rgba(16, 185, 129, 0.4)`,
                }}
                aria-hidden="true"
              >
                <Icon className={iconColor} icon={iconName} width={24} />
              </div>

              <div className="flex flex-col gap-y-2 flex-1">
                <dt className="mx-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {title}
                </dt>
                <dd className="px-4 text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {value}
                </dd>
              </div>

              {change && (
                <Chip
                  className="absolute right-4 top-4 shadow-lg"
                  classNames={{
                    content: "font-bold text-sm",
                  }}
                  style={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
                    color: "white",
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
                  }}
                  radius="lg"
                  size="sm"
                  aria-label={`Subscription price: ${change}`}
                >
                  {change}
                </Chip>
              )}
            </div>

            {/* Bottom accent line */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${glowColor}-400 via-${glowColor}-500 to-${glowColor}-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            ></div>
          </Card>
        )
      )}
    </div>
  );
}
