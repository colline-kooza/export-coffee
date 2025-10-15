import React, { Suspense } from "react";
import Signup from "../components/signup";
import AuthLoadingSkeleton from "../components/AuthLoading";

export default function page() {
  return (
    <Suspense fallback={<AuthLoadingSkeleton />}>
      <Signup />
    </Suspense>
  );
}
