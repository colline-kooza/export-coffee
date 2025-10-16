import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status?: "pending" | "completed" | "warning";
}

interface ActivityListProps {
  title: string;
  activities: any[];
}

export function ActivityList({ title, activities }: ActivityListProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-amber-100 text-amber-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">
                  {activity.title}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {activity.description}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {activity.status && (
                  <Badge
                    className={`text-xs ${getStatusColor(activity.status)}`}
                  >
                    {activity.status}
                  </Badge>
                )}
                <span className="text-xs text-slate-400">
                  {activity.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
