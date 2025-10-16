"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BuyingWeightNote } from "./bwn-data";

interface BWNDetailProps {
  bwn: BuyingWeightNote;
  onUpdate: () => void;
}

export function BWNDetail({ bwn, onUpdate }: BWNDetailProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bwn/${bwn.id}/approve`, {
        method: "POST",
      });
      const result = await response.json();
      if (result.success) {
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to approve BWN:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bwn/${bwn.id}/reject`, {
        method: "POST",
      });
      const result = await response.json();
      if (result.success) {
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to reject BWN:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async () => {
    if (!paymentAmount || Number.parseFloat(paymentAmount) <= 0) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/bwn/${bwn.id}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number.parseFloat(paymentAmount) }),
      });
      const result = await response.json();
      if (result.success) {
        setPaymentAmount("");
        setOpenPaymentDialog(false);
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to record payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this BWN?")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/bwn/${bwn.id}`, { method: "DELETE" });
      const result = await response.json();
      if (result.success) {
        router.push("/bwn");
      }
    } catch (error) {
      console.error("Failed to delete BWN:", error);
    } finally {
      setLoading(false);
    }
  };

  const remainingBalance = bwn.totalValue - (bwn.paidAmount || 0);
  const paymentPercentage = ((bwn.paidAmount || 0) / bwn.totalValue) * 100;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold">{bwn.bwnNumber}</h2>
            <p className="text-muted-foreground">{bwn.traderName}</p>
          </div>
          <div className="flex gap-2">
            <Badge>{bwn.status}</Badge>
            <Badge variant="outline">{bwn.paymentStatus}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-4">Coffee Details</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-muted-foreground">Coffee Type</Label>
                <p className="font-medium">{bwn.coffeeType}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Quality Grade</Label>
                <p className="font-medium">{bwn.qualityGrade}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  Moisture Content
                </Label>
                <p className="font-medium">{bwn.moistureContent}%</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quantity & Pricing</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-muted-foreground">Quantity</Label>
                <p className="font-medium">
                  {bwn.quantity.toLocaleString()} kg
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Unit Price</Label>
                <p className="font-medium">
                  UGX {bwn.unitPrice.toLocaleString()}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Value</Label>
                <p className="font-bold text-lg">
                  UGX {bwn.totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {bwn.notes && (
          <div className="mt-6 pt-6 border-t">
            <Label className="text-muted-foreground">Notes</Label>
            <p className="mt-2">{bwn.notes}</p>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Payment Information</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-muted-foreground">Payment Progress</Label>
              <span className="font-medium">
                {paymentPercentage.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${paymentPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-muted-foreground">Paid Amount</Label>
              <p className="font-bold">
                UGX {(bwn.paidAmount || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Remaining</Label>
              <p className="font-bold text-orange-600">
                UGX {remainingBalance.toLocaleString()}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <Badge className="mt-1">{bwn.paymentStatus}</Badge>
            </div>
          </div>

          {bwn.paymentStatus !== "paid" && (
            <Dialog
              open={openPaymentDialog}
              onOpenChange={setOpenPaymentDialog}
            >
              <DialogTrigger asChild>
                <Button className="w-full">Record Payment</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record Payment</DialogTitle>
                  <DialogDescription>
                    Enter the payment amount for this BWN
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Amount (UGX)</Label>
                    <Input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="0"
                      max={remainingBalance}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Remaining: UGX {remainingBalance.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={handleRecordPayment}
                    disabled={loading || !paymentAmount}
                    className="w-full"
                  >
                    {loading ? "Processing..." : "Confirm Payment"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Actions</h3>
        <div className="flex flex-wrap gap-2">
          {bwn.status === "pending" && (
            <>
              <Button onClick={handleApprove} disabled={loading}>
                Approve
              </Button>
              <Button
                onClick={handleReject}
                variant="destructive"
                disabled={loading}
              >
                Reject
              </Button>
            </>
          )}
          <Button
            variant="outline"
            onClick={() => router.push(`/bwn/${bwn.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
}
