import Link from "next/link";
import React from "react";
import { Header } from "./Header";

export default function AuthHeader({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) {
  return (
    <div className="flex items-center justify-center flex-col">
      <Link href="/" aria-label="go home">
        <Header showTagline={false} />
      </Link>
      <h1 className="text-title mb-1 mt-4 text-xl font-semibold">{title}</h1>
      <p className="text-sm">{subTitle}</p>
    </div>
  );
}
