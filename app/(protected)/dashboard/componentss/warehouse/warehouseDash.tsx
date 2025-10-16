"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertCircle, Leaf } from "lucide-react";
import { dummyInventory } from "@/lib/dummy-data";
import { StatCard } from "../stat-card";
import { ActivityList } from "../activity-list";

export default function WarehouseDashboard() {
  const totalInventoryKg = dummyInventory.reduce(
    (sum, inv) => sum + inv.quantityKg,
    0
  );
  const arabicaKg = dummyInventory
    .filter((inv) => inv.coffeeType === "ARABICA")
    .reduce((sum, inv) => sum + inv.quantityKg, 0);
  const robustaKg = dummyInventory
    .filter((inv) => inv.coffeeType === "ROBUSTA")
    .reduce((sum, inv) => sum + inv.quantityKg, 0);
  const agedStockCount = dummyInventory.filter(
    (inv) => inv.daysInStock > 7
  ).length;

  const inventoryActivities = dummyInventory.map((inv) => ({
    id: inv.id,
    title: inv.lotNumber,
    description: `${inv.coffeeType} • ${inv.quantityKg} kg • ${inv.storageLocation}`,
    timestamp: `${inv.daysInStock} days in stock`,
    status: inv.daysInStock > 7 ? "warning" : "completed",
  }));

  return (
    <div className="space-y-8 p-6">
      {/* <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Warehouse & Inventory Management
        </h1>
        <p className="text-slate-600 mt-2">
          Monitor stock levels, storage locations, and inventory movements
        </p>
      </div> */}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Inventory"
          value={`${totalInventoryKg.toLocaleString()} kg`}
          icon={Package}
          description="All coffee types"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Arabica Stock"
          value={`${arabicaKg.toLocaleString()} kg`}
          icon={Leaf}
          description="Premium grade"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Robusta Stock"
          value={`${robustaKg.toLocaleString()} kg`}
          icon={Leaf}
          description="Standard grade"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Aged Stock Alert"
          value={agedStockCount}
          icon={AlertCircle}
          description="Over 7 days in storage"
          trend={{ value: 1, isPositive: false }}
        />
      </div>

      {/* Storage Utilization */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle>Storage Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["Bay A", "Bay B", "Bay C"].map((bay, idx) => {
              const utilization = [65, 45, 72][idx];
              return (
                <div key={bay}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900">
                      {bay}
                    </span>
                    <span className="text-sm text-slate-600">
                      {utilization}% utilized
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-amber-600 h-2 rounded-full"
                      style={{ width: `${utilization}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Inventory Details */}
      <ActivityList
        title="Current Inventory Lots"
        activities={inventoryActivities}
      />
    </div>
  );
}
