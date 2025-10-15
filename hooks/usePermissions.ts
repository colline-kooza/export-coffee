import { useQuery } from "@tanstack/react-query";
import { api } from "@/config/axios";
import { useMemo } from "react";

interface StaffPermissionsResponse {
  success: boolean;
  data: {
    staff: {
      id: string;
      userId: string;
      isActive: boolean;
      role: {
        id: string;
        name: string;
        description: string | null;
      };
      branch: {
        id: string;
        name: string;
        location: string | null;
        institution: {
          id: string;
          name: string;
        };
      };
      permissions: string[];
    };
    session: {
      branchId: string;
      branchName: string;
      institutionId: string;
      institutionName: string;
      staffId: string;
      role: string;
    };
  };
  error?: string;
}

interface UserBranchesResponse {
  success: boolean;
  data: Array<{
    branchId: string;
    branchName: string;
    branchLocation: string | null;
    institutionId: string;
    institutionName: string;
    staffId: string;
    role: string;
    isActive: boolean;
  }>;
  error?: string;
}

// Query keys for caching
export const permissionKeys = {
  all: ["permissions"] as const,
  current: () => [...permissionKeys.all, "current"] as const,
  branches: () => [...permissionKeys.all, "branches"] as const,
};

const apiClient = {
  /**
   * Get current staff permissions and session
   */
  getCurrentPermissions: async (): Promise<StaffPermissionsResponse> => {
    try {
      const res = await api.get("/permissions/current");
      return res.data;
    } catch (error: any) {
      console.error("Error fetching permissions:", error);
      throw new Error(
        error.response?.data?.error || "Failed to fetch permissions"
      );
    }
  },

  /**
   * Get all branches accessible by current user
   */
  getUserBranches: async (): Promise<UserBranchesResponse> => {
    try {
      const res = await api.get("/permissions/branches");
      return res.data;
    } catch (error: any) {
      console.error("Error fetching branches:", error);
      throw new Error(
        error.response?.data?.error || "Failed to fetch branches"
      );
    }
  },
};

/**
 * Hook to get current staff permissions and session
 * This is the base hook - all other hooks should use this
 */
export function useCurrentPermissions() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: permissionKeys.current(),
    queryFn: () => apiClient.getCurrentPermissions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  return useMemo(
    () => ({
      staff: data?.data?.staff || null,
      session: data?.data?.session || null,
      permissions: data?.data?.staff?.permissions || [],
      role: data?.data?.staff?.role?.name || null,
      isLoading,
      isError,
      error,
      refetch,
    }),
    [data, isLoading, isError, error, refetch]
  );
}

/**
 * Hook to check if user has a specific permission
 * Returns an object with permission status and loading state
 */
export function useHasPermission(permissionName: string) {
  const { permissions, isLoading } = useCurrentPermissions();

  return useMemo(
    () => ({
      hasPermission: !isLoading && permissions.includes(permissionName),
      isLoading,
    }),
    [permissions, isLoading, permissionName]
  );
}

/**
 * Hook to check if user has any of the specified permissions
 * Returns an object with permission status and loading state
 */
export function useHasAnyPermission(permissionNames: string[]) {
  const { permissions, isLoading } = useCurrentPermissions();

  return useMemo(
    () => ({
      hasPermission:
        !isLoading &&
        permissionNames.some((perm) => permissions.includes(perm)),
      isLoading,
    }),
    [permissions, isLoading, permissionNames]
  );
}

/**
 * Hook to check if user has all of the specified permissions
 * Returns an object with permission status and loading state
 */
export function useHasAllPermissions(permissionNames: string[]) {
  const { permissions, isLoading } = useCurrentPermissions();

  return useMemo(
    () => ({
      hasPermission:
        !isLoading &&
        permissionNames.every((perm) => permissions.includes(perm)),
      isLoading,
    }),
    [permissions, isLoading, permissionNames]
  );
}

/**
 * Hook to check if user has a specific role
 * Returns an object with role status and loading state
 */
export function useHasRole(roleName: string) {
  const { role, isLoading } = useCurrentPermissions();

  return useMemo(
    () => ({
      hasRole: !isLoading && role === roleName,
      isLoading,
    }),
    [role, isLoading, roleName]
  );
}

/**
 * Hook to check if user has any of the specified roles
 * Returns an object with role status and loading state
 */
export function useHasAnyRole(roleNames: string[]) {
  const { role, isLoading } = useCurrentPermissions();

  return useMemo(
    () => ({
      hasRole: !isLoading && role ? roleNames.includes(role) : false,
      isLoading,
    }),
    [role, isLoading, roleNames]
  );
}

/**
 * Hook to check if user is Admin
 * Returns an object with admin status and loading state
 */
export function useIsAdmin() {
  const { role, isLoading } = useCurrentPermissions();

  return useMemo(
    () => ({
      isAdmin: !isLoading && role === "Admin",
      isLoading,
    }),
    [role, isLoading]
  );
}

/**
 * Hook to get all branches accessible by current user
 */
export function useUserBranches() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: permissionKeys.branches(),
    queryFn: () => apiClient.getUserBranches(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return useMemo(
    () => ({
      branches: data?.data || [],
      isLoading,
      isError,
      error,
      refetch,
    }),
    [data, isLoading, isError, error, refetch]
  );
}

/**
 * Hook to get current branch session
 */
export function useCurrentBranch() {
  const { session, isLoading } = useCurrentPermissions();

  return useMemo(
    () => ({
      branchId: session?.branchId || null,
      branchName: session?.branchName || null,
      institutionId: session?.institutionId || null,
      institutionName: session?.institutionName || null,
      staffId: session?.staffId || null,
      role: session?.role || null,
      isLoading,
    }),
    [session, isLoading]
  );
}

/**
 * Hook to check if user can access multiple branches
 */
export function useCanSwitchBranches() {
  const { branches, isLoading: branchesLoading } = useUserBranches();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();

  return useMemo(
    () => ({
      canSwitch:
        !branchesLoading && !adminLoading && (branches.length > 1 || isAdmin),
      branchCount: branches.length,
      isLoading: branchesLoading || adminLoading,
    }),
    [branches, isAdmin, branchesLoading, adminLoading]
  );
}
