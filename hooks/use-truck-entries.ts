import { api, getAuthenticatedApi } from "@/config/axios";
import { Trader, TruckEntry, TruckEntryCreateDTO } from "@/types/truck-entry";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface TruckEntriesResponse {
  entries: TruckEntry[];
  success: boolean;
  error?: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

interface TruckEntryResponse {
  entry: TruckEntry;
  success: boolean;
  error?: string;
}

interface TradersResponse {
  traders: Trader[];
  success: boolean;
  error?: string;
}

interface OfficerResponse {
  officers: Trader[];
  success: boolean;
  error?: string;
}

// Query keys for caching
export const truckEntryKeys = {
  all: ["truck-entries"] as const,
  lists: () => [...truckEntryKeys.all, "list"] as const,
  list: (filters: any) => [...truckEntryKeys.lists(), { filters }] as const,
  details: () => [...truckEntryKeys.all, "detail"] as const,
  detail: (id: string) => [...truckEntryKeys.details(), id] as const,
  traders: ["traders"] as const,
  securityOfficers: ["officers"] as const,
};

const apiClient = {
  getTruckEntries: async (
    page = 1,
    limit = 10,
    search = ""
  ): Promise<TruckEntriesResponse> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const res = await api.get(`/truck-entries?${params}`);

      return {
        entries: res.data.entries || [],
        success: res.data.success || true,
        totalCount: res.data.totalCount || 0,
        currentPage: res.data.currentPage || page,
        totalPages: res.data.totalPages || 1,
      };
    } catch (error) {
      console.error("Error fetching truck entries:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Failed to fetch truck entries"
        );
      }
      throw new Error("Failed to fetch truck entries");
    }
  },

  getTruckEntry: async (id: string): Promise<TruckEntryResponse> => {
    try {
      const res = await api.get(`/truck-entries/${id}`);
      return {
        entry: res.data.entry,
        success: res.data.success || true,
      };
    } catch (error) {
      console.error("Error fetching truck entry:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Failed to fetch truck entry"
        );
      }
      throw new Error("Failed to fetch truck entry");
    }
  },

  getTraders: async (): Promise<TradersResponse> => {
    try {
      const res = await api.get("/simple-traders");
      return {
        traders: res.data.traders || [],
        success: true,
      };
    } catch (error) {
      console.error("Error fetching traders:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Failed to fetch traders"
        );
      }
      throw new Error("Failed to fetch traders");
    }
  },

  // FIXED: Correctly handle the officers response
  getOfficers: async (): Promise<OfficerResponse> => {
    try {
      const res = await api.get("/simple-officers");
      // The API returns officers directly as an array, not wrapped in { traders }
      return {
        officers: Array.isArray(res.data) ? res.data : [],
        success: true,
      };
    } catch (error) {
      console.error("Error fetching officers:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Failed to fetch officers"
        );
      }
      throw new Error("Failed to fetch officers");
    }
  },

  createTruckEntry: async (
    data: TruckEntryCreateDTO
  ): Promise<TruckEntryResponse> => {
    try {
      const authApi = await getAuthenticatedApi();
      // Convert null to undefined for driverPhone
      const payload = {
        ...data,
        driverPhone: data.driverPhone || undefined,
      };
      const res = await authApi.post("/truck-entries", payload);
      return {
        entry: res.data.entry,
        success: res.data.success || true,
      };
    } catch (error) {
      console.error("Error creating truck entry:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Failed to create truck entry"
        );
      }
      throw new Error("Failed to create truck entry");
    }
  },
};

// Hook to fetch truck entries with pagination
export function useTruckEntries(page = 1, limit = 10, search = "") {
  const { data, refetch, isError, error, isLoading } = useQuery({
    queryKey: truckEntryKeys.list({ page, limit, search }),
    queryFn: () => apiClient.getTruckEntries(page, limit, search),
    staleTime: 30000, // 30 seconds
  });

  return {
    entries: data?.entries || [],
    pagination: {
      total: data?.totalCount || 0,
      page: data?.currentPage || page,
      limit,
      totalPages: data?.totalPages || 1,
    },
    refetch,
    isError,
    error,
    isLoading,
  };
}

// Hook to fetch single truck entry
export function useTruckEntry(id: string) {
  const { data, refetch, isError, error, isLoading } = useQuery({
    queryKey: truckEntryKeys.detail(id),
    queryFn: () => apiClient.getTruckEntry(id),
    enabled: !!id,
  });

  return {
    entry: data?.entry,
    refetch,
    isError,
    error,
    isLoading,
  };
}

// Hook to fetch traders
export function useTraders() {
  const { data, refetch, isError, error, isLoading } = useQuery({
    queryKey: truckEntryKeys.traders,
    queryFn: () => apiClient.getTraders(),
    staleTime: 60000, // 1 minute
  });

  return {
    traders: data?.traders || [],
    refetch,
    isError,
    error,
    isLoading,
  };
}

// Hook to fetch security officers
export function useSecurityOfficers() {
  const { data, refetch, isError, error, isLoading } = useQuery({
    queryKey: truckEntryKeys.securityOfficers,
    queryFn: () => apiClient.getOfficers(),
    staleTime: 60000,
  });

  return {
    officers: data?.officers || [],
    refetch,
    isError,
    error,
    isLoading,
  };
}

// Hook to create truck entry
export function useCreateTruckEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TruckEntryCreateDTO) => apiClient.createTruckEntry(data),
    onSuccess: (data) => {
      toast.success("Truck entry registered successfully");
      // Invalidate and refetch truck entries list
      queryClient.invalidateQueries({ queryKey: truckEntryKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error("Failed to register truck entry", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
}
