"use client";

import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";

import { TraderDetailsPanel } from "./components/trader-details-panel";
import { useState } from "react";
import { useTraders } from "@/hooks/useTraders";
import { TraderFormPanel } from "./components/froms/TraderFomPanel";
import { TraderListItem } from "./components/traderList";

export default function TradersPage() {
  const [selectedTrader, setSelectedTrader] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const ITEMS_PER_PAGE = 7;
  
  const { traders, totalCount, totalPages, isLoading, error, refetch } =
    useTraders({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: searchQuery,
      // status: statusFilter,
    });

  const handleViewTrader = (trader: any) => {
    setSelectedTrader(trader);
    setIsCreating(false);
    setIsEditing(false);
    setIsMobileSidebarOpen(false);
  };

  const handleEditTrader = (trader: any) => {
    setSelectedTrader(trader);
    setIsEditing(true);
    setIsCreating(false);
    setIsMobileSidebarOpen(false);
  };

  const handleCreateNew = () => {
    setSelectedTrader(null);
    setIsCreating(true);
    setIsEditing(false);
    setIsMobileSidebarOpen(false);
  };

  const handleClosePanel = () => {
    setSelectedTrader(null);
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleSuccess = () => {
    setIsCreating(false);
    setIsEditing(false);
    refetch();
    alert("Trader saved successfully!");
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Traders</h1>
          <p className="text-xs text-gray-600">{totalCount} traders</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateNew}
            className="p-2 bg-primary text-white rounded-lg"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {isMobileSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Left Sidebar */}
      <div
        className={`
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        fixed lg:relative
        inset-y-0 left-0
        w-80 lg:w-96
        bg-white border-r border-gray-200
        flex flex-col
        transition-transform duration-300 ease-in-out
        z-30 lg:z-0
        ${isMobileSidebarOpen ? "top-16" : "top-0"}
        lg:top-0
      `}
      >
        {/* Header - Desktop Only */}
        <div className="hidden lg:block p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold text-gray-900">
              Traders <span className="text-gray-500">({totalCount})</span>
            </h1>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
          <p className="text-xs text-gray-600">Manage coffee traders</p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search traders..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50"
            />
          </div>
        </div>

        {/* Traders List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : traders.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-7 w-7 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-600">
                {searchQuery ? "No traders found" : "No traders yet"}
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {traders.map((trader) => (
                <TraderListItem
                  key={trader.id}
                  trader={trader}
                  onView={() => handleViewTrader(trader)}
                  onEdit={() => handleEditTrader(trader)}
                  onDelete={() => {
                    refetch();
                    alert("Delete functionality");
                  }}
                  isSelected={
                    selectedTrader?.id === trader.id &&
                    !isCreating &&
                    !isEditing
                  }
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalCount > ITEMS_PER_PAGE && (
            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isLoading}
                    className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-2 text-xs font-medium text-gray-700">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages || isLoading}
                    className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Right Panel */}
      <div className="flex-1 lg:overflow-hidden">
        {isCreating || isEditing ? (
          <TraderFormPanel
            trader={isEditing ? selectedTrader : null}
            onClose={handleClosePanel}
            onSuccess={handleSuccess}
          />
        ) : selectedTrader ? (
          <TraderDetailsPanel
            trader={selectedTrader}
            onEdit={() => handleEditTrader(selectedTrader)}
            onClose={handleClosePanel}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mb-3">
              <Users className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1.5">
              Select a Trader
            </h3>
            <p className="text-xs text-gray-500 max-w-xs">
              Choose a trader from the sidebar to view their details,
              performance metrics, and transaction history.
            </p>
            <button
              onClick={handleCreateNew}
              className="mt-4 flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add New Trader
            </button>
          </div>
        )}
      </div>

      {/* Custom styles for removing scrollbar on large screens */}
      <style>{`
        @media (min-width: 1024px) {
          .overflow-y-auto {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .overflow-y-auto::-webkit-scrollbar {
            display: none;
          }
        }
        
        /* Keep scrollbar on mobile for better UX */
        @media (max-width: 1023px) {
          .overflow-y-auto {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
          }
          .overflow-y-auto::-webkit-scrollbar {
            width: 4px;
          }
          .overflow-y-auto::-webkit-scrollbar-track {
            background: transparent;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 2px;
          }
        }
      `}</style>
    </div>
  );
}