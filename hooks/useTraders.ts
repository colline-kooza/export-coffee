import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

export interface TraderProps {
  id: string;
  traderCode: string;
  name: string;
  contactPerson: string | null;
  phoneNumber: string;
  alternatePhone: string | null;
  email: string | null;
  physicalAddress: string | null;
  district: string | null;
  registrationNumber: string | null;
  tinNumber: string | null;
  status: "ACTIVE" | "SUSPENDED" | "BLACKLISTED" | "UNDER_REVIEW";
  trustScore: number;
  totalDeliveries: number;
  totalVolumeKg: number;
  qualityAcceptanceRate: number;
  reliabilityScore: number;
  preferredPaymentDays: number;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  performance?: TraderPerformance;
  paymentTerms?: TraderPaymentTerms;
  disputes?: TraderDispute[];
  _count?: {
    buyingWeightNotes: number;
    stockReceipts: number;
    payments: number;
    disputes: number;
  };
}

export interface TraderPerformance {
  id: string;
  traderId: string;
  totalDeliveries: number;
  totalVolumeKg: number;
  acceptedDeliveries: number;
  rejectedDeliveries: number;
  borderlineDeliveries: number;
  qualityConsistencyScore: number;
  averageDefectCount: number;
  averageMoistureContent: number;
  onTimeDeliveryRate: number;
  lastDeliveryDate: string | null;
  updatedAt: string;
}

export interface TraderPaymentTerms {
  id: string;
  traderId: string;
  paymentDays: number;
  preferredMethod: string;
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
  mobileMoneyNumber: string | null;
  mobileMoneyName: string | null;
  requiresAdvance: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TraderDispute {
  id: string;
  traderId: string;
  disputeType: string;
  description: string;
  bwnNumber: string | null;
  amount: string | null;
  status: "OPEN" | "UNDER_INVESTIGATION" | "RESOLVED" | "CLOSED";
  resolution: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TraderDashboardMetrics {
  totalDeliveries: number;
  totalVolumeKg: number;
  totalValueUGX: string;
  activeOrders: number;
  pendingPayments: number;
  qualityRate: number;
  averageMoistureContent: number;
  recentDeliveries: Array<{
    id: string;
    bwnNumber: string;
    deliveryDate: string;
    coffeeType: string;
    netWeightKg: number;
    totalAmountUGX: string;
    status: string;
  }>;
  performanceTrend: Record<string, number>;
  monthlyVolume: Record<string, number>;
}

// Get all traders with pagination and filters
// export function useTraders(params?: {
//   search?: string;
//   status?: string;
//   page?: number;
//   limit?: number;
// }) {
//   const queryParams = new URLSearchParams();
//   if (params?.search) queryParams.set("search", params.search);
//   if (params?.status) queryParams.set("status", params.status);
//   if (params?.page) queryParams.set("page", params.page.toString());
//   if (params?.limit) queryParams.set("limit", params.limit.toString());

//   return useQuery({
//     queryKey: ["traders", params],
//     queryFn: async () => {
//       const response = await fetch(
//         `${baseUrl}/api/traders?${queryParams.toString()}`
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch traders");
//       }
//       const data = await response.json();
//       return data as {
//         traders: TraderProps[];
//         totalCount: number;
//         totalPages: number;
//         currentPage: number;
//       };
//     },
//   });
// }

// Get single trader details
export function useTrader(traderId: string) {
  return useQuery({
    queryKey: ["trader", traderId],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/api/traders/${traderId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch trader");
      }
      return (await response.json()) as TraderProps;
    },
    enabled: !!traderId,
  });
}

// Get trader dashboard metrics
export function useTraderDashboard(traderId: string, range: string = "30days") {
  return useQuery({
    queryKey: ["trader-dashboard", traderId, range],
    queryFn: async () => {
      const response = await fetch(
        `${baseUrl}/api/traders/${traderId}/dashboard?range=${range}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch trader dashboard");
      }
      const data = await response.json();
      return data as TraderDashboardMetrics;
    },
    enabled: !!traderId,
  });
}

// // Create trader mutation
// export function useCreateTrader() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (data: Partial<TraderProps>) => {
//       const response = await fetch(`${baseUrl}/api/traders`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to create trader");
//       }
//       return await response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["traders"] });
//     },
//   });
// }

// // Update trader mutation
// export function useUpdateTrader(traderId: string) {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (data: Partial<TraderProps>) => {
//       const response = await fetch(`${baseUrl}/api/traders/${traderId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to update trader");
//       }
//       return await response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["trader", traderId] });
//       queryClient.invalidateQueries({ queryKey: ["traders"] });
//     },
//   });
// }

// Delete (deactivate) trader mutation
export function useDeleteTrader() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (traderId: string) => {
      const response = await fetch(`${baseUrl}/api/traders/${traderId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete trader");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["traders"] });
    },
  });
}

// Update the mutation hooks to return the correct properties
export function useCreateTrader() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: Partial<TraderProps>) => {
      const response = await fetch(`${baseUrl}/api/traders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create trader");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["traders"] });
    },
  });

  return {
    createTrader: mutation.mutate,
    createTraderAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}

// Update useUpdateTrader
export function useUpdateTrader(traderId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: Partial<TraderProps>) => {
      const response = await fetch(`${baseUrl}/api/traders/${traderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update trader");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trader", traderId] });
      queryClient.invalidateQueries({ queryKey: ["traders"] });
    },
  });

  return {
    updateTrader: mutation.mutate,
    updateTraderAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}

// Update useTraders to destructure data properly
export function useTraders(params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.set("search", params.search);
  if (params?.status) queryParams.set("status", params.status);
  if (params?.page) queryParams.set("page", params.page.toString());
  if (params?.limit) queryParams.set("limit", params.limit.toString());

  const query = useQuery({
    queryKey: ["traders", params],
    queryFn: async () => {
      const response = await fetch(
        `${baseUrl}/api/traders?${queryParams.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch traders");
      }
      const data = await response.json();
      return data as {
        traders: TraderProps[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
      };
    },
  });

  return {
    traders: query.data?.traders ?? [],
    totalCount: query.data?.totalCount ?? 0,
    totalPages: query.data?.totalPages ?? 0,
    currentPage: query.data?.currentPage ?? 1,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error?.message,
    refetch: query.refetch,
  };
}