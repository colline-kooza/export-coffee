"use client";

import { useState } from "react";
import {
  MoreVertical,
  Package,
  Phone,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useDeleteTrader } from "@/hooks/useTraders";
import { toast } from "sonner";

export function TraderListItem({ trader, onView, onEdit, isSelected }: any) {
  const [openDialog, setOpenDialog] = useState(false);
  const deleteTrader = useDeleteTrader();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "SUSPENDED":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "BLACKLISTED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTrader.mutateAsync(trader.id);
      toast.success(`${trader.name} has been successfully deleted.`);
      setOpenDialog(false);
    } catch (error) {
      toast.error(`Failed to delete trader. Please try again.`);
    }
  };

  return (
    <>
      <div
        className={`flex items-center justify-between p-2.5 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
          isSelected
            ? "bg-primary/5 border-primary/30"
            : "bg-white border-gray-200"
        }`}
        onClick={onView}
      >
        {/* Trader Info */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/10">
            <span className="text-xs font-semibold text-primary">
              {trader.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-medium text-sm text-gray-900 truncate">
                {trader.name}
              </h3>
              <span
                className={`${getStatusColor(trader.status)} text-[10px] px-1.5 py-0.5 h-4 border rounded capitalize`}
              >
                {trader.status}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {trader.phoneNumber}
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <Package className="h-3 w-3" />
                {trader.totalDeliveries} deliveries
              </span>
            </div>
          </div>
        </div>

        {/* 3-dot menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <MoreVertical className="h-3.5 w-3.5 text-gray-500" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-28">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="flex items-center gap-1.5 text-xs cursor-pointer py-1.5"
            >
              <Eye className="h-3 w-3 text-primary" />
              <span>View</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex items-center gap-1.5 text-xs cursor-pointer py-1.5"
            >
              <Edit className="h-3 w-3 text-primary" />
              <span>Edit</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setOpenDialog(true);
              }}
              className="flex items-center gap-1.5 text-xs text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer py-1.5"
            >
              <Trash2 className="h-3 w-3" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center text-base">
              Delete Trader?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm">
              Permanently delete{" "}
              <span className="font-semibold text-gray-900">{trader.name}</span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel
              disabled={deleteTrader.isPending}
              className="flex-1 h-8 text-xs"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteTrader.isPending}
              className="flex-1 h-8 text-xs bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              {deleteTrader.isPending ? (
                <span className="flex items-center gap-1.5">
                  <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
