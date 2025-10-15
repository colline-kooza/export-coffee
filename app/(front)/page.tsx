import { redirect } from "next/navigation";
import React from "react";

export default function page() {
  redirect("/login");
  return (
    <div>
      <h2>Welcome too Lendbox</h2>
    </div>
  );
}
