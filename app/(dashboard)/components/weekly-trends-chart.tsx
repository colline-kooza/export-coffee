"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

// Weekly trend data for the past 7 days
const weeklyData = [
  { day: "Mon", purchases: 8500, exports: 6200 },
  { day: "Tue", purchases: 12000, exports: 8500 },
  { day: "Wed", purchases: 15200, exports: 11000 },
  { day: "Thu", purchases: 11800, exports: 9800 },
  { day: "Fri", purchases: 18500, exports: 13500 },
  { day: "Sat", purchases: 14300, exports: 7200 },
  { day: "Sun", purchases: 7200, exports: 3800 },
];

export function WeeklyTrendsChart() {
  return (
    <Card className="bg-white border-slate-200">
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>Weekly Purchase & Export Trends</span>
          <TrendingUp className="h-4 w-4 text-blue-600" />
        </CardTitle>
        <p className="text-xs text-slate-500 mt-1">
          Daily volume comparison (kg)
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            purchases: {
              label: "Purchases",
              color: "hsl(217, 91%, 60%)",
            },
            exports: {
              label: "Exports",
              color: "hsl(142, 71%, 45%)",
            },
          }}
          className="h-[280px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={weeklyData}
              margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient
                  id="purchasesGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="hsl(217, 91%, 60%)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(217, 91%, 60%)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient
                  id="exportsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="hsl(142, 71%, 45%)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(142, 71%, 45%)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={{ stroke: "#cbd5e1" }}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={{ stroke: "#cbd5e1" }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="purchases"
                stroke="hsl(217, 91%, 60%)"
                strokeWidth={2}
                fill="url(#purchasesGradient)"
              />
              <Area
                type="monotone"
                dataKey="exports"
                stroke="hsl(142, 71%, 45%)"
                strokeWidth={2}
                fill="url(#exportsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
