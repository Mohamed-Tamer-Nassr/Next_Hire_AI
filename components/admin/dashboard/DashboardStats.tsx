"use client";

import { Button, Card, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

type Props = {
  data: {
    totalUser: number;
    totalSubscription: number;
    totalSubscriptionWorth: number;
    totalInterviews: number;
    totalCompletedInterviews: number;
    interviewCompletionRate: number;
    averageInterviewPerUser: number;
  };
};

export default function DashboardStats({ data }: Props) {
  const stats = [
    {
      title: "Total Users",
      value: data.totalUser,
      bgColor: "bg-gradient-to-br from-emerald-400/20 to-teal-400/20",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
      iconColor: "text-white",
      iconName: "solar:users-group-rounded-linear",
      link: "/admin/users",
      glowColor: "emerald",
    },
    {
      title: "Active Subscriptions",
      value: data.totalSubscription,
      bgColor: "bg-gradient-to-br from-green-400/20 to-emerald-400/20",
      iconBg: "bg-gradient-to-br from-green-500 to-emerald-500",
      iconColor: "text-white",
      iconName: "solar:users-group-two-rounded-bold",
      link: "/admin/users?subscription.status=active",
      glowColor: "green",
    },
    {
      title: "Revenue (MRR)",
      value: `$${data.totalSubscriptionWorth.toFixed(2)}`,
      bgColor: "bg-gradient-to-br from-teal-400/20 to-cyan-400/20",
      iconBg: "bg-gradient-to-br from-teal-500 to-cyan-500",
      iconColor: "text-white",
      iconName: "solar:dollar-minimalistic-broken",
      link: "/admin/users",
      glowColor: "teal",
    },
    {
      title: "Total Interviews",
      value: data?.totalInterviews,
      bgColor: "bg-gradient-to-br from-amber-400/20 to-orange-400/20",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
      iconColor: "text-white",
      iconName: "solar:user-speak-bold",
      link: "/admin/interviews",
      glowColor: "amber",
    },
    {
      title: "Completion Rate",
      value: `${data.interviewCompletionRate}%`,
      bgColor: "bg-gradient-to-br from-violet-400/20 to-purple-400/20",
      iconBg: "bg-gradient-to-br from-violet-500 to-purple-500",
      iconColor: "text-white",
      iconName: "tabler:percentage",
      link: "/admin/interviews",
      glowColor: "violet",
    },
    {
      title: "Interviews / User",
      value: data?.averageInterviewPerUser,
      bgColor: "bg-gradient-to-br from-blue-400/20 to-indigo-400/20",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-500",
      iconColor: "text-white",
      iconName: "tabler:user-hexagon",
      link: "/admin/interviews",
      glowColor: "blue",
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      {stats.map(
        (
          { title, value, bgColor, iconBg, iconColor, iconName, link, glowColor },
          index
        ) => (
          <Card
            key={index}
            className={cn(
              "border-2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group",
              bgColor
            )}
          >
            {/* Animated glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

            <div className="flex p-5 relative z-10">
              <div
                className={cn(
                  "mt-1 flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110",
                  iconBg
                )}
                style={{
                  boxShadow: `0 8px 16px -4px rgba(16, 185, 129, 0.4)`,
                }}
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
            </div>

            {/* View Details Button */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-t border-emerald-200 dark:border-emerald-800">
              <Button
                fullWidth
                className="flex justify-start text-xs font-semibold text-emerald-600 dark:text-emerald-400 data-[pressed]:scale-100 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all duration-300"
                radius="none"
                variant="light"
                as={Link}
                href={link}
                endContent={
                  <Icon
                    icon="solar:arrow-right-linear"
                    className="ml-auto transition-transform duration-300 group-hover:translate-x-1"
                    width={16}
                  />
                }
              >
                View Details
              </Button>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Card>
        )
      )}
    </div>
  );
}