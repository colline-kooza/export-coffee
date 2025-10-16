"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Eye, Package, Scale, Truck, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { BuyingWeightNote } from "@/types/buying-weight-note"

interface BWNCardProps {
  bwn: BuyingWeightNote
  onView: (bwn: BuyingWeightNote) => void
}

const statusColors: Record<string, string> = {
  PENDING_WEIGHING: "bg-gray-100 text-gray-800 border-gray-200",
  WEIGHED: "bg-blue-100 text-blue-800 border-blue-200",
  MOISTURE_TESTED: "bg-cyan-100 text-cyan-800 border-cyan-200",
  PRICE_CALCULATED: "bg-purple-100 text-purple-800 border-purple-200",
  AWAITING_QC: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PAYMENT_APPROVED: "bg-green-100 text-green-800 border-green-200",
  COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
}

const paymentStatusColors: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-800 border-orange-200",
  APPROVED: "bg-green-100 text-green-800 border-green-200",
  PAID: "bg-emerald-100 text-emerald-800 border-emerald-200",
}

export function BWNCard({ bwn, onView }: BWNCardProps) {
    console.log(bwn ,"sksksksk")
  const formatCurrency = (amount: number | bigint | string) => {
    // Handle string or number conversion
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount)
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(numAmount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-UG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatMoisture = (moisture: number) => {
    return `${(moisture / 10).toFixed(1)}%`
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-[#8B4513]/20 hover:border-[#8B4513]/40 bg-white">
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-[#8B4513] text-base leading-tight">{bwn.bwnNumber}</h3>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(bwn.deliveryDate)}
              </p>
            </div>
            <Badge
              className={cn(
                "text-[10px] font-semibold border px-2 py-0.5",
                statusColors[bwn.status] || "bg-gray-100 text-gray-800",
              )}
            >
              {bwn.status.replace(/_/g, " ")}
            </Badge>
          </div>

          {/* Trader Info */}
          <div className="bg-[#8B4513]/5 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-[#8B4513]" />
              <span className="text-xs font-semibold text-[#8B4513]">{bwn.trader?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-3.5 w-3.5 text-gray-600" />
              <span className="text-xs text-gray-700">{bwn.truckNumber}</span>
            </div>
          </div>

          {/* Coffee Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">Coffee Type</p>
              <div className="flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-[#8B4513]" />
                <p className="text-xs font-semibold text-gray-900">{bwn.coffeeType}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">Net Weight</p>
              <div className="flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5 text-[#8B4513]" />
                <p className="text-xs font-semibold text-gray-900">{bwn.finalNetWeightKg?.toLocaleString() || 0} kg</p>
              </div>
            </div>
          </div>

          {/* Weight & Moisture */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
            <div className="text-center">
              <p className="text-[10px] text-gray-500 font-medium">Gross</p>
              <p className="text-xs font-bold text-gray-900">{bwn.grossWeightKg || 0} kg</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-500 font-medium">Tare</p>
              <p className="text-xs font-bold text-gray-900">{bwn.tareWeightKg || 0} kg</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-500 font-medium">Moisture</p>
              <p className="text-xs font-bold text-[#8B4513]">{formatMoisture(bwn.moistureContent || 0)}</p>
            </div>
          </div>

          {/* Financial Info */}
          <div className="bg-gradient-to-r from-[#8B4513]/10 to-[#8B4513]/5 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-600 font-medium">Price/kg:</span>
              <span className="text-xs font-bold text-[#8B4513]">{formatCurrency(bwn.pricePerKgUGX || 0)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#8B4513]/20">
              <span className="text-xs text-gray-700 font-semibold">Total Amount:</span>
              <span className="text-sm font-bold text-[#8B4513]">{formatCurrency(bwn.totalAmountUGX || 0)}</span>
            </div>
          </div>

          {/* Payment Status */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-600 font-medium">Payment:</span>
            <Badge
              className={cn(
                "text-[10px] font-semibold border px-2 py-0.5",
                paymentStatusColors[bwn.paymentStatus] || "bg-gray-100 text-gray-800",
              )}
            >
              {bwn.paymentStatus}
            </Badge>
          </div>

          {/* Actions */}
          <Button
            onClick={() => onView(bwn)}
            className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90 text-white text-xs font-semibold h-8 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}