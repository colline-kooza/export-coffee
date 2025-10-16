"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Users, AlertCircle, CheckCircle } from "lucide-react";
import {
  dummyBuyingWeightNotes,
  dummyQualityInspections,
  dummyTraders,
} from "@/lib/dummy-data";
import { StatCard } from "../stat-card";
import { ActivityList } from "../activity-list";

export default function ProcurementDashboard() {
  const totalTraders = dummyTraders.length;
  const totalPurchasesKg = dummyBuyingWeightNotes.reduce(
    (sum, bwn) => sum + bwn.netWeightKg,
    0
  );
  const totalPurchasesUGX = dummyBuyingWeightNotes.reduce(
    (sum, bwn) => sum + bwn.totalAmountUGX,
    0
  );
  const avgQualityScore =
    dummyTraders.reduce((sum, t) => sum + t.qualityAcceptanceRate, 0) /
    dummyTraders.length;

  const recentBWNs = dummyBuyingWeightNotes.map((bwn) => ({
    id: bwn.id,
    title: bwn.number,
    description: `${bwn.trader} - ${bwn.netWeightKg} kg ${bwn.coffeeType}`,
    timestamp: bwn.date,
    status: bwn.status === "COMPLETED" ? "completed" : "pending",
  }));

  return (
    <div className="space-y-8 p-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Traders"
          value={totalTraders}
          icon={Users}
          description="All traders active"
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Total Purchases (This Month)"
          value={`${totalPurchasesKg.toLocaleString()} kg`}
          icon={Leaf}
          description={`UGX ${(totalPurchasesUGX / 1000000).toFixed(1)}M`}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Avg Quality Score"
          value={`${avgQualityScore.toFixed(1)}%`}
          icon={CheckCircle}
          description="Across all traders"
          trend={{ value: 2, isPositive: true }}
        />
        <StatCard
          title="Pending QC"
          value={
            dummyQualityInspections.filter((q) => q.result === "BORDERLINE")
              .length
          }
          icon={AlertCircle}
          description="Requires attention"
          trend={{ value: 1, isPositive: false }}
        />
      </div>

      {/* Trader Performance */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle>Trader Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dummyTraders.map((trader) => (
              <div
                key={trader.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{trader.name}</p>
                  <p className="text-sm text-slate-600">
                    {trader.totalDeliveries} deliveries •{" "}
                    {trader.totalVolumeKg.toLocaleString()} kg
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">
                      {trader.trustScore}%
                    </p>
                    <p className="text-xs text-slate-600">Trust Score</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">
                      {trader.qualityAcceptanceRate}%
                    </p>
                    <p className="text-xs text-slate-600">Quality Rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent BWNs and Quality Inspections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityList
          title="Recent Buying Weight Notes"
          activities={recentBWNs}
        />

        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">
              Quality Inspection Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dummyQualityInspections.map((qc) => (
                <div
                  key={qc.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {qc.number}
                    </p>
                    <p className="text-xs text-slate-600">
                      Defects: {qc.defectCount} • Screen: {qc.screenSizePass}%
                    </p>
                  </div>
                  <Badge
                    className={
                      qc.result === "PASSED"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }
                  >
                    {qc.result}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
