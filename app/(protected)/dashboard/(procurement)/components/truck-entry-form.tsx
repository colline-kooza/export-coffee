"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Truck, User, Phone, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useCreateTruckEntry, useTraders, useSecurityOfficers } from "@/hooks/use-truck-entries"
import type { SelectOption } from "@/types/truck-entry"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SelectInput } from "@/components/data-table/select-input"

const truckEntrySchema = z.object({
  truckNumber: z.string().min(1, "Truck number is required").toUpperCase(),
  driverName: z.string().min(2, "Driver name must be at least 2 characters"),
  driverPhone: z.string().optional().nullable(),
  traderId: z.string().min(1, "Trader is required"),
  securityOfficerId: z.string().min(1, "Security officer is required"),
})

type TruckEntryFormValues = z.infer<typeof truckEntrySchema>

interface TruckEntryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TruckEntryForm({ open, onOpenChange }: TruckEntryFormProps) {
  const { traders, isLoading: loadingTraders } = useTraders()
  const { officers, isLoading: loadingOfficers } = useSecurityOfficers()
  const createMutation = useCreateTruckEntry()

  const form = useForm<TruckEntryFormValues>({
    resolver: zodResolver(truckEntrySchema),
    defaultValues: {
      truckNumber: "",
      driverName: "",
      driverPhone: "",
      traderId: "",
      securityOfficerId: "",
    },
  })

  const onSubmit = async (data: TruckEntryFormValues) => {
    try {
      console.log("Submitting truck entry:", data)
      // Convert null to undefined for API compatibility
      const payload = {
        ...data,
        driverPhone: data.driverPhone || undefined,
      }
      const result = await createMutation.mutateAsync(payload)
      if (result.success) {
        form.reset()
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  const traderOptions: SelectOption[] = traders.map((trader) => ({
    value: trader.id,
    label: trader.name,
  }))

  const securityOfficerOptions: SelectOption[] = officers.map((officer) => ({
    value: officer.id,
    label: officer.name,
  }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 border-[#8B4513]/20">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#8B4513]/10 bg-gradient-to-r from-[#8B4513]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#8B4513]/10">
              <Truck className="h-5 w-5 text-[#8B4513]" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-[#8B4513]">Register Truck Entry</DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Fill in the details to register a new truck entry
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 py-4">
              <div className="space-y-6">
                {/* Truck Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#8B4513]/20">
                    <div className="w-1 h-5 bg-[#8B4513] rounded-full" />
                    <h3 className="font-semibold text-[#8B4513]">Truck Information</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="truckNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Truck Number <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Truck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="UBJ 123A or KAA 456B"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                              className="pl-10 border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513]/20"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Driver Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#8B4513]/20">
                    <div className="w-1 h-5 bg-[#8B4513] rounded-full" />
                    <h3 className="font-semibold text-[#8B4513]">Driver Information</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="driverName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Driver Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="James Okello or Sarah Nakato"
                              {...field}
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
                    name="driverPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Driver Phone <span className="text-xs text-gray-500">(Optional)</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="+256 700 123 456 or 0700123456"
                              {...field}
                              value={field.value || ""}
                              className="pl-10 border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513]/20"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Assignment Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#8B4513]/20">
                    <div className="w-1 h-5 bg-[#8B4513] rounded-full" />
                    <h3 className="font-semibold text-[#8B4513]">Assignment Details</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="traderId"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="h-4 w-4 text-gray-500" />
                          <FormLabel className="text-gray-700 font-medium mb-0">
                            Trader <span className="text-red-500">*</span>
                          </FormLabel>
                        </div>
                        <SelectInput
                          options={traderOptions}
                          value={field.value}
                          onValueChange={field.onChange}
                          label="Select trader (e.g., Ahmed Coffee Traders)"
                          searchPlaceholder="Search traders..."
                          emptyMessage="No traders found"
                          loading={loadingTraders}
                          className="w-full"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="securityOfficerId"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <FormLabel className="text-gray-700 font-medium mb-0">
                            Security Officer <span className="text-red-500">*</span>
                          </FormLabel>
                        </div>
                        <SelectInput
                          options={securityOfficerOptions}
                          value={field.value}
                          onValueChange={field.onChange}
                          label="Select security officer on duty"
                          searchPlaceholder="Search officers..."
                          emptyMessage="No officers found"
                          loading={loadingOfficers}
                          className="w-full"
                        />
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
                Registering...
              </>
            ) : (
              <>
                <Truck className="mr-2 h-4 w-4" />
                Register Entry
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}