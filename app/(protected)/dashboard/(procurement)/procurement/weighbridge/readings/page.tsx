"use client"

import { useState } from "react"
import { Eye, Scale, Weight } from "lucide-react"
import { useWeighbridgeReadings } from "@/hooks/use-weighbridge-readings"
import type { DataTableColumn, DataTableAction } from "@/types/data-table"
import type { WeighbridgeReading } from "@/types/weighbridge-reading"
import { format } from "date-fns"
import { Toaster } from "@/components/ui/sonner"
import { DataTable } from "@/components/data-table/DataTable"
import { useRouter } from "next/navigation"
import { StatusBadge } from "@/components/data-table/StatusBadge"
import { WeighbridgeReadingForm } from "../components/weighbridge-reading-form"

export default function WeighbridgeReadingsPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchValue, setSearchValue] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const pageSize = 10

  const { readings, pagination, isLoading, refetch } = useWeighbridgeReadings(currentPage, pageSize, searchValue)

  const columns: DataTableColumn<WeighbridgeReading>[] = [
    {
      id: "truckNumber",
      header: "Truck Number",
      accessorKey: "entry",
      sortable: true,
      cell: (value, row) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#8B4513]/10">
            <Scale className="h-4 w-4 text-[#8B4513]" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#8B4513]">{row.entry.truckNumber}</span>
            <span className="text-xs text-gray-500">{row.entry.driverName}</span>
          </div>
        </div>
      ),
    },
    {
      id: "grossWeight",
      header: "Gross Weight",
      accessorKey: "grossWeightKg",
      sortable: true,
      cell: (value) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{value.toLocaleString()} kg</span>
          <span className="text-xs text-gray-500">Truck + Coffee</span>
        </div>
      ),
    },
    {
      id: "tareWeight",
      header: "Tare Weight",
      accessorKey: "tareWeightKg",
      sortable: true,
      cell: (value) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{value.toLocaleString()} kg</span>
          <span className="text-xs text-gray-500">Empty Truck</span>
        </div>
      ),
    },
    {
      id: "netWeight",
      header: "Net Weight",
      accessorKey: "netWeightKg",
      sortable: true,
      cell: (value) => (
        <div className="flex items-center gap-2">
          <Weight className="h-4 w-4 text-[#8B4513]" />
          <div className="flex flex-col">
            <span className="font-bold text-[#8B4513] text-lg">{value.toLocaleString()} kg</span>
            <span className="text-xs text-gray-500">Coffee Weight</span>
          </div>
        </div>
      ),
    },
    {
      id: "operator",
      header: "Operator",
      cell: (value, row) => <span className="text-gray-700">{row.operator.name}</span>,
    },
    {
      id: "timestamp",
      header: "Recorded At",
      accessorKey: "timestamp",
      sortable: true,
      cell: (value) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{format(new Date(value), "MMM dd, yyyy")}</span>
          <span className="text-xs text-gray-500">{format(new Date(value), "hh:mm a")}</span>
        </div>
      ),
    },
    {
      id: "status",
      header: "BWN Status",
      cell: (value, row) => {
        if (row.buyingWeightNote) {
          return (
            <StatusBadge
              status={row.buyingWeightNote.status.replace(/_/g, " ")}
              variant={
                row.buyingWeightNote.status === "COMPLETED"
                  ? "completed"
                  : row.buyingWeightNote.status === "REJECTED"
                    ? "suspended"
                    : "pending"
              }
            />
          )
        }
        return <StatusBadge status="Pending BWN" variant="inactive" />
      },
    },
  ]

  const actions: DataTableAction<WeighbridgeReading>[] = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => {
        router.push(`/dashboard/procurement/weighbridge/${row.id}`)
      },
      variant: "default",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B4513]/5 via-white to-[#8B4513]/5">
      <div className="container mx-auto py-1 px-4">
        <DataTable
          title="Weighbridge Reading Management"
          subtitle="Record and manage weighbridge readings with accurate gross, tare, and net weight measurements"
          columns={columns}
          data={readings}
          actions={actions}
          searchPlaceholder="Search by truck number, driver, or operator..."
          showAddButton={true}
          addButtonLabel="Record Reading"
          onAddClick={() => setShowCreateForm(true)}
          showViewToggle={false}
          isLoading={isLoading}
          onRefresh={refetch}
          pageSize={pageSize}
          currentPage={currentPage}
          totalPages={pagination?.totalPages || 1}
          onPageChange={setCurrentPage}
          enableSelection={true}
          showActions={true}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          className="shadow-xl"
        />

        <WeighbridgeReadingForm open={showCreateForm} onOpenChange={setShowCreateForm} />
      </div>
      <Toaster />
    </div>
  )
}
