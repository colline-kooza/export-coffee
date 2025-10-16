"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Edit, Trash2, Eye, Users, GraduationCap } from "lucide-react"
import { DataTableAction, DataTableColumn, DataTableFilter, School } from "@/types/data-table"
import { StatusBadge } from "./StatusBadge"
import { DataTable } from "./DataTable"
import { DataImage } from "./DataImage"


// Mock data
const mockSchools: School[] = [
  {
    id: "1",
    name: "Lincoln Elementary School",
    code: "LES001",
    logo: "https://media.istockphoto.com/id/1309949844/vector/class-of-2021-congrats-graduates-label.jpg?s=612x612&w=0&k=20&c=e2x2B4lhG4e7sWr8888ZduVIgjAbGI-4QjB3qonLBZA=",
    students: 1113,
    teachers: 45,
    applications: 234,
    status: "active",
    type: "public",
    district: "Central District",
    established: "1985",
    rating: 4.5,
    location: "Downtown, NY",
  },
  {
    id: "2",
    name: "Roosevelt High School",
    code: "RHS002",
    logo: "https://media.istockphoto.com/id/1309949844/vector/class-of-2021-congrats-graduates-label.jpg?s=612x612&w=0&k=20&c=e2x2B4lhG4e7sWr8888ZduVIgjAbGI-4QjB3qonLBZA=",
    students: 2156,
    teachers: 89,
    applications: 456,
    status: "active",
    type: "public",
    district: "North District",
    established: "1978",
    rating: 4.2,
    location: "North Side, NY",
  },
  {
    id: "3",
    name: "St. Mary's Academy",
    code: "SMA003",
    students: 678,
    teachers: 32,
    applications: 123,
    status: "active",
    type: "private",
    district: "Private Schools",
    established: "1965",
    rating: 4.8,
    location: "East Side, NY",
  },
  {
    id: "4",
    name: "Washington Middle School",
    code: "WMS004",
    logo: "https://media.istockphoto.com/id/1309949844/vector/class-of-2021-congrats-graduates-label.jpg?s=612x612&w=0&k=20&c=e2x2B4lhG4e7sWr8888ZduVIgjAbGI-4QjB3qonLBZA=",
    students: 892,
    teachers: 38,
    applications: 167,
    status: "pending",
    type: "public",
    district: "South District",
    established: "1992",
    rating: 4.1,
    location: "South Side, NY",
  },
  {
    id: "5",
    name: "Innovation Charter School",
    code: "ICS005",
    students: 445,
    teachers: 24,
    applications: 89,
    status: "active",
    type: "charter",
    district: "Charter Schools",
    established: "2010",
    rating: 4.6,
    location: "West Side, NY",
  },
  {
    id: "6",
    name: "Jefferson Elementary",
    code: "JES006",
    logo: "https://media.istockphoto.com/id/1309949844/vector/class-of-2021-congrats-graduates-label.jpg?s=612x612&w=0&k=20&c=e2x2B4lhG4e7sWr8888ZduVIgjAbGI-4QjB3qonLBZA=",
    students: 756,
    teachers: 31,
    applications: 145,
    status: "suspended",
    type: "public",
    district: "Central District",
    established: "1988",
    rating: 3.9,
    location: "Central, NY",
  },
]

// Mock API function
const fetchSchools = async (): Promise<School[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockSchools
}

export default function DataTableExample() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["schools"],
    queryFn: fetchSchools,
  })

  // Define columns
  const columns: DataTableColumn<School>[] = [
    {
      id: "school",
      header: "School Name",
      cell: (_, row) => (
        <div className="flex items-center gap-3">
          <DataImage src={row.logo} alt={row.name} className="w-12 h-12" />
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">Code: {row.code}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "students",
      header: "Students",
      accessorKey: "students",
      cell: (value) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{value.toLocaleString()}</span>
        </div>
      ),
      sortable: true,
    },
    {
      id: "teachers",
      header: "Teachers",
      accessorKey: "teachers",
      cell: (value) => (
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{value}</span>
        </div>
      ),
      sortable: true,
    },
    {
      id: "applications",
      header: "Applications",
      accessorKey: "applications",
      cell: (value) => <span className="font-medium text-purple-700">{value}</span>,
      sortable: true,
    },
    {
      id: "type",
      header: "Type",
      accessorKey: "type",
      cell: (value) => <span className="capitalize text-gray-700 font-medium">{value}</span>,
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (_, row) => (
        <StatusBadge status={row.status.charAt(0).toUpperCase() + row.status.slice(1)} variant={row.status} />
      ),
      sortable: true,
    },
  ]

  // Define filters
  const filters: DataTableFilter[] = [
    {
      id: "type",
      label: "School Type",
      options: [
        { label: "Public Schools (4)", value: "public", count: 4 },
        { label: "Private Schools (1)", value: "private", count: 1 },
        { label: "Charter Schools (1)", value: "charter", count: 1 },
      ],
    },
    {
      id: "status",
      label: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Pending", value: "pending" },
        { label: "Suspended", value: "suspended" },
      ],
    },
    {
      id: "district",
      label: "District",
      options: [
        { label: "Central District", value: "Central District" },
        { label: "North District", value: "North District" },
        { label: "South District", value: "South District" },
        { label: "Private Schools", value: "Private Schools" },
        { label: "Charter Schools", value: "Charter Schools" },
      ],
    },
  ]

  // Define actions
  const actions: DataTableAction<School>[] = [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => {
        console.log("View school:", row)
      },
    },
    // {
    //   label: "Edit",
    //   icon: <Edit className="h-4 w-4" />,
    //   onClick: (row) => {
    //     console.log("Edit school:", row)
    //   },
    // },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      variant: "destructive",
      onClick: (row) => {
        setSelectedSchool(row)
      },
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-2 px-4 max-w-7xl">
  
        <DataTable
          columns={columns}
          data={data || []}
          filters={filters}
          actions={actions}
          searchPlaceholder="Search schools..."
          showAddButton={true}
          addButtonLabel="Add School"
          onAddClick={() => console.log("Add school clicked")}
          showViewToggle={true}
          isLoading={isLoading}
          error={error?.message || null}
          onRefresh={refetch}
          pageSize={10}
        />
      </div>
    </div>
  )
}
