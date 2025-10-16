/**
 * COFFEE MANAGEMENT SYSTEM - Permissions & Roles
 * Centralized permission definitions for role-based access control
 */

// ============================================
// ROLE DEFINITIONS WITH PERMISSIONS
// ============================================

export const ROLES_PERMISSIONS = {
  SYSTEM_ADMIN: {
    label: "System Admin",
    description: "Full system access",
    permissions: [
      // User Management
      "users.view",
      "users.create",
      "users.update",
      "users.delete",
      "roles.manage",
      "permissions.manage",
      "user.manage",
      // "kooza.view",

      // Trader Management
      "traders.view",
      "traders.create",
      "traders.update",
      "traders.delete",
      "traders.approve",

      // Procurement & Buying
      "buying.view",
      "buying.create",
      "buying.approve",
      "buying.payment",

      // Quality Control
      "quality.view",
      "quality.create",
      "quality.approve",

      // Inventory
      "inventory.view",
      "inventory.create",
      "inventory.update",
      "inventory.adjust",

      // Drying & Processing
      "drying.view",
      "drying.create",
      "drying.manage",

      // Export Orders
      "export.view",
      "export.create",
      "export.manage",
      "export.approve",

      // Transport & Logistics
      "transport.view",
      "transport.create",
      "transport.manage",

      // Financial
      "payments.view",
      "payments.create",
      "payments.approve",
      "reports.view",
      "reports.export",

      // System
      "audit.view",
      "alerts.manage",
      "settings.view",
      "settings.update",
    ],
  },

  PROCUREMENT_QUALITY_MANAGER: {
    label: "Procurement & Quality Manager",
    description: "Manages procurement and quality control",
    permissions: [
      // Trader Management
      "traders.view",
      "traders.create",
      "traders.update",

      // Buying
      "buying.view",
      "buying.create",
      "buying.approve",

      // Quality Control
      "quality.view",
      "quality.create",
      "quality.approve",

      // Inventory
      "inventory.view",
      "inventory.create",

      // Reports
      "reports.view",
      "reports.export",
    ],
  },

  WAREHOUSE_INVENTORY_OFFICER: {
    label: "Warehouse & Inventory Officer",
    description: "Manages warehouse operations and inventory",
    permissions: [
      // Inventory
      "inventory.view",
      "inventory.create",
      "inventory.update",
      "inventory.adjust",

      // Stock Receipts
      "stock.view",
      "stock.create",
      "stock.verify",

      // Physical Counts
      "counts.view",
      "counts.create",

      // Drying
      "drying.view",
      "drying.create",

      // Storage
      "storage.view",
      "storage.manage",

      // Reports
      "reports.view",
    ],
  },

  SALES_LOGISTICS_MANAGER: {
    label: "Sales & Logistics Manager",
    description: "Manages export orders and transportation",
    permissions: [
      // Export Orders
      "export.view",
      "export.create",
      "export.manage",

      // Container Management
      "containers.view",
      "containers.create",
      "containers.inspect",

      // Transport
      "transport.view",
      "transport.create",
      "transport.manage",
      "transport.track",

      // Loading
      "loading.view",
      "loading.create",
      "loading.verify",

      // Documents
      "documents.view",
      "documents.create",

      // Inventory (read-only for allocations)
      "inventory.view",

      // Reports
      "reports.view",
      "reports.export",
    ],
  },

  FINANCE_OFFICER: {
    label: "Finance Officer",
    description: "Manages financial operations and reporting",
    permissions: [
      // Payments
      "payments.view",
      "payments.create",
      "payments.approve",
      "payments.process",

      // Budget & Planning
      "budget.view",
      "budget.create",
      "budget.approve",

      // Reports
      "reports.view",
      "reports.export",
      "reports.create",

      // Trader Management (read-only)
      "traders.view",

      // Export Orders (read-only)
      "export.view",

      // Audit
      "audit.view",
    ],
  },

  OPERATIONS_MANAGER: {
    label: "Operations Manager",
    description: "Oversees overall operations",
    permissions: [
      // All viewing permissions
      "traders.view",
      "buying.view",
      "quality.view",
      "inventory.view",
      "drying.view",
      "export.view",
      "transport.view",
      "containers.view",
      "payments.view",

      // Management capabilities
      "buying.create",
      "export.create",
      "transport.create",
      "buying.approve",
      "export.approve",

      // Reports
      "reports.view",
      "reports.export",
      "reports.create",

      // Alerts
      "alerts.view",

      // Audit
      "audit.view",
    ],
  },
} as const;

// ============================================
// TYPE DEFINITIONS
// ============================================

export type UserRole = keyof typeof ROLES_PERMISSIONS;
export type Permission = string;

export interface RolePermissions {
  label: string;
  description: string;
  permissions: Permission[];
}

export interface UserWithPermissions {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return [...(ROLES_PERMISSIONS[role]?.permissions ?? [])];
}

/**
 * Get role label
 */
export function getRoleLabel(role: UserRole): string {
  return ROLES_PERMISSIONS[role]?.label || role;
}

/**
 * Get role description
 */
export function getRoleDescription(role: UserRole): string {
  return ROLES_PERMISSIONS[role]?.description || "";
}

/**
 * Check if user has specific permission
 */
export function hasPermission(
  userPermissions: Permission[],
  requiredPermission: Permission
): boolean {
  return userPermissions.includes(requiredPermission);
}

/**
 * Check if user has ANY of the permissions
 */
export function hasAnyPermission(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.some((perm) => userPermissions.includes(perm));
}

/**
 * Check if user has ALL permissions
 */
export function hasAllPermissions(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.every((perm) => userPermissions.includes(perm));
}

/**
 * Get all available roles
 */
export function getAllRoles(): Array<{ role: UserRole; label: string }> {
  return Object.entries(ROLES_PERMISSIONS).map(([role, data]) => ({
    role: role as UserRole,
    label: data.label,
  }));
}

/**
 * Get all unique permissions across all roles
 */
export function getAllPermissions(): Permission[] {
  const permSet = new Set<Permission>();
  Object.values(ROLES_PERMISSIONS).forEach((roleData) => {
    roleData.permissions.forEach((perm) => permSet.add(perm));
  });
  return Array.from(permSet).sort();
}

/**
 * Format permission for display
 */
export function formatPermissionLabel(permission: Permission): string {
  return permission
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" - ");
}

/**
 * Get permissions grouped by category
 */
export function getPermissionsGrouped(): Record<string, Permission[]> {
  const grouped: Record<string, Permission[]> = {};

  getAllPermissions().forEach((permission) => {
    const [category] = permission.split(".");
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(permission);
  });

  return grouped;
}
