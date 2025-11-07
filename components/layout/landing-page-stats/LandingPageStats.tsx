"use client";

import type { ButtonProps, CardProps } from "@heroui/react";

import { Card, cn } from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import {
  Cell,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  name: string;
  value: number;
  [key: string]: string | number;
};

type CircleChartProps = {
  title: string;
  color: ButtonProps["color"];
  chartData: ChartData[];
  total: number;
};

const data: CircleChartProps[] = [
  {
    title: "Activity",
    color: "default",
    total: 10000,
    chartData: [
      {
        name: "Active Users",
        value: 10000,
        fill: "hsl(var(--heroui-primary))",
      },
    ],
  },
  {
    title: "Interviews",
    color: "primary",
    total: 650000,
    chartData: [
      {
        name: "Interviews Created",
        value: 650000,
        fill: "hsl(var(--heroui-primary))",
      },
    ],
  },
  {
    title: "Companies",
    color: "secondary",
    total: 65,
    chartData: [
      {
        name: "Companies",
        value: 3150,
        fill: "hsl(var(--heroui-secondary))",
      },
    ],
  },
  {
    title: "Ratings",
    color: "success",
    total: 4.8,
    chartData: [
      { name: "Ratings", value: 4.5, fill: "hsl(var(--heroui-success))" },
    ],
  },
];

export default function LandingPageStats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div ref={sectionRef} className="w-full">
      <hr className="my-10 opacity-0 animate-fade-in" />
      <dl className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.map((item, index) => (
          <div
            key={index}
            className={`transform transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <CircleChartCard {...item} isVisible={isVisible} />
          </div>
        ))}
      </dl>
    </div>
  );
}

const formatTotal = (value: number | undefined) => {
  return value?.toLocaleString() ?? "0";
};

const CircleChartCard = React.forwardRef<
  HTMLDivElement,
  Omit<CardProps, "children"> & CircleChartProps & { isVisible: boolean }
>(({ className, title, color, chartData, total, isVisible, ...props }, ref) => {
  return (
    <Card
      ref={ref}
      className={cn(
        "h-[240px] border border-transparent dark:border-default-100 hover:scale-105 hover:shadow-2xl hover:border-primary-300 transition-all duration-500 cursor-pointer group",
        className
      )}
      {...props}
    >
      <div className="flex h-full gap-x-3 relative overflow-hidden">
        {/* Animated gradient background on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <ResponsiveContainer
          className="[&_.recharts-surface]:outline-none relative z-10"
          height="100%"
          width="100%"
        >
          <RadialBarChart
            barSize={10}
            cx="50%"
            cy="50%"
            data={chartData}
            endAngle={-270}
            innerRadius={90}
            outerRadius={70}
            startAngle={90}
          >
            <PolarAngleAxis
              angleAxisId={0}
              domain={[0, total]}
              tick={false}
              type="number"
            />
            <RadialBar
              angleAxisId={0}
              animationDuration={1500}
              animationEasing="ease-out"
              animationBegin={0}
              background={{
                fill: "hsl(var(--heroui-default-100))",
              }}
              cornerRadius={12}
              dataKey="value"
              isAnimationActive={isVisible}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(var(--heroui-${
                    color === "default" ? "foreground" : color
                  }))`}
                  className="transition-all duration-300"
                />
              ))}
            </RadialBar>
            <g className="animate-pulse-slow">
              <text textAnchor="middle" x="50%" y="48%">
                <tspan
                  className="fill-default-500 text-tiny transition-all duration-300 group-hover:fill-primary-500"
                  dy="-0.5em"
                  x="50%"
                >
                  {chartData?.[0].name}
                </tspan>
                <tspan
                  className="fill-foreground text-medium font-semibold transition-all duration-300 group-hover:text-primary-500"
                  dy="1.5em"
                  x="50%"
                >
                  {formatTotal(total)}+
                </tspan>
              </text>
            </g>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});

CircleChartCard.displayName = "CircleChartCard";
