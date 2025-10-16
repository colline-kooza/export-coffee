import { getAuthenticatedApi } from "@/config/axios";
import {
  BuyingWeightNote,
  BuyingWeightNoteCreateDTO,
  BuyingWeightNoteUpdateDTO,
} from "@/types/buying-weight-note";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface BuyingWeightNotesResponse {
  bwns: BuyingWeightNote[];
  success: boolean;
  error?: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

interface BuyingWeightNoteResponse {
  bwn: BuyingWeightNote;
  success: boolean;
  error?: string;
}

interface BWNStatsResponse {
  stats: {
    totalBWNs: number;
    pendingBWNs: number;
    completedBWNs: number;
    totalAmount: string;
    arabicaCount: number;
    robustaCount: number;
  };
  success: boolean;
  error?: string;
}

// Query keys for caching
export const buyingWeightNoteKeys = {
  all: ["buying-weight-notes"] as const,
  lists: () => [...buyingWeightNoteKeys.all, "list"] as const,
  list: (filters: any) =>
    [...buyingWeightNoteKeys.lists(), { filters }] as const,
  details: () => [...buyingWeightNoteKeys.all, "detail"] as const,
  detail: (id: string) => [...buyingWeightNoteKeys.details(), id] as const,
  stats: ["buying-weight-notes-stats"] as const,
};

const apiClient = {
  getBuyingWeightNotes: async (
    page = 1,
    limit = 12,
    search = "",
    status = "",
    coffeeType = "",
    paymentStatus = ""
  ): Promise<BuyingWeightNotesResponse> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(status && { status }),
        ...(coffeeType && { coffeeType }),
        ...(paymentStatus && { paymentStatus }),
      });
      const authApi = await getAuthenticatedApi();

      const res = await authApi.get<BuyingWeightNotesResponse>(
        `/buying-weight-notes?${params}`
      );

      if (!res.data.success) {
        throw new Error(
          res.data.error || "Failed to fetch buying weight notes"
        );
      }

      return {
        bwns: Array.isArray(res.data.bwns) ? res.data.bwns : [],
        success: true,
        totalCount: res.data.totalCount || 0,
        currentPage: res.data.currentPage || page,
        totalPages: res.data.totalPages || 1,
      };
    } catch (error) {
      console.error("Error fetching buying weight notes:", error);
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.error ||
          error.response?.data?.details ||
          error.message ||
          "Failed to fetch buying weight notes";
        throw new Error(errorMsg);
      }
      throw error;
    }
  },

  getBuyingWeightNote: async (
    id: string
  ): Promise<BuyingWeightNoteResponse> => {
    try {
      if (!id) {
        throw new Error("BWN ID is required");
      }
      const authApi = await getAuthenticatedApi();

      const res = await authApi.get<BuyingWeightNoteResponse>(
        `/buying-weight-notes/${id}`
      );

      if (!res.data.success) {
        throw new Error(res.data.error || "Failed to fetch buying weight note");
      }

      if (!res.data.bwn) {
        throw new Error("Buying weight note not found");
      }

      return {
        bwn: res.data.bwn,
        success: true,
      };
    } catch (error) {
      console.error("Error fetching buying weight note:", error);
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.error ||
          error.response?.data?.details ||
          error.message ||
          "Failed to fetch buying weight note";
        throw new Error(errorMsg);
      }
      throw error;
    }
  },

  getBWNStats: async (): Promise<BWNStatsResponse> => {
    try {
      const authApi = await getAuthenticatedApi();

      const res = await authApi.get<BWNStatsResponse>(
        "/buying-weight-notes/stats"
      );

      if (!res.data.success) {
        throw new Error(res.data.error || "Failed to fetch BWN stats");
      }

      return res.data;
    } catch (error) {
      console.error("Error fetching BWN stats:", error);
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.error ||
          error.response?.data?.details ||
          error.message ||
          "Failed to fetch BWN stats";
        throw new Error(errorMsg);
      }
      throw error;
    }
  },

  createBuyingWeightNote: async (
    data: BuyingWeightNoteCreateDTO
  ): Promise<BuyingWeightNoteResponse> => {
    try {
      // Validate data before sending
      if (!data.weighbridgeReadingId)
        throw new Error("Weighbridge reading ID is required");
      if (!data.coffeeType) throw new Error("Coffee type is required");
      if (!data.moistureContent || data.moistureContent <= 0)
        throw new Error("Moisture content must be greater than 0");
      if (!data.pricePerKgUGX || data.pricePerKgUGX <= 0)
        throw new Error("Price per kg must be greater than 0");

      const authApi = await getAuthenticatedApi();
      const res = await authApi.post<BuyingWeightNoteResponse>(
        "/buying-weight-notes",
        data
      );

      if (!res.data.success) {
        throw new Error(
          res.data.error || "Failed to create buying weight note"
        );
      }

      if (!res.data.bwn) {
        throw new Error("No BWN data returned");
      }

      return {
        bwn: res.data.bwn,
        success: true,
      };
    } catch (error) {
      console.error("Error creating buying weight note:", error);
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.error ||
          error.response?.data?.details ||
          error.message ||
          "Failed to create buying weight note";
        throw new Error(errorMsg);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to create buying weight note");
    }
  },

  updateBuyingWeightNote: async (
    id: string,
    data: BuyingWeightNoteUpdateDTO
  ): Promise<BuyingWeightNoteResponse> => {
    try {
      if (!id) throw new Error("BWN ID is required");

      const authApi = await getAuthenticatedApi();
      const res = await authApi.patch<BuyingWeightNoteResponse>(
        `/buying-weight-notes/${id}`,
        data
      );

      if (!res.data.success) {
        throw new Error(
          res.data.error || "Failed to update buying weight note"
        );
      }

      if (!res.data.bwn) {
        throw new Error("No BWN data returned");
      }

      return {
        bwn: res.data.bwn,
        success: true,
      };
    } catch (error) {
      console.error("Error updating buying weight note:", error);
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.error ||
          error.response?.data?.details ||
          error.message ||
          "Failed to update buying weight note";
        throw new Error(errorMsg);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to update buying weight note");
    }
  },

  deleteBuyingWeightNote: async (id: string): Promise<{ success: boolean }> => {
    try {
      if (!id) throw new Error("BWN ID is required");

      const authApi = await getAuthenticatedApi();
      const res = await authApi.delete(`/buying-weight-notes/${id}`);

      if (!res.data.success) {
        throw new Error(
          res.data.error || "Failed to delete buying weight note"
        );
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting buying weight note:", error);
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.error ||
          error.response?.data?.details ||
          error.message ||
          "Failed to delete buying weight note";
        throw new Error(errorMsg);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to delete buying weight note");
    }
  },
};

