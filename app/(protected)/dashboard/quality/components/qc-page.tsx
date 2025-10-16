"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { QCTable } from "./qc-table";

export default function QualityControlPage() {
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedResult, setSelectedResult] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecords() {
      setIsLoading(true);
      //   const result = await getQCRecords(selectedResult, currentPage);
      //   if (result.success) {
      //     setRecords([]);
      //     setTotalPages(10);
      //   }
      setIsLoading(false);
    }
    fetchRecords();
  }, [currentPage, selectedResult]);

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Quality Control
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and review QC inspections
            </p>
          </div>
          <Link href="/quality-control/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Inspection
            </Button>
          </Link>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading QC inspections...</p>
            </div>
          ) : (
            <QCTable
              records={records}
              currentPage={currentPage}
              totalPages={totalPages}
              selectedStatus={selectedResult}
              onStatusChange={setSelectedResult}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </main>
  );
}
