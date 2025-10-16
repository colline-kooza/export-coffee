"server only";
import db from "@/prisma/db";
import { auth } from "@/lib/auth";
import { cache } from "react";
import { ROLES_PERMISSIONS, type UserRole } from "@/lib/permissions";

export interface UserWithPermissions {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
}

/**
 * Get current authenticated user with permissions
 * Server-side only - cached per request
 */
export const getCurrentUser = cache(
  async (): Promise<UserWithPermissions | null> => {
    try {
      const session = await auth.api.getSession({
        headers: await import("next/headers").then((mod) => mod.headers()),
      });

      if (!session || !session.user) {
        return null;
      }

      const user = await db.user.findUnique({
        where: {
          id: session.user.id,
        },
        select: {
          id: true,
          email: true,
          name: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });

      if (!user || !user.isActive) {
        return null;
      }

      // Type assertion to ensure role is properly typed as UserRole
      const userRole = user.role as UserRole;

      // Get permissions based on role
      const permissions = ROLES_PERMISSIONS[userRole]?.permissions || [];

      return {
        ...user,
        role: userRole,
        permissions: [...permissions],
      };
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }
);

/**
 * Get user permissions array
 * Cached per request
 */
export const getUserPermissions = cache(async (): Promise<string[]> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return [];
    }

    return user.permissions;
  } catch (error) {
    console.error("Error getting user permissions:", error);
    return [];
  }
});

/**
 * Check if current user has a specific permission
 * Cached per request
 */
export const hasPermission = cache(
  async (permissionName: string): Promise<boolean> => {
    try {
      const permissions = await getUserPermissions();
      return permissions.includes(permissionName);
    } catch (error) {
      console.error("Error checking permission:", error);
      return false;
    }
  }
);

/**
 * Check if current user has any of the specified permissions
 */
export const hasAnyPermission = cache(
  async (permissionNames: string[]): Promise<boolean> => {
    try {
      const permissions = await getUserPermissions();
      return permissionNames.some((perm) => permissions.includes(perm));
    } catch (error) {
      console.error("Error checking permissions:", error);
      return false;
    }
  }
);

/**
 * Check if current user has all of the specified permissions
 */
export const hasAllPermissions = cache(
  async (permissionNames: string[]): Promise<boolean> => {
    try {
      const permissions = await getUserPermissions();
      return permissionNames.every((perm) => permissions.includes(perm));
    } catch (error) {
      console.error("Error checking permissions:", error);
      return false;
    }
  }
);

/**
 * Check if current user is System Admin
 */
export const isSystemAdmin = cache(async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return false;
    }

    return user.role === "SYSTEM_ADMIN";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
});

/**
 * Check if current user has a specific role
 */
export const hasRole = cache(async (roleName: UserRole): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return false;
    }

    return user.role === roleName;
  } catch (error) {
    console.error("Error checking role:", error);
    return false;
  }
});

/**
 * Check if current user has any of the specified roles
 */
export const hasAnyRole = cache(
  async (roleNames: UserRole[]): Promise<boolean> => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return false;
      }

      return roleNames.includes(user.role);
    } catch (error) {
      console.error("Error checking roles:", error);
      return false;
    }
  }
);

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<UserWithPermissions> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Require specific permission - throws if not authorized
 */
export async function requirePermission(permissionName: string): Promise<void> {
  const hasAccess = await hasPermission(permissionName);
  if (!hasAccess) {
    throw new Error(`Unauthorized: Missing permission '${permissionName}'`);
  }
}

/**
 * Require any of the specified permissions - throws if not authorized
 */
export async function requireAnyPermission(
  permissionNames: string[]
): Promise<void> {
  const hasAccess = await hasAnyPermission(permissionNames);
  if (!hasAccess) {
    throw new Error(
      `Unauthorized: Missing required permissions: ${permissionNames.join(", ")}`
    );
  }
}

/**
 * Require specific role - throws if not authorized
 */
export async function requireRole(roleName: UserRole): Promise<void> {
  const hasAccess = await hasRole(roleName);
  if (!hasAccess) {
    throw new Error(`Unauthorized: Required role '${roleName}'`);
  }
}
