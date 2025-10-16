"use client";

import {
  Building2,
  CreditCard,
  Grid2X2,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  Users,
  Wallet,
  ShieldCheck,
  FolderTree,
  UserCircle,
  ClipboardList,
  TrendingUp,
  Bell,
  FileBarChart,
} from "lucide-react";
import type * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import type { User } from "@/lib/auth";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { BranchSwitcher } from "@/components/dashboard/BranchSwitcher";
import { useCurrentPermissions } from "@/hooks/usePermissions";

// Navigation configuration with permissions
const navigationConfig = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
      permissions: ["dashboard.view"],
      roles: [],
    },
    {
      title: "Institutions",
      url: "/dashboard/institutions",
      icon: Building2,
      permissions: ["institutions.view"],
      roles: ["Admin"],
    },
    {
      title: "Branches",
      url: "/dashboard/branches",
      icon: FolderTree,
      permissions: ["branches.view"],
      roles: ["Admin", "Manager"],
    },
    {
      title: "Borrowers",
      url: "/dashboard/borrowers",
      icon: UserCircle,
      permissions: ["borrowers.view"],
      roles: ["Admin", "Manager", "Loan Officer"],
    },
    {
      title: "Loans",
      url: "/dashboard/loans",
      icon: CreditCard,
      permissions: ["loans.view"],
      roles: ["Admin", "Manager", "Loan Officer", "Auditor"],
      items: [
        {
          title: "All Loans",
          url: "/dashboard/loans",
          permissions: ["loans.view"],
        },
        {
          title: "Active Loans",
          url: "/dashboard/loans/active",
          permissions: ["loans.view"],
        },
        {
          title: "Overdue Loans",
          url: "/dashboard/loans/overdue",
          permissions: ["loans.view"],
        },
        {
          title: "Completed Loans",
          url: "/dashboard/loans/completed",
          permissions: ["loans.view"],
        },
      ],
    },
    {
      title: "Loan Products",
      url: "/dashboard/loan-products",
      icon: Grid2X2,
      permissions: ["loan-products.view"],
      roles: ["Admin", "Manager", "Loan Officer"],
    },
    {
      title: "Loan Requests",
      url: "/dashboard/loan-requests",
      icon: ClipboardList,
      permissions: ["loan-requests.view"],
      roles: ["Admin", "Manager", "Loan Officer"],
    },
    {
      title: "Repayments",
      url: "/dashboard/repayments",
      icon: Wallet,
      permissions: ["repayments.view"],
      roles: ["Admin", "Manager", "Loan Officer", "Auditor"],
    },
    {
      title: "Accounting",
      url: "/dashboard/accounting",
      icon: FileBarChart,
      permissions: ["accounting.view"],
      roles: ["Admin", "Manager", "Auditor"],
      items: [
        {
          title: "Accounts",
          url: "/dashboard/accounting/accounts",
          permissions: ["accounts.view"],
        },
        {
          title: "General Ledger",
          url: "/dashboard/accounting/ledger",
          permissions: ["accounting.view"],
        },
        {
          title: "Reports",
          url: "/dashboard/accounting/reports",
          permissions: ["accounting.reports"],
        },
      ],
    },
    {
      title: "Staff",
      url: "/dashboard/staff",
      icon: Users,
      permissions: ["staff.view"],
      roles: ["Admin", "Manager"],
    },
    {
      title: "Roles & Permissions",
      url: "/dashboard/roles",
      icon: ShieldCheck,
      permissions: ["roles.view"],
      roles: ["Admin"],
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: TrendingUp,
      permissions: ["reports.view"],
      roles: ["Admin", "Manager", "Auditor"],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: SettingsIcon,
      permissions: ["settings.view"],
      roles: ["Admin", "Manager"],
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
      permissions: ["notifications.view"],
      roles: ["Admin", "Manager", "Loan Officer"],
    },
    {
      title: "Get Help",
      url: "/dashboard/help",
      icon: HelpCircleIcon,
      permissions: [],
      roles: [],
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
      permissions: [],
      roles: [],
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
  initialData?: {
    permissions: string[];
    role: string | null;
    branchId: string | null;
    branchName: string | null;
    institutionName: string | null;
  };
}

export function AppSidebar({ user, initialData, ...props }: AppSidebarProps) {
  const {
    permissions: clientPermissions = [],
    role: clientRole,
    isLoading,
  } = useCurrentPermissions();

  const permissions =
    clientPermissions.length > 0
      ? clientPermissions
      : initialData?.permissions || [];
  const role = clientRole || initialData?.role || "User";

  const navUser = {
    name: user.name,
    email: user.email,
    avatar: user.image ?? "",
    role: role,
  };

  // Filter navigation items based on permissions and roles
  const filterNavItems = (items: typeof navigationConfig.navMain) => {
    return items.filter((item) => {
      // Check role requirement
      if (item.roles && item.roles.length > 0) {
        if (!role || !item.roles.includes(role)) {
          return false;
        }
      }

      // Check permission requirement
      if (item.permissions && item.permissions.length > 0) {
        const hasRequiredPermission = item.permissions.some((perm) =>
          permissions.includes(perm)
        );
        if (!hasRequiredPermission) {
          return false;
        }
      }

      // Filter sub-items if they exist
      if (item.items) {
        item.items = item.items.filter((subItem) => {
          if (subItem.permissions && subItem.permissions.length > 0) {
            return subItem.permissions.some((perm) =>
              permissions.includes(perm)
            );
          }
          return true;
        });
      }

      return true;
    });
  };

  const mainNavItems = filterNavItems(navigationConfig.navMain);
  const secNavItems = filterNavItems(navigationConfig.navSecondary);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="px-2 py-2">
              <BranchSwitcher />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
      </SidebarHeader>

      <SidebarContent className="sidebar-scrollbar">
        {isLoading && !initialData ? (
          <div className="px-4 py-2 text-sm text-sidebar-foreground/60">
            Loading...
          </div>
        ) : (
          <>
            <NavMain items={mainNavItems} />
            <NavSecondary items={secNavItems} className="mt-auto" />
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
