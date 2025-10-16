import { AlertCircle, ChevronLeft, Package, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import InputField from "../formInputs/InputField";
import { SelectInput } from "../formInputs/SelectInput";
import { z } from "zod";
import {
  TraderProps,
  useCreateTrader,
  useUpdateTrader,
} from "@/hooks/useTraders";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Fixed schema - all fields that have default values should not be optional
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
  preferredPaymentDays: z.number().min(1, "Payment days must be at least 1"),
  preferredMethod: z.enum(["BANK_TRANSFER", "MOBILE_MONEY"]),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mobileMoneyNumber: z.string().optional(),
  mobileMoneyName: z.string().optional(),
  requiresAdvance: z.boolean(),
});

type TraderFormData = z.infer<typeof traderSchema>;

interface TraderFormProps {
  onClose: () => void;
  onSuccess: () => void;
  trader?: TraderProps;
}

export function TraderFormPanel({
  trader,
  onClose,
  onSuccess,
}: TraderFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const { createTraderAsync, isCreating } = useCreateTrader();
  const { updateTraderAsync, isUpdating } = useUpdateTrader(trader?.id || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TraderFormData>({
    resolver: zodResolver(traderSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      contactPerson: "",
      alternatePhone: "",
      email: "",
      physicalAddress: "",
      district: "",
      registrationNumber: "",
      tinNumber: "",
      notes: "",
      preferredPaymentDays: 7,
      preferredMethod: "BANK_TRANSFER",
      bankName: "",
      accountNumber: "",
      accountName: "",
      mobileMoneyNumber: "",
      mobileMoneyName: "",
      requiresAdvance: false,
    },
  });

  const preferredMethod = watch("preferredMethod");
  const isLoading = isCreating || isUpdating;

  // Set form values when trader prop changes (for edit mode)
  useEffect(() => {
    if (trader) {
      reset({
        name: trader.name || "",
        phoneNumber: trader.phoneNumber || "",
        contactPerson: trader.contactPerson || "",
        alternatePhone: trader.alternatePhone || "",
        email: trader.email || "",
        physicalAddress: trader.physicalAddress || "",
        district: trader.district || "",
        registrationNumber: trader.registrationNumber || "",
        tinNumber: trader.tinNumber || "",
        notes: trader.notes || "",
        preferredPaymentDays: trader.preferredPaymentDays || 7,
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
    }
  }, [trader, reset]);

  const onSubmit = async (data: TraderFormData) => {
    try {
      if (trader) {
        await updateTraderAsync(data);
        toast.success(`${trader.name} updated successfully`);
      } else {
        await createTraderAsync(data);
        toast.success("Trader created successfully!");
      }

      onClose();
      reset();
    } catch (error: any) {
      console.error("Failed to save trader:", error);

      // Extract error message
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save trader. Please try again.";

      toast.error(errorMessage);
    }
  };

  const paymentMethodOptions = [
    { value: "BANK_TRANSFER", label: "Bank Transfer" },
    { value: "MOBILE_MONEY", label: "Mobile Money" },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            type="button"
            disabled={isLoading}
            className="p-1.5 hover:bg-gray-100 rounded-lg lg:hidden disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {trader ? "Edit Trader" : "Add New Trader"}
            </h2>
            <p className="text-xs text-gray-600">
              {trader
                ? "Update trader information"
                : "Create a new trader profile"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          type="button"
          disabled={isLoading}
          className="hidden lg:block p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-4">
        <div className="flex gap-1 overflow-x-auto">
          {[
            { id: "basic", label: "Basic Info", icon: Users },
            { id: "payment", label: "Payment", icon: Package },
            { id: "additional", label: "Additional", icon: AlertCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap disabled:opacity-50 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 overflow-y-auto"
      >
        <div className="p-4 lg:p-6 space-y-4">
          {activeTab === "basic" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InputField
                label="Trader Name"
                required
                placeholder="Enter trader name"
                description="Full legal name or business name"
                error={errors.name?.message}
                disabled={isLoading}
                {...register("name")}
              />

              <InputField
                label="Phone Number"
                required
                placeholder="+256 700 000000"
                description="Primary contact number"
                error={errors.phoneNumber?.message}
                disabled={isLoading}
                {...register("phoneNumber")}
              />

              <InputField
                label="Alternate Phone"
                placeholder="+256 700 000000"
                description="Secondary contact number"
                error={errors.alternatePhone?.message}
                disabled={isLoading}
                {...register("alternatePhone")}
              />

              <InputField
                label="Contact Person"
                placeholder="Enter contact person name"
                description="Primary contact person"
                error={errors.contactPerson?.message}
                disabled={isLoading}
                {...register("contactPerson")}
              />

              <InputField
                label="Email Address"
                type="email"
                placeholder="trader@example.com"
                description="Business email address"
                error={errors.email?.message}
                disabled={isLoading}
                {...register("email")}
              />

              <InputField
                label="District"
                placeholder="Enter district"
                description="District or region"
                error={errors.district?.message}
                disabled={isLoading}
                {...register("district")}
              />

              <div className="lg:col-span-2">
                <InputField
                  label="Physical Address"
                  placeholder="Enter physical address"
                  description="Complete physical address"
                  error={errors.physicalAddress?.message}
                  disabled={isLoading}
                  {...register("physicalAddress")}
                />
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InputField
                label="Payment Days"
                type="number"
                placeholder="7"
                description="Number of days for payment settlement"
                error={errors.preferredPaymentDays?.message}
                disabled={isLoading}
                {...register("preferredPaymentDays")}
              />

              <SelectInput
                label="Payment Method"
                required
                options={paymentMethodOptions}
                value={preferredMethod as any}
                onValueChange={(opt: any) =>
                  setValue("preferredMethod", opt.value)
                }
                placeholder="Select payment method"
                description="Preferred payment method"
                error={errors.preferredMethod?.message}
                disabled={isLoading}
              />

              {preferredMethod === "BANK_TRANSFER" && (
                <>
                  <InputField
                    label="Bank Name"
                    placeholder="Enter bank name"
                    description="Name of the bank"
                    error={errors.bankName?.message}
                    disabled={isLoading}
                    {...register("bankName")}
                  />

                  <InputField
                    label="Account Number"
                    placeholder="Enter account number"
                    description="Bank account number"
                    error={errors.accountNumber?.message}
                    disabled={isLoading}
                    {...register("accountNumber")}
                  />

                  <div className="lg:col-span-2">
                    <InputField
                      label="Account Name"
                      placeholder="Enter account name"
                      description="Name as registered on bank account"
                      error={errors.accountName?.message}
                      disabled={isLoading}
                      {...register("accountName")}
                    />
                  </div>
                </>
              )}

              {preferredMethod === "MOBILE_MONEY" && (
                <>
                  <InputField
                    label="Mobile Money Number"
                    placeholder="+256 700 000000"
                    description="Mobile money account number"
                    error={errors.mobileMoneyNumber?.message}
                    disabled={isLoading}
                    {...register("mobileMoneyNumber")}
                  />

                  <InputField
                    label="Mobile Money Name"
                    placeholder="Enter registered name"
                    description="Name registered on mobile money account"
                    error={errors.mobileMoneyName?.message}
                    disabled={isLoading}
                    {...register("mobileMoneyName")}
                  />
                </>
              )}
            </div>
          )}

          {activeTab === "additional" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InputField
                label="Registration Number"
                placeholder="Business registration number"
                description="Official business registration number"
                error={errors.registrationNumber?.message}
                disabled={isLoading}
                {...register("registrationNumber")}
              />

              <InputField
                label="TIN Number"
                placeholder="Tax identification number"
                description="Tax identification number"
                error={errors.tinNumber?.message}
                disabled={isLoading}
                {...register("tinNumber")}
              />

              <div className="lg:col-span-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-900">
                    Notes
                  </label>
                  <textarea
                    className="w-full h-24 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none disabled:opacity-50 disabled:bg-gray-50"
                    placeholder="Additional notes or comments"
                    disabled={isLoading}
                    {...register("notes")}
                  />
                  <p className="text-[10px] text-gray-500">
                    Any additional information about the trader
                  </p>
                  {errors.notes && (
                    <p className="text-[10px] text-red-600">
                      {errors.notes.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-3.5 w-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {isLoading
                ? trader
                  ? "Updating..."
                  : "Creating..."
                : trader
                  ? "Update Trader"
                  : "Create Trader"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
