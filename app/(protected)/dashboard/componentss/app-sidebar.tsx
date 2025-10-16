"use client";

import { easeOut } from "framer-motion";
import type * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  getNavigationForRole,
  NavigationItem,
  UserRole,
} from "@/config/navigations";
import { useBasicHouses } from "@/hooks/useHouseQueries";
import { UnifiedHeader, User } from "./unifiedHeader";
import { NavUser } from "./nav-user";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
  //   schools?: School[];
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const navigationItems = getNavigationForRole(user.role as UserRole);
  // const { pagination } = useGetNotices();
  const isCollapsed = state === "collapsed";

  // Fetch levels for non-super-admin users
  const { levels, isLoading: levelsLoading } = useBasicHouses();

  // Check if current path should be active, with special handling for super admin dashboard
  const isItemActive = (item: NavigationItem): boolean => {
    if (item.url === "/dashboard" && user.role === UserRole.SYSTEM_ADMIN) {
      // For super admin, dashboard is active if on dashboard or root
      return pathname === "/dashboard/super-admin" || pathname === "/";
    }
    return pathname === item.url;
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, ease: easeOut },
    },
  };

  const badgeVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: { type: "spring" as const, stiffness: 500, damping: 30 },
    },
  };

  const NavMainContent = ({ items }: { items: NavigationItem[] }) => (
    <SidebarGroup className="px-0">
      <SidebarMenu className="space-y-0.5">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.02 }}
              className="sidebar-item"
            >
              {item.items ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.items.some(
                    (subItem) => pathname === subItem.url
                  )}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={`group relative ${
                          isCollapsed ? "px-2.5 py-2 mx-1" : "px-4 py-2 mx-2"
                        } rounded-lg font-medium text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/20 data-[state=open]:bg-gradient-to-r data-[state=open]:from-primary/20 data-[state=open]:to-primary/10 data-[state=open]:text-primary transition-all duration-200 ease-out`}
                      >
                        <motion.div
                          className="flex items-center justify-between w-full"
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <item.icon className="h-4 w-4 transition-colors duration-200 flex-shrink-0" />
                            </div>
                            <span className="font-inter truncate text-gray-500 text-sm font-medium">
                              {item.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 flex-shrink-0" />
                          </div>
                        </motion.div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="overflow-hidden">
                      <SidebarMenuSub className="ml-4 mt-1 space-y-0.5">
                        {item.items?.map((subItem, subIndex) => (
                          <motion.div
                            key={subItem.title}
                            initial={{ opacity: 0, y: -3 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: subIndex * 0.03 }}
                          >
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.url}
                                className="px-3 py-1.5 mx-2 text-sm font-medium text-gray-500 hover:text-primary hover:bg-primary/10 data-[active=true]:bg-gradient-to-r data-[active=true]:from-primary/20 data-[active=true]:to-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold transition-all duration-150 font-inter rounded-md"
                              >
                                <Link
                                  href={subItem.url}
                                  className="flex items-center justify-between w-full"
                                >
                                  <span className="truncate">
                                    {subItem.title}
                                  </span>
                                  {subItem.badge && (
                                    <Badge
                                      variant="secondary"
                                      className="h-4 px-1.5 text-xs bg-gradient-to-r from-primary to-primary/90 text-white border-0 font-medium"
                                    >
                                      {subItem.badge}
                                    </Badge>
                                  )}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </motion.div>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isItemActive(item)}
                    className={`group relative ${
                      isCollapsed ? "px-2.5 py-2 mx-1" : "px-4 py-2 mx-2"
                    } rounded-lg font-medium text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/20 data-[active=true]:bg-gradient-to-r data-[active=true]:from-primary data-[active=true]:to-primary/90 data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:shadow-primary/30 transition-all duration-200 ease-out`}
                  >
                    <Link
                      href={item.url}
                      className="flex items-center justify-between w-full"
                    >
                      <motion.div
                        className="flex items-center gap-3"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="relative">
                          <item.icon className="h-4 w-4 transition-colors duration-200 flex-shrink-0" />
                        </div>
                        <span className="font-medium truncate font-inter text-sm">
                          {item.title}
                        </span>
                      </motion.div>

                      {item.badge && (
                        <motion.div
                          variants={badgeVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <Badge
                            variant="secondary"
                            className="h-5 px-2 text-xs bg-gradient-to-r from-primary to-primary/90 text-white border-0 font-medium"
                          >
                            {item.badge}
                          </Badge>
                        </motion.div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </SidebarMenu>
    </SidebarGroup>
  );

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-primary/20 bg-gradient-to-b from-white  to-white shadow-sm overflow-x-hidden"
      {...props}
    >
      <SidebarHeader className="border-b border-gray-200/50 bg-white/95 backdrop-blur-sm px-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <UnifiedHeader
            user={user}
            levels={levels}
            isLevelsLoading={levelsLoading}
            onLevelChange={(levelId, title) => {
              console.log(`Level changed to: ${title} (${levelId})`);
            }}
          />
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="bg-gradient-to-b overflow-x-hidden from-white to-white custom-scrollbar py-1">
        <NavMainContent items={navigationItems} />
      </SidebarContent>

      <SidebarFooter className="border-t border-primary/20 bg-white/90 backdrop-blur-sm p-3">
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail className="bg-gradient-to-b from-primary/20 to-primary/30" />
    </Sidebar>
  );
}
