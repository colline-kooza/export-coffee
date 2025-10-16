"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  CreditCard,
  TrendingUp,
  Package,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  FileText,
} from "lucide-react";
import { TraderProps } from "@/hooks/useTraders";

interface TraderDetailsPanelProps {
  trader: TraderProps;
  onRefresh: () => void;
}

export default function TraderDetailsPanel({
  trader,
  onRefresh,
}: TraderDetailsPanelProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return {
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: CheckCircle2,
        };
      case "SUSPENDED":
        return {
          color: "bg-orange-50 text-orange-700 border-orange-200",
          icon: AlertCircle,
        };
      case "BLACKLISTED":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: XCircle,
        };
      case "UNDER_REVIEW":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: AlertCircle,
        };
      default:
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: AlertCircle,
        };
    }
  };

  const statusConfig = getStatusConfig(trader.status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="px-2 h-full overflow-y-auto pb-6">
      <div className="bg-white rounded-sm border border-gray-200">
        {/* Header Section */}
        <div className="relative px-6 py-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#985145] via-[#985145]/90 to-[#985145]/80" />

          <div className="relative z-10 flex items-start gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-white shadow-lg">
              <AvatarFallback className="bg-white text-[#985145] text-base font-bold">
                {trader.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-white drop-shadow-sm">
                      {trader.name}
                    </h2>
                    <Badge
                      className={`${statusConfig.color} shadow-sm px-2 py-0.5 text-[10px] border`}
                    >
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {trader.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/90 drop-shadow-sm font-mono">
                    {trader.traderCode}
                  </p>
                  {trader.contactPerson && (
                    <p className="text-xs text-white/80 mt-1 drop-shadow-sm">
                      Contact: {trader.contactPerson}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="p-4 bg-gradient-to-br from-gray-50 to-white border-b">
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-9 w-9 mx-auto mb-1.5 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">
                {trader.totalDeliveries}
              </div>
              <div className="text-[10px] text-gray-600">Deliveries</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-9 w-9 mx-auto mb-1.5 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">
                {(trader.totalVolumeKg / 1000).toFixed(1)}T
              </div>
              <div className="text-[10px] text-gray-600">Total Volume</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-9 w-9 mx-auto mb-1.5 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">
                {trader.qualityAcceptanceRate}%
              </div>
              <div className="text-[10px] text-gray-600">Quality Rate</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-9 w-9 mx-auto mb-1.5 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">
                {trader.trustScore}
              </div>
              <div className="text-[10px] text-gray-600">Trust Score</div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-4 space-y-4">
          {/* Contact Information */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Phone className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Contact Information
                </h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
                  <Phone className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-gray-900 mb-0.5">
                    Primary Phone
                  </p>
                  <p className="text-xs text-gray-600">{trader.phoneNumber}</p>
                </div>
              </div>

              {trader.alternatePhone && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 border border-green-100">
                    <Phone className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-gray-900 mb-0.5">
                      Alternate Phone
                    </p>
                    <p className="text-xs text-gray-600">
                      {trader.alternatePhone}
                    </p>
                  </div>
                </div>
              )}

              {trader.email && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 border border-purple-100">
                    <Mail className="h-3.5 w-3.5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-gray-900 mb-0.5">
                      Email Address
                    </p>
                    <p className="text-xs text-gray-600 break-all">
                      {trader.email}
                    </p>
                  </div>
                </div>
              )}

              {trader.physicalAddress && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 border border-orange-100">
                    <MapPin className="h-3.5 w-3.5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-gray-900 mb-0.5">
                      Physical Address
                    </p>
                    <p className="text-xs text-gray-600">
                      {trader.physicalAddress}
                    </p>
                    {trader.district && (
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        District: {trader.district}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Terms */}
          {trader.paymentTerms && (
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-100 rounded-lg">
                    <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Payment Terms
                  </h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-gray-50 rounded-lg">
                    <p className="text-[10px] font-medium text-gray-900 mb-0.5">
                      Payment Days
                    </p>
                    <p className="text-xs text-gray-700 font-semibold">
                      {trader.paymentTerms.paymentDays} day(s)
                    </p>
                  </div>

                  <div className="p-2.5 bg-gray-50 rounded-lg">
                    <p className="text-[10px] font-medium text-gray-900 mb-0.5">
                      Method
                    </p>
                    <p className="text-xs text-gray-700 font-semibold">
                      {trader.paymentTerms.preferredMethod.replace("_", " ")}
                    </p>
                  </div>
                </div>

                {trader.paymentTerms.preferredMethod === "BANK_TRANSFER" && (
                  <div className="space-y-2 pt-2 border-t">
                    {trader.paymentTerms.bankName && (
                      <div>
                        <p className="text-[10px] font-medium text-gray-900 mb-0.5">
                          Bank Name
                        </p>
                        <p className="text-xs text-gray-700">
                          {trader.paymentTerms.bankName}
                        </p>
                      </div>
                    )}
                    {trader.paymentTerms.accountNumber && (
                      <div>
                        <p className="text-[10px] font-medium text-gray-900 mb-0.5">
                          Account Number
                        </p>
                        <p className="text-xs text-gray-700 font-mono">
                          {trader.paymentTerms.accountNumber}
                        </p>
                      </div>
                    )}
                    {trader.paymentTerms.accountName && (
                      <div>
                        <p className="text-[10px] font-medium text-gray-900 mb-0.5">
                          Account Name
                        </p>
                        <p className="text-xs text-gray-700">
                          {trader.paymentTerms.accountName}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {trader.paymentTerms.preferredMethod === "MOBILE_MONEY" && (
                  <div className="space-y-2 pt-2 border-t">
                    {trader.paymentTerms.mobileMoneyNumber && (
                      <div>
                        <p className="text-[10px] font-medium text-gray-900 mb-0.5">
                          Mobile Money Number
                        </p>
                        <p className="text-xs text-gray-700">
                          {trader.paymentTerms.mobileMoneyNumber}
                        </p>
                      </div>
                    )}
                    {trader.paymentTerms.mobileMoneyName && (
                      <div>
                        <p className="text-[10px] font-medium text-gray-900 mb-0.5">
                          Registered Name
                        </p>
                        <p className="text-xs text-gray-700">
                          {trader.paymentTerms.mobileMoneyName}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Business Details */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                  <Building2 className="h-3.5 w-3.5 text-indigo-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Business Details
                </h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {trader.registrationNumber && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100">
                    <FileText className="h-3.5 w-3.5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-gray-900 mb-0.5">
                      Registration Number
                    </p>
                    <p className="text-xs text-gray-700 font-mono">
                      {trader.registrationNumber}
                    </p>
                  </div>
                </div>
              )}

              {trader.tinNumber && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 border border-teal-100">
                    <FileText className="h-3.5 w-3.5 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-gray-900 mb-0.5">
                      TIN Number
                    </p>
                    <p className="text-xs text-gray-700 font-mono">
                      {trader.tinNumber}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 pt-2 border-t">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 border border-gray-200">
                  <Calendar className="h-3.5 w-3.5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-gray-900 mb-0.5">
                    Member Since
                  </p>
                  <p className="text-xs text-gray-700">
                    {formatDate(trader.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Details */}
          {trader.performance && (
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-3.5 w-3.5 text-purple-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Performance Metrics
                  </h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-[10px] font-medium text-gray-900 mb-0.5">
                      Accepted
                    </p>
                    <p className="text-lg font-bold text-green-700">
                      {trader.performance.acceptedDeliveries}
                    </p>
                  </div>

                  <div className="p-2.5 bg-orange-50 rounded-lg border border-orange-100">
                    <p className="text-[10px] font-medium text-gray-900 mb-0.5">
                      Borderline
                    </p>
                    <p className="text-lg font-bold text-orange-700">
                      {trader.performance.borderlineDeliveries}
                    </p>
                  </div>

                  <div className="p-2.5 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-[10px] font-medium text-gray-900 mb-0.5">
                      Rejected
                    </p>
                    <p className="text-lg font-bold text-red-700">
                      {trader.performance.rejectedDeliveries}
                    </p>
                  </div>

                  <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-[10px] font-medium text-gray-900 mb-0.5">
                      On-Time Rate
                    </p>
                    <p className="text-lg font-bold text-blue-700">
                      {trader.performance.onTimeDeliveryRate}%
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                      Quality Consistency
                    </span>
                    <span className="text-xs font-semibold text-gray-900">
                      {trader.performance.qualityConsistencyScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-purple-600 h-1.5 rounded-full"
                      style={{
                        width: `${trader.performance.qualityConsistencyScore}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                      Avg. Defect Count
                    </span>
                    <span className="text-xs font-semibold text-gray-900">
                      {trader.performance.averageDefectCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                      Avg. Moisture Content
                    </span>
                    <span className="text-xs font-semibold text-gray-900">
                      {(trader.performance.averageMoistureContent / 10).toFixed(
                        1
                      )}
                      %
                    </span>
                  </div>
                </div>

                {trader.performance.lastDeliveryDate && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      <div>
                        <p className="text-[10px] text-gray-600">
                          Last Delivery
                        </p>
                        <p className="text-xs font-medium text-gray-900">
                          {formatDate(trader.performance.lastDeliveryDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recent Disputes */}
          {trader.disputes && trader.disputes.length > 0 && (
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-red-100 rounded-lg">
                      <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Recent Disputes
                    </h3>
                  </div>
                  <Badge className="bg-red-100 text-red-700 border-red-200">
                    {trader._count?.disputes || 0}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {trader.disputes.slice(0, 3).map((dispute) => (
                  <div
                    key={dispute.id}
                    className="p-2.5 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-xs font-medium text-gray-900">
                        {dispute.disputeType.replace("_", " ")}
                      </span>
                      <Badge
                        className={`text-[10px] px-1.5 py-0 ${
                          dispute.status === "RESOLVED"
                            ? "bg-green-100 text-green-700"
                            : dispute.status === "CLOSED"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {dispute.status}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-gray-600 line-clamp-2">
                      {dispute.description}
                    </p>
                    {dispute.bwnNumber && (
                      <p className="text-[10px] text-gray-500 mt-1 font-mono">
                        BWN: {dispute.bwnNumber}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Notes Section */}
          {trader.notes && (
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gray-100 rounded-lg">
                    <FileText className="h-3.5 w-3.5 text-gray-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Notes</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-700 whitespace-pre-wrap">
                  {trader.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={onRefresh}
            >
              Refresh Data
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex-1 text-xs bg-[#985145] hover:bg-[#7d4237]"
            >
              View Full History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
