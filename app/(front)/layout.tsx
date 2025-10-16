import React, { ReactNode } from "react";
import SiteHeader from "./components/siteHeader";

export default function FrontLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <SiteHeader />
      {children}
    </div>
  );
}
