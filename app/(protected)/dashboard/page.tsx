// app/dashboard/page.tsx
import { redirect } from "next/navigation";

import { auth, getAuthUser } from "@/lib/auth"; // Adjust to your auth implementation
import PageLayout from "./components/PageLayout";
import AdminDashboard from "./components/AdminDashboard";
import VendorDashboard from "./components/VendorDashboard";
import UserDashboard from "./components/UserDashboard";
import AdminDashboardPage from "@/app/(dashboard)/components/dash-page";
import ProcurementDashboard from "@/app/(dashboard)/components/procurement/procurementDash";
import WarehouseDashboard from "@/app/(dashboard)/components/warehouse/warehouseDash";
import SalesDashboard from "@/app/(dashboard)/components/sales/salesDash";
import FinanceDashboard from "@/app/(dashboard)/components/finance/financeDash";
import OperationsDashboard from "@/app/(dashboard)/components/operations/operationsDash";

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent("/dashboard")}`);
  }
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent("/dashboard")}`);
  }

  const userRole = user.role;

  return (
    <PageLayout title="Dashboard" user={user}>
      <div className="py-4">
        {/* Page Header */}
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            {userRole === "ADMIN" && "Manage your platform"}
            {userRole === "ASSISTANT_ADMIN" && "Manage your platform"}
            {userRole === "VENDOR" && "Manage your shop and products"}
            {userRole === "USER" && "Explore products and vendors"}
          </p>
        </div> */}

        {/* Render dashboard based on role */}
        {/* {(userRole === "ADMIN" || userRole === "ASSISTANT_ADMIN") && (
          <AdminDashboard />
        )} */}
        {/* Render dashboard based on role */}
        {(userRole === "SYSTEM_ADMIN" || userRole === "ASSISTANT_ADMIN") && (
          <AdminDashboardPage />
        )}

        {/* {userRole === "VENDOR" && <VendorDashboard userId={user.id} />} */}
        {userRole === "PROCUREMENT_QUALITY_MANAGER" && <ProcurementDashboard />}

        {userRole === "WAREHOUSE_INVENTORY_OFFICER" && <WarehouseDashboard />}
        {userRole === "SALES_LOGISTICS_MANAGER" && <SalesDashboard />}
        {userRole === "FINANCE_OFFICER" && <FinanceDashboard />}
        {userRole === "OPERATIONS_MANAGER" && <OperationsDashboard />}
      </div>
    </PageLayout>
  );
}
