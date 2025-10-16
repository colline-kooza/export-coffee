"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, CheckCircle, Package } from "lucide-react";
import { dummyDryingOrders } from "../../dammy/dammy-data";
import { StatCard } from "../stat-card";
import { ActivityList } from "../activity-list";

export default function OperationsDashboard() {
  const inProgressDrying = dummyDryingOrders.filter(
    (d) => d.status === "IN_PROGRESS"
  ).length;
  const completedDrying = dummyDryingOrders.filter(
    (d) => d.status === "COMPLETED"
  ).length;
  const totalDryingCapacity = dummyDryingOrders.reduce(
    (sum, d) => sum + d.quantityKg,
    0
  );

  const dryingActivities = dummyDryingOrders.map((order) => ({
    id: order.id,
    title: order.number,
    description: `${order.lotNumber} • ${order.quantityKg} kg • MC: ${order.currentMC}%`,
    timestamp: order.status,
    status: order.status === "COMPLETED" ? "completed" : "pending",
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "COOLING":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
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
          title="Drying Orders"
          value={dummyDryingOrders.length}
          icon={Package}
          description="Total active orders"
          trend={{ value: 2, isPositive: true }}
        />
        <StatCard
          title="In Progress"
          value={inProgressDrying}
          icon={TrendingUp}
          description="Currently drying"
          trend={{ value: 1, isPositive: true }}
        />
        <StatCard
          title="Total Capacity"
          value={`${totalDryingCapacity.toLocaleString()} kg`}
          icon={Package}
          description="Being processed"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Equipment Status"
          value="3/3"
          icon={CheckCircle}
          description="Operational"
          trend={{ value: 0, isPositive: true }}
        />
      </div>

      {/* Drying Orders */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle>Active Drying Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dummyDryingOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-slate-900">{order.number}</p>
                    <p className="text-sm text-slate-600">{order.lotNumber}</p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.replace(/_/g, " ")}
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600">Quantity</p>
                    <p className="font-medium text-slate-900">
                      {order.quantityKg} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600">Initial MC</p>
                    <p className="font-medium text-slate-900">
                      {order.initialMC}%
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600">Current MC</p>
                    <p className="font-medium text-slate-900">
                      {order.currentMC}%
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600">Target MC</p>
                    <p className="font-medium text-slate-900">
                      {order.targetMC}%
                    </p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-amber-600 h-2 rounded-full"
                    style={{
                      width: `${(
                        ((order.initialMC - order.currentMC) /
                          (order.initialMC - order.targetMC)) *
                        100
                      ).toFixed(0)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <ActivityList
        title="Drying Process Activities"
        activities={dryingActivities}
      />
    </div>
  );
}
