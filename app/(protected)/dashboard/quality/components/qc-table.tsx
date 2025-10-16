"use client";
import Link from "next/link";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { StatusBadge } from "./status-badge";
import { Eye } from "lucide-react";

interface QCRecord {
  id: string;
  inspectionNumber: string;
  lotNumber: string;
  colorGrade: string;
  moistureContent: number;
  overallResult: "APPROVED" | "BORDERLINE" | "REJECTED";
  inspector: { name: string };
  inspectionDate: Date;
}

interface QCTableProps {
  records: QCRecord[];
  currentPage: number;
  totalPages: number;
  onStatusChange: (status: string) => void;
  onPageChange: (page: number) => void;
  selectedStatus: string;
}

export function QCTable({
  records,
  currentPage,
  totalPages,
  onStatusChange,
  onPageChange,
  selectedStatus,
}: QCTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter by Result:</span>
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Results</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="BORDERLINE">Borderline</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Inspection #</TableHead>
              <TableHead>Lot #</TableHead>
              <TableHead>Color Grade</TableHead>
              <TableHead>Moisture</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Inspector</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No QC inspections found
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono text-sm font-semibold">
                    {record.inspectionNumber}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {record.lotNumber}
                  </TableCell>
                  <TableCell>{record.colorGrade.replace(/_/g, " ")}</TableCell>
                  <TableCell>{record.moistureContent.toFixed(2)}%</TableCell>
                  <TableCell>
                    <StatusBadge status={record.overallResult} />
                  </TableCell>
                  <TableCell>{record.inspector.name}</TableCell>
                  <TableCell>
                    {format(new Date(record.inspectionDate), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/quality-control/${record.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(currentPage - 1)}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => onPageChange(page)}
                      isActive={page === currentPage}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    onClick={() => onPageChange(currentPage + 1)}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
