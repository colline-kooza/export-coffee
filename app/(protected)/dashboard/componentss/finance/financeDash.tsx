"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { dummyFinancialMetrics, dummyPayments } from "@/lib/dummy-data";
import { StatCard } from "../stat-card";
import { ActivityList } from "../activity-list";

export default function FinanceDashboard() {
  const pendingPayments = dummyPayments.filter(
    (p) => p.status === "PENDING"
  ).length;
  const totalPendingAmount = dummyPayments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);

  const paymentActivities = dummyPayments.map((payment) => ({
    id: payment.id,
    title: payment.number,
    description: `${payment.trader} • UGX ${(payment.amount / 1000000).toFixed(
      1
    )}M`,
    timestamp: payment.date,
    status: payment.status === "PAID" ? "completed" : "pending",
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "APPROVED":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue (USD)"
          value={`$${(dummyFinancialMetrics.totalRevenueUSD / 1000).toFixed(
            0
          )}K`}
          icon={DollarSign}
          description="From exports"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Gross Profit"
          value={`UGX ${(
            dummyFinancialMetrics.grossProfitUGX / 1000000
          ).toFixed(1)}M`}
          icon={TrendingUp}
          description={`${dummyFinancialMetrics.profitMarginPercent}% margin`}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Pending Payments"
          value={pendingPayments}
          icon={AlertCircle}
          description={`UGX ${(totalPendingAmount / 1000000).toFixed(1)}M`}
          trend={{ value: 2, isPositive: false }}
        />
        <StatCard
          title="Payment Success Rate"
          value="98%"
          icon={CheckCircle}
          description="On-time payments"
          trend={{ value: 1, isPositive: true }}
        />
      </div>

      {/* Financial Summary */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Total Revenue</p>
              <p className="text-lg font-bold text-slate-900">
                UGX{" "}
                {(dummyFinancialMetrics.totalRevenueUGX / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Purchase Cost</p>
              <p className="text-lg font-bold text-slate-900">
                UGX{" "}
                {(dummyFinancialMetrics.purchaseCostUGX / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Operating Costs</p>
              <p className="text-lg font-bold text-slate-900">
                UGX{" "}
                {(
                  (dummyFinancialMetrics.dryingCostUGX +
                    dummyFinancialMetrics.transportCostUGX) /
                  1000000
                ).toFixed(1)}
                M
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Drying Cost</p>
              <p className="text-lg font-bold text-slate-900">
                UGX {(dummyFinancialMetrics.dryingCostUGX / 1000000).toFixed(1)}
                M
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Transport Cost</p>
              <p className="text-lg font-bold text-slate-900">
                UGX{" "}
                {(dummyFinancialMetrics.transportCostUGX / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Gross Profit</p>
              <p className="text-lg font-bold text-green-600">
                UGX{" "}
                {(dummyFinancialMetrics.grossProfitUGX / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityList title="Recent Payments" activities={paymentActivities} />

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dummyPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {payment.number}
                    </p>
                    <p className="text-xs text-slate-600">{payment.trader}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-900">
                      UGX {(payment.amount / 1000000).toFixed(1)}M
                    </span>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
