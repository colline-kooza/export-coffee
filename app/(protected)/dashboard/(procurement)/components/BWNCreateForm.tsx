"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  FileText,
  Scale,
  Droplets,
  DollarSign,
  Coffee,
  Building2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateBuyingWeightNote } from "@/hooks/use-buying-weight-notes";
import { useWeighbridgeReadings } from "@/hooks/use-weighbridge-readings";
import type {
  BuyingWeightNoteCreateDTO,
  CoffeeType,
} from "@/types/buying-weight-note";

// Comprehensive validation schema
const bwnSchema = z.object({
  weighbridgeReadingId: z
    .string()
    .min(1, "Please select a weighbridge reading"),
  coffeeType: z
    .enum(["ARABICA", "ROBUSTA"])
    .refine((val) => !!val, { message: "Please select coffee type" }),

  moistureContent: z.coerce
    .number()
    .min(100, "Moisture content must be at least 10.0%")
    .max(300, "Moisture content cannot exceed 30.0%"),
  pricePerKgUGX: z.coerce
    .number()
    .min(1000, "Price must be at least 1,000 UGX")
    .max(50000, "Price cannot exceed 50,000 UGX"),
  outturn: z.string().optional(),
  qualityAnalysisNo: z.string().optional(),
  buyingCentre: z.string().optional(),
});

type BWNFormValues = z.infer<typeof bwnSchema>;

interface BWNCreateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BWNCreateForm({ open, onOpenChange }: BWNCreateFormProps) {
  // Fetch available weighbridge readings
  const { readings, isLoading: isLoadingReadings } = useWeighbridgeReadings();
  const createMutation = useCreateBuyingWeightNote();

  const [selectedReading, setSelectedReading] = useState<any>(null);
  const [calculatedValues, setCalculatedValues] = useState({
    moistureDeductionKg: 0,
    finalNetWeightKg: 0,
    totalAmountUGX: 0,
  });

  const form = useForm<BWNFormValues>({
    resolver: zodResolver(bwnSchema) as any, // ✅ quick fix
    defaultValues: {
      weighbridgeReadingId: "",
      coffeeType: "ARABICA", // ✅ ensure non-undefined if possible
      moistureContent: 115,
      pricePerKgUGX: 8000,
      outturn: "",
      qualityAnalysisNo: "",
      buyingCentre: "",
    },
  });

  // Calculate values based on moisture and price
  const calculateValues = (
    moistureContent: number,
    pricePerKg: number,
    netWeight: number
  ) => {
    // Standard moisture deduction formula
    const moistureDeduction = Math.max(
      0,
      Math.round((netWeight * (moistureContent - 115)) / 1000)
    );
    const finalNet = Math.max(0, netWeight - moistureDeduction);
    const total = finalNet * pricePerKg;

    setCalculatedValues({
      moistureDeductionKg: moistureDeduction,
      finalNetWeightKg: finalNet,
      totalAmountUGX: total,
    });
  };

  // Watch form values for real-time calculation
  const watchMoisture = form.watch("moistureContent");
  const watchPrice = form.watch("pricePerKgUGX");

  useEffect(() => {
    if (selectedReading && watchMoisture && watchPrice) {
      calculateValues(watchMoisture, watchPrice, selectedReading.netWeightKg);
    }
  }, [watchMoisture, watchPrice, selectedReading]);

  const handleReadingChange = (readingId: string) => {
    const reading = readings?.find((r) => r.id === readingId);
    setSelectedReading(reading || null);

    if (reading) {
      const moisture = form.getValues("moistureContent") || 115;
      const price = form.getValues("pricePerKgUGX") || 8000;
      calculateValues(moisture, price, reading.netWeightKg);
    }
  };

