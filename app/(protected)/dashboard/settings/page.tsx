import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import PageLayout from "../components/PageLayout";

export default async function page() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }
  return (
    <PageLayout user={user} title="Settings">
      <h2>The settings page</h2>
    </PageLayout>
  );
}
