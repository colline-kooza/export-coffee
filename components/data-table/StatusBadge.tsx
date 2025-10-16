import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  variant?: "active" | "inactive" | "pending" | "suspended" | "completed" | "in-progress"
  className?: string
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const variantStyles = {
    active: "bg-green-100 text-green-800 border-green-200",
    inactive: "bg-gray-100 text-gray-800 border-gray-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    suspended: "bg-red-100 text-red-800 border-red-200",
    completed: "bg-blue-100 text-blue-800 border-blue-200",
    "in-progress": "bg-purple-100 text-purple-800 border-purple-200",
  }

  return (
    <Badge className={cn("font-medium capitalize border", variant && variantStyles[variant], className)}>
      {status}
    </Badge>
  )
}
