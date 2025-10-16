"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BuyingWeightNote } from "./bwn-data";

interface BWNFormProps {
  initialData?: BuyingWeightNote;
  isEditing?: boolean;
}

export function BWNForm({ initialData, isEditing = false }: BWNFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bwnNumber: initialData?.bwnNumber || "",
    traderId: initialData?.traderId || "",
    traderName: initialData?.traderName || "",
    coffeeType: initialData?.coffeeType || "Arabica",
    quantity: initialData?.quantity || 0,
    unitPrice: initialData?.unitPrice || 0,
    moistureContent: initialData?.moistureContent || 0,
    qualityGrade: initialData?.qualityGrade || "A",
    notes: initialData?.notes || "",
  });

  const totalValue = formData.quantity * formData.unitPrice;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" ||
        name === "unitPrice" ||
        name === "moistureContent"
          ? Number.parseFloat(value) || 0
          : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        totalValue,
        paymentStatus: "unpaid" as const,
      };

      const response = await fetch(
        isEditing ? `/api/bwn/${initialData?.id}` : "/api/bwn",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (result.success) {
        router.push("/bwn");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to save BWN:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bwnNumber">BWN Number</Label>
            <Input
              id="bwnNumber"
              name="bwnNumber"
              value={formData.bwnNumber}
              onChange={handleChange}
              placeholder="e.g., BWN-2025-001"
              required
            />
          </div>

          <div>
            <Label htmlFor="traderName">Trader Name</Label>
            <Input
              id="traderName"
              name="traderName"
              value={formData.traderName}
              onChange={handleChange}
              placeholder="Enter trader name"
              required
            />
          </div>

          <div>
            <Label htmlFor="traderId">Trader ID</Label>
            <Input
              id="traderId"
              name="traderId"
              value={formData.traderId}
              onChange={handleChange}
              placeholder="e.g., T001"
              required
            />
          </div>

          <div>
            <Label htmlFor="coffeeType">Coffee Type</Label>
            <Select
              value={formData.coffeeType}
              onValueChange={(value) => handleSelectChange("coffeeType", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arabica">Arabica</SelectItem>
                <SelectItem value="Robusta">Robusta</SelectItem>
                <SelectItem value="Blend">Blend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantity">Quantity (kg)</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </div>

          <div>
            <Label htmlFor="unitPrice">Unit Price (UGX)</Label>
            <Input
              id="unitPrice"
              name="unitPrice"
              type="number"
              value={formData.unitPrice}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </div>

          <div>
            <Label htmlFor="moistureContent">Moisture Content (%)</Label>
            <Input
              id="moistureContent"
              name="moistureContent"
              type="number"
              step="0.1"
              value={formData.moistureContent}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </div>

          <div>
            <Label htmlFor="qualityGrade">Quality Grade</Label>
            <Select
              value={formData.qualityGrade}
              onValueChange={(value) =>
                handleSelectChange("qualityGrade", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Total Value (UGX)</Label>
          <div className="text-2xl font-bold text-primary">
            {totalValue.toLocaleString()}
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any additional notes..."
            rows={4}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update BWN" : "Create BWN"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
