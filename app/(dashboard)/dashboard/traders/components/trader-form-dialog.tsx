"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { User, CreditCard, FileText, Loader2 } from "lucide-react";
import {
  TraderProps,
  useCreateTrader,
  useTrader,
  useUpdateTrader,
} from "@/hooks/useTraders";

const traderSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Valid phone number required"),
  contactPerson: z.string().optional(),
  alternatePhone: z.string().optional(),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  physicalAddress: z.string().optional(),
  district: z.string().optional(),
  registrationNumber: z.string().optional(),
  tinNumber: z.string().optional(),
  notes: z.string().optional(),
  preferredPaymentDays: z.number().min(1).default(1),
  // Payment Terms
  preferredMethod: z
    .enum(["BANK_TRANSFER", "MOBILE_MONEY"])
    .default("BANK_TRANSFER"),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mobileMoneyNumber: z.string().optional(),
  mobileMoneyName: z.string().optional(),
  requiresAdvance: z.boolean().default(false),
});

type TraderFormData = z.infer<typeof traderSchema>;

interface TraderFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  trader?: TraderProps;
}

export default function TraderFormDialog({
  isOpen,
  onClose,
  onSuccess,
  trader,
}: TraderFormDialogProps) {
  const { createTraderAsync, isCreating } = useCreateTrader();
  const { updateTraderAsync, isUpdating } = useUpdateTrader(trader?.id || "");
  const [activeTab, setActiveTab] = useState("basic");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TraderFormData>({
    // resolver: zodResolver(traderSchema),
    defaultValues: {
      preferredPaymentDays: 1,
      preferredMethod: "BANK_TRANSFER",
      requiresAdvance: false,
    },
  });

  const preferredMethod = watch("preferredMethod");

  useEffect(() => {
    if (trader) {
      reset({
        name: trader.name,
        phoneNumber: trader.phoneNumber,
        contactPerson: trader.contactPerson || "",
        alternatePhone: trader.alternatePhone || "",
        email: trader.email || "",
        physicalAddress: trader.physicalAddress || "",
        district: trader.district || "",
        registrationNumber: trader.registrationNumber || "",
        tinNumber: trader.tinNumber || "",
        notes: trader.notes || "",
        preferredPaymentDays: trader.preferredPaymentDays,
        preferredMethod:
          (trader.paymentTerms?.preferredMethod as
            | "BANK_TRANSFER"
            | "MOBILE_MONEY") || "BANK_TRANSFER",
        bankName: trader.paymentTerms?.bankName || "",
        accountNumber: trader.paymentTerms?.accountNumber || "",
        accountName: trader.paymentTerms?.accountName || "",
        mobileMoneyNumber: trader.paymentTerms?.mobileMoneyNumber || "",
        mobileMoneyName: trader.paymentTerms?.mobileMoneyName || "",
        requiresAdvance: trader.paymentTerms?.requiresAdvance || false,
      });
    } else {
      reset({
        preferredPaymentDays: 1,
        preferredMethod: "BANK_TRANSFER",
        requiresAdvance: false,
      });
    }
  }, [trader, reset]);

  const onSubmit = async (data: TraderFormData) => {
    try {
      if (trader) {
        await updateTraderAsync(data);
      } else {
        await createTraderAsync(data);
      }
      onSuccess();
      onClose();
      reset();
    } catch (error) {
      console.error("Failed to save trader:", error);
      alert("Failed to save trader. Please try again.");
    }
  };
  const handleClose = () => {
    onClose();
    reset();
    setActiveTab("basic");
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-[#985145]/20 to-[#985145]/10 rounded-lg">
              <User className="h-4 w-4 text-[#985145]" />
            </div>
            {trader ? "Edit Trader" : "Add New Trader"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 h-9">
              <TabsTrigger value="basic" className="text-xs">
                <User className="h-3 w-3 mr-1.5" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="payment" className="text-xs">
                <CreditCard className="h-3 w-3 mr-1.5" />
                Payment
              </TabsTrigger>
              <TabsTrigger value="additional" className="text-xs">
                <FileText className="h-3 w-3 mr-1.5" />
                Additional
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name" className="text-xs font-medium">
                    Trader Name *
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Enter trader name"
                    className="mt-1.5 h-8 text-xs"
                  />
                  {errors.name && (
                    <p className="text-[10px] text-red-600 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phoneNumber" className="text-xs font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    {...register("phoneNumber")}
                    placeholder="+256 700 000000"
                    className="mt-1.5 h-8 text-xs"
                  />
                  {errors.phoneNumber && (
                    <p className="text-[10px] text-red-600 mt-1">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="alternatePhone"
                    className="text-xs font-medium"
                  >
                    Alternate Phone
                  </Label>
                  <Input
                    id="alternatePhone"
                    {...register("alternatePhone")}
                    placeholder="+256 700 000000"
                    className="mt-1.5 h-8 text-xs"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="contactPerson"
                    className="text-xs font-medium"
                  >
                    Contact Person
                  </Label>
                  <Input
                    id="contactPerson"
                    {...register("contactPerson")}
                    placeholder="Enter contact person"
                    className="mt-1.5 h-8 text-xs"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-xs font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="trader@example.com"
                    className="mt-1.5 h-8 text-xs"
                  />
                  {errors.email && (
                    <p className="text-[10px] text-red-600 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="district" className="text-xs font-medium">
                    District
                  </Label>
                  <Input
                    id="district"
                    {...register("district")}
                    placeholder="Enter district"
                    className="mt-1.5 h-8 text-xs"
                  />
                </div>

                <div className="col-span-2">
                  <Label
                    htmlFor="physicalAddress"
                    className="text-xs font-medium"
                  >
                    Physical Address
                  </Label>
                  <Textarea
                    id="physicalAddress"
                    {...register("physicalAddress")}
                    placeholder="Enter physical address"
                    className="mt-1.5 text-xs resize-none h-16"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Payment Terms Tab */}
            <TabsContent value="payment" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="preferredPaymentDays"
                    className="text-xs font-medium"
                  >
                    Payment Days
                  </Label>
                  <Input
                    id="preferredPaymentDays"
                    type="number"
                    {...register("preferredPaymentDays", {
                      valueAsNumber: true,
                    })}
                    placeholder="1"
                    className="mt-1.5 h-8 text-xs"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="preferredMethod"
                    className="text-xs font-medium"
                  >
                    Payment Method
                  </Label>
                  <Select
                    value={preferredMethod}
                    onValueChange={(value) =>
                      setValue("preferredMethod", value as any)
                    }
                  >
                    <SelectTrigger className="mt-1.5 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BANK_TRANSFER" className="text-xs">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="MOBILE_MONEY" className="text-xs">
                        Mobile Money
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {preferredMethod === "BANK_TRANSFER" && (
                  <>
                    <div>
                      <Label htmlFor="bankName" className="text-xs font-medium">
                        Bank Name
                      </Label>
                      <Input
                        id="bankName"
                        {...register("bankName")}
                        placeholder="Enter bank name"
                        className="mt-1.5 h-8 text-xs"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="accountNumber"
                        className="text-xs font-medium"
                      >
                        Account Number
                      </Label>
                      <Input
                        id="accountNumber"
                        {...register("accountNumber")}
                        placeholder="Enter account number"
                        className="mt-1.5 h-8 text-xs"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label
                        htmlFor="accountName"
                        className="text-xs font-medium"
                      >
                        Account Name
                      </Label>
                      <Input
                        id="accountName"
                        {...register("accountName")}
                        placeholder="Enter account name"
                        className="mt-1.5 h-8 text-xs"
                      />
                    </div>
                  </>
                )}

                {preferredMethod === "MOBILE_MONEY" && (
                  <>
                    <div>
                      <Label
                        htmlFor="mobileMoneyNumber"
                        className="text-xs font-medium"
                      >
                        Mobile Money Number
                      </Label>
                      <Input
                        id="mobileMoneyNumber"
                        {...register("mobileMoneyNumber")}
                        placeholder="+256 700 000000"
                        className="mt-1.5 h-8 text-xs"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="mobileMoneyName"
                        className="text-xs font-medium"
                      >
                        Mobile Money Name
                      </Label>
                      <Input
                        id="mobileMoneyName"
                        {...register("mobileMoneyName")}
                        placeholder="Enter registered name"
                        className="mt-1.5 h-8 text-xs"
                      />
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            {/* Additional Information Tab */}
            <TabsContent value="additional" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="registrationNumber"
                    className="text-xs font-medium"
                  >
                    Registration Number
                  </Label>
                  <Input
                    id="registrationNumber"
                    {...register("registrationNumber")}
                    placeholder="Business registration no."
                    className="mt-1.5 h-8 text-xs"
                  />
                </div>

                <div>
                  <Label htmlFor="tinNumber" className="text-xs font-medium">
                    TIN Number
                  </Label>
                  <Input
                    id="tinNumber"
                    {...register("tinNumber")}
                    placeholder="Tax identification no."
                    className="mt-1.5 h-8 text-xs"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="notes" className="text-xs font-medium">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    {...register("notes")}
                    placeholder="Additional notes or comments"
                    className="mt-1.5 text-xs resize-none h-20"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              size="sm"
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              size="sm"
              className="bg-[#985145] hover:bg-[#7d4138] text-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  {trader ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{trader ? "Update Trader" : "Create Trader"}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
