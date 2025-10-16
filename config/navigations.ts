import {
  Home,
  Package,
  Truck,
  DollarSign,
  Settings,
  BarChart3,
  type LucideIcon,
  Leaf,
  CheckCircle,
  Container,
  FileText,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

export enum UserRole {
  SYSTEM_ADMIN = "SYSTEM_ADMIN",
  PROCUREMENT_QUALITY_MANAGER = "PROCUREMENT_QUALITY_MANAGER",
  WAREHOUSE_INVENTORY_OFFICER = "WAREHOUSE_INVENTORY_OFFICER",
  SALES_LOGISTICS_MANAGER = "SALES_LOGISTICS_MANAGER",
  FINANCE_OFFICER = "FINANCE_OFFICER",
  OPERATIONS_MANAGER = "OPERATIONS_MANAGER",
}

export interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  badge?: string | number;
  roles: UserRole[];
  items?: {
    title: string;
    url: string;
    roles: UserRole[];
    badge?: string | number;
  }[];
}

export const navigationConfig: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: [
      UserRole.SYSTEM_ADMIN,
      UserRole.PROCUREMENT_QUALITY_MANAGER,
      UserRole.WAREHOUSE_INVENTORY_OFFICER,
      UserRole.SALES_LOGISTICS_MANAGER,
      UserRole.FINANCE_OFFICER,
      UserRole.OPERATIONS_MANAGER,
    ],
  },

  // Procurement & Quality Management
  {
    title: "Procurement",
    url: "#",
    icon: Leaf,
    roles: [UserRole.PROCUREMENT_QUALITY_MANAGER, UserRole.SYSTEM_ADMIN],
    items: [
      {
        title: "Annual Plans",
        url: "/dashboard/procurement/plans",
        roles: [UserRole.PROCUREMENT_QUALITY_MANAGER, UserRole.SYSTEM_ADMIN],
      },
      {
        title: "Traders",
        url: "/dashboard/procurement/traders",
        roles: [UserRole.PROCUREMENT_QUALITY_MANAGER, UserRole.SYSTEM_ADMIN],
      },
      {
        title: "Buying Weight Notes",
        url: "/dashboard/bwn",
        roles: [UserRole.PROCUREMENT_QUALITY_MANAGER, UserRole.SYSTEM_ADMIN],
        badge: "12",
      },
      {
        title: "Price Management",
        url: "/dashboard/procurement/pricing",
        roles: [UserRole.PROCUREMENT_QUALITY_MANAGER, UserRole.SYSTEM_ADMIN],
      },
    ],
  },

  {
    title: "Quality Control",
    url: "#",
    icon: CheckCircle,
    roles: [UserRole.PROCUREMENT_QUALITY_MANAGER, UserRole.SYSTEM_ADMIN],
    items: [
      {
        title: "Inspections",
        url: "/dashboard/quality/inspections",
        roles: [UserRole.PROCUREMENT_QUALITY_MANAGER, UserRole.SYSTEM_ADMIN],
        badge: "8",
      },
      {
        title: "Certificates",
        url: "/dashboard/quality/certificates",
        roles: [UserRole.PROCUREMENT_QUALITY_MANAGER, UserRole.SYSTEM_ADMIN],
      },
      {
        title: "Quality Reports",
        url: "/dashboard/quality/reports",
        roles: [UserRole.PROCUREMENT_QUALITY_MANAGER, UserRole.SYSTEM_ADMIN],
      },
    ],
  },

  // Warehouse & Inventory
  {
    title: "Warehouse",
    url: "#",
    icon: Package,
    roles: [UserRole.WAREHOUSE_INVENTORY_OFFICER, UserRole.SYSTEM_ADMIN],
    items: [
      {
        title: "Stock Receipts",
        url: "/dashboard/warehouse/receipts",
        roles: [UserRole.WAREHOUSE_INVENTORY_OFFICER, UserRole.SYSTEM_ADMIN],
      },
      {
        title: "Inventory",
        url: "/dashboard/warehouse/inventory",
        roles: [UserRole.WAREHOUSE_INVENTORY_OFFICER, UserRole.SYSTEM_ADMIN],
      },
      {
        title: "Storage Locations",
        url: "/dashboard/warehouse/locations",
        roles: [UserRole.WAREHOUSE_INVENTORY_OFFICER, UserRole.SYSTEM_ADMIN],
      },
      {
        title: "Stock Counts",
        url: "/dashboard/warehouse/counts",
        roles: [UserRole.WAREHOUSE_INVENTORY_OFFICER, UserRole.SYSTEM_ADMIN],
      },
    ],
  },

  {
    title: "Drying & Processing",
    url: "#",
    icon: TrendingUp,
    roles: [UserRole.OPERATIONS_MANAGER, UserRole.SYSTEM_ADMIN],
    items: [
      {
        title: "Drying Orders",
        url: "/dashboard/operations/drying",
        roles: [UserRole.OPERATIONS_MANAGER, UserRole.SYSTEM_ADMIN],
        badge: "5",
      },
      {
        title: "Equipment",
        url: "/dashboard/operations/equipment",
        roles: [UserRole.OPERATIONS_MANAGER, UserRole.SYSTEM_ADMIN],
      },
      {
        title: "Monitoring",
        url: "/dashboard/operations/monitoring",
        roles: [UserRole.OPERATIONS_MANAGER, UserRole.SYSTEM_ADMIN],
      },
    ],
  },

  // Sales & Logistics
  {
    title: "Export Orders",
    url: "#",
    icon: FileText,
    roles: [UserRole.SALES_LOGISTICS_MANAGER, UserRole.SYSTEM_ADMIN],
    items: [
      {
        title: "All Orders",
        url: "/dashboard/sales/orders",
        roles: [UserRole.SALES_LOGISTICS_MANAGER, UserRole.SYSTEM_ADMIN],
        badge: "6",
      },
      {
        title: "Create Order",
        url: "/dashboard/sales/orders/new",
        roles: [UserRole.SALES_LOGISTICS_MANAGER, UserRole.SYSTEM_ADMIN],
      },
      {
        title: "Allocations",
        url: "/dashboard/sales/allocations",
        roles: [UserRole.SALES_LOGISTICS_MANAGER, UserRole.SYSTEM_ADMIN],
      },
    ],
  },

  {
    title: "Containers & Loading",
    url: "#",
    icon: Container,
    roles: [UserRole.SALES_LOGISTICS_MANAGER, UserRole.SYSTEM_ADMIN],
    items: [
      {
        title: "Container Bookings",
        url: "/dashboard/logistics/containers",
        roles: [UserRole.SALES_LOGISTICS_MANAGER, UserRole.SYSTEM_ADMIN],
      },
      {
        title: "Loading Tallies",
        url: "/dashboard/logistics/loading",
        roles: [UserRole.SALES_LOGISTICS_MANAGER, UserRole.SYSTEM_ADMIN],
        badge: "3",
      },
      {
        title: "Inspections",
        url: "/dashboard/logistics/inspections",
        roles: [UserRole.SALES_LOGISTICS_MANAGER, UserRole.SYSTEM_ADMIN],
      },
    ],
  },

  {
    title: "Transport",
    url: "#",
    icon: Truck,
    roles: [UserRole.SALES_LOGISTICS_MANAGER, UserRole.SYSTEM_ADMIN],
    items: [
      {
        title: "Transport Jobs",
        url: "/dashboard/logistics/transport",
        roles: [UserRole.SALES_LOGISTICS_MANAGER, UserRole.SYSTEM_ADMIN],
      },
      {
        title: "Tracking",
        url: "/dashboard/logistics/tracking",
        roles: [UserRole.SALES_LOGISTICS_MANAGER, UserRole.SYSTEM_ADMIN],
      },
    ],
  },

  {
    title: "Export Documents",
    url: "/dashboard/sales/documents",
    icon: FileText,
    roles: [UserRole.SALES_LOGISTICS_MANAGER, UserRole.SYSTEM_ADMIN],
  },

  // Finance
  {
    title: "Payments",
    url: "#",
    icon: DollarSign,
    roles: [UserRole.FINANCE_OFFICER, UserRole.SYSTEM_ADMIN],
    items: [
      {
        title: "Trader Payments",
        url: "/dashboard/finance/trader-payments",
        roles: [UserRole.FINANCE_OFFICER, UserRole.SYSTEM_ADMIN],
        badge: "15",
      },
      {
        title: "Export Payments",
        url: "/dashboard/finance/export-payments",
        roles: [UserRole.FINANCE_OFFICER, UserRole.SYSTEM_ADMIN],
        badge: "4",
      },
      {
        title: "Payment Terms",
        url: "/dashboard/finance/terms",
        roles: [UserRole.FINANCE_OFFICER, UserRole.SYSTEM_ADMIN],
      },
    ],
  },

  {
    title: "Financial Reports",
    url: "#",
    icon: BarChart3,
    roles: [UserRole.FINANCE_OFFICER, UserRole.SYSTEM_ADMIN],
    items: [
      {
        title: "Profitability",
        url: "/dashboard/finance/profitability",
        roles: [UserRole.FINANCE_OFFICER, UserRole.SYSTEM_ADMIN],
      },
      {
        title: "Cash Flow",
        url: "/dashboard/finance/cashflow",
        roles: [UserRole.FINANCE_OFFICER, UserRole.SYSTEM_ADMIN],
      },
      {
        title: "Monthly Reports",
        url: "/dashboard/finance/reports",
        roles: [UserRole.FINANCE_OFFICER, UserRole.SYSTEM_ADMIN],
      },
    ],
  },

  {
    title: "Reports & Analytics",
    url: "#",
    icon: BarChart3,
    roles: [UserRole.SYSTEM_ADMIN],
    items: [
      {
        title: "Daily Summary",
        url: "/dashboard/reports/daily",
        roles: [UserRole.SYSTEM_ADMIN],
      },
      {
        title: "Weekly Performance",
        url: "/dashboard/reports/weekly",
        roles: [UserRole.SYSTEM_ADMIN],
      },
      {
        title: "Business Metrics",
        url: "/dashboard/reports/metrics",
        roles: [UserRole.SYSTEM_ADMIN],
      },
    ],
  },

  {
    title: "System Settings",
    url: "/dashboard/settings",
    icon: Settings,
    roles: [UserRole.SYSTEM_ADMIN],
  },
];

export function getNavigationForRole(role: UserRole): NavigationItem[] {
  return navigationConfig
    .filter((item) => item.roles.includes(role))
    .map((item) => ({
      ...item,
      items: item.items?.filter((subItem) => subItem.roles.includes(role)),
    }));
}
