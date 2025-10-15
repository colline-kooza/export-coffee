"server only";
import db from "@/prisma/db";
import { cookies } from "next/headers";

import { cache } from "react";

export interface BranchSession {
  branchId: string;
  branchName: string;
  institutionId: string;
  institutionName: string;
  staffId: string;
  role: string;
  userId: string;
}

export interface StaffWithRelations {
  id: string;
  userId: string;
  roleId: string;
  branchId: string;
  isActive: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  role: {
    id: string;
    name: string;
    description: string | null;
    permissions: {
      permission: {
        id: string;
        name: string;
        category: string;
        action: string;
      };
    }[];
  };
  branch: {
    id: string;
    name: string;
    location: string | null;
    isActive: boolean;
    institution: {
      id: string;
      name: string;
      email: string;
    };
  };
}

/**
 * Get branch session from cookie
 * Server-side only - use cache for deduplication within single request
 */
export const getBranchSession = cache(
  async (): Promise<BranchSession | null> => {
    try {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get("branch-session");

      if (!sessionCookie || !sessionCookie.value) {
        return null;
      }

      const session: BranchSession = JSON.parse(sessionCookie.value);
      return session;
    } catch (error) {
      console.error("Error getting branch session:", error);
      return null;
    }
  }
);

/**
 * Get current staff details with all relations
 * Cached per request for performance
 */
export const getCurrentStaff = cache(
  async (): Promise<StaffWithRelations | null> => {
    try {
      const session = await getBranchSession();
      if (!session) {
        return null;
      }

      const staff = await db.staff.findUnique({
        where: {
          id: session.staffId,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          role: {
            include: {
              permissions: {
                include: {
                  permission: {
                    select: {
                      id: true,
                      name: true,
                      category: true,
                      action: true,
                    },
                  },
                },
              },
            },
          },
          branch: {
            include: {
              institution: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!staff || !staff.isActive) {
        return null;
      }

      return staff;
    } catch (error) {
      console.error("Error getting current staff:", error);
      return null;
    }
  }
);

/**
 * Get all branches accessible by current user
 * Cached per request
 */
export const getUserBranches = cache(async () => {
  try {
    const session = await getBranchSession();
    if (!session) {
      return [];
    }

    const branches = await db.staff.findMany({
      where: {
        userId: session.userId,
        isActive: true,
        branch: {
          isActive: true,
        },
      },
      include: {
        branch: {
          include: {
            institution: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return branches.map((staff) => ({
      branchId: staff.branch.id,
      branchName: staff.branch.name,
      branchLocation: staff.branch.location,
      institutionId: staff.branch.institution.id,
      institutionName: staff.branch.institution.name,
      staffId: staff.id,
      role: staff.role.name,
      isActive: staff.branch.isActive,
    }));
  } catch (error) {
    console.error("Error getting user branches:", error);
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
      const staff = await getCurrentStaff();
      if (!staff) {
        return false;
      }

      // Check if user's role has the permission
      const hasAccess = staff.role.permissions.some(
        (rp) => rp.permission.name === permissionName
      );

      return hasAccess;
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
      const staff = await getCurrentStaff();
      if (!staff) {
        return false;
      }

      const hasAccess = staff.role.permissions.some((rp) =>
        permissionNames.includes(rp.permission.name)
      );

      return hasAccess;
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
      const staff = await getCurrentStaff();
      if (!staff) {
        return false;
      }

      const userPermissions = staff.role.permissions.map(
        (rp) => rp.permission.name
      );
      const hasAll = permissionNames.every((perm) =>
        userPermissions.includes(perm)
      );

      return hasAll;
    } catch (error) {
      console.error("Error checking permissions:", error);
      return false;
    }
  }
);

/**
 * Get all permissions for current user
 * Returns array of permission names
 */
export const getUserPermissions = cache(async (): Promise<string[]> => {
  try {
    const staff = await getCurrentStaff();
    if (!staff) {
      return [];
    }

    return staff.role.permissions.map((rp) => rp.permission.name);
  } catch (error) {
    console.error("Error getting user permissions:", error);
    return [];
  }
});

/**
 * Check if current user is Admin
 */
export const isAdmin = cache(async (): Promise<boolean> => {
  try {
    const staff = await getCurrentStaff();
    if (!staff) {
      return false;
    }

    return staff.role.name === "Admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
});

/**
 * Check if current user has a specific role
 */
export const hasRole = cache(async (roleName: string): Promise<boolean> => {
  try {
    const staff = await getCurrentStaff();
    if (!staff) {
      return false;
    }

    return staff.role.name === roleName;
  } catch (error) {
    console.error("Error checking role:", error);
    return false;
  }
});

/**
 * Check if current user has any of the specified roles
 */
export const hasAnyRole = cache(
  async (roleNames: string[]): Promise<boolean> => {
    try {
      const staff = await getCurrentStaff();
      if (!staff) {
        return false;
      }

      return roleNames.includes(staff.role.name);
    } catch (error) {
      console.error("Error checking roles:", error);
      return false;
    }
  }
);
