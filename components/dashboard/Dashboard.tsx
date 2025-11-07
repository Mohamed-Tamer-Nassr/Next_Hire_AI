"use client";

import { IUser } from "@/backend/config/models/user.model";
import { Button, Card, DateRangePicker } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardInsights from "./DashboardInsights";
import DashboardStats from "./DashboardStats";

type DailyStats = {
  date: string;
  totalInterviews: number;
  completedQuestions: number;
  unAnswerQuestions: number;
  completionRate: number;
};

type Props = {
  data: {
    totalInterviews: number;
    completionRate: number;
    stats: DailyStats[];
  } | null;
};

const Dashboard = ({ data }: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dateRange, setDateRange] = useState<any>(null);

  if (status === "loading") {
    return <DashboardSkeleton />;
  }

  if (status === "unauthenticated" || !session) {
    redirect("/login");
  }

  const user = session?.user as IUser;
  const subscriptionStatus = user?.subscription?.status ?? "inactive";

  const handleDateRangeChange = (range: any) => {
    if (range?.start && range?.end) {
      setDateRange(range);
      const params = new URLSearchParams(searchParams.toString());
      params.set("start", range.start.toString());
      params.set("end", range.end.toString());
      router.push(`?${params.toString()}`);
    }
  };

  if (!data) {
    return (
      <Card className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-200 dark:border-emerald-800">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400 blur-3xl opacity-30 rounded-full animate-pulse"></div>
            <Icon
              icon="solar:danger-circle-broken"
              className="text-emerald-500 relative z-10"
              width={64}
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Failed to Load Dashboard
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
            We encountered an error while loading your dashboard data. Please
            refresh the page or try again later.
          </p>
          <Button
            color="success"
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/50"
          >
            Refresh Page
          </Button>
        </div>
      </Card>
    );
  }

  const chartData = data.stats.map((stat) => ({
    date: new Date(stat.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    interviews: stat.totalInterviews,
    completed: stat.completedQuestions,
    unanswered: stat.unAnswerQuestions,
    rate: parseFloat(stat.completionRate.toString()),
  }));

  const totalCompleted = data.stats.reduce(
    (sum, stat) => sum + stat.completedQuestions,
    0
  );
  const totalUnanswered = data.stats.reduce(
    (sum, stat) => sum + stat.unAnswerQuestions,
    0
  );

  const pieData = [
    { name: "Completed", value: totalCompleted },
    { name: "Unanswered", value: totalUnanswered },
  ];

  // Vibrant green color palette
  const COLORS = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];
  const CHART_COLORS = {
    primary: "#10b981",
    secondary: "#059669",
    accent: "#34d399",
    warning: "#fbbf24",
  };

  return (
    <div className="space-y-6">
      {/* Animated Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Stats Cards */}
        <DashboardStats
          totalInterviews={data?.totalInterviews ?? 0}
          completionRate={data?.completionRate ?? 0}
          subscriptionStatus={subscriptionStatus}
        />

        {/* Insights Section */}
        {data?.stats && data.stats.length > 0 && (
          <DashboardInsights
            stats={data.stats}
            totalInterviews={data.totalInterviews}
            completionRate={data.completionRate}
          />
        )}

        {/* Header with Date Picker */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Analytics Overview
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Track your interview performance over time
            </p>
          </div>

          <DateRangePicker
            label="Select Date Range"
            className="max-w-xs"
            onChange={handleDateRangeChange}
            value={dateRange}
            variant="bordered"
            color="success"
          />
        </div>

        {/* Charts Section */}
        {data?.stats && data.stats.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interview Trends - Area Chart */}
            <Card className="p-6 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50/50 dark:from-gray-900 dark:to-emerald-950/20 border-2 border-emerald-100 dark:border-emerald-900/30">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg shadow-lg shadow-emerald-500/30">
                    <Icon
                      icon="solar:graph-up-linear"
                      className="text-white"
                      width={20}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Interview Trends
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Daily interview count over the selected period
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorInterviews"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={CHART_COLORS.primary}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={CHART_COLORS.primary}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#d1fae5"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    stroke="#a7f3d0"
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    stroke="#a7f3d0"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #10b981",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.3)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="interviews"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorInterviews)"
                    name="Interviews"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Completion Rate - Line Chart */}
            <Card className="p-6 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-teal-50/50 dark:from-gray-900 dark:to-teal-950/20 border-2 border-teal-100 dark:border-teal-900/30">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg shadow-lg shadow-teal-500/30">
                    <Icon
                      icon="solar:chart-2-linear"
                      className="text-white"
                      width={20}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Completion Rate
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Interview completion percentage trend
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#a7f3d0"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    stroke="#6ee7b7"
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    stroke="#6ee7b7"
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #14b8a6",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgba(20, 184, 166, 0.3)",
                    }}
                    formatter={(value: any) => [
                      `${value.toFixed(1)}%`,
                      "Completion Rate",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke={CHART_COLORS.secondary}
                    strokeWidth={4}
                    dot={{
                      fill: "#10b981",
                      r: 6,
                      strokeWidth: 3,
                      stroke: "#fff",
                      filter: "drop-shadow(0 2px 4px rgba(16, 185, 129, 0.4))",
                    }}
                    activeDot={{
                      r: 8,
                      stroke: "#10b981",
                      strokeWidth: 3,
                      fill: "#fff",
                    }}
                    name="Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Questions Status - Bar Chart */}
            <Card className="p-6 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/50 dark:from-gray-900 dark:to-green-950/20 border-2 border-green-100 dark:border-green-900/30">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg shadow-lg shadow-green-500/30">
                    <Icon
                      icon="solar:clipboard-list-linear"
                      className="text-white"
                      width={20}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Question Status
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Completed vs Unanswered questions daily
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#bbf7d0"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    stroke="#86efac"
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    stroke="#86efac"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #22c55e",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgba(34, 197, 94, 0.3)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="completed"
                    fill={CHART_COLORS.primary}
                    radius={[8, 8, 0, 0]}
                    name="Completed"
                  />
                  <Bar
                    dataKey="unanswered"
                    fill={CHART_COLORS.warning}
                    radius={[8, 8, 0, 0]}
                    name="Unanswered"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Overall Distribution - Pie Chart */}
            <Card className="p-6 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50/50 dark:from-gray-900 dark:to-emerald-950/20 border-2 border-emerald-100 dark:border-emerald-900/30">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg shadow-lg shadow-emerald-500/30">
                    <Icon
                      icon="solar:pie-chart-2-linear"
                      className="text-white"
                      width={20}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Overall Distribution
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total questions breakdown summary
                </p>
              </div>
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={false}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      strokeWidth={3}
                      stroke="#fff"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "2px solid #10b981",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.3)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Custom Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {pieData.map((entry, index) => {
                    const total = totalCompleted + totalUnanswered;
                    const percentage =
                      total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0;
                    return (
                      <div
                        key={entry.name}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-full border border-emerald-200 dark:border-emerald-800"
                      >
                        <div
                          className="w-3 h-3 rounded-full shadow-lg"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                            boxShadow: `0 0 10px ${
                              COLORS[index % COLORS.length]
                            }40`,
                          }}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {entry.name}:{" "}
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {percentage}%
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        ) : (
          // Empty State with Glowing Effect
          <Card className="p-12 shadow-2xl bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 dark:from-gray-900 dark:via-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-200 dark:border-emerald-800">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 blur-3xl opacity-40 rounded-full animate-pulse"></div>
                <div className="relative z-10 p-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full shadow-2xl shadow-emerald-500/50">
                  <Icon
                    icon="solar:document-add-linear"
                    className="text-white"
                    width={80}
                  />
                </div>
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Ready to Start Your Journey?
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-400 max-w-md">
                  You haven't completed any interviews yet. Begin your first
                  interview to unlock detailed analytics, insights, and track
                  your progress over time!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button
                  size="lg"
                  as={Link}
                  href="/app/interviews/new"
                  startContent={
                    <Icon icon="solar:add-circle-linear" width={20} />
                  }
                  className="font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/60 transition-all duration-300"
                >
                  Create Your First Interview
                </Button>
                <Button
                  variant="bordered"
                  size="lg"
                  as={Link}
                  href="/app/interviews"
                  startContent={
                    <Icon icon="solar:clipboard-list-linear" width={20} />
                  }
                  className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                >
                  View All Interviews
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// Loading Skeleton Component with Green Theme
export function DashboardSkeleton() {
  const { Skeleton } = require("@heroui/react");

  return (
    <div className="space-y-6">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Stats Cards Skeleton */}
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="p-4 bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-950/10"
            >
              <div className="flex gap-4">
                <Skeleton className="h-8 w-8 rounded-md bg-emerald-200 dark:bg-emerald-900" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24 bg-emerald-100 dark:bg-emerald-900" />
                  <Skeleton className="h-6 w-16 bg-emerald-200 dark:bg-emerald-800" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Insights Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="p-6 bg-gradient-to-br from-white to-teal-50/30 dark:from-gray-900 dark:to-teal-950/10"
            >
              <div className="flex justify-between mb-4">
                <Skeleton className="h-6 w-32 bg-teal-200 dark:bg-teal-900" />
                <Skeleton className="h-10 w-10 rounded-lg bg-teal-300 dark:bg-teal-800" />
              </div>
              <Skeleton className="h-4 w-40 bg-teal-100 dark:bg-teal-900" />
            </Card>
          ))}
        </div>

        {/* Header Skeleton */}
        <div className="flex justify-between items-center pt-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2 bg-emerald-200 dark:bg-emerald-900" />
            <Skeleton className="h-4 w-64 bg-emerald-100 dark:bg-emerald-900" />
          </div>
          <Skeleton className="h-10 w-64 bg-emerald-200 dark:bg-emerald-900" />
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              className="p-6 bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-950/10"
            >
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-8 w-8 rounded-lg bg-green-300 dark:bg-green-900" />
                <Skeleton className="h-6 w-32 bg-green-200 dark:bg-green-900" />
              </div>
              <Skeleton className="h-4 w-48 mb-4 bg-green-100 dark:bg-green-900" />
              <Skeleton className="h-[300px] w-full rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
