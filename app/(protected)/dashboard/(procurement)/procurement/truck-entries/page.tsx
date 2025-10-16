"use client"

import { useState } from "react"
import { Eye, Truck } from "lucide-react"
import { useTruckEntries } from "@/hooks/use-truck-entries"
import type { DataTableColumn, DataTableAction } from "@/types/data-table"
import type { TruckEntry } from "@/types/truck-entry"
import { format } from "date-fns"
import { Toaster } from "@/components/ui/sonner"
import { TruckEntryForm } from "../../components/truck-entry-form"
import { DataTable } from "@/components/data-table/DataTable"

export default function TruckEntriesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchValue, setSearchValue] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const pageSize = 10

  const { entries, pagination, isLoading, refetch } = useTruckEntries(currentPage, pageSize, searchValue)

  const columns: DataTableColumn<TruckEntry>[] = [
    {
      id: "truckNumber",
      header: "Truck Number",
      accessorKey: "truckNumber",
      sortable: true,
      cell: (value) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#8B4513]/10">
            <Truck className="h-4 w-4 text-[#8B4513]" />
          </div>
          <span className="font-semibold text-[#8B4513]">{value}</span>
        </div>
      ),
    },
    {
      id: "driverName",
      header: "Driver Name",
      accessorKey: "driverName",
      sortable: true,
      cell: (value) => <span className="font-medium text-gray-900">{value}</span>,
    },
    {
      id: "driverPhone",
      header: "Driver Phone",
      accessorKey: "driverPhone",
      cell: (value) => <span className="text-gray-600">{value || "—"}</span>,
    },
    {
      id: "arrivalTime",
      header: "Arrival Time",
      accessorKey: "arrivalTime",
      sortable: true,
      cell: (value) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{format(new Date(value), "MMM dd, yyyy")}</span>
          <span className="text-xs text-gray-500">{format(new Date(value), "hh:mm a")}</span>
        </div>
      ),
    },
    {
      id: "securityOfficer",
      header: "Security Officer",
      cell: (value, row) => <span className="text-gray-700">{row.securityOfficer?.name || "—"}</span>,
    },
  ]

  const actions: DataTableAction<TruckEntry>[] = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => {
        console.log("View details:", row)
        // Navigate to detail page or open modal
      },
      variant: "default",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B4513]/5 via-white to-[#8B4513]/5">
      <div className="container mx-auto py-1 px-4">
        <DataTable
          title="Truck Entry Management"
          subtitle="Register and manage truck entries with comprehensive tracking and monitoring capabilities"
          columns={columns}
          data={entries}
          actions={actions}
          searchPlaceholder="Search by truck number, driver name, or phone..."
          showAddButton={true}
          addButtonLabel="Register Truck Entry"
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

        <TruckEntryForm open={showCreateForm} onOpenChange={setShowCreateForm} />
      </div>
      <Toaster />
    </div>
  )
}
