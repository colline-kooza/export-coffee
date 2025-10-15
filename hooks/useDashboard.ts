// hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";

export type TimeRange = "today" | "week" | "month" | "all";

interface AdminMetrics {
  users: number;
  vendors: number;
  products: number;
  categories: number;
  pendingRequests: number;
}

interface VendorMetrics {
  totalProducts: number;
  activeProducts: number;
  promotedProducts: number;
  categoryCount: number;
}

interface UserMetrics {
  totalProducts: number;
  totalCategories: number;
  totalVendors: number;
  activeProducts: number;
}

interface User {
  name: string;
  email: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  memberSince: string;
}

interface Shop {
  name: string;
  isVerified: boolean | null;
}

interface RecentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

interface RecentVendor {
  id: string;
  shopName: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  category: {
    title: string;
  };
}

interface Category {
  id: string;
  title: string;
  _count: {
    products: number;
  };
}
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
// Admin Dashboard Hook
export function useAdminDashboard(range: TimeRange = "today") {
  return useQuery({
    queryKey: ["admin-dashboard", range],
    queryFn: async () => {
      const response = await fetch(
        `${baseUrl}/api/dashboard/admin?range=${range}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch admin dashboard");
      }
      const data = await response.json();
      return data.data as {
        metrics: AdminMetrics;
        chartData: Record<string, number>;
        recentUsers: RecentUser[];
        recentVendors: RecentVendor[];
      };
    },
  });
}

// Vendor Dashboard Hook
export function useVendorDashboard(userId: string, range: TimeRange = "today") {
  return useQuery({
    queryKey: ["vendor-dashboard", userId, range],
    queryFn: async () => {
      const response = await fetch(
        `${baseUrl}/api/dashboard/vendor?userId=${userId}&range=${range}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch vendor dashboard");
      }
      const data = await response.json();
      return data.data as {
        metrics: VendorMetrics;
        shop: Shop;
        chartData: Record<string, number>;
        recentProducts: Product[];
      };
    },
    enabled: !!userId,
  });
}

// User Dashboard Hook
export function useUserDashboard(userId: string, range: TimeRange = "today") {
  return useQuery({
    queryKey: ["user-dashboard", userId, range],
    queryFn: async () => {
      const response = await fetch(
        `${baseUrl}/api/dashboard/user?userId=${userId}&range=${range}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user dashboard");
      }
      const data = await response.json();
      return data.data as {
        user: User;
        metrics: UserMetrics;
        chartData: Record<string, number>;
        featuredProducts: Product[];
        popularCategories: Category[];
      };
    },
    enabled: !!userId,
  });
}
