import { redirect } from "next/navigation";
import { JSX, ReactNode } from "react";
import {
<<<<<<< HEAD
=======
  // getCurrentStaff,
>>>>>>> 7ac891623424698e0974a9474fbbbb5aa478bc7d
  hasPermission,
  hasAnyPermission,
  hasRole,
  hasAnyRole,
} from "@/lib/session";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProtectedPageProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requireAllPermissions?: boolean;
  requiredRole?: string;
  requiredRoles?: string[];
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * Server-side component to protect pages with permission/role checks
 *
 * @example
 * // In your page.tsx
 * export default async function LoansPage() {
 *   return (
 *     <ProtectedPage requiredPermission="loans.view">
 *       <LoansContent />
 *     </ProtectedPage>
 *   );
 * }
 */
export async function ProtectedPage({
  children,
  requiredPermission,
  requiredPermissions,
  requireAllPermissions = false,
  requiredRole,
  requiredRoles,
  fallback,
  redirectTo,
}: ProtectedPageProps) {
  // const staff = await getCurrentStaff();

  // Check if user has staff record
  // if (!staff) {
  //   if (redirectTo) {
  //     redirect(redirectTo);
  //   }
  
    return (
      <UnauthorizedFallback
        message="No active staff profile found"
        description="You need to be assigned to a branch to access this page."
      />
    );
  }

  let hasAccess = true;

  // Check single permission
  // if (requiredPermission) {
  //   hasAccess = await hasPermission(requiredPermission);
  // }

  // // Check multiple permissions
  // if (requiredPermissions && requiredPermissions.length > 0) {
  //   if (requireAllPermissions) {
  //     // Require all permissions
  //     const checks = await Promise.all(
  //       requiredPermissions.map((perm) => hasPermission(perm))
  //     );
  //     hasAccess = checks.every((check) => check);
  //   } else {
  //     // Require any permission
  //     const checks = await Promise.all(
  //       requiredPermissions.map((perm) => hasPermission(perm))
  //     );
  //     hasAccess = checks.some((check) => check);
  //   }
  // }

  // Check single role
  // if (requiredRole && hasAccess) {
  //   hasAccess = await hasRole(requiredRole);
  // }

  // Check multiple roles
  // if (requiredRoles && requiredRoles.length > 0 && hasAccess) {
  //   hasAccess = await hasAnyRole(requiredRoles);
  // }

  // if (!hasAccess) {
  //   if (redirectTo) {
  //     redirect(redirectTo);
  //   }
  //   if (fallback) {
  //     return <>{fallback}</>;
  //   }
  //   return (
  //     <UnauthorizedFallback
  //       message="Access Denied"
  //       description="You don't have permission to access this page."
  //     />
  //   );
  // }

  // return <>{children}</>;
// }

let hasAccess = true;

// Check single permission
// if (requiredPermission) {
//   hasAccess = await hasPermission(requiredPermission);
// }

// Check multiple permissions
// if (requiredPermissions && requiredPermissions.length > 0) {
//   if (requireAllPermissions) {
//     // Require all permissions
//     const checks = await Promise.all(
//       requiredPermissions.map((perm) => hasPermission(perm))
//     );
//     hasAccess = checks.every((check) => check);
//   } else {
//     // Require any permission
//     const checks = await Promise.all(
//       requiredPermissions.map((perm) => hasPermission(perm))
//     );
//     hasAccess = checks.some((check) => check);
//   }
// }

// Check single role
// if (requiredRole && hasAccess) {
//   hasAccess = await hasRole(requiredRole);
// }

// Check multiple roles
// if (requiredRoles && requiredRoles.length > 0 && hasAccess) {
//   hasAccess = await hasAnyRole(requiredRoles);
// }

//   if (!hasAccess) {
//     if (redirectTo) {
//       redirect(redirectTo);
//     }
//     if (fallback) {
//       return <>{fallback}</>;
//     }
//     return (
//       <UnauthorizedFallback
//         message="Access Denied"
//         description="You don't have permission to access this page."
//       />
//     );
//   }

//   return <>{children}</>;
// }

/**
 * Default unauthorized fallback component
 */
function UnauthorizedFallback({
  message,
  description,
}: {
  message: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive" className="border-2">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">{message}</AlertTitle>
          <AlertDescription className="mt-2 space-y-4">
            <p>{description}</p>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

/**
 * Higher-order function to create permission-protected page components
 *
 * @example
 * const ProtectedLoansPage = withPagePermission(LoansPage, 'loans.view');
 * export default ProtectedLoansPage;
 */
export function withPagePermission(
  Component: () => Promise<JSX.Element>,
  permission: string,
  redirectTo?: string
) {
  return async function ProtectedPageComponent() {
    return (
      <ProtectedPage requiredPermission={permission} redirectTo={redirectTo}>
        <Component />
      </ProtectedPage>
    );
  };
}

/**
 * Higher-order function to create role-protected page components
 *
 * @example
 * const AdminOnlyPage = withPageRole(SettingsPage, 'Admin');
 * export default AdminOnlyPage;
 */
export function withPageRole(
  Component: () => Promise<JSX.Element>,
  role: string,
  redirectTo?: string
) {
  return async function ProtectedPageComponent() {
    return (
      <ProtectedPage requiredRole={role} redirectTo={redirectTo}>
        <Component />
      </ProtectedPage>
    );
  };
}
