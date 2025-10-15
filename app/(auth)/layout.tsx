// app/(auth)/layout.tsx
import { Suspense } from "react";
import AuthLoadingSkeleton from "./components/AuthLoading";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<AuthLoadingSkeleton />}>{children}</Suspense>;
}
