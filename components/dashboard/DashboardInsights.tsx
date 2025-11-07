"use client";

import { Card, Chip, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMemo } from "react";

type DailyStats = {
  date: string;
  totalInterviews: number;
  completedQuestions: number;
  unAnswerQuestions: number;
  completionRate: number;
};

interface InsightsProps {
  stats: DailyStats[];
  totalInterviews: number;
  completionRate: number;
}

export default function DashboardInsights({
  stats,
  totalInterviews,
  completionRate,
}: InsightsProps) {
  const insights = useMemo(() => {
    if (!stats || stats.length === 0) {
      return {
        averageQuestionsPerDay: 0,
        bestDay: null,
        improvementTrend: 0,
        totalQuestions: 0,
        averageCompletionRate: 0,
      };
    }

    const totalQuestions = stats.reduce(
      (sum, s) => sum + s.completedQuestions + s.unAnswerQuestions,
      0
    );
    const averageQuestionsPerDay = Math.round(totalQuestions / stats.length);

    const bestDay = stats.reduce((best, current) =>
      current.completionRate > (best?.completionRate ?? 0) ? current : best
    );

    let improvementTrend = 0;

    if (stats.length >= 2) {
      const midPoint = Math.floor(stats.length / 2);
      const firstHalf = stats.slice(0, midPoint);
      const secondHalf = stats.slice(midPoint);

      const firstHalfAvg =
        firstHalf.reduce(
          (sum, s) => sum + parseFloat(s.completionRate.toString()),
          0
        ) / firstHalf.length;
      const secondHalfAvg =
        secondHalf.reduce(
          (sum, s) => sum + parseFloat(s.completionRate.toString()),
          0
        ) / secondHalf.length;

      improvementTrend = secondHalfAvg - firstHalfAvg;
    }

    const averageCompletionRate =
      stats.reduce(
        (sum, s) => sum + parseFloat(s.completionRate.toString()),
        0
      ) / stats.length;

    return {
      averageQuestionsPerDay,
      bestDay,
      improvementTrend: isNaN(improvementTrend) ? 0 : improvementTrend,
      totalQuestions,
      averageCompletionRate: isNaN(averageCompletionRate)
        ? 0
        : averageCompletionRate,
    };
  }, [stats]);

  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {/* Performance Trend */}
      <Card className="p-6 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50/50 dark:from-gray-900 dark:to-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-800 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="flex items-start justify-between mb-4 relative z-10">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Performance Trend
            </p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              {insights.improvementTrend === 0 ? (
                <span className="text-gray-400">—</span>
              ) : (
                <span
                  className={
                    insights.improvementTrend > 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                  }
                >
                  {insights.improvementTrend > 0 ? "↑" : "↓"}{" "}
                  {Math.abs(insights.improvementTrend).toFixed(1)}%
                </span>
              )}
            </h3>
          </div>
          <div
            className={`p-3 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110 ${
              insights.improvementTrend > 0
                ? "bg-gradient-to-br from-emerald-400 to-teal-500"
                : insights.improvementTrend < 0
                ? "bg-gradient-to-br from-amber-400 to-orange-500"
                : "bg-gradient-to-br from-gray-300 to-gray-400"
            }`}
            style={{
              boxShadow:
                insights.improvementTrend > 0
                  ? "0 8px 16px rgba(16, 185, 129, 0.4)"
                  : insights.improvementTrend < 0
                  ? "0 8px 16px rgba(245, 158, 11, 0.4)"
                  : "0 8px 16px rgba(156, 163, 175, 0.4)",
            }}
          >
            <Icon
              icon={
                insights.improvementTrend > 0
                  ? "solar:graph-up-linear"
                  : insights.improvementTrend < 0
                  ? "solar:graph-down-linear"
                  : "solar:graph-linear"
              }
              className="text-white"
              width={24}
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 relative z-10">
          {insights.improvementTrend > 0
            ? "🎉 Your completion rate is improving! Keep it up!"
            : insights.improvementTrend < 0
            ? "💪 Focus on completing more questions to improve."
            : "📊 Complete more interviews to see your trend."}
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Card>

      {/* Best Performance Day */}
      <Card className="p-6 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-teal-50/50 dark:from-gray-900 dark:to-teal-950/20 border-2 border-teal-200 dark:border-teal-800 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400/0 via-teal-400/10 to-teal-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="flex items-start justify-between mb-4 relative z-10">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Best Performance
            </p>
            <h3 className="text-3xl font-bold text-teal-600 dark:text-teal-400">
              {insights.bestDay?.completionRate.toFixed(0)}%
            </h3>
          </div>
          <div
            className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
            style={{
              boxShadow: "0 8px 16px rgba(251, 191, 36, 0.4)",
            }}
          >
            <Icon
              icon="solar:cup-star-linear"
              className="text-white"
              width={24}
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 relative z-10">
          🏆 Achieved on{" "}
          <span className="font-semibold text-teal-600 dark:text-teal-400">
            {insights.bestDay?.date &&
              new Date(insights.bestDay.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
          </span>
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Card>

      {/* Average Activity */}
      <Card className="p-6 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/50 dark:from-gray-900 dark:to-green-950/20 border-2 border-green-200 dark:border-green-800 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="flex items-start justify-between mb-4 relative z-10">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Daily Average
            </p>
            <h3 className="text-3xl font-bold text-green-600 dark:text-green-400">
              {insights.averageQuestionsPerDay}
            </h3>
          </div>
          <div
            className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg transition-transform duration-300 group-hover:scale-110"
            style={{
              boxShadow: "0 8px 16px rgba(34, 197, 94, 0.4)",
            }}
          >
            <Icon
              icon="solar:calendar-mark-linear"
              className="text-white"
              width={24}
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 relative z-10">
          📝 Questions answered per day on average
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Card>

      {/* Overall Progress */}
      <Card className="p-6 md:col-span-2 lg:col-span-3 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 dark:from-gray-900 dark:via-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-200 dark:border-emerald-800 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-teal-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 relative z-10">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Overall Progress
            </p>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {totalInterviews} Interviews Completed
            </h3>
          </div>
          <Chip
            size="lg"
            className="font-bold shadow-lg"
            style={{
              background:
                completionRate >= 75
                  ? "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)"
                  : completionRate >= 50
                  ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                  : "linear-gradient(135deg, #f87171 0%, #dc2626 100%)",
              color: "white",
              boxShadow:
                completionRate >= 75
                  ? "0 4px 12px rgba(16, 185, 129, 0.4)"
                  : completionRate >= 50
                  ? "0 4px 12px rgba(251, 191, 36, 0.4)"
                  : "0 4px 12px rgba(239, 68, 68, 0.4)",
            }}
          >
            {completionRate.toFixed(1)}% Completion Rate
          </Chip>
        </div>

        <div className="relative">
          <Progress
            value={completionRate}
            size="lg"
            className="mt-2"
            classNames={{
              indicator:
                completionRate >= 75
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                  : completionRate >= 50
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                  : "bg-gradient-to-r from-red-400 to-red-600",
              track: "bg-gray-200 dark:bg-gray-800",
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-full rounded-full blur-sm opacity-50"
            style={{
              background:
                completionRate >= 75
                  ? "linear-gradient(to right, #10b981, #14b8a6)"
                  : completionRate >= 50
                  ? "linear-gradient(to right, #fbbf24, #f59e0b)"
                  : "linear-gradient(to right, #f87171, #dc2626)",
              width: `${completionRate}%`,
            }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total Questions
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {insights.totalQuestions}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 border border-teal-200 dark:border-teal-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Avg Completion
            </p>
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              {insights.averageCompletionRate.toFixed(1)}%
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Active Days
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.length}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Card>
    </div>
  );
}
