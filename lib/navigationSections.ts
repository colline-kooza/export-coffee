import {
  Building2,
  Truck,
  Scale,
  Droplets,
  PackageCheck,
  Container,
  Ship,
  Receipt,
  Users,
  ShieldCheck,
  TrendingUp,
  Settings,
  HelpCircle,
  Bell,
  Search,
  LayoutDashboard,
  Coffee,
  ClipboardCheck,
  Warehouse,
  FileText,
} from "lucide-react";

export interface NavigationItem {
  href: string;
  icon: any;
  label: string;
  permissions?: string[];
  subItems?: Array<{
    href: string;
    label: string;
    permissions?: string[];
  }>;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export const defaultPermissions = [
  "users.view",
  "traders.view",
  "traders.create",
  "buying.view",
  "buying.create",
  "quality.view",
  "inventory.view",
  "drying.view",
  "export.view",
  "transport.view",
  "payments.view",
  "reports.view",
  "settings.view",
];

export const navigationSections: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      {
        href: "/dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
        permissions: [],
      },
      {
        href: "/dashboard/traders",
        icon: Users,
        label: "Trader Management",
        permissions: ["traders.view"],
      },
      //   {
      //     href: "/dashboard/kooza",
      //     icon: Users,
      //     label: "Kooza Management",
      //     permissions: ["traders.view"] /**kooza.view */,
      //   },
    ],
  },
  {
    title: "Procurement",
    items: [
      {
        href: "/dashboard/procurement/truck-entries",
        icon: Truck,
        label: "Truck Entry Register",
        permissions: ["buying.create"],
        subItems: [
          {
            href: "/dashboard/procurement/truck-entries",
            label: "All Entries",
            permissions: ["buying.view"],
          },
        ],
      },
      {
        href: "/dashboard/procurement/weighbridge",
        icon: Scale,
        label: "Weighbridge",
        permissions: ["buying.view"],
        subItems: [
          {
            href: "/dashboard/procurement/weighbridge/readings",
            label: "All Readings",
            permissions: ["buying.view"],
          },
          //   {
          //     href: "/dashboard/procurement/weighbridge/new",
          //     label: "New Weighing",
          //     permissions: ["buying.create"],
          //   },
        ],
      },
      {
        href: "/dashboard/procurement/buying",
        icon: Receipt,
        label: "Buying Weight Notes",
        permissions: ["buying.view"],
      },
    ],
  },

  {
    title: "Quality & Storage",
    items: [
      {
        href: "/dashboard/stock",
        icon: Warehouse,
        label: "Stock Reception",
        permissions: ["inventory.view"],
      },
      {
        href: "/dashboard/quality",
        icon: PackageCheck,
        label: "Quality Control",
        permissions: ["quality.view"],
      },
      {
        href: "/dashboard/moisture",
        icon: Droplets,
        label: "Moisture & Drying",
        permissions: ["drying.view"],
      },
      {
        href: "/dashboard/inventory",
        icon: Coffee,
        label: "Inventory",
        permissions: ["inventory.view"],
        subItems: [
          {
            href: "/dashboard/inventory/current",
            label: "Current Stock",
            permissions: ["inventory.view"],
          },
          {
            href: "/dashboard/inventory/movements",
            label: "Movements",
            permissions: ["inventory.view"],
          },
          {
            href: "/dashboard/inventory/count",
            label: "Stock Count",
            permissions: ["inventory.view"],
          },
        ],
      },
    ],
  },
  {
    title: "Export & Logistics",
    items: [
      {
        href: "/dashboard/export",
        icon: Ship,
        label: "Export Orders",
        permissions: ["export.view"],
        subItems: [
          {
            href: "/dashboard/export/orders",
            label: "All Orders",
            permissions: ["export.view"],
          },
          {
            href: "/dashboard/export/active",
            label: "Active Orders",
            permissions: ["export.view"],
          },
          {
            href: "/dashboard/export/completed",
            label: "Completed",
            permissions: ["export.view"],
          },
        ],
      },
      {
        href: "/dashboard/containers",
        icon: Container,
        label: "Containers & Loading",
        permissions: ["export.view"],
      },
      {
        href: "/dashboard/transport",
        icon: Truck,
        label: "Transportation",
        permissions: ["transport.view"],
      },
      {
        href: "/dashboard/documents",
        icon: FileText,
        label: "Export Documents",
        permissions: ["export.view"],
      },
    ],
  },
  {
    title: "Financial",
    items: [
      {
        href: "/dashboard/payments",
        icon: Receipt,
        label: "Payments",
        permissions: ["payments.view"],
        subItems: [
          {
            href: "/dashboard/payments/traders",
            label: "Trader Payments",
            permissions: ["payments.view"],
          },
          {
            href: "/dashboard/payments/export",
            label: "Export Receipts",
            permissions: ["payments.view"],
          },
        ],
      },
      {
        href: "/dashboard/reports",
        icon: TrendingUp,
        label: "Reports & Analytics",
        permissions: ["reports.view"],
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        href: "/dashboard/users",
        icon: Users,
        label: "User Management",
        permissions: ["users.view"],
      },
      {
        href: "/dashboard/roles",
        icon: ShieldCheck,
        label: "Roles & Permissions",
        permissions: ["roles.manage"],
      },
    ],
  },
];
