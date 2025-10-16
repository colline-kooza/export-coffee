import { User } from "@/lib/auth";
import React, { ReactNode } from "react";
import { SiteHeader } from "./site-header";

export default function PageLayout({
  user,
  title,
  children,
}: {
  user: User;
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <SiteHeader user={user} title={title} />
      <div className="">{children}</div>
    </div>
  );
}
