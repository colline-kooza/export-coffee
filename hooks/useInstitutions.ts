import { api, getAuthenticatedApi } from "@/config/axios";
// import { Institution } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

// Institution DTO for create/update operations
export interface InstitutionCreateDTO {
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  logo?: string | null;
  website?: string | null;
  financialYearStart?: Date | string;
}

interface IInstitutionResponse {
  data: any[] | null;
  success: boolean;
  error?: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
}

// Query keys for caching
export const institutionKeys = {
  all: ["institutions"] as const,
  lists: () => [...institutionKeys.all, "list"] as const,
  list: (filters: any) => [...institutionKeys.lists(), { filters }] as const,
  details: () => [...institutionKeys.all, "detail"] as const,
  detail: (id: string) => [...institutionKeys.details(), id] as const,
};

const apiClient = {
  getInstitutions: async (): Promise<IInstitutionResponse> => {
    try {
      const res = await api.get("/institutions");
      const response_data = res?.data?.data;
      const pagination = res?.data?.pagination;

      return {
        success: true,
        data: response_data,
        pagination,
        error: null,
      };
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Failed to fetch institutions"
        );
      }
      return {
        success: false,
        error: "Failed to fetch institutions",
        data: null,
        pagination: null,
      };
    }
  },

  createInstitution: async (data: InstitutionCreateDTO) => {
    const api = await getAuthenticatedApi();
    try {
      const res = await api.post("/institutions", data);
      return {
        success: true,
        data: res.data.data,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: "Failed to create institution",
        data: null,
      };
    }
  },

  updateInstitution: async (
    id: string,
    data: Partial<InstitutionCreateDTO>
  ) => {
    const api = await getAuthenticatedApi();
    try {
      const res = await api.patch(`/institutions/${id}`, data);
      return {
        success: true,
        data: res.data.data,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: "Failed to update institution",
        data: null,
      };
    }
  },

  deleteInstitution: async (id: string) => {
    const api = await getAuthenticatedApi();
    try {
      const res = await api.delete(`/institutions/${id}`);
      return {
        success: true,
        data: res.data.data,
        error: null,
      };
    } catch (error) {
      console.log("Delete error:", error);
      return {
        success: false,
        error: "Failed to delete institution",
        data: null,
      };
    }
  },
};

// Hook to fetch all institutions
export function useInstitutions() {
  const {
    data: institutions,
    refetch,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: institutionKeys.lists(),
    queryFn: () => apiClient.getInstitutions(),
  });

  return {
    institutions: institutions?.data || [],
    pagination: institutions?.pagination,
    refetch,
    isError,
    error,
    isLoading,
  };
}

// Hook to create institution
export function useCreateInstitution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InstitutionCreateDTO) =>
      apiClient.createInstitution(data),
    onSuccess: () => {
      toast.success("Institution created successfully");
      queryClient.invalidateQueries({ queryKey: institutionKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error("Failed to create institution", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
}

// Hook to update institution
export function useUpdateInstitution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<InstitutionCreateDTO>;
    }) => apiClient.updateInstitution(id, data),
    onSuccess: (result, variables) => {
      toast.success("Institution updated successfully");
      queryClient.invalidateQueries({ queryKey: institutionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: institutionKeys.detail(variables.id),
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to update institution", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
}

// Hook to delete institution
export function useDeleteInstitution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteInstitution(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: institutionKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete institution", {
        description: error.message || "Unknown error occurred",
      });
    },
  });
}
