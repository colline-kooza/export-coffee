// components/UserDashboard.tsx
"use client";

import { useState } from "react";
import { useUserDashboard, type TimeRange } from "@/hooks/useDashboard";
import {
  Package,
  Grid2X2,
  Store,
  Star,
  ShoppingBag,
  ArrowUpRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UserDashboardProps {
  userId: string;
}

export default function UserDashboard({ userId }: UserDashboardProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("today");
  const { data, isLoading, error } = useUserDashboard(userId, timeRange);

  const quickLinks = [
    { title: "Browse Products", href: "/products", icon: ShoppingBag },
    { title: "Categories", href: "/categories", icon: Grid2X2 },
    { title: "Vendors", href: "/vendors", icon: Store },
    { title: "Featured", href: "/featured", icon: Star },
  ];

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: "today", label: "Today" },
    { value: "week", label: "Last 7 Days" },
    { value: "month", label: "Last 28 Days" },
    { value: "all", label: "All Time" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading dashboard</p>
      </div>
    );
  }

  const metrics = [
    {
      title: "Available Products",
      value: data?.metrics.totalProducts || 0,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Categories",
      value: data?.metrics.totalCategories || 0,
      icon: Grid2X2,
      color: "bg-green-500",
    },
    {
      title: "Verified Vendors",
      value: data?.metrics.totalVendors || 0,
      icon: Store,
      color: "bg-purple-500",
    },
    {
      title: "Featured Items",
      value: data?.metrics.activeProducts || 0,
      icon: Star,
      color: "bg-orange-500",
    },
  ];

  const chartData = Object.entries(data?.chartData || {}).map(
    ([date, count]) => ({
      date: format(new Date(date), "MMM dd"),
      products: count,
    })
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Welcome back, {data?.user.name}!
            </h2>
            <p className="text-purple-100 mt-1">
              Member since{" "}
              {format(
                new Date(data?.user.memberSince || new Date()),
                "MMMM yyyy"
              )}
            </p>
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-2">
                {data?.user.emailVerified ? (
                  <CheckCircle className="w-4 h-4 text-green-300" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-300" />
                )}
                <span className="text-sm">
                  Email {data?.user.emailVerified ? "Verified" : "Not Verified"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {data?.user.phoneVerified ? (
                  <CheckCircle className="w-4 h-4 text-green-300" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-300" />
                )}
                <span className="text-sm">
                  Phone {data?.user.phoneVerified ? "Verified" : "Not Verified"}
                </span>
              </div>
            </div>
          </div>
          <ShoppingBag className="w-12 h-12 text-purple-200" />
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                timeRange === range.value
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {metric.value.toLocaleString()}
                  </p>
                </div>
                <div className={`${metric.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart and Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            New Products (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="products"
                stroke="#9333ea"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
