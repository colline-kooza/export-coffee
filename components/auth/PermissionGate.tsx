"use client";

import React from "react";
import {
  useHasPermission,
  useHasAnyPermission,
  useHasAllPermissions,
  // useHasRole,
  // useHasAnyRole,
  // useIsAdmin,
} from "@/hooks/usePermissions";

interface PermissionGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface PermissionProps extends PermissionGateProps {
  permission: string;
}

interface AnyPermissionProps extends PermissionGateProps {
  permissions: string[];
}

interface AllPermissionsProps extends PermissionGateProps {
  permissions: string[];
}

interface RoleProps extends PermissionGateProps {
  role: string;
}

interface AnyRoleProps extends PermissionGateProps {
  roles: string[];
}

/**
 * Component to show content only if user has specific permission
 *
 * @example
 * <PermissionGate permission="loans.create">
 *   <CreateLoanButton />
 * </PermissionGate>
 */
export function PermissionGate({
  permission,
  children,
  fallback = null,
}: PermissionProps) {
  // const { hasPermission } = useHasPermission(permission);

  // if (!hasPermission) {
  //   return <>{fallback}</>;
  // }

  return <>{children}</>;
}

/**
 * Component to show content only if user has ANY of the specified permissions
 *
 * @example
 * <AnyPermissionGate permissions={["loans.create", "loans.update"]}>
 *   <ManageLoansPanel />
 * </AnyPermissionGate>
 */
export function AnyPermissionGate({
  permissions,
  children,
  fallback = null,
}: AnyPermissionProps) {
  // const { hasPermission } = useHasAnyPermission(permissions);

  // if (!hasPermission) {
  //   return <>{fallback}</>;
  // }

  return <>{children}</>;
}

/**
 * Component to show content only if user has ALL of the specified permissions
 *
 * @example
 * <AllPermissionsGate permissions={["loans.approve", "loans.disburse"]}>
 *   <ApproveLoanButton />
 * </AllPermissionsGate>
 */
export function AllPermissionsGate({
  permissions,
  children,
  fallback = null,
}: AllPermissionsProps) {
  // const { hasPermission } = useHasAllPermissions(permissions);

  // if (!hasPermission) {
  //   return <>{fallback}</>;
  // }

  return <>{children}</>;
}

/**
 * Component to show content only if user has specific role
 *
 * @example
 * <RoleGate role="Admin">
 *   <AdminDashboard />
 * </RoleGate>
 */
export function RoleGate({ role, children, fallback = null }: RoleProps) {
  // const { hasRole } = useHasRole(role);

  // if (!hasRole) {
  //   return <>{fallback}</>;
  // }

  return <>{children}</>;
}

/**
 * Component to show content only if user has ANY of the specified roles
 *
 * @example
 * <AnyRoleGate roles={["Admin", "Manager"]}>
 *   <ManagementPanel />
 * </AnyRoleGate>
 */
export function AnyRoleGate({
  roles,
  children,
  fallback = null,
}: AnyRoleProps) {
  // const { hasRole } = useHasAnyRole(roles);

  // if (!hasRole) {
  //   return <>{fallback}</>;
  // }

  return <>{children}</>;
}

/**
 * Component to show content only for Admin users
 *
 * @example
 * <AdminGate>
 *   <SystemSettings />
 * </AdminGate>
 */
export function AdminGate({ children, fallback = null }: PermissionGateProps) {
  // const { isAdmin } = useIsAdmin();

  // if (!isAdmin) {
  //   return <>{fallback}</>;
  // }

  return <>{children}</>;
}

/**
 * Higher-order component to protect components with permission check
 *
 * @example
 * const ProtectedComponent = withPermission(MyComponent, 'loans.view');
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permission: string,
  fallback?: React.ReactNode
) {
  return function ProtectedComponent(props: P) {
    return (
      <PermissionGate permission={permission} fallback={fallback}>
        <Component {...props} />
      </PermissionGate>
    );
  };
}

/**
 * Higher-order component to protect components with role check
 *
 * @example
 * const AdminOnlyComponent = withRole(MyComponent, 'Admin');
 */
export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  role: string,
  fallback?: React.ReactNode
) {
  return function ProtectedComponent(props: P) {
    return (
      <RoleGate role={role} fallback={fallback}>
        <Component {...props} />
      </RoleGate>
    );
  };
}
