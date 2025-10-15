/**
 * Permission Constants and Utilities
 * Centralized permission definitions for the application
 */

// ============================================
// PERMISSION CONSTANTS
// ============================================

export const PERMISSIONS = {
  // Dashboard
  DASHBOARD: {
    VIEW: "dashboard.view",
  },

  // Institutions
  INSTITUTIONS: {
    VIEW: "institutions.view",
    CREATE: "institutions.create",
    UPDATE: "institutions.update",
    DELETE: "institutions.delete",
  },

  // Branches
  BRANCHES: {
    VIEW: "branches.view",
    CREATE: "branches.create",
    UPDATE: "branches.update",
    DELETE: "branches.delete",
  },

  // Borrowers
  BORROWERS: {
    VIEW: "borrowers.view",
    CREATE: "borrowers.create",
    UPDATE: "borrowers.update",
    DELETE: "borrowers.delete",
  },

  // Loans
  LOANS: {
    VIEW: "loans.view",
    CREATE: "loans.create",
    UPDATE: "loans.update",
    DELETE: "loans.delete",
    APPROVE: "loans.approve",
    DISBURSE: "loans.disburse",
  },

  // Loan Products
  LOAN_PRODUCTS: {
    VIEW: "loan-products.view",
    CREATE: "loan-products.create",
    UPDATE: "loan-products.update",
    DELETE: "loan-products.delete",
  },

  // Loan Requests
  LOAN_REQUESTS: {
    VIEW: "loan-requests.view",
    APPROVE: "loan-requests.approve",
    REJECT: "loan-requests.reject",
  },

  // Repayments
  REPAYMENTS: {
    VIEW: "repayments.view",
    CREATE: "repayments.create",
    UPDATE: "repayments.update",
    DELETE: "repayments.delete",
  },

  // Accounting
  ACCOUNTING: {
    VIEW: "accounting.view",
    CREATE: "accounting.create",
    UPDATE: "accounting.update",
    DELETE: "accounting.delete",
    JOURNAL_ENTRIES: "accounting.journal-entries",
    REPORTS: "accounting.reports",
  },

  // Accounts
  ACCOUNTS: {
    VIEW: "accounts.view",
    CREATE: "accounts.create",
    UPDATE: "accounts.update",
    DELETE: "accounts.delete",
  },

  // Staff
  STAFF: {
    VIEW: "staff.view",
    CREATE: "staff.create",
    UPDATE: "staff.update",
    DELETE: "staff.delete",
  },

  // Roles & Permissions
  ROLES: {
    VIEW: "roles.view",
    CREATE: "roles.create",
    UPDATE: "roles.update",
    DELETE: "roles.delete",
  },

  PERMISSIONS_MANAGE: "permissions.manage",

  // Settings
  SETTINGS: {
    VIEW: "settings.view",
    UPDATE: "settings.update",
  },

  // Reports
  REPORTS: {
    VIEW: "reports.view",
    EXPORT: "reports.export",
  },

  // Notifications
  NOTIFICATIONS: {
    VIEW: "notifications.view",
    MANAGE: "notifications.manage",
  },

  // Audit Logs
  AUDIT_LOGS: {
    VIEW: "audit-logs.view",
  },
} as const;

// ============================================
// ROLE CONSTANTS
// ============================================

export const ROLES = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  LOAN_OFFICER: "Loan Officer",
  AUDITOR: "Auditor",
} as const;

// ============================================
// PERMISSION GROUPS
// ============================================

/**
 * Common permission groups for easier checking
 */
