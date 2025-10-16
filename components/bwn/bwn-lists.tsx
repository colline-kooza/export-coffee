"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BuyingWeightNote } from "./bwn-data";

export function BWNList() {
  const [bwns, setBwns] = useState<BuyingWeightNote[]>([]);
  const [filteredBwns, setFilteredBwns] = useState<BuyingWeightNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchBWNs();
  }, []);

  const fetchBWNs = async () => {
    try {
      const response = await fetch("/api/bwn");
      const result = await response.json();
      if (result.success) {
        setBwns(result.data);
        setFilteredBwns(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch BWNs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = bwns;

    if (searchTerm) {
      filtered = filtered.filter(
        (bwn) =>
          bwn.bwnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bwn.traderName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((bwn) => bwn.status === statusFilter);
    }

    setFilteredBwns(filtered);
  }, [searchTerm, statusFilter, bwns]);

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      paid: "default",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      unpaid: "destructive",
      partial: "secondary",
      paid: "default",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-col sm:flex-row">
        <Input
          placeholder="Search by BWN number or trader name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>BWN Number</TableHead>
                <TableHead>Trader</TableHead>
                <TableHead>Coffee Type</TableHead>
                <TableHead>Quantity (kg)</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBwns.map((bwn) => (
                <TableRow key={bwn.id}>
                  <TableCell className="font-medium">{bwn.bwnNumber}</TableCell>
                  <TableCell>{bwn.traderName}</TableCell>
                  <TableCell>{bwn.coffeeType}</TableCell>
                  <TableCell>{bwn.quantity.toLocaleString()}</TableCell>
                  <TableCell>UGX {bwn.totalValue.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(bwn.status)}</TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(bwn.paymentStatus)}
                  </TableCell>
                  <TableCell>
                    <Link href={`/bwn/${bwn.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {filteredBwns.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-muted-foreground">No BWNs found</p>
        </Card>
      )}
    </div>
  );
}
