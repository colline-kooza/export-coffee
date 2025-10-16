import type React from "react";
import { DashboardLayout } from "./components/dashboard-layout";

export default function DLayout({ children }: { children: React.ReactNode }) {
  // Mock user data - replace with actual auth
  const mockUser = {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    role: "SYSTEM_ADMIN",
  };

  const mockLevel = {
    id: "level-1",
    title: "WhereHouse one",
  };

  return (
    <DashboardLayout user={mockUser} level={mockLevel}>
      {children}
    </DashboardLayout>
  );
}
