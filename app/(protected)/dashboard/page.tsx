// app/dashboard/page.tsx
import { redirect } from "next/navigation";

import { auth, getAuthUser } from "@/lib/auth"; // Adjust to your auth implementation
import PageLayout from "./components/PageLayout";
import AdminDashboard from "./components/AdminDashboard";
import VendorDashboard from "./components/VendorDashboard";
import UserDashboard from "./components/UserDashboard";

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
      <div className="container mx-auto md:px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            {userRole === "ADMIN" && "Manage your platform"}
            {userRole === "ASSISTANT_ADMIN" && "Manage your platform"}
            {userRole === "VENDOR" && "Manage your shop and products"}
            {userRole === "USER" && "Explore products and vendors"}
          </p>
        </div>

        {/* Render dashboard based on role */}
        {/* {(userRole === "ADMIN" || userRole === "ASSISTANT_ADMIN") && (
          <AdminDashboard />
        )} */}
        {/* Render dashboard based on role */}
        {(userRole === "ADMIN" || userRole === "ASSISTANT_ADMIN") && (
          <AdminDashboard />
        )}

        {/* {userRole === "VENDOR" && <VendorDashboard userId={user.id} />} */}
        {userRole === "VENDOR" && <VendorDashboard userId={user.id} />}

        {userRole === "USER" && <UserDashboard userId={user.id} />}
      </div>
    </PageLayout>
  );
}
