"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Package,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useRouter } from "next/navigation";

import { TraderProps, useTraders } from "@/hooks/useTraders";
import TraderDetailsPanel from "./components/trader-details-panel";
import TraderFormDialog from "./components/trader-form-dialog";

function TraderListItem({
  trader,
  onView,
  onEdit,
  onDelete,
  isSelected,
}: {
  trader: TraderProps;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isSelected: boolean;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "SUSPENDED":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "BLACKLISTED":
        return "bg-red-50 text-red-700 border-red-200";
      case "UNDER_REVIEW":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected
          ? "bg-[#985145]/5 border-[#985145]/30"
          : "bg-white border-gray-200"
      }`}
      onClick={onView}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="h-9 w-9 ring-2 ring-[#985145]/10">
          <AvatarFallback className="bg-gradient-to-br from-[#985145]/20 to-[#985145]/10 text-[#985145] text-xs font-semibold">
            {trader.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-medium text-sm text-gray-900 truncate">
              {trader.name}
            </h3>
            <Badge
              className={`${getStatusColor(
                trader.status
              )} text-[10px] px-1.5 py-0 h-4 border`}
            >
              {trader.status}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {trader.phoneNumber}
            </span>
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              {trader.totalDeliveries} deliveries
            </span>
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={onView} className="text-xs">
            <Eye className="h-3.5 w-3.5 mr-2" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit} className="text-xs">
            <Edit className="h-3.5 w-3.5 mr-2" />
            Edit Trader
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-xs text-red-600">
            <Trash2 className="h-3.5 w-3.5 mr-2" />
            Deactivate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function EmptyTraderSelection() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-14 h-14 bg-gradient-to-br from-[#985145]/20 to-[#985145]/10 rounded-xl flex items-center justify-center mb-3">
        <Users className="h-7 w-7 text-[#985145]" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1.5">
        Select a Trader
      </h3>
      <p className="text-xs text-gray-500 max-w-xs">
        Choose a trader from the sidebar to view their details, performance
        metrics, and transaction history.
      </p>
    </div>
  );
}

export default function TradersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedTrader, setSelectedTrader] = useState<TraderProps | null>(
    null
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [traderToEdit, setTraderToEdit] = useState<TraderProps | null>(null);

  const router = useRouter();
  const { traders, totalCount, totalPages, isLoading, error, refetch } =
    useTraders({
      page: currentPage,
      limit: 10,
      search: searchQuery,
      status: statusFilter,
    });

  const activeTraders = traders.filter((t) => t.status === "ACTIVE").length;
  const suspendedTraders = traders.filter(
    (t) => t.status === "SUSPENDED"
  ).length;

  const handleEdit = (trader: TraderProps) => {
    setTraderToEdit(trader);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (trader: TraderProps) => {
    if (confirm(`Are you sure you want to deactivate ${trader.name}?`)) {
      try {
        await fetch(`/api/traders/${trader.id}`, { method: "DELETE" });
        refetch();
        if (selectedTrader?.id === trader.id) {
          setSelectedTrader(null);
        }
      } catch (err) {
        alert("Failed to deactivate trader");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#985145] mx-auto mb-3"></div>
          <p className="text-xs text-gray-600">Loading traders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <p className="text-sm text-red-600 mb-3">Error: {error}</p>

          <Button onClick={() => refetch()} size="sm">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Check if there are no traders at all (not just filtered results)
  const hasNoTradersAtAll =
    !isLoading && !error && totalCount === 0 && !searchQuery && !statusFilter;

  if (hasNoTradersAtAll) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen items-center justify-center">
          <div className="text-center max-w-md px-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#985145]/20 to-[#985145]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-[#985145]" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Traders Yet
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Get started by adding your first coffee trader to the system. You
              can manage their information, track deliveries, and monitor
              performance.
            </p>
            <Button
              size="sm"
              className="bg-[#985145] hover:bg-[#7d4138]"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Trader
            </Button>
          </div>
        </div>

        {/* Create Dialog */}
        <TraderFormDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSuccess={refetch}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col fixed left-64 top-16 h-full z-10">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-lg font-semibold text-gray-900">Traders</h1>
              <Button
                size="sm"
                className="bg-[#985145] hover:bg-[#7d4138] h-7 text-xs"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add
              </Button>
            </div>
            <p className="text-xs text-gray-600">Manage coffee traders</p>
          </div>

          {/* Statistics Cards */}
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-2.5 text-center">
                <div className="text-base font-semibold text-gray-900">
                  {totalCount}
                </div>
                <div className="text-[10px] text-gray-600">Total</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg p-2.5 text-center">
                <div className="text-base font-semibold text-gray-900">
                  {activeTraders}
                </div>
                <div className="text-[10px] text-gray-600">Active</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg p-2.5 text-center">
                <div className="text-base font-semibold text-gray-900">
                  {suspendedTraders}
                </div>
                <div className="text-[10px] text-gray-600">Suspended</div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search traders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 bg-gray-50 border-gray-200 h-8 text-xs"
              />
            </div>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 h-7 text-xs"
              >
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                Filters
              </Button>
            </div>
          </div>

          {/* Traders List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 space-y-2">
              {traders.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-7 w-7 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">
                    {searchQuery ? "No traders found" : "No traders yet"}
                  </p>
                </div>
              ) : (
                traders.map((trader) => (
                  <TraderListItem
                    key={trader.id}
                    trader={trader}
                    onView={() => setSelectedTrader(trader)}
                    onEdit={() => handleEdit(trader)}
                    onDelete={() => handleDelete(trader)}
                    isSelected={selectedTrader?.id === trader.id}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] text-gray-500">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-gray-50 ml-80">
          {selectedTrader ? (
            <TraderDetailsPanel trader={selectedTrader} onRefresh={refetch} />
          ) : (
            <EmptyTraderSelection />
          )}
        </div>
      </div>

      {/* Create Dialog */}
      <TraderFormDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={refetch}
      />

      {/* Edit Dialog */}
      {traderToEdit && (
        <TraderFormDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setTraderToEdit(null);
          }}
          onSuccess={() => {
            refetch();
            if (selectedTrader?.id === traderToEdit.id) {
              setSelectedTrader(null);
            }
          }}
          trader={traderToEdit}
        />
      )}
    </div>
  );
}
