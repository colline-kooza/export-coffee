import React from "react";
import ResetPassword from "../components/reset-password";
import { ErrorCard } from "../components/ErrorCard";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{
    token: string;
  }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return <ErrorCard />;
  }
  return (
    <div>
      <ResetPassword token={token} />
    </div>
  );
}
