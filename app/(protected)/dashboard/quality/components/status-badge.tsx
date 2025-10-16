import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "APPROVED" | "BORDERLINE" | "REJECTED";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    APPROVED: "bg-green-100 text-green-800 hover:bg-green-100",
    BORDERLINE: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    REJECTED: "bg-red-100 text-red-800 hover:bg-red-100",
  };

  return <Badge className={variants[status]}>{status}</Badge>;
}
