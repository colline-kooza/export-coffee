import { api, getAuthenticatedApi } from "@/config/axios";
import type {
  WeighbridgeReading,
  WeighbridgeReadingCreateDTO,
  PendingTruckEntry,
} from "@/types/weighbridge-reading";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface WeighbridgeReadingsResponse {
  readings: WeighbridgeReading[];
  success: boolean;
  error?: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

interface WeighbridgeReadingResponse {
  reading: WeighbridgeReading;
  success: boolean;
  error?: string;
}

interface PendingTruckEntriesResponse {
  entries: PendingTruckEntry[];
  success: boolean;
  error?: string;
  total?: number;
}

interface OfficerResponse {
  officers: Array<{ id: string; name: string; email: string }>;
  success: boolean;
  error?: string;
  total?: number;
}

// Query keys for caching
export const weighbridgeReadingKeys = {
  all: ["weighbridge-readings"] as const,
  lists: () => [...weighbridgeReadingKeys.all, "list"] as const,
  list: (filters: any) =>
    [...weighbridgeReadingKeys.lists(), { filters }] as const,
  details: () => [...weighbridgeReadingKeys.all, "detail"] as const,
  detail: (id: string) => [...weighbridgeReadingKeys.details(), id] as const,
  pendingEntries: ["pending-truck-entries"] as const,
  operators: ["operators"] as const,
};

const apiClient = {
  getWeighbridgeReadings: async (
    page = 1,
    limit = 10,
    search = ""
  ): Promise<WeighbridgeReadingsResponse> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });
      const authApi = await getAuthenticatedApi();

      const res = await authApi.get<WeighbridgeReadingsResponse>(
        `/weighbridge?${params}`
      );

      if (!res.data.success) {
        throw new Error(res.data.error || "Failed to fetch readings");
      }

      return {
        readings: Array.isArray(res.data.readings) ? res.data.readings : [],
        success: true,
        totalCount: res.data.totalCount || 0,
        currentPage: res.data.currentPage || page,
        totalPages: res.data.totalPages || 1,
      };
    } catch (error) {
      console.error("Error fetching weighbridge readings:", error);
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.error ||
          error.response?.data?.details ||
          error.message ||
          "Failed to fetch weighbridge readings";
        throw new Error(errorMsg);
      }
      throw error;
    }
  },

  getWeighbridgeReading: async (
    id: string
  ): Promise<WeighbridgeReadingResponse> => {
    try {
      if (!id) {
        throw new Error("Reading ID is required");
      }
      const authApi = await getAuthenticatedApi();

      const res = await authApi.get<WeighbridgeReadingResponse>(
        `/weighbridge/${id}`
      );

      if (!res.data.success) {
        throw new Error(res.data.error || "Failed to fetch reading");
      }

      if (!res.data.reading) {
        throw new Error("Reading not found");
      }

      return {
        reading: res.data.reading,
        success: true,
      };
    } catch (error) {
      console.error("Error fetching weighbridge reading:", error);
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.error ||
          error.response?.data?.details ||
          error.message ||
          "Failed to fetch weighbridge reading";
        throw new Error(errorMsg);
      }
      throw error;
    }
  },

  getPendingTruckEntries: async (): Promise<PendingTruckEntriesResponse> => {
    try {
      const authApi = await getAuthenticatedApi();

      const res = await authApi.get<PendingTruckEntriesResponse>(
        "/truck-entries-pending"
      );

      if (!res.data.success) {
        throw new Error(res.data.error || "Failed to fetch pending entries");
      }

      return {
        entries: Array.isArray(res.data.entries) ? res.data.entries : [],
        success: true,
        total: res.data.total || 0,
      };
    } catch (error) {
      console.error("Error fetching pending truck entries:", error);
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.error ||
          error.response?.data?.details ||
          error.message ||
          "Failed to fetch pending truck entries";
        throw new Error(errorMsg);
      }
      throw error;
    }
  },

  getOperators: async (): Promise<OfficerResponse> => {
    try {
      const authApi = await getAuthenticatedApi();

      const res = await authApi.get<OfficerResponse>("/simple-officers");

      // Handle both direct array response and object response
      if (Array.isArray(res.data)) {
        return {
          officers: res.data,
          success: true,
          total: res.data.length,
        };
      }

      if (!res.data.success) {
        throw new Error(res.data.error || "Failed to fetch officers");
      }

      return {
        officers: Array.isArray(res.data.officers) ? res.data.officers : [],
        success: true,
        total: res.data.total || 0,
      };
    } catch (error) {
      console.error("Error fetching operators:", error);
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.error ||
          error.response?.data?.details ||
          error.message ||
          "Failed to fetch operators";
        throw new Error(errorMsg);
      }
      throw error;
    }
  },

  createWeighbridgeReading: async (
    data: WeighbridgeReadingCreateDTO
  ): Promise<WeighbridgeReadingResponse> => {
    try {
      // Validate data before sending
      if (!data.entryId) throw new Error("Entry ID is required");
      if (!data.operatorId) throw new Error("Operator ID is required");
      if (!data.grossWeightKg || data.grossWeightKg <= 0)
        throw new Error("Gross weight must be greater than 0");
      if (!data.tareWeightKg || data.tareWeightKg <= 0)
        throw new Error("Tare weight must be greater than 0");
      if (data.grossWeightKg <= data.tareWeightKg)
        throw new Error("Gross weight must be greater than tare weight");

      const authApi = await getAuthenticatedApi();
      const res = await authApi.post<WeighbridgeReadingResponse>(
        "/weighbridge",
        data
      );

      if (!res.data.success) {
        throw new Error(res.data.error || "Failed to create reading");
      }

      if (!res.data.reading) {
        throw new Error("No reading data returned");
      }

      return {
        reading: res.data.reading,
        success: true,
      };
    } catch (error) {
      console.error("Error creating weighbridge reading:", error);
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.error ||
          error.response?.data?.details ||
          error.message ||
          "Failed to create weighbridge reading";
        throw new Error(errorMsg);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to create weighbridge reading");
    }
  },
};

