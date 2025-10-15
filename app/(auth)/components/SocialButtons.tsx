"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/global/icons";

function SocialButtonsInner() {
  const [isLoading, setIsLoading] = React.useState<"google" | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const redirectUrl =
    redirectParam && isValidRedirect(redirectParam)
      ? redirectParam
      : "/dashboard"; // Your default post-login page
  console.log(redirectUrl);

  function isValidRedirect(url: string): boolean {
    return url.startsWith("/") && !url.startsWith("//");
  }

  async function handleSignIn(provider: "google") {
    setIsLoading(provider);
    setError(null);

    try {
      await signIn.social({
        provider: provider,
        callbackURL: redirectUrl,
      });
    } catch (error) {
      console.error("Sign in failed:", error);
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(null);
    }
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-3">
      {error && <div className="text-sm text-red-500 text-center">{error}</div>}
      <Button
        onClick={() => handleSignIn("google")}
        type="button"
        variant="outline"
        disabled={isLoading === "google"}
      >
        {isLoading === "google" ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google />
        )}
        <span>
          {isLoading === "google" ? "Signing in..." : "Continue with Google"}
        </span>
      </Button>
    </div>
  );
}

export default function SocialButtons() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SocialButtonsInner />
    </Suspense>
  );
}
