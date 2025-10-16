"use client";

import {
  Settings,
  HelpCircle,
  Bell,
  Coffee,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { 
  navigationSections, 
  defaultPermissions,
  type NavigationSection as NavigationSectionType 
} from "@/lib/navigationSections";

interface NavItemProps {
  href: string;
  icon: any;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

interface SubNavItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

interface NavSectionProps {
  title: string;
  items: NavigationSectionType["items"];
  userPermissions: string[];
  onNavigate: () => void;
  currentPath: string;
}

interface CoffeeSidebarProps {
  userPermissions?: string[];
}

function NavItem({ href, icon: Icon, children, isActive, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all ${
        isActive
          ? "bg-[#8B4513] text-white shadow-sm"
          : "text-gray-700 dark:text-gray-300 hover:bg-[#8B4513]/10 dark:hover:bg-[#8B4513]/20"
      }`}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="font-medium">{children}</span>
    </Link>
  );
}

function SubNavItem({ href, children, isActive, onClick }: SubNavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 pl-10 pr-3 py-2 text-sm rounded-lg transition-all ${
        isActive
          ? "bg-[#8B4513]/20 text-[#8B4513] dark:text-[#D2691E]"
          : "text-gray-600 dark:text-gray-400 hover:bg-[#8B4513]/10 dark:hover:bg-[#8B4513]/20"
      }`}
    >
      <span>{children}</span>
    </Link>
  );
}

function NavSection({ title, items, userPermissions, onNavigate, currentPath }: NavSectionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const hasPermission = (permissions?: string[]) => {
    if (!permissions || permissions.length === 0) return true;
    return permissions.some((perm) => userPermissions.includes(perm));
  };

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  // Auto-expand parent if a sub-item is active
  useEffect(() => {
    items.forEach((item) => {
      if (item.subItems?.some((subItem) => currentPath === subItem.href)) {
        setExpandedItems((prev) => new Set(prev).add(item.label));
      }
    });
  }, [currentPath, items]);

  const filteredItems = items.filter((item) => hasPermission(item.permissions));

  if (filteredItems.length === 0) return null;

  return (
    <div className="space-y-1">
      <div className="px-3 mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B4513] dark:text-[#D2691E]">
          {title}
        </h3>
      </div>
      <div className="space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isExpanded = expandedItems.has(item.label);
          const filteredSubItems = item.subItems?.filter((subItem) =>
            hasPermission(subItem.permissions)
          );
          const isActive = currentPath === item.href;

          return (
            <div key={item.label}>
              {hasSubItems ? (
                <button
                  onClick={() => toggleExpand(item.label)}
                  className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm rounded-lg transition-all text-gray-700 dark:text-gray-300 hover:bg-[#8B4513]/10 dark:hover:bg-[#8B4513]/20"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <svg
                    className={`h-4 w-4 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              ) : (
                <NavItem href={item.href} icon={Icon} onClick={onNavigate} isActive={isActive}>
                  {item.label}
                </NavItem>
              )}
              {hasSubItems && isExpanded && (
                <div className="mt-1 space-y-1">
                  {filteredSubItems?.map((subItem) => (
                    <SubNavItem
                      key={subItem.label}
                      href={subItem.href}
                      onClick={onNavigate}
                      isActive={currentPath === subItem.href}
                    >
                      {subItem.label}
                    </SubNavItem>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CoffeeSidebar({ userPermissions = [] }: CoffeeSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Use provided permissions or fall back to defaults
  const permissions =  defaultPermissions;

  const handleNavigation = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg
          className="h-5 w-5 text-gray-700 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <nav
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 transform transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-gray-200 dark:border-gray-800 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-16 px-6 flex items-center border-b border-gray-200 dark:border-gray-800 bg-[#8B4513]">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 group"
              onClick={handleNavigation}
            >
              <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Coffee className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Coffee Export</h1>
                <p className="text-xs text-white/80">Management System</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
            {navigationSections.map((section) => (
              <NavSection
                key={section.title}
                title={section.title}
                items={section.items}
                userPermissions={permissions}
                onNavigate={handleNavigation}
                currentPath={pathname}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
            <NavItem 
              href="/dashboard/settings" 
              icon={Settings} 
              onClick={handleNavigation}
              isActive={pathname === "/dashboard/settings"}
            >
              Settings
            </NavItem>
            <NavItem 
              href="/dashboard/notifications" 
              icon={Bell} 
              onClick={handleNavigation}
              isActive={pathname === "/dashboard/notifications"}
            >
              Notifications
            </NavItem>
            <NavItem 
              href="/dashboard/help" 
              icon={HelpCircle} 
              onClick={handleNavigation}
              isActive={pathname === "/dashboard/help"}
            >
              Help & Support
            </NavItem>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}