// Hook to fetch buying weight notes with pagination and filters
export function useBuyingWeightNotes(
  page = 1,
  limit = 12,
  search = "",
  status = "",
  coffeeType = "",
  paymentStatus = ""
) {
  const { data, refetch, isError, error, isLoading } = useQuery({
    queryKey: buyingWeightNoteKeys.list({
      page,
      limit,
      search,
      status,
      coffeeType,
      paymentStatus,
    }),
    queryFn: () =>
      apiClient.getBuyingWeightNotes(
        page,
        limit,
        search,
        status,
        coffeeType,
        paymentStatus
      ),
    staleTime: 30000, // 30 seconds
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    bwns: data?.bwns || [],
    pagination: {
      total: data?.totalCount || 0,
      page: data?.currentPage || page,
      limit,
      totalPages: data?.totalPages || 1,
    },
    refetch,
    isError,
    // FIX: Only return error message if there actually is an error
    error: isError && error instanceof Error ? error.message : undefined,
    isLoading,
  };
}

// Hook to fetch single buying weight note
export function useBuyingWeightNote(id: string) {
  const { data, refetch, isError, error, isLoading } = useQuery({
    queryKey: buyingWeightNoteKeys.detail(id),
    queryFn: () => apiClient.getBuyingWeightNote(id),
    enabled: !!id,
    retry: 2,
  });

  return {
    bwn: data?.bwn,
    refetch,
    isError,
    error: error instanceof Error ? error.message : "Unknown error",
    isLoading,
  };
}

// Hook to fetch BWN stats
export function useBWNStats() {
  const { data, refetch, isError, error, isLoading } = useQuery({
    queryKey: buyingWeightNoteKeys.stats,
    queryFn: () => apiClient.getBWNStats(),
    staleTime: 60000, // 1 minute
    retry: 2,
  });

  return {
    stats: data?.stats,
    refetch,
    isError,
    error: error instanceof Error ? error.message : "Unknown error",
    isLoading,
  };
}

// Hook to create buying weight note
export function useCreateBuyingWeightNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BuyingWeightNoteCreateDTO) =>
      apiClient.createBuyingWeightNote(data),
    onSuccess: (data) => {
      toast.success("Buying weight note created successfully");
      // Invalidate and refetch buying weight notes list
      queryClient.invalidateQueries({
        queryKey: buyingWeightNoteKeys.lists(),
      });
      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: buyingWeightNoteKeys.stats,
      });
    },
    onError: (error: Error) => {
      const errorMsg = error.message || "Failed to create buying weight note";
      toast.error("Failed to create buying weight note", {
        description: errorMsg,
      });
    },
  });
}

// Hook to update buying weight note
export function useUpdateBuyingWeightNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: BuyingWeightNoteUpdateDTO;
    }) => apiClient.updateBuyingWeightNote(id, data),
    onSuccess: (data) => {
      toast.success("Buying weight note updated successfully");
      // Invalidate and refetch buying weight notes list
      queryClient.invalidateQueries({
        queryKey: buyingWeightNoteKeys.lists(),
      });
      // Invalidate specific BWN detail
      queryClient.invalidateQueries({
        queryKey: buyingWeightNoteKeys.detail(data.bwn.id),
      });
      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: buyingWeightNoteKeys.stats,
      });
    },
    onError: (error: Error) => {
      const errorMsg = error.message || "Failed to update buying weight note";
      toast.error("Failed to update buying weight note", {
        description: errorMsg,
      });
    },
  });
}

// Hook to delete buying weight note
export function useDeleteBuyingWeightNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteBuyingWeightNote(id),
    onSuccess: () => {
      toast.success("Buying weight note deleted successfully");
      // Invalidate and refetch buying weight notes list
      queryClient.invalidateQueries({
        queryKey: buyingWeightNoteKeys.lists(),
      });
      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: buyingWeightNoteKeys.stats,
      });
    },
    onError: (error: Error) => {
      const errorMsg = error.message || "Failed to delete buying weight note";
      toast.error("Failed to delete buying weight note", {
        description: errorMsg,
      });
    },
  });
}
