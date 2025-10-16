"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useBWNStats } from "@/hooks/use-buying-weight-notes"
import { CheckCircle2, Clock, Coffee, DollarSign, FileText, Package } from "lucide-react"

export function BWNStats() {
  const { stats, isLoading, error } = useBWNStats()
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(Number(amount))
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-[#8B4513]/20">
            <CardContent className="p-4">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return null
  }

  const statCards = [
    {
      label: "Total BWNs",
      value: stats.totalBWNs.toLocaleString(),
      icon: FileText,
      color: "text-[#8B4513]",
      bgColor: "bg-[#8B4513]/10",
    },
    {
      label: "Pending",
      value: stats.pendingBWNs.toLocaleString(),
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      label: "Completed",
      value: stats.completedBWNs.toLocaleString(),
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Total Value",
      value: formatCurrency(stats.totalAmount),
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      isLarge: true,
    },
    {
      label: "Arabica",
      value: stats.arabicaCount.toLocaleString(),
      icon: Coffee,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      label: "Robusta",
      value: stats.robustaCount.toLocaleString(),
      icon: Package,
      color: "text-brown-600",
      bgColor: "bg-brown-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <Card
          key={index}
          className="border-[#8B4513]/20 hover:border-[#8B4513]/40 transition-all duration-200 hover:shadow-md"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <p className="text-[10px] text-gray-600 uppercase tracking-wide font-medium">{stat.label}</p>
                <p className={`font-bold ${stat.isLarge ? "text-base" : "text-sm"} text-gray-900 leading-tight`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
