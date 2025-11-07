"use client";

import { IInterview } from "@/backend/config/models/interview.model";
import { calculateAverageScore, calculateDuration } from "@/helper/helpers";
import { Card, cn } from "@heroui/react";
import React from "react";
import {
  Cell,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

interface CircleChartProps {
  title: string;
  color: string;
  total?: number;
  strValue?: string;
  chartData: {
    name: string;
    value: number;
    fill: string;
  }[];
}

export const formatTotal = (value: number | undefined) => {
  return value?.toLocaleString() || "0";
};
export default function ResultTable({ interview }: { interview: IInterview }) {
  const AverageScore = calculateAverageScore(interview?.questions);
  const DurationData = calculateDuration(
    interview?.duration,
    interview?.durationLeft
  );
  const data: CircleChartProps[] = [
    {
      title: "Questions",
      color: "default",
      total: interview?.numOfQuestion,
      strValue: `${interview?.answered} / ${interview?.numOfQuestion}`,
      chartData: [
        {
          name: "Questions",
          value: interview?.answered,
          fill: "hsl(var(--heroui-primary))",
        },
      ],
    },
    {
      title: "Result",
      color: "success",
      total: 10,
      strValue: `${AverageScore} / 10`,
      chartData: [
        {
          name: "Result",
          value: parseFloat(AverageScore?.toString()),
          fill: "hsl(var(--heroui-success))",
        },
      ],
    },
    {
      title: "Duration",
      color: "warning",
      total: DurationData.total,
      strValue: DurationData.strValue,
      chartData: [
        {
          name: "Time",
          value: DurationData.chartDataValue,
          fill: "hsl(var(--heroui-warning))",
        },
      ],
    },
    {
      title: "Difficulty",
      color: "danger",
      total: 3,
      strValue: interview?.difficulty,
      chartData: [
        {
          name: "Difficulty",
          value:
            interview?.difficulty === "Entry level"
              ? 1
              : interview?.difficulty === "Mid level"
              ? 2
              : 3,
          fill: "hsl(var(--heroui-danger))",
        },
      ],
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-3">
      {data.map((item, index) => (
        <CircleChartCard key={index} {...item} />
      ))}
    </div>
  );
}

const CircleChartCard: React.FC<CircleChartProps> = ({
  title,
  color,
  chartData,
  total,
  strValue,
  ...props
}) => {
  return (
    <Card
      className={cn(
        "h-[180px] sm:h-[200px] md:h-[220px] border border-transparent dark:border-default-100"
      )}
      {...props}
    >
      <div className="flex h-full w-full items-center justify-center p-2 sm:p-3">
        <ResponsiveContainer
          className="[&_.recharts-surface]:outline-none"
          height="100%"
          width="100%"
        >
          <RadialBarChart
            barSize={8}
            cx="50%"
            cy="50%"
            data={chartData}
            endAngle={-45}
            innerRadius="70%"
            outerRadius="55%"
            startAngle={225}
          >
            <PolarAngleAxis
              angleAxisId={0}
              domain={[0, total ?? 0]}
              tick={false}
              type="number"
            />
            <RadialBar
              angleAxisId={0}
              animationDuration={1000}
              animationEasing="ease"
              background={{
                fill: "hsl(var(--heroui-default-100))",
              }}
              cornerRadius={12}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(var(--heroui-${
                    color === "default" ? "foreground" : color
                  }))`}
                />
              ))}
            </RadialBar>
            <g>
              <text textAnchor="middle" x="50%" y="48%">
                <tspan
                  className="fill-default-500 text-[10px] sm:text-xs"
                  dy="-0.5em"
                  x="50%"
                >
                  {chartData?.[0].name}
                </tspan>
                <tspan
                  className="fill-foreground text-sm sm:text-base md:text-medium font-semibold"
                  dy="1.5em"
                  x="50%"
                >
                  {strValue ?? formatTotal(total)}
                </tspan>
              </text>
            </g>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
