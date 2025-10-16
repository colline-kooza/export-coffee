"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const qcFormSchema = z.object({
  inspectionNumber: z.string().min(1, "Inspection number is required"),
  lotNumber: z.string().min(1, "Lot number is required"),
  receiptId: z.string().optional(),
  sampleWeightGrams: z.coerce
    .number()
    .min(1, "Sample weight must be at least 1g"),
  defectCount: z.coerce
    .number()
    .min(0)
    .max(86, "Defect count cannot exceed 86"),
  screenSizePassPercentage: z.coerce
    .number()
    .min(0)
    .max(100, "Must be between 0-100%"),
  moistureContent: z.coerce.number().min(0).max(100, "Must be between 0-100%"),
  foreignMatterPercentage: z.coerce
    .number()
    .min(0)
    .max(100, "Must be between 0-100%"),
  colorGrade: z.string().min(1, "Color grade is required"),
  odorNotes: z.string().optional(),
  overallResult: z.string().optional(),
  priceAdjustmentPercentage: z.coerce.number().min(0).max(100).optional(),
  priceAdjustmentUGX: z.coerce.number().optional(),
  notes: z.string().optional(),
});

type QCFormValues = z.infer<typeof qcFormSchema>;

interface QCFormProps {
  inspectorId: string;
  receiptOptions?: Array<{ id: string; referenceNumber: string }>;
}

// Function to generate random inspection number
function generateInspectionNumber(): string {
  const randomDigits = Math.floor(Math.random() * 10000000000)
    .toString()
    .padStart(10, "0");
  return `FEI ${randomDigits}`;
}

export function QCForm({ inspectorId, receiptOptions = [] }: QCFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(qcFormSchema),
    defaultValues: {
      inspectionNumber: "",
      lotNumber: "",
      receiptId: "",
      sampleWeightGrams: 1500,
      defectCount: 0,
      screenSizePassPercentage: 90,
      moistureContent: 0,
      foreignMatterPercentage: 0,
      colorGrade: "",
      odorNotes: "",
      overallResult: "",
      priceAdjustmentPercentage: 0,
      priceAdjustmentUGX: 0,
      notes: "",
    },
  });

  // Generate inspection number on component mount
  useEffect(() => {
    const inspectionNumber = generateInspectionNumber();
    form.setValue("inspectionNumber", inspectionNumber);
  }, [form]);

  async function onSubmit(values: QCFormValues) {
    setIsLoading(true);
    try {
      console.log(values);
      //   const result = await createQCRecord({
      //     ...values,
      //     inspectorId,
      //   });

      //   if (result.success) {
      //     router.push("/dashboard/quality");
      //   } else {
      //   }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="inspectionNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inspection Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., FEI 1234567890"
                    {...field}
                    readOnly
                    className="bg-gray-50 w-full"
                  />
                </FormControl>
                <FormDescription className="text-gray-500 text-xs">
                  Auto-generated
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lotNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lot Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., LOT-001" {...field} />
                </FormControl>
                <FormDescription className="text-gray-500 text-xs">
                  Auto-generated
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="receiptId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Receipt</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a receipt" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {receiptOptions.map((receipt) => (
                      <SelectItem key={receipt.id} value={receipt.id}>
                        {receipt.referenceNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-gray-500 text-xs">
                  Stock you are inspecting
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sampleWeightGrams"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sample Weight (grams)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1500"
                    {...field}
                    value={
                      field.value === undefined || field.value === null
                        ? ""
                        : Number(field.value)
                    }
                  />
                </FormControl>
                <FormDescription className="text-gray-500 text-xs">
                  e.g., 1500g for 3-ton delivery
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="defectCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Defect Count</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="86"
                    {...field}
                    value={
                      field.value === undefined || field.value === null
                        ? ""
                        : Number(field.value)
                    }
                  />
                </FormControl>
                <FormDescription className="text-gray-500 text-xs">
                  Maximum 86 defects allowed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="screenSizePassPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Screen Size Pass (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="90"
                    min="0"
                    max="100"
                    {...field}
                    value={
                      field.value === undefined || field.value === null
                        ? ""
                        : Number(field.value)
                    }
                  />
                </FormControl>
                <FormDescription className="text-gray-500 text-xs">
                  Should be ≥ 90%
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="moistureContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moisture Content (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    {...field}
                    value={
                      field.value === undefined || field.value === null
                        ? ""
                        : Number(field.value)
                    }
                  />
                </FormControl>
                <FormDescription className="text-gray-500 text-xs">
                  Amount of water in grains (%)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="foreignMatterPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foreign Matter (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    {...field}
                    value={
                      field.value === undefined || field.value === null
                        ? ""
                        : Number(field.value)
                    }
                  />
                </FormControl>
                <FormDescription className="text-gray-500 text-xs">
                  Should be &lt; 5%
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="colorGrade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color Grade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select color grade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BLUISH_GREEN">Bluish Green</SelectItem>
                    <SelectItem value="GREENISH_YELLOW">
                      Greenish Yellow
                    </SelectItem>
                    <SelectItem value="GREEN">Green</SelectItem>
                    <SelectItem value="YELLOW">Yellow</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-gray-500 text-xs">
                  colors of the grains
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="odorNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Odor Notes</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select odor assessment" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="NO_OFF_ODORS">No Off Odors</SelectItem>
                    <SelectItem value="SLIGHT_FERMENTATION">
                      Slight Fermentation
                    </SelectItem>
                    <SelectItem value="MUSTY">Musty</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-gray-500 text-xs">
                  Order of the grains
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* <FormField
          control={form.control}
          name="overallResult"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Overall Result</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className=" w-full md:w-[50%]">
                    <SelectValue placeholder="Select overall result" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="BORDERLINE">Borderline</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-gray-500 text-xs">
                  Stock status
                </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="priceAdjustmentPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price Adjustment (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    {...field}
                    value={
                      field.value === undefined || field.value === null
                        ? ""
                        : Number(field.value)
                    }
                  />
                </FormControl>
                <FormDescription className="text-gray-500 text-xs">
                  For borderline cases (5-10%)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceAdjustmentUGX"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price Adjustment (UGX)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    value={
                      field.value === undefined || field.value === null
                        ? ""
                        : Number(field.value)
                    }
                  />
                </FormControl>
                <FormDescription className="text-gray-500 text-xs">
                  price Adjustments
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create QC Inspection
        </Button>
      </form>
    </Form>
  );
}
