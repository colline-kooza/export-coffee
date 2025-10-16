"use client";

import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Edit,
  Package,
  Phone,
  Star,
  TrendingUp,
} from "lucide-react";

export function TraderDetailsPanel({ trader, onEdit, onClose }: any) {
  const getStatusConfig = (status: string) => {
    const configs: any = {
      ACTIVE: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: "✓",
      },
      SUSPENDED: {
        color: "bg-orange-50 text-orange-700 border-orange-200",
        icon: "!",
      },
      BLACKLISTED: {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: "×",
      },
    };
    return configs[status] || configs.ACTIVE;
  };

  const statusConfig = getStatusConfig(trader.status);

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      {/* Header */}
      {/* <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/80" />
        <div className="relative z-10 p-4 lg:p-6">
          <div className="flex items-start justify-between mb-4">
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg text-white lg:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={onEdit}
              className="p-1.5 hover:bg-white/20 rounded-lg text-white ml-auto"
            >
              <Edit className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center">
              <span className="text-base font-bold text-primary">
                {trader.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-white">{trader.name}</h2>
                <span
                  className={`${statusConfig.color} px-2 py-0.5 text-[10px] border rounded`}
                >
                  {statusConfig.icon} {trader.status}
                </span>
              </div>
              <p className="text-xs text-white/90 font-mono">
                {trader.traderCode}
              </p>
              {trader.contactPerson && (
                <p className="text-xs text-white/80 mt-1">
                  Contact: {trader.contactPerson}
                </p>
              )}
            </div>
          </div>
        </div>
        <div></div>
      </div> */}
      <div className="relative overflow-hidden">
        {/* Header background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary" />

        <div className="relative z-10 p-4 lg:p-6">
          {/* Top buttons */}
          <div className="flex items-start justify-between ">
            <button
              onClick={onClose}
              className=" hidden p-1.5 hover:bg-white/20 rounded-lg text-white lg:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={onEdit}
              className="p-1.5 hover:bg-white/20 rounded-lg text-white ml-auto py-1"
            >
              <Edit className="h-4 w-4" />
            </button>
          </div>

          {/* Trader info + performance metrics */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
            {/* Trader Info (Left) */}
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-white shadow-md flex items-center justify-center">
                <span className="text-base font-bold text-primary">
                  {trader.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-white">
                    {trader.name}
                  </h2>
                  <span
                    className={`${statusConfig.color} px-2 py-0.5 text-[10px] border rounded`}
                  >
                    {statusConfig.icon} {trader.status}
                  </span>
                </div>
                <p className="text-xs text-white/90 font-mono">
                  {trader.traderCode}
                </p>
                {trader.contactPerson && (
                  <p className="text-xs text-white/80 mt-1">
                    Contact: {trader.contactPerson}
                  </p>
                )}
              </div>
            </div>

            {/* Performance Metrics (Right) */}
            <div className=" hidden lg:flex items-center justify-end gap-4 text-white lg:mr-8 lg:pt-4 ">
              {/* Deliveries */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4 text-blue-300" />
                  <span className="text-sm font-semibold">
                    {trader.totalDeliveries}
                  </span>
                </div>
                <span className="text-[10px] text-white/70">Deliveries</span>
              </div>

              {/* Total Volume */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-emerald-300" />
                  <span className="text-sm font-semibold">
                    {(trader.totalVolumeKg / 1000).toFixed(1)}T
                  </span>
                </div>
                <span className="text-[10px] text-white/70">Volume</span>
              </div>

              {/* Quality Rate */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-purple-300" />
                  <span className="text-sm font-semibold">
                    {trader.qualityAcceptanceRate}%
                  </span>
                </div>
                <span className="text-[10px] text-white/70">Quality</span>
              </div>

              {/* Trust Score */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-orange-300" />
                  <span className="text-sm font-semibold">
                    {trader.trustScore}
                  </span>
                </div>
                <span className="text-[10px] text-white/70">Trust</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 p-4 lg:p-6 space-y-4">
        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            Contact Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-medium text-gray-600 mb-0.5">
                Primary Phone
              </p>
              <p className="text-xs text-gray-900">{trader.phoneNumber}</p>
            </div>
            {trader.alternatePhone && (
              <div>
                <p className="text-[10px] font-medium text-gray-600 mb-0.5">
                  Alternate Phone
                </p>
                <p className="text-xs text-gray-900">{trader.alternatePhone}</p>
              </div>
            )}
            {trader.email && (
              <div>
                <p className="text-[10px] font-medium text-gray-600 mb-0.5">
                  Email
                </p>
                <p className="text-xs text-gray-900">{trader.email}</p>
              </div>
            )}
            {trader.physicalAddress && (
              <div>
                <p className="text-[10px] font-medium text-gray-600 mb-0.5">
                  Address
                </p>
                <p className="text-xs text-gray-900">
                  {trader.physicalAddress}
                </p>
                {trader.district && (
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    District: {trader.district}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Payment Terms */}
        {trader.paymentTerms && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Payment Terms
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-medium text-gray-600 mb-0.5">
                  Payment Days
                </p>
                <p className="text-xs font-semibold text-gray-900">
                  {trader.paymentTerms.paymentDays} day(s)
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600 mb-0.5">
                  Method
                </p>
                <p className="text-xs font-semibold text-gray-900">
                  {trader.paymentTerms.preferredMethod.replace("_", " ")}
                </p>
              </div>
            </div>
            {trader.paymentTerms.preferredMethod === "BANK_TRANSFER" && (
              <div className="mt-3 pt-3 border-t space-y-2">
                {trader.paymentTerms.bankName && (
                  <div>
                    <p className="text-[10px] font-medium text-gray-600 mb-0.5">
                      Bank Name
                    </p>
                    <p className="text-xs text-gray-900">
                      {trader.paymentTerms.bankName}
                    </p>
                  </div>
                )}
                {trader.paymentTerms.accountNumber && (
                  <div>
                    <p className="text-[10px] font-medium text-gray-600 mb-0.5">
                      Account Number
                    </p>
                    <p className="text-xs text-gray-900 font-mono">
                      {trader.paymentTerms.accountNumber}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Business Details */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-primary" />
            Business Details
          </h3>
          <div className="space-y-3">
            {trader.registrationNumber && (
              <div>
                <p className="text-[10px] font-medium text-gray-600 mb-0.5">
                  Registration Number
                </p>
                <p className="text-xs text-gray-900 font-mono">
                  {trader.registrationNumber}
                </p>
              </div>
            )}
            {trader.tinNumber && (
              <div>
                <p className="text-[10px] font-medium text-gray-600 mb-0.5">
                  TIN Number
                </p>
                <p className="text-xs text-gray-900 font-mono">
                  {trader.tinNumber}
                </p>
              </div>
            )}
            <div>
              <p className="text-[10px] font-medium text-gray-600 mb-0.5">
                Member Since
              </p>
              <p className="text-xs text-gray-900">
                {new Date(trader.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
