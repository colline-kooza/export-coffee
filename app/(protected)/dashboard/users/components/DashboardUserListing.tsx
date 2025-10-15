"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  type Column,
  ConfirmationDialog,
  DataTable,
  TableActions,
  TableLoading,
} from "@/components/ui/data-table";

import { Shield } from "lucide-react";

import TableError from "@/components/ui/data-table/table-error";
import { useUsers } from "@/hooks/useUsers";
import { User } from "@/types/user.schema";
import { UserRoleModal } from "./UserRoleModal";

export default function DashboardUserListing({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  // const router = useRouter();
  const { users = [], isLoading, refetch, isError, error } = useUsers();

  // State management
  const [isDeleting, setIsDeleting] = useState(false);
  console.log(setIsDeleting);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // const [modalOpen, setModalOpen] = useState(false);

  // New state for role management
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  if (isError) {
    return (
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <TableError
          title="Failed to load users"
          subtitle="Unable to fetch users data"
          error={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <TableLoading />
      </div>
    );
  }

  const columns: Column<User>[] = [
    {
      accessorKey: "firstName",
      header: "User",
      cell: (row) => {
        const user = row;
        const image = user.image || "/default-avatar.png";
        return (
          <div className="flex items-center gap-3">
            <img
              src={image || "/placeholder.svg"}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-10 w-10 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default-avatar.png";
              }}
            />
            <div className="flex flex-col">
              <span className="font-medium">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-sm text-gray-500">{user.email}</span>
            </div>
          </div>
        );
      },
    },
    // {
    //   accessorKey: "firstName",
    //   header: "First Name",
    //   cell: (row) => {
    //     const user = row;
    //     return (
    //       <div className="flex items-center gap-2">
    //         <UserIcon className="h-4 w-4 text-gray-500" />
    //         <span className="text-sm">{user.firstName}</span>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "lastName",
    //   header: "Last Name",
    //   cell: (row) => {
    //     const user = row;
    //     return (
    //       <div className="flex items-center gap-2">
    //         <UserIcon className="h-4 w-4 text-gray-500" />
    //         <span className="text-sm">{user.lastName}</span>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "email",
    //   header: "Email",
    //   cell: (row) => {
    //     const user = row;
    //     return (
    //       <div className="max-w-xs">
    //         <p className="text-sm text-gray-600 truncate">{user.email}</p>
    //       </div>
    //     );
    //   },
    // },
    // New Role column
    {
      accessorKey: "role",
      header: "Role",
      cell: (row) => {
        const user = row;
        const role = user.role || "user";
        const roleColors = {
          ADMIN: "bg-red-100 text-red-800",
          VENDOR: "bg-blue-100 text-blue-800",
          ASSISTANT_ADMIN: "bg-green-100 text-green-800",
          USER: "bg-gray-100 text-gray-800",
        };

        return (
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gray-500" />
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                roleColors[role as keyof typeof roleColors] || roleColors.USER
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: (row) => {
        const user = row;
        return (
          <div className="text-sm text-gray-600">
            {format(new Date(user.createdAt), "MMM d, yyyy")}
          </div>
        );
      },
    },
  ];

  const handleAddNew = () => {
    // Implement add new user functionality if needed
  };

  // Export to Excel
  const handleExport = async (filteredUsers: User[]) => {
    try {
      // Prepare data for export
      const exportData = filteredUsers.map((user) => ({
        ID: user.id,
        "First Name": user.firstName,
        "Last Name": user.lastName,
        Email: user.email,
        Role: user.role || "user",
        Image: user.image,
        "Created At": format(new Date(user.createdAt), "yyyy-MM-dd HH:mm:ss"),
      }));

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

      // Generate filename with current date
      const fileName = `Users_${format(new Date(), "yyyy-MM-dd")}.xlsx`;

      // Export to file
      XLSX.writeFile(workbook, fileName);

      toast.success("Export successful", {
        description: `Users exported to ${fileName}`,
      });
    } catch (error) {
      toast.error("Export failed", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  // Handle edit click - Now opens role modal
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setRoleModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (user: User) => {
    // Implement delete functionality if needed
    console.log("Delete user:", user);
  };

  const handleConfirmDelete = async () => {
    // Implement delete confirmation logic if needed
  };

  const handleRoleModalClose = () => {
    setRoleModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="container mx-auto py-6">
      {isError && (
        <TableError
          title="Failed to load users"
          subtitle="Unable to fetch user data"
          error={error}
          onRetry={refetch}
        />
      )}

      {/* User Role Change Modal */}
      <UserRoleModal
        user={selectedUser}
        isOpen={roleModalOpen}
        onClose={handleRoleModalClose}
      />

      <DataTable<User>
        title={`${title} (${users.length})`}
        subtitle={subtitle}
        data={users}
        columns={columns}
        keyField="id"
        isLoading={false}
        onRefresh={() => {
          console.log("refreshing users");
          refetch();
        }}
        actions={{
          onAdd: handleAddNew,
          onExport: handleExport,
        }}
        filters={{
          searchFields: ["firstName", "lastName", "email", "role"],
          enableDateFilter: true,
          getItemDate: (item) => item.createdAt,
        }}
        renderRowActions={(item) => (
          <TableActions.RowActions
            onEdit={() => handleEditClick(item)}
            onDelete={() => handleDeleteClick(item)}
          />
        )}
      />

      {/* Delete Confirmation Dialog - if needed */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isConfirming={isDeleting}
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