export const PERMISSION_GROUPS = {
  // Full CRUD operations
  LOANS_FULL_ACCESS: [
    PERMISSIONS.LOANS.VIEW,
    PERMISSIONS.LOANS.CREATE,
    PERMISSIONS.LOANS.UPDATE,
    PERMISSIONS.LOANS.DELETE,
    PERMISSIONS.LOANS.APPROVE,
    PERMISSIONS.LOANS.DISBURSE,
  ],

  // Loan management (view, create, update)
  LOANS_MANAGE: [
    PERMISSIONS.LOANS.VIEW,
    PERMISSIONS.LOANS.CREATE,
    PERMISSIONS.LOANS.UPDATE,
  ],

  // View-only access
  LOANS_VIEW_ONLY: [PERMISSIONS.LOANS.VIEW],

  // Borrower management
  BORROWERS_MANAGE: [
    PERMISSIONS.BORROWERS.VIEW,
    PERMISSIONS.BORROWERS.CREATE,
    PERMISSIONS.BORROWERS.UPDATE,
  ],

  // Accounting access
  ACCOUNTING_FULL: [
    PERMISSIONS.ACCOUNTING.VIEW,
    PERMISSIONS.ACCOUNTING.CREATE,
    PERMISSIONS.ACCOUNTING.UPDATE,
    PERMISSIONS.ACCOUNTING.DELETE,
    PERMISSIONS.ACCOUNTING.JOURNAL_ENTRIES,
    PERMISSIONS.ACCOUNTING.REPORTS,
  ],

  // Read-only accounting
  ACCOUNTING_READ: [
    PERMISSIONS.ACCOUNTING.VIEW,
    PERMISSIONS.ACCOUNTING.REPORTS,
  ],

  // Admin operations
  ADMIN_OPERATIONS: [
    PERMISSIONS.INSTITUTIONS.VIEW,
    PERMISSIONS.BRANCHES.VIEW,
    PERMISSIONS.STAFF.VIEW,
    PERMISSIONS.ROLES.VIEW,
    PERMISSIONS.SETTINGS.VIEW,
  ],
} as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get all permissions as a flat array
 */
export function getAllPermissions(): string[] {
  const permissions: string[] = [];

  const extractPermissions = (obj: any) => {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        permissions.push(obj[key]);
      } else if (typeof obj[key] === "object") {
        extractPermissions(obj[key]);
      }
    }
  };

  extractPermissions(PERMISSIONS);
  return permissions;
}

/**
 * Get permissions by category
 */
export function getPermissionsByCategory(category: string): string[] {
  const categoryKey = category.toUpperCase().replace(/-/g, "_");
  const categoryPermissions = (PERMISSIONS as any)[categoryKey];

  if (!categoryPermissions) {
    return [];
  }

  return Object.values(categoryPermissions).filter(
    (value) => typeof value === "string"
  ) as string[];
}

/**
 * Check if a permission string is valid
 */
export function isValidPermission(permission: string): boolean {
  const allPermissions = getAllPermissions();
  return allPermissions.includes(permission);
}

/**
 * Get human-readable permission name
 */
export function getPermissionLabel(permission: string): string {
  const parts = permission.split(".");
  if (parts.length !== 2) return permission;

  const [category, action] = parts;
  const categoryLabel = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const actionLabel = action.charAt(0).toUpperCase() + action.slice(1);

  return `${categoryLabel} - ${actionLabel}`;
}

/**
 * Get all permissions grouped by category
 */
export function getPermissionsGrouped(): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};

  const allPermissions = getAllPermissions();
  allPermissions.forEach((permission) => {
    const [category] = permission.split(".");
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(permission);
  });

  return grouped;
}

/**
 * Check if user has permission to perform CRUD operation
 */
export function canPerformCRUD(
  userPermissions: string[],
  resource: string,
  operation: "create" | "view" | "update" | "delete"
): boolean {
  const permission = `${resource}.${operation}`;
  return userPermissions.includes(permission);
}

/**
 * Get missing permissions from required set
 */
export function getMissingPermissions(
  userPermissions: string[],
  requiredPermissions: string[]
): string[] {
  return requiredPermissions.filter((perm) => !userPermissions.includes(perm));
}

/**
 * Format permissions for display in UI
 */
export function formatPermissionsForDisplay(
  permissions: string[]
): Array<{ category: string; action: string; label: string }> {
  return permissions.map((permission) => {
    const [category, action] = permission.split(".");
    return {
      category,
      action,
      label: getPermissionLabel(permission),
    };
  });
}

// ============================================
// TYPE EXPORTS
// ============================================

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export type Role = (typeof ROLES)[keyof typeof ROLES];
export type PermissionString = string;

// Helper type to extract all permission values
type ExtractPermissions<T> = T extends string
  ? T
  : T extends object
  ? ExtractPermissions<T[keyof T]>
  : never;

export type AllPermissions = ExtractPermissions<typeof PERMISSIONS>;