// Hook to fetch weighbridge readings with pagination
export function useWeighbridgeReadings(page = 1, limit = 10, search = "") {
  const { data, refetch, isError, error, isLoading } = useQuery({
    queryKey: weighbridgeReadingKeys.list({ page, limit, search }),
    queryFn: () => apiClient.getWeighbridgeReadings(page, limit, search),
    staleTime: 30000, // 30 seconds
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    readings: data?.readings || [],
    pagination: {
      total: data?.totalCount || 0,
      page: data?.currentPage || page,
      limit,
      totalPages: data?.totalPages || 1,
    },
    refetch,
    isError,
    error: error instanceof Error ? error.message : "Unknown error",
    isLoading,
  };
}

// Hook to fetch single weighbridge reading
export function useWeighbridgeReading(id: string) {
  const { data, refetch, isError, error, isLoading } = useQuery({
    queryKey: weighbridgeReadingKeys.detail(id),
    queryFn: () => apiClient.getWeighbridgeReading(id),
    enabled: !!id,
    retry: 2,
  });

  return {
    reading: data?.reading,
    refetch,
    isError,
    error: error instanceof Error ? error.message : "Unknown error",
    isLoading,
  };
}

// Hook to fetch pending truck entries
export function usePendingTruckEntries() {
  const { data, refetch, isError, error, isLoading } = useQuery({
    queryKey: weighbridgeReadingKeys.pendingEntries,
    queryFn: () => apiClient.getPendingTruckEntries(),
    staleTime: 10000, // 10 seconds
    retry: 2,
  });

  return {
    entries: data?.entries || [],
    total: data?.total || 0,
    refetch,
    isError,
    error: error instanceof Error ? error.message : "Unknown error",
    isLoading,
  };
}

// Hook to fetch operators
export function useOperators() {
  const { data, refetch, isError, error, isLoading } = useQuery({
    queryKey: weighbridgeReadingKeys.operators,
    queryFn: () => apiClient.getOperators(),
    staleTime: 60000, // 1 minute
    retry: 2,
  });

  return {
    operators: data?.officers || [],
    total: data?.total || 0,
    refetch,
    isError,
    error: error instanceof Error ? error.message : "Unknown error",
    isLoading,
  };
}

// Hook to create weighbridge reading
export function useCreateWeighbridgeReading() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WeighbridgeReadingCreateDTO) =>
      apiClient.createWeighbridgeReading(data),
    onSuccess: (data) => {
      toast.success("Weighbridge reading recorded successfully");
      // Invalidate and refetch weighbridge readings list
      queryClient.invalidateQueries({
        queryKey: weighbridgeReadingKeys.lists(),
      });
      // Invalidate pending truck entries
      queryClient.invalidateQueries({
        queryKey: weighbridgeReadingKeys.pendingEntries,
      });
    },
    onError: (error: Error) => {
      const errorMsg = error.message || "Failed to record weighbridge reading";
      toast.error("Failed to record weighbridge reading", {
        description: errorMsg,
      });
    },
  });
}
