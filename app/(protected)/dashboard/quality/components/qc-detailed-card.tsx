import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface QCDetailCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export function QCDetailCard({ label, value, icon }: QCDetailCardProps) {
  return (
    <Card className="rounded-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

interface TimelineItemProps {
  label: string;
  date: Date | null;
  status: "completed" | "pending";
}

export function TimelineItem({ label, date, status }: TimelineItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`w-3 h-3 rounded-full ${status === "completed" ? "bg-green-500" : "bg-gray-300"}`}
        />
        <div className="w-0.5 h-12 bg-gray-200" />
      </div>
      <div className="pb-8">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          {date ? format(new Date(date), "MMM dd, yyyy HH:mm") : "Pending"}
        </p>
      </div>
    </div>
  );
}