  const handleFormSubmit = async (data: BWNFormValues) => {
    try {
      await createMutation.mutateAsync({
        ...data,
        coffeeType: data.coffeeType as CoffeeType,
      });
      form.reset();
      setSelectedReading(null);
      setCalculatedValues({
        moistureDeductionKg: 0,
        finalNetWeightKg: 0,
        totalAmountUGX: 0,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatMoisture = (value: number) => {
    return (value / 10).toFixed(1) + "%";
  };

  // Available readings that don't have BWNs yet
  const availableReadings = readings?.filter((r) => !r.hasBWN) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 border-[#8B4513]/20">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#8B4513]/10 bg-gradient-to-r from-[#8B4513]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#8B4513]/10">
              <FileText className="h-5 w-5 text-[#8B4513]" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-[#8B4513]">
                Create Buying Weight Note
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Generate a new BWN from weighbridge reading
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <div className="px-6 py-4">
            <Form {...form}>
              <div className="space-y-6">
                {/* Weighbridge Reading Selection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#8B4513]/20">
                    <div className="w-1 h-5 bg-[#8B4513] rounded-full" />
                    <h3 className="font-semibold text-[#8B4513]">
                      Weighbridge Reading
                    </h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="weighbridgeReadingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Select Reading <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleReadingChange(value);
                          }}
                          disabled={isLoadingReadings}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513]/20 bg-white text-gray-900">
                              <SelectValue
                                placeholder={
                                  isLoadingReadings
                                    ? "Loading readings..."
                                    : "Select a weighbridge reading"
                                }
                              >
                                {selectedReading && (
                                  <div className="flex items-center gap-2 text-sm text-gray-900">
                                    <span className="font-medium">
                                      {selectedReading.entry.truckNumber}
                                    </span>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-600">
                                      {selectedReading.netWeightKg.toLocaleString()}{" "}
                                      kg
                                    </span>
                                  </div>
                                )}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            {availableReadings.length === 0 ? (
                              <div className="p-4 text-center text-sm text-gray-500">
                                No available weighbridge readings
                              </div>
                            ) : (
                              availableReadings.map((reading) => (
                                <SelectItem
                                  key={reading.id}
                                  value={reading.id}
                                  className="hover:bg-[#8B4513]/5 text-gray-900"
                                >
                                  <div className="flex flex-col py-1">
                                    <div className="flex items-center gap-2 font-medium text-gray-900">
                                      <span>{reading.entry.truckNumber}</span>
                                      <span className="text-gray-400">•</span>
                                      <span className="text-[#8B4513]">
                                        {reading.netWeightKg.toLocaleString()}{" "}
                                        kg
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      Driver: {reading.entry.driverName} •{" "}
                                      {new Date(
                                        reading.timestamp
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedReading && (
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-br from-[#8B4513]/5 to-transparent rounded-lg border border-[#8B4513]/20">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 font-medium">
                          Gross Weight
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {selectedReading.grossWeightKg.toLocaleString()} kg
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 font-medium">
                          Tare Weight
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {selectedReading.tareWeightKg.toLocaleString()} kg
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 font-medium">
                          Net Weight
                        </p>
                        <p className="text-lg font-bold text-[#8B4513]">
                          {selectedReading.netWeightKg.toLocaleString()} kg
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Coffee Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#8B4513]/20">
                    <div className="w-1 h-5 bg-[#8B4513] rounded-full" />
                    <h3 className="font-semibold text-[#8B4513]">
                      Coffee Details
                    </h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="coffeeType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Coffee Type <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513]/20 bg-white text-gray-900">
                              <SelectValue placeholder="Select coffee type">
                                {field.value && (
                                  <div className="flex items-center gap-2 text-gray-900">
                                    <Coffee className="h-4 w-4 text-[#8B4513]" />
                                    <span>{field.value}</span>
                                  </div>
                                )}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem
                              value="ARABICA"
                              className="hover:bg-[#8B4513]/5 text-gray-900"
                            >
                              <div className="flex items-center gap-2 py-1">
                                <Coffee className="h-4 w-4 text-[#8B4513]" />
                                <div>
                                  <div className="font-medium">Arabica</div>
                                  <div className="text-xs text-gray-500">
                                    Premium quality coffee
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem
                              value="ROBUSTA"
                              className="hover:bg-[#8B4513]/5 text-gray-900"
                            >
                              <div className="flex items-center gap-2 py-1">
                                <Coffee className="h-4 w-4 text-[#8B4513]" />
                                <div>
                                  <div className="font-medium">Robusta</div>
                                  <div className="text-xs text-gray-500">
                                    Standard quality coffee
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="moistureContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Moisture Content{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Droplets className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="number"
                                step="1"
                                placeholder="115"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  if (selectedReading) {
                                    calculateValues(
                                      Number(e.target.value),
                                      form.getValues("pricePerKgUGX"),
                                      selectedReading.netWeightKg
                                    );
                                  }
                                }}
                                className="pl-10 border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513]/20 text-gray-900"
                              />
                              <div className="absolute right-3 top-3 text-xs text-gray-500 font-medium">
                                {formatMoisture(field.value || 115)}
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs">
                            Enter as integer (e.g., 115 = 11.5%, 135 = 13.5%)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricePerKgUGX"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Price per Kg (UGX){" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="number"
                                placeholder="8000"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  if (selectedReading) {
                                    calculateValues(
                                      form.getValues("moistureContent"),
                                      Number(e.target.value),
                                      selectedReading.netWeightKg
                                    );
                                  }
                                }}
                                className="pl-10 border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513]/20 text-gray-900"
                              />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs">
                            Current market price per kilogram
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Calculation Preview */}
                {selectedReading && calculatedValues.finalNetWeightKg > 0 && (
                  <Alert className="border-[#8B4513]/20 bg-gradient-to-br from-[#8B4513]/5 to-transparent">
                    <Scale className="h-4 w-4 text-[#8B4513]" />
                    <AlertDescription>
                      <div className="space-y-3 mt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Net Weight:</span>
                          <span className="font-semibold text-gray-900">
                            {selectedReading.netWeightKg.toLocaleString()} kg
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            Moisture Deduction:
                          </span>
                          <span className="font-semibold text-orange-600">
                            -
                            {calculatedValues.moistureDeductionKg.toLocaleString()}{" "}
                            kg
                          </span>
                        </div>
                        <div className="h-px bg-[#8B4513]/20" />
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium">
                            Final Net Weight:
                          </span>
                          <span className="text-lg font-bold text-[#8B4513]">
                            {calculatedValues.finalNetWeightKg.toLocaleString()}{" "}
                            kg
                          </span>
                        </div>
                        <div className="h-px bg-[#8B4513]/20" />
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium">
                            Total Amount:
                          </span>
                          <span className="text-xl font-bold text-green-600">
                            {formatCurrency(calculatedValues.totalAmountUGX)}
                          </span>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Optional Fields */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#8B4513]/20">
                    <div className="w-1 h-5 bg-[#8B4513] rounded-full" />
                    <h3 className="font-semibold text-[#8B4513]">
                      Additional Information
                    </h3>
                    <span className="text-xs text-gray-500 ml-auto">
                      (Optional)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="outturn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Outturn Grade
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="FAQ, Grade 1, etc."
                              {...field}
                              className="border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513]/20 text-gray-900"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="qualityAnalysisNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Quality Analysis No.
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="QA-2025-001"
                              {...field}
                              className="border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513]/20 text-gray-900"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="buyingCentre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Buying Centre
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Kampala Main Warehouse"
                              {...field}
                              className="pl-10 border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513]/20 text-gray-900"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </Form>
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t border-[#8B4513]/10 bg-gray-50/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>All calculations are automatic</span>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setSelectedReading(null);
                onOpenChange(false);
              }}
              disabled={createMutation.isPending}
              className="border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={form.handleSubmit(handleFormSubmit)}
              disabled={createMutation.isPending || !selectedReading}
              className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white font-medium shadow-sm"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating BWN...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Create BWN
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
