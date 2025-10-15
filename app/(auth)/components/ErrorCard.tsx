import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ErrorCard() {
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="bg-card m-auto h-fit w-full max-w-md rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Invalid Reset Link
          </h1>

          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            This password reset link is invalid or has expired. Please request a
            new password reset link.
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/forgot-password">Request New Reset Link</Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/login" className="flex items-center justify-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </Button>
          </div>
        </div>

        <div className="bg-muted rounded-(--radius) border p-3">
          <p className="text-accent-foreground text-center text-xs text-gray-500 dark:text-gray-400">
            Reset links expire after 24 hours for security reasons
          </p>
        </div>
      </div>
    </section>
  );
}
