"use client"

import { useParams, useRouter } from "next/navigation"
import { useWeighbridgeReading } from "@/hooks/use-weighbridge-readings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft, Scale, Truck, User, Calendar, Weight, FileText,
  Building2, Phone, Clock, Loader2
} from "lucide-react"
import { format } from "date-fns"
import { Toaster } from "@/components/ui/sonner"

export default function WeighbridgeReadingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { reading, isLoading, isError } = useWeighbridgeReading(id)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#8B4513]/5 via-white to-[#8B4513]/5">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-[#8B4513]" />
          <p className="text-sm text-gray-600">Loading weighbridge reading...</p>
        </div>
      </div>
    )
  }

  if (isError || !reading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#8B4513]/5 via-white to-[#8B4513]/5">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600 text-lg">Error</CardTitle>
            <CardDescription>Failed to load weighbridge reading details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()} variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B4513]/5 via-white to-[#8B4513]/5">
      <div className="container mx-auto py-6 px-4">
        {/* Header */}
        <div className="mb-5">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            size="sm"
            className="mb-3 text-[#8B4513] hover:text-[#8B4513]/80 hover:bg-[#8B4513]/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#8B4513]/10">
              <Scale className="h-7 w-7 text-[#8B4513]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-[#8B4513]">Weighbridge Reading</h1>
              <p className="text-xs text-gray-600 mt-1">
                Recorded {format(new Date(reading.timestamp), "MMM dd, yyyy 'at' hh:mm a")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* LEFT: Main content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Weight Measurements */}
            <Card className="border-[#8B4513]/20 shadow-sm">
              <CardHeader className="bg-[#8B4513]/5 border-b border-[#8B4513]/10 py-3">
                <div className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-[#8B4513]" />
                  <CardTitle className="text-[#8B4513] text-sm font-semibold">Weight Measurements</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <WeightBox
                    title="Gross Weight"
                    icon={<Scale className="h-4 w-4 text-blue-600" />}
                    value={reading.grossWeightKg}
                    color="blue"
                    note="kg (Truck + Coffee)"
                  />
                  <WeightBox
                    title="Tare Weight"
                    icon={<Truck className="h-4 w-4 text-orange-600" />}
                    value={reading.tareWeightKg}
                    color="orange"
                    note="kg (Empty Truck)"
                  />
                  <WeightBox
                    title="Net Weight"
                    icon={<Weight className="h-4 w-4 text-[#8B4513]" />}
                    value={reading.netWeightKg}
                    color="brown"
                    note="kg (Coffee Only)"
                  />
                </div>
                <div className="mt-5 text-center text-xs text-gray-600 bg-gray-50 border rounded-md p-2">
                  <span className="font-semibold">Net = Gross - Tare:</span>{" "}
                  {reading.netWeightKg} = {reading.grossWeightKg} - {reading.tareWeightKg}
                </div>
              </CardContent>
            </Card>

            {/* Truck Info */}
            <Card className="border-[#8B4513]/20 shadow-sm">
              <CardHeader className="bg-[#8B4513]/5 border-b border-[#8B4513]/10 py-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#8B4513]" />
                  <CardTitle className="text-[#8B4513] text-sm font-semibold">Truck Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info label="Truck Number" value={reading.entry.truckNumber} icon={<Truck className="h-4 w-4" />} />
                  <Info label="Driver Name" value={reading.entry.driverName} icon={<User className="h-4 w-4" />} />
                  {reading.entry.driverPhone && (
                    <Info label="Driver Phone" value={reading.entry.driverPhone} icon={<Phone className="h-4 w-4" />} />
                  )}
                  <Info
                    label="Arrival Time"
                    value={`${format(new Date(reading.entry.arrivalTime), "MMM dd, yyyy")} • ${format(
                      new Date(reading.entry.arrivalTime),
                      "hh:mm a"
                    )}`}
                    icon={<Calendar className="h-4 w-4" />}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {reading.notes && (
              <Card className="border-[#8B4513]/20 shadow-sm">
                <CardHeader className="bg-[#8B4513]/5 border-b border-[#8B4513]/10 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#8B4513]" />
                    <CardTitle className="text-[#8B4513] text-sm font-semibold">Notes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-3 text-sm text-gray-700 whitespace-pre-wrap">
                  {reading.notes}
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT: Sidebar */}
          <div className="space-y-5">
            <OperatorCard reading={reading} />
            <BwnCard reading={reading} />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

/* Subcomponents for cleaner JSX */
function WeightBox({ title, icon, value, note, color }: any) {
  const colorClasses =
    color === "blue"
      ? "bg-blue-50 border-blue-200 text-blue-900"
      : color === "orange"
        ? "bg-orange-50 border-orange-200 text-orange-900"
        : "bg-[#8B4513]/10 border-[#8B4513]/30 text-[#8B4513]"
  return (
    <div className={`p-3 border rounded-lg ${colorClasses}`}>
      <div className="flex items-center gap-2 mb-1 text-xs font-medium">{icon}{title}</div>
      <p className="text-2xl font-semibold">{value.toLocaleString()}</p>
      <p className="text-[10px] opacity-80 mt-1">{note}</p>
    </div>
  )
}

function Info({ label, value, icon }: any) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <div className="flex items-center gap-2 mt-1">
        {icon}
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  )
}

function OperatorCard({ reading }: any) {
  return (
    <Card className="border-[#8B4513]/20 shadow-sm">
      <CardHeader className="bg-[#8B4513]/5 border-b border-[#8B4513]/10 py-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-[#8B4513]" />
          <CardTitle className="text-[#8B4513] text-sm font-semibold">Operator</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-3 text-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-[#8B4513]/10">
            <User className="h-4 w-4 text-[#8B4513]" />
          </div>
          <div>
            <p className="font-semibold">{reading.operator.name}</p>
            <p className="text-xs text-gray-600">{reading.operator.email}</p>
          </div>
        </div>
        <Separator />
        <div className="mt-3 text-xs text-gray-600">
          <Clock className="inline-block h-3 w-3 mr-1" />
          Recorded {format(new Date(reading.timestamp), "MMM dd, yyyy 'at' hh:mm a")}
        </div>
      </CardContent>
    </Card>
  )
}

function BwnCard({ reading }: any) {
  return (
    <Card className="border-[#8B4513]/20 shadow-sm">
      <CardHeader className="bg-[#8B4513]/5 border-b border-[#8B4513]/10 py-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#8B4513]" />
          <CardTitle className="text-[#8B4513] text-sm font-semibold">BWN Status</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-3 text-sm">
        {reading.buyingWeightNote ? (
          <div className="space-y-3">
            <div className="p-2 bg-green-50 border border-green-200 rounded-md text-center">
              <p className="text-xs text-green-800">BWN Created</p>
              <p className="text-base font-semibold text-green-900">{reading.buyingWeightNote.bwnNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <Badge
                className={`mt-1 ${
                  reading.buyingWeightNote.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : reading.buyingWeightNote.status === "REJECTED"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                } capitalize`}
              >
                {reading.buyingWeightNote.status.replace(/_/g, " ")}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-center text-xs text-yellow-800">
            <FileText className="h-6 w-6 mx-auto mb-1 text-yellow-600" />
            No BWN Created Yet
          </div>
        )}
      </CardContent>
    </Card>
  )
}
