import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoadingSkeleton() {
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="bg-card m-auto h-fit w-full max-w-md rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
        <div className="p-8 pb-6">
          {/* Header Skeleton */}
          <div className="mb-6 text-center">
            <Skeleton className="mx-auto mb-2 h-8 w-3/4" />
            <Skeleton className="mx-auto h-4 w-2/3" />
          </div>

          {/* Social Button Skeleton */}
          <div className="mt-6 grid grid-cols-1 gap-3">
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Divider */}
          <div className="my-4 flex items-center">
            <Skeleton className="h-px flex-1" />
          </div>

          {/* Form Fields Skeleton */}
          <div className="space-y-3">
            {/* Email Field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Submit Button */}
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="bg-muted rounded-(--radius) border p-3">
          <div className="flex items-center justify-center">
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    </section>
  );
}
