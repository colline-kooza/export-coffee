import { User } from "@/lib/auth";
import { getCurrentStaff, getUserPermissions } from "@/lib/session";
import { AppSidebar } from "./app-sidebar";

/**
 * Server-side wrapper that fetches permissions and passes to client sidebar
 */
export async function AppSidebarWrapper({
  user,
  ...props
}: React.ComponentProps<typeof AppSidebar> & { user: User }) {
  // Get staff details and permissions server-side
  const staff = await getCurrentStaff();
  const permissions = await getUserPermissions();

  const initialData = {
    permissions,
    role: staff?.role.name || null,
    branchId: staff?.branch.id || null,
    branchName: staff?.branch.name || null,
    institutionName: staff?.branch.institution.name || null,
  };

  return <AppSidebar user={user} initialData={initialData} {...props} />;
}
