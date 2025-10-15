import React, { Suspense } from "react";
import AuthLoadingSkeleton from "../components/AuthLoading";
import LoginForm from "../components/login";

export default function page() {
  return (
    <Suspense fallback={<AuthLoadingSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
