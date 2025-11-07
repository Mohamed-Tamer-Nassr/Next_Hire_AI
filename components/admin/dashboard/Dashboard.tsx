"use client";

import { Button, Card, DateRangePicker } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";
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
import DashboardStats from "./DashboardStats";

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

const Dashboard = ({ data }: Props) => {
  const [dateRange, setDateRange] = useState<any>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleDateRangeChange = (range: any) => {
    if (range?.start && range?.end) {
      setDateRange(range);
      const params = new URLSearchParams(searchParams.toString());
      params.set("start", range.start.toString());
      params.set("end", range.end.toString());
      router.push(`?${params.toString()}`);
    }
  };

  // Mock chart data - In production, fetch this from backend
  const userGrowthData = [
    { date: "Mon", users: 12, subscriptions: 3 },
    { date: "Tue", users: 19, subscriptions: 5 },
    { date: "Wed", users: 15, subscriptions: 4 },
    { date: "Thu", users: 28, subscriptions: 8 },
    { date: "Fri", users: 22, subscriptions: 6 },
    { date: "Sat", users: 18, subscriptions: 5 },
    { date: "Sun", users: 25, subscriptions: 7 },
  ];

  const interviewStatsData = [
    { date: "Mon", completed: 45, pending: 12 },
    { date: "Tue", completed: 52, pending: 8 },
    { date: "Wed", completed: 48, pending: 15 },
    { date: "Thu", completed: 65, pending: 10 },
    { date: "Fri", completed: 58, pending: 7 },
    { date: "Sat", completed: 42, pending: 18 },
    { date: "Sun", completed: 55, pending: 13 },
  ];

  const revenueData = [
    { name: "Week 1", revenue: 89.91 },
    { name: "Week 2", revenue: 129.87 },
    { name: "Week 3", revenue: 159.84 },
    { name: "Week 4", revenue: 199.8 },
  ];

  const userDistributionData = [
    { name: "Active Subscribers", value: data.totalSubscription },
    { name: "Free Users", value: data.totalUser - data.totalSubscription },
  ];

  const COLORS = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];

  return (
    <div className="space-y-6">
      {/* Header with Date Picker */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Admin Analytics Overview
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your application performance over time
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

      {/* Stats Cards */}
      <DashboardStats data={data} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* User Growth Chart */}
        <Card className="p-6 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50/50 dark:from-gray-900 dark:to-emerald-950/20 border-2 border-emerald-100 dark:border-emerald-900/30">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg shadow-lg shadow-emerald-500/30">
                <Icon
                  icon="solar:users-group-rounded-linear"
                  className="text-white"
                  width={20}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Growth Trend
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              New users and subscriptions over the week
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1} />
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
              <Legend />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#colorUsers)"
                name="Users"
              />
              <Area
                type="monotone"
                dataKey="subscriptions"
                stroke="#14b8a6"
                strokeWidth={3}
                fill="url(#colorSubs)"
                name="Subscriptions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Interview Stats Chart */}
        <Card className="p-6 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-teal-50/50 dark:from-gray-900 dark:to-teal-950/20 border-2 border-teal-100 dark:border-teal-900/30">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg shadow-lg shadow-teal-500/30">
                <Icon
                  icon="solar:clipboard-list-linear"
                  className="text-white"
                  width={20}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Interview Statistics
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Completed vs Pending interviews
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={interviewStatsData}>
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
                  border: "2px solid #14b8a6",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgba(20, 184, 166, 0.3)",
                }}
              />
              <Legend />
              <Bar
                dataKey="completed"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
                name="Completed"
              />
              <Bar
                dataKey="pending"
                fill="#fbbf24"
                radius={[8, 8, 0, 0]}
                name="Pending"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Chart */}
        <Card className="p-6 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/50 dark:from-gray-900 dark:to-green-950/20 border-2 border-green-100 dark:border-green-900/30">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg shadow-lg shadow-green-500/30">
                <Icon
                  icon="solar:dollar-minimalistic-broken"
                  className="text-white"
                  width={20}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Revenue Trend
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monthly subscription revenue
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#a7f3d0"
                opacity={0.3}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                stroke="#6ee7b7"
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                stroke="#6ee7b7"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "2px solid #22c55e",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgba(34, 197, 94, 0.3)",
                }}
                formatter={(value: any) => [`$${value.toFixed(2)}`, "Revenue"]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={4}
                dot={{
                  fill: "#10b981",
                  r: 6,
                  strokeWidth: 3,
                  stroke: "#fff",
                }}
                activeDot={{ r: 8 }}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* User Distribution Pie Chart */}
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
                User Distribution
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Subscribers vs Free users
            </p>
          </div>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={userDistributionData}
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
                  {userDistributionData.map((entry, index) => (
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
              {userDistributionData.map((entry, index) => {
                const total = data.totalUser;
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

      {/* Quick Actions */}
      <Card className="p-6 shadow-xl bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 dark:from-gray-900 dark:via-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-200 dark:border-emerald-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            className="font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/60 transition-all duration-300"
            size="lg"
            startContent={
              <Icon icon="solar:users-group-rounded-linear" width={20} />
            }
            onClick={() => router.push("/admin/users")}
          >
            Manage Users
          </Button>
          <Button
            className="font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/50 hover:shadow-xl hover:shadow-teal-500/60 transition-all duration-300"
            size="lg"
            startContent={
              <Icon icon="solar:clipboard-list-linear" width={20} />
            }
            onClick={() => router.push("/admin/interviews")}
          >
            View Interviews
          </Button>
          <Button
            className="font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/60 transition-all duration-300"
            size="lg"
            startContent={<Icon icon="solar:chart-2-linear" width={20} />}
            onClick={() => window.location.reload()}
          >
            Refresh Stats
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
