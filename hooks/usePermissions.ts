"use client";

import { useEffect, useState } from "react";

interface PermissionsState {
  permissions: string[];
  role: string | null;
  isLoading: boolean;
}

/**
 * Client-side hook to access user permissions
 * Note: Initial data should be passed from server to avoid loading state
 */
export function useCurrentPermissions(
  initialPermissions?: string[],
  initialRole?: string
) {
  const [state, setState] = useState<PermissionsState>({
    permissions: initialPermissions || [],
    role: initialRole || null,
    isLoading: !initialPermissions,
  });

  useEffect(() => {
    // If we have initial permissions, don't fetch
    if (initialPermissions) {
      return;
    }

    // Fetch permissions from API endpoint
    async function fetchPermissions() {
      try {
        const response = await fetch("/api/user/permissions");
        if (response.ok) {
          const data = await response.json();
          setState({
            permissions: data.permissions || [],
            role: data.role || null,
            isLoading: false,
          });
        } else {
          setState({
            permissions: [],
            role: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
        setState({
          permissions: [],
          role: null,
          isLoading: false,
        });
      }
    }

    fetchPermissions();
  }, [initialPermissions]);

  return state;
}

/**
 * Check if user has specific permission
 */
export function useHasPermission(
  permission: string,
  userPermissions: string[]
): boolean {
  return userPermissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export function useHasAnyPermission(
  permissions: string[],
  userPermissions: string[]
): boolean {
  return permissions.some((perm) => userPermissions.includes(perm));
}

/**
 * Check if user has all of the specified permissions
 */
export function useHasAllPermissions(
  permissions: string[],
  userPermissions: string[]
): boolean {
  return permissions.every((perm) => userPermissions.includes(perm));
}
