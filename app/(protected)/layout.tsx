// app/(protected)/layout.tsx
import { getCurrentUser, getUserPermissions } from "@/lib/session";
import { redirect } from "next/navigation";
import { getRoleLabel } from "@/lib/permissions";
import CoffeeSidebar from "./dashboard/components/CoffeeExportSidebar";
import { Navbar } from "./dashboard/components/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current user - if not authenticated, redirect to login
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const user = {
    name: currentUser.name,
    email: currentUser.email,
    image: null,
    role: getRoleLabel(currentUser.role),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Custom Sidebar - No Provider Needed */}
      <CoffeeSidebar  userPermissions={currentUser.permissions}/>

      {/* Main Content Area */}
      <div className="lg:pl-72">
        {/* Navbar */}
        <Navbar user={user} />

        {/* Page Content */}
        <main className="p-1 ">{children}</main>
      </div>
    </div>
  );
}

// Export metadata for the layout
export const metadata = {
  title: "Coffee Export Management System",
  description: "Manage your coffee export operations efficiently",
};