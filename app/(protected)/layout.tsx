import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getAuthUser } from "@/lib/auth";
import { getCurrentStaff, getBranchSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AppSidebarWrapper } from "./dashboard/components/app-sidebar-wrapper";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Check authentication
  const user = await getAuthUser();
  if (!user) {
    const pathname = "/dashboard";
    redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  // Check if user has workspace setup
  const staff = await getCurrentStaff();
  const session = await getBranchSession();

  // If no staff or session, redirect to workspace setup
  if (!staff || !session) {
    redirect("/workspace");
  }

  // Verify staff is active
  if (!staff.isActive) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="border-2">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">
              Account Inactive
            </AlertTitle>
            <AlertDescription className="mt-2 space-y-4">
              <p>
                Your staff account has been deactivated. Please contact your
                administrator to regain access.
              </p>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/logout">Sign Out</Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Verify branch is active
  if (!staff.branch.isActive) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="border-2">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">
              Branch Inactive
            </AlertTitle>
            <AlertDescription className="mt-2 space-y-4">
              <p>
                The branch "{staff.branch.name}" is currently inactive. Please
                contact your administrator or switch to an active branch.
              </p>
              <div className="flex gap-2">
                <Button asChild variant="default" size="sm">
                  <Link href="/workspace">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Switch Branch
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/logout">Sign Out</Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // All checks passed, render dashboard with server-side wrapper
  return (
    <SidebarProvider>
      <AppSidebarWrapper user={user} variant="inset" />
      <SidebarInset>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
