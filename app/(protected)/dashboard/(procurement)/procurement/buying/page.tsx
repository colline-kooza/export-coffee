"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useBuyingWeightNotes } from "@/hooks/use-buying-weight-notes";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { BuyingWeightNote } from "@/types/buying-weight-note";
import { BWNStats } from "../../components/bwn-stats";
import { BWNCard } from "../../components/bwn-card";
import { BWNCreateForm } from "../../components/BWNCreateForm";

export default function BuyingWeightNotesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [coffeeType, setCoffeeType] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  // Convert "all" to empty string for API calls
  const { bwns, pagination, isLoading, isError, error, refetch } =
  useBuyingWeightNotes(
    page,
    12,
    search,
    status === "all" ? "" : status,
    coffeeType === "all" ? "" : coffeeType,
    paymentStatus === "all" ? "" : paymentStatus
  );

  const handleViewBWN = (bwn: BuyingWeightNote) => {
    console.log("View BWN:", bwn);
  };

  const handleCreateBWN = () => {
    setIsCreateFormOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreateFormOpen(false);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[#8B4513]/5 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 bg-white p-6 rounded-xl border border-[#8B4513]/20 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#8B4513]/10">
                <FileText className="h-6 w-6 text-[#8B4513]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#8B4513] tracking-tight">
                  Buying Weight Notes
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  Manage and track all coffee purchase weight notes
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="border-[#8B4513]/30 text-[#8B4513] hover:bg-[#8B4513]/5"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              onClick={handleCreateBWN}
              className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white font-semibold shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create BWN
            </Button>
          </div>
        </div>
        {/* Stats */}
        <BWNStats />
        {/* Filters */}
        <div className="bg-white p-5 rounded-xl border border-[#8B4513]/20 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by BWN number, truck, or trader..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513]/20 text-sm"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select
              value={status || "all"}
              onValueChange={(value) => {
                setStatus(value === "all" ? "" : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513]/20 text-sm">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING_WEIGHING">
                  Pending Weighing
                </SelectItem>
                <SelectItem value="WEIGHED">Weighed</SelectItem>
                <SelectItem value="MOISTURE_TESTED">Moisture Tested</SelectItem>
                <SelectItem value="PRICE_CALCULATED">
                  Price Calculated
                </SelectItem>
                <SelectItem value="AWAITING_QC">Awaiting QC</SelectItem>
                <SelectItem value="PAYMENT_APPROVED">
                  Payment Approved
                </SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Coffee Type Filter */}
            <Select
              value={coffeeType || "all"}
              onValueChange={(value) => {
                setCoffeeType(value === "all" ? "" : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513]/20 text-sm">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ARABICA">Arabica</SelectItem>
                <SelectItem value="ROBUSTA">Robusta</SelectItem>
              </SelectContent>
            </Select>

            {/* Payment Status Filter */}
            <Select
              value={paymentStatus || "all"}
              onValueChange={(value) => {
                setPaymentStatus(value === "all" ? "" : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513]/20 text-sm">
                <SelectValue placeholder="All Payments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {isError && error ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-red-200">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              Something went wrong
            </h3>
            <p className="text-gray-600 mt-1 text-sm max-w-md text-center">
              {error}
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="mt-4 border-[#8B4513]/30 text-[#8B4513] hover:bg-[#8B4513]/5"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#8B4513]/20 p-5"
              >
                <Skeleton className="h-64 w-full" />
              </div>
            ))}
          </div>
        ) : bwns && bwns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-[#8B4513]/20">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              No buying weight notes found
            </h3>
            <p className="text-gray-600 mt-1 text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : bwns ? (
          <>
            {/* BWN Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {bwns.map((bwn) => (
                <BWNCard key={bwn.id} bwn={bwn} onView={handleViewBWN} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 bg-white rounded-xl border border-[#8B4513]/20 shadow-sm">
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-[#8B4513]">
                    {(page - 1) * 12 + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-[#8B4513]">
                    {Math.min(page * 12, pagination.total)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#8B4513]">
                    {pagination.total}
                  </span>{" "}
                  results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="border-[#8B4513]/30 text-[#8B4513] hover:bg-[#8B4513]/5 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        const pageNumber = i + 1;
                        return (
                          <Button
                            key={i}
                            variant={
                              page === pageNumber ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setPage(pageNumber)}
                            className={
                              page === pageNumber
                                ? "bg-[#8B4513] hover:bg-[#8B4513]/90 text-white w-9 h-9 p-0"
                                : "border-[#8B4513]/30 text-[#8B4513] hover:bg-[#8B4513]/5 w-9 h-9 p-0"
                            }
                          >
                            {pageNumber}
                          </Button>
                        );
                      }
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= pagination.totalPages}
                    className="border-[#8B4513]/30 text-[#8B4513] hover:bg-[#8B4513]/5 disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* Create BWN Form Dialog */}
      <BWNCreateForm
        open={isCreateFormOpen}
        onOpenChange={setIsCreateFormOpen}
      />
    </div>
  );
}
