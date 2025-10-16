"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Award } from "lucide-react";

// Trader performance data
const traderData = [
  { name: "Ahmed Coffee", volume: 125, quality: 94, trustScore: 92 },
  { name: "Kampala Coop", volume: 98, quality: 91, trustScore: 88 },
  { name: "Western Region", volume: 87, quality: 88, trustScore: 85 },
];

// Color scale based on trust score - earth tones matching #8b4513
const getBarColor = (trustScore: number) => {
  if (trustScore >= 90) return "#6b8e23"; // Olive green (high performance)
  if (trustScore >= 85) return "#8b4513"; // Saddle brown (your primary color)
  return "#cd853f"; // Peru/tan (lower performance)
};

export function TraderPerformanceChart() {
  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-md">
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between text-amber-900">
          <span>Top Trader Performance</span>
          <Award className="h-4 w-4 text-amber-700" />
        </CardTitle>
        <p className="text-xs text-amber-700 mt-1">
          Total volume delivered (1000 kg)
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            volume: {
              label: "Volume",
              color: "#8b4513",
            },
          }}
          className="h-[280px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={traderData}
              layout="vertical"
              margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#d4a574"
                opacity={0.5}
              />
              <XAxis
                type="number"
                tick={{ fill: "#7c3e0e", fontSize: 12 }}
                axisLine={{ stroke: "#a0522d" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#7c3e0e", fontSize: 12 }}
                axisLine={{ stroke: "#a0522d" }}
                width={120}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-amber-50 p-3 rounded-lg shadow-xl border-2 border-amber-300">
                        <p className="font-semibold text-sm text-amber-900">
                          {data.name}
                        </p>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-amber-800">
                            Volume:{" "}
                            <span className="font-medium">
                              {data.volume}k kg
                            </span>
                          </p>
                          <p className="text-xs text-amber-800">
                            Quality Rate:{" "}
                            <span className="font-medium">{data.quality}%</span>
                          </p>
                          <p className="text-xs text-amber-800">
                            Trust Score:{" "}
                            <span className="font-medium">
                              {data.trustScore}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="volume" radius={[0, 8, 8, 0]}>
                {traderData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.trustScore)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#6b8e23]" />
            <span className="text-amber-800">Trust Score 90+</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#8b4513]" />
            <span className="text-amber-800">Trust Score 85-89</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#cd853f]" />
            <span className="text-amber-800">Trust Score {"<"}85</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
