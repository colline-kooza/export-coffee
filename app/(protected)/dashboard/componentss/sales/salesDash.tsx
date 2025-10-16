"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, DollarSign, AlertCircle } from "lucide-react";
import { dummyExportOrders } from "@/lib/dummy-data";
import { StatCard } from "../stat-card";
import { ActivityList } from "../activity-list";

export default function SalesDashboard() {
  const totalOrderValue = dummyExportOrders.reduce(
    (sum, order) => sum + order.totalValueUSD,
    0
  );
  const readyForLoading = dummyExportOrders.filter(
    (o) => o.status === "READY_FOR_LOADING"
  ).length;
  const inProgress = dummyExportOrders.filter(
    (o) =>
      o.status === "PACKING_IN_PROGRESS" || o.status === "INVENTORY_ALLOCATED"
  ).length;

  const orderActivities = dummyExportOrders.map((order) => ({
    id: order.id,
    title: order.number,
    description: `${order.buyer} (${order.country}) • ${order.quantityKg} kg ${order.coffeeType}`,
    timestamp: `$${(order.totalValueUSD / 1000).toFixed(1)}K`,
    status: order.status === "READY_FOR_LOADING" ? "completed" : "pending",
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "READY_FOR_LOADING":
        return "bg-green-100 text-green-800";
      case "PACKING_IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "INVENTORY_ALLOCATED":
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
          title="Active Orders"
          value={dummyExportOrders.length}
          icon={Package}
          description="All statuses"
          trend={{ value: 3, isPositive: true }}
        />
        <StatCard
          title="Total Order Value"
          value={`$${(totalOrderValue / 1000).toFixed(0)}K`}
          icon={DollarSign}
          description="USD equivalent"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Ready for Loading"
          value={readyForLoading}
          icon={TrendingUp}
          description="Awaiting container"
          trend={{ value: 1, isPositive: true }}
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={AlertCircle}
          description="Packing/allocation"
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Orders by Status */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle>Export Orders Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dummyExportOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{order.number}</p>
                  <p className="text-sm text-slate-600">
                    {order.buyer} • {order.quantityKg.toLocaleString()} kg
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">
                      ${(order.totalValueUSD / 1000).toFixed(1)}K
                    </p>
                    <p className="text-xs text-slate-600">
                      @ ${order.pricePerKgUSD}/kg
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <ActivityList title="Recent Export Orders" activities={orderActivities} />
    </div>
  );
}
