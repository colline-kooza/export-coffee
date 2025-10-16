// components/AdminDashboard.tsx
"use client";

import { useState } from "react";
import { useAdminDashboard, type TimeRange } from "@/hooks/useDashboard";
import {
  Users,
  Store,
  Package,
  Grid2X2,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
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

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("today");
  const { data, isLoading, error } = useAdminDashboard(timeRange);

  const quickLinks = [
    { title: "Manage Users", href: "/dashboard/users", icon: Users },
    { title: "Vendor Shops", href: "/dashboard/vendors", icon: Store },
    { title: "Categories", href: "/dashboard/categories", icon: Grid2X2 },
    { title: "Products", href: "/dashboard/products", icon: Package },
    {
      title: "Verification Requests",
      href: "/dashboard/requests",
      icon: AlertCircle,
    },
    { title: "V-Codes", href: "/dashboard/v-codes", icon: TrendingUp },
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
      title: "Total Users",
      value: data?.metrics.users || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Vendors",
      value: data?.metrics.vendors || 0,
      icon: Store,
      color: "bg-green-500",
    },
    {
      title: "Products",
      value: data?.metrics.products || 0,
      icon: Package,
      color: "bg-purple-500",
    },
    {
      title: "Pending Requests",
      value: data?.metrics.pendingRequests || 0,
      icon: AlertCircle,
      color: "bg-orange-500",
    },
  ];

  const chartData = Object.entries(data?.chartData || {}).map(
    ([date, count]) => ({
      date: format(new Date(date), "MMM dd"),
      registrations: count,
    })
  );

  return (
    <div className="space-y-6">
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
            User Registrations (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="registrations"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Users
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">
                    Name
                  </th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">
                    Email
                  </th>
                  <th className="text-left text-sm font-medium text-gray-600 pb-3">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.recentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100">
                    <td className="py-3 text-sm text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="py-3 text-sm text-gray-600">
                      {format(new Date(user.createdAt), "MMM dd, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Access Links */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Access
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors group"
              >
                <Icon className="w-8 h-8 text-gray-600 group-hover:text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-900 text-center">
                  {link.title}
                </span>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 mt-1" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
