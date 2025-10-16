"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Leaf,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { StatCard } from "./stat-card";
import { ActivityList } from "./activity-list";
import { WeeklyTrendsChart } from "./weekly-trends-chart";
import { TraderPerformanceChart } from "./trader-performance-chart";
import {
  dummyDailyMetrics,
  dummyExportOrders,
  dummyFinancialMetrics,
  dummyWeeklyMetrics,
} from "../dammy/dammy-data";

export default function AdminDashboardPage() {
  const recentActivities = [
    {
      id: "1",
      title: "BWN-2025-10-1847 Approved",
      description: "Ahmed Coffee Traders - 3,200 kg Robusta",
      timestamp: "2 hours ago",
      status: "completed" as const,
    },
    {
      id: "2",
      title: "Quality Inspection Completed",
      description: "Lot ROB-TRD-Ahmed-131025-03T - PASSED",
      timestamp: "4 hours ago",
      status: "completed" as const,
    },
    {
      id: "3",
      title: "Export Order Created",
      description: "EXP-2025-10-047 - Dripkit Coffee (Germany)",
      timestamp: "6 hours ago",
      status: "completed" as const,
    },
    {
      id: "4",
      title: "Payment Pending",
      description: "TP-2025-10-236 - Western Region Suppliers",
      timestamp: "1 day ago",
      status: "pending" as const,
    },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Purchases"
          value={`${dummyDailyMetrics.totalPurchasesKg.toLocaleString()} kg`}
          icon={Leaf}
          description="3 traders delivered"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Quality Pass Rate"
          value={`${dummyDailyMetrics.qualityPassRate}%`}
          icon={CheckCircle}
          description="2 inspections completed"
          trend={{ value: 3, isPositive: true }}
        />
        <StatCard
          title="Active Export Orders"
          value={dummyExportOrders.length}
          icon={Package}
          description="Total value: $130,750"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Weekly Revenue"
          value={`$${(dummyFinancialMetrics.totalRevenueUSD / 1000).toFixed(1)}K`}
          icon={DollarSign}
          description={`Margin: ${dummyFinancialMetrics.profitMarginPercent}%`}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Weekly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-amber-300">
          <CardHeader>
            <CardTitle className="text-sm text-amber-900 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Weekly Purchases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-amber-900">
              {dummyWeeklyMetrics.totalPurchasesKg.toLocaleString()} kg
            </div>
            <p className="text-xs text-amber-700 mt-2">
              Avg price: UGX{" "}
              {dummyWeeklyMetrics.averagePurchasePriceUGX.toLocaleString()}/kg
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300">
          <CardHeader>
            <CardTitle className="text-sm text-yellow-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Weekly Exports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-yellow-900">
              {dummyWeeklyMetrics.totalExportsKg.toLocaleString()} kg
            </div>
            <p className="text-xs text-yellow-700 mt-2">
              Turnover: {dummyWeeklyMetrics.inventoryTurnoverDays} days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-orange-300">
          <CardHeader>
            <CardTitle className="text-sm text-orange-900 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Gross Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-orange-900">
              UGX {(dummyFinancialMetrics.grossProfitUGX / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-orange-700 mt-2">
              Margin: {dummyFinancialMetrics.profitMarginPercent}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WeeklyTrendsChart />
        <TraderPerformanceChart />
      </div>

      {/* Activities and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityList title="Recent Activities" activities={recentActivities} />

        {/* <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dummyAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.priority === "HIGH"
                      ? "bg-red-50 border-red-400"
                      : "bg-amber-50 border-amber-400"
                  }`}
                >
                  <p className="text-sm font-medium text-slate-900">
                    {alert.title}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">{alert.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
