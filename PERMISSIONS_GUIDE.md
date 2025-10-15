# Permission System Usage Guide

This guide explains how to use the permission-based access control system in your application.

## Table of Contents

1. [Server-Side Protection](#server-side-protection)
2. [Client-Side Protection](#client-side-protection)
3. [Permission Constants](#permission-constants)
4. [Branch Switching](#branch-switching)
5. [Common Patterns](#common-patterns)

---

## Server-Side Protection

### Protecting Entire Pages

Use the `ProtectedPage` component in your server components:

```typescript
// app/dashboard/loans/page.tsx
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/permissions";

export default async function LoansPage() {
  return (
    <ProtectedPage requiredPermission={PERMISSIONS.LOANS.VIEW}>
      <LoansContent />
    </ProtectedPage>
  );
}
```

### Multiple Permissions (ANY)

```typescript
<ProtectedPage
  requiredPermissions={[PERMISSIONS.LOANS.CREATE, PERMISSIONS.LOANS.UPDATE]}
>
  <ManageLoansContent />
</ProtectedPage>
```

### Multiple Permissions (ALL)

```typescript
<ProtectedPage
  requiredPermissions={[PERMISSIONS.LOANS.APPROVE, PERMISSIONS.LOANS.DISBURSE]}
  requireAllPermissions={true}
>
  <ApproveLoanContent />
</ProtectedPage>
```

### Role-Based Protection

```typescript
<ProtectedPage requiredRole="Admin">
  <AdminSettings />
</ProtectedPage>
```

### Multiple Roles

```typescript
<ProtectedPage requiredRoles={["Admin", "Manager"]}>
  <ManagementDashboard />
</ProtectedPage>
```

### Custom Redirect

```typescript
<ProtectedPage
  requiredPermission={PERMISSIONS.LOANS.VIEW}
  redirectTo="/dashboard/unauthorized"
>
  <LoansContent />
</ProtectedPage>
```

### Using Server-Side Utilities Directly

```typescript
import { hasPermission, getCurrentStaff, isAdmin } from "@/lib/session";

export default async function SomePage() {
  const staff = await getCurrentStaff();
  const canViewLoans = await hasPermission(PERMISSIONS.LOANS.VIEW);
  const isAdminUser = await isAdmin();

  if (!canViewLoans) {
    return <NoAccessMessage />;
  }

  return <LoansContent />;
}
```

---

## Client-Side Protection

### Protecting Components

```typescript
"use client";

import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/lib/permissions";

export function LoanActions() {
  return (
    <div>
      <PermissionGate permission={PERMISSIONS.LOANS.CREATE}>
        <CreateLoanButton />
      </PermissionGate>

      <PermissionGate permission={PERMISSIONS.LOANS.UPDATE}>
        <EditLoanButton />
      </PermissionGate>

      <PermissionGate permission={PERMISSIONS.LOANS.DELETE}>
        <DeleteLoanButton />
      </PermissionGate>
    </div>
  );
}
```

### Using Permission Hooks

```typescript
"use client";

import { useHasPermission, useIsAdmin } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/permissions";

export function LoanTable() {
  const canCreate = useHasPermission(PERMISSIONS.LOANS.CREATE);
  const canEdit = useHasPermission(PERMISSIONS.LOANS.UPDATE);
  const isAdmin = useIsAdmin();

  return (
    <div>
      {canCreate && <Button>Create Loan</Button>}
      {canEdit && <Button>Edit</Button>}
      {isAdmin && <Button>Admin Actions</Button>}
    </div>
  );
}
```

### Any Permission Gate

```typescript
import { AnyPermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/lib/permissions";

<AnyPermissionGate
  permissions={[PERMISSIONS.LOANS.CREATE, PERMISSIONS.LOANS.UPDATE]}
>
  <ManageLoanButton />
</AnyPermissionGate>;
```

### All Permissions Gate

```typescript
import { AllPermissionsGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/lib/permissions";

<AllPermissionsGate
  permissions={[PERMISSIONS.LOANS.APPROVE, PERMISSIONS.LOANS.DISBURSE]}
>
  <ApproveAndDisburseButton />
</AllPermissionsGate>;
```

### Role Gates

```typescript
import { RoleGate, AdminGate, AnyRoleGate } from '@/components/auth/PermissionGate';

// Single role
<RoleGate role="Admin">
  <AdminPanel />
</RoleGate>

// Admin shorthand
<AdminGate>
  <AdminPanel />
</AdminGate>

// Multiple roles
<AnyRoleGate roles={["Admin", "Manager"]}>
  <ManagementTools />
</AnyRoleGate>
```

### With Fallback

```typescript
<PermissionGate
  permission={PERMISSIONS.LOANS.CREATE}
  fallback={<div>You don't have access to create loans</div>}
>
  <CreateLoanForm />
</PermissionGate>
```

### Higher-Order Components

```typescript
import { withPermission, withRole } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/lib/permissions";

const ProtectedLoanForm = withPermission(LoanForm, PERMISSIONS.LOANS.CREATE);

const AdminOnlySettings = withRole(SettingsPanel, "Admin");
```

---

## Permission Constants

Always use permission constants from `@/lib/permissions`:

```typescript
import { PERMISSIONS, ROLES } from "@/lib/permissions";

// ✅ GOOD - Type-safe, refactorable
const canView = await hasPermission(PERMISSIONS.LOANS.VIEW);

// ❌ BAD - String literals are error-prone
const canView = await hasPermission("loans.view");
```

### Available Permission Categories

- `PERMISSIONS.DASHBOARD`
- `PERMISSIONS.INSTITUTIONS`
- `PERMISSIONS.BRANCHES`
- `PERMISSIONS.BORROWERS`
- `PERMISSIONS.LOANS`
- `PERMISSIONS.LOAN_PRODUCTS`
- `PERMISSIONS.LOAN_REQUESTS`
- `PERMISSIONS.REPAYMENTS`
- `PERMISSIONS.ACCOUNTING`
- `PERMISSIONS.ACCOUNTS`
- `PERMISSIONS.STAFF`
- `PERMISSIONS.ROLES`
- `PERMISSIONS.SETTINGS`
- `PERMISSIONS.REPORTS`
- `PERMISSIONS.NOTIFICATIONS`
- `PERMISSIONS.AUDIT_LOGS`

---

## Branch Switching

### Using Branch Switcher Component

```typescript
import { BranchSwitcher } from '@/components/dashboard/BranchSwitcher';

// Full version (for sidebar)
<BranchSwitcher />

// Compact version (for header)
<BranchSwitcherCompact />
```

### Getting Current Branch

```typescript
"use client";

import { useCurrentBranch } from "@/hooks/usePermissions";

export function BranchInfo() {
  const { branchId, branchName, institutionName } = useCurrentBranch();

  return (
    <div>
      <h2>{branchName}</h2>
      <p>{institutionName}</p>
    </div>
  );
}
```

### Getting All User Branches

```typescript
import { useUserBranches } from "@/hooks/usePermissions";

export function BranchList() {
  const { branches, isLoading } = useUserBranches();

  return (
    <ul>
      {branches.map((branch) => (
        <li key={branch.branchId}>{branch.branchName}</li>
      ))}
    </ul>
  );
}
```

### Check if Can Switch Branches

```typescript
import { useCanSwitchBranches } from "@/hooks/usePermissions";

export function Header() {
  const { canSwitch, branchCount } = useCanSwitchBranches();

  return (
    <div>
      {canSwitch && <BranchSwitcher />}
      <span>{branchCount} branches available</span>
    </div>
  );
}
```

---

## Common Patterns

### Pattern 1: Conditional Rendering Based on Multiple Conditions

```typescript
"use client";

import {
  useHasPermission,
  useIsAdmin,
  useCurrentBranch,
} from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/permissions";

export function LoanCard({ loan }) {
  const canEdit = useHasPermission(PERMISSIONS.LOANS.UPDATE);
  const canApprove = useHasPermission(PERMISSIONS.LOANS.APPROVE);
  const isAdmin = useIsAdmin();
  const { role } = useCurrentBranch();

  return (
    <Card>
      <LoanDetails loan={loan} />

      {canEdit && <EditButton />}
      {canApprove && loan.status === "pending" && <ApproveButton />}
      {isAdmin && <AdminActions />}
      {role === "Manager" && <ManagerTools />}
    </Card>
  );
}
```

### Pattern 2: Combined Server and Client Protection

```typescript
// page.tsx (Server Component)
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/permissions";
import { LoansTable } from "./LoansTable";

export default async function LoansPage() {
  return (
    <ProtectedPage requiredPermission={PERMISSIONS.LOANS.VIEW}>
      <LoansTable />
    </ProtectedPage>
  );
}

// LoansTable.tsx (Client Component)
("use client");

import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/lib/permissions";

export function LoansTable() {
  return (
    <div>
      <Table />
      <PermissionGate permission={PERMISSIONS.LOANS.CREATE}>
        <CreateButton />
      </PermissionGate>
    </div>
  );
}
```

### Pattern 3: Dynamic Navigation Based on Permissions

```typescript
"use client";

import { useCurrentPermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/permissions";

export function Navigation() {
  const { permissions } = useCurrentPermissions();

  const navItems = [
    {
      label: "Loans",
      href: "/dashboard/loans",
      permission: PERMISSIONS.LOANS.VIEW,
    },
    {
      label: "Borrowers",
      href: "/dashboard/borrowers",
      permission: PERMISSIONS.BORROWERS.VIEW,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      permission: PERMISSIONS.SETTINGS.VIEW,
    },
  ];

  return (
    <nav>
      {navItems
        .filter((item) => permissions.includes(item.permission))
        .map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
    </nav>
  );
}
```

### Pattern 4: API Route Protection

```typescript
// app/api/loans/route.ts
import { NextRequest, NextResponse } from "next/server";
import { hasPermission } from "@/lib/session";
import { PERMISSIONS } from "@/lib/permissions";
import { getAuthUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const canCreate = await hasPermission(PERMISSIONS.LOANS.CREATE);
  if (!canCreate) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Process loan creation...
  return NextResponse.json({ success: true });
}
```

---

## Summary

- **Server Components**: Use `ProtectedPage` or direct utility functions from `@/lib/session`
- **Client Components**: Use `PermissionGate` components or hooks from `@/hooks/usePermissions`
- **Always use constants**: Import from `@/lib/permissions`
- **Branch awareness**: Use `BranchSwitcher` and `useCurrentBranch` hooks
- **Combine approaches**: Use both server and client protection for defense in depth

For more details, check the source code or contact the development team.
