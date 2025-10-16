import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { User } from "@/lib/auth";

export function SiteHeader({ title, user }: { user: User; title: string }) {
  const navUser = {
    name: user.name,
    avatar: user.image ?? "",
    role: user.role,
    email: user.email,
  };

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
      <div className="">
        <NavUser user={navUser} />
      </div>
    </header>
  );
}
