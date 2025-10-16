"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Scale, Truck, User, Weight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCreateWeighbridgeReading, usePendingTruckEntries, useOperators } from "@/hooks/use-weighbridge-readings"
import type { SelectOption } from "@/types/weighbridge-reading"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SelectInput } from "@/components/data-table/select-input"

const weighbridgeReadingSchema = z
  .object({
    entryId: z.string().min(1, "Truck entry is required"),
    grossWeightKg: z
      .number()
      .min(1, "Gross weight must be greater than 0")
      .max(100000, "Gross weight seems unrealistic"),
    tareWeightKg: z
      .number()
      .min(1, "Tare weight must be greater than 0")
      .max(50000, "Tare weight seems unrealistic"),
    operatorId: z.string().min(1, "Operator is required"),
    notes: z.string().optional(),
  })
  .refine((data) => data.grossWeightKg > data.tareWeightKg, {
    message: "Gross weight must be greater than tare weight",
    path: ["grossWeightKg"],
  })

type WeighbridgeReadingFormValues = z.infer<typeof weighbridgeReadingSchema>

interface WeighbridgeReadingFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WeighbridgeReadingForm({ open, onOpenChange }: WeighbridgeReadingFormProps) {
  const { entries, isLoading: loadingEntries } = usePendingTruckEntries()
  const { operators, isLoading: loadingOperators } = useOperators()
  const createMutation = useCreateWeighbridgeReading()

  const form = useForm<WeighbridgeReadingFormValues>({
    resolver: zodResolver(weighbridgeReadingSchema),
    defaultValues: {
      entryId: "",
      grossWeightKg: 0,
      tareWeightKg: 0,
      operatorId: "",
      notes: "",
    },
  })

  const grossWeight = form.watch("grossWeightKg")
  const tareWeight = form.watch("tareWeightKg")
  const netWeight = grossWeight && tareWeight && grossWeight > tareWeight ? grossWeight - tareWeight : 0

  const onSubmit = async (data: WeighbridgeReadingFormValues) => {
    try {
      const result = await createMutation.mutateAsync(data)
      if (result.success) {
        form.reset()
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  const truckEntryOptions: SelectOption[] = entries.map((entry) => ({
    value: entry.id,
    label: `${entry.truckNumber} - ${entry.driverName}`,
    description: `Arrived: ${new Date(entry.arrivalTime).toLocaleString()}`,
  }))

  const operatorOptions: SelectOption[] = operators.map((operator) => ({
    value: operator.id,
    label: operator.name,
  }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 border-[#8B4513]/20">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#8B4513]/10 bg-gradient-to-r from-[#8B4513]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#8B4513]/10">
              <Scale className="h-5 w-5 text-[#8B4513]" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-[#8B4513]">Record Weighbridge Reading</DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Record gross and tare weights for truck entry
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 py-4">
              <div className="space-y-6">
                {/* Truck Entry Selection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#8B4513]/20">
                    <div className="w-1 h-5 bg-[#8B4513] rounded-full" />
                    <h3 className="font-semibold text-[#8B4513]">Truck Entry</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="entryId"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 mb-2">
                          <Truck className="h-4 w-4 text-gray-500" />
                          <FormLabel className="text-gray-700 font-medium mb-0">
                            Select Truck Entry <span className="text-red-500">*</span>
                          </FormLabel>
                        </div>
                        <SelectInput
                          options={truckEntryOptions}
                          value={field.value}
                          onValueChange={field.onChange}
                          label="Select pending truck entry"
                          searchPlaceholder="Search by truck number or driver..."
                          emptyMessage="No pending truck entries found"
                          loading={loadingEntries}
                          showDescription={true}
                          className="w-full"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Weight Measurements */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#8B4513]/20">
                    <div className="w-1 h-5 bg-[#8B4513] rounded-full" />
                    <h3 className="font-semibold text-[#8B4513]">Weight Measurements</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="grossWeightKg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Gross Weight (kg) <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Weight className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="number"
                                placeholder="e.g., 25000"
                                value={field.value || ''}
                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                className="pl-10 border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513]/20"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tareWeightKg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Tare Weight (kg) <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Weight className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="number"
                                placeholder="e.g., 8000"
                                value={field.value || ''}
                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                className="pl-10 border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513]/20"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Net Weight Display */}
                  {netWeight > 0 && (
                    <div className="p-4 bg-[#8B4513]/5 border border-[#8B4513]/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Net Weight (Calculated):</span>
                        <span className="text-2xl font-bold text-[#8B4513]">{netWeight.toLocaleString()} kg</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Operator Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#8B4513]/20">
                    <div className="w-1 h-5 bg-[#8B4513] rounded-full" />
                    <h3 className="font-semibold text-[#8B4513]">Operator Details</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="operatorId"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <FormLabel className="text-gray-700 font-medium mb-0">
                            Weighbridge Operator <span className="text-red-500">*</span>
                          </FormLabel>
                        </div>
                        <SelectInput
                          options={operatorOptions}
                          value={field.value}
                          onValueChange={field.onChange}
                          label="Select operator on duty"
                          searchPlaceholder="Search operators..."
                          emptyMessage="No operators found"
                          loading={loadingOperators}
                          className="w-full"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Notes <span className="text-xs text-gray-500">(Optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional observations or notes..."
                            {...field}
                            rows={3}
                            className="border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513]/20 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </ScrollArea>

        <div className="px-6 py-4 border-t border-[#8B4513]/10 bg-gray-50/50 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset()
              onOpenChange(false)
            }}
            disabled={createMutation.isPending}
            className="border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={createMutation.isPending}
            className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white font-medium shadow-sm"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recording...
              </>
            ) : (
              <>
                <Scale className="mr-2 h-4 w-4" />
                Record Reading
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}