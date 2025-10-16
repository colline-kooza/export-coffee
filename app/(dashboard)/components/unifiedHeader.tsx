"use client";

import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UnifiedHeaderProps {
  user: User;
  levels: any[];
  isLevelsLoading: boolean;
  onLevelChange: (levelId: string, title: string) => void;
}

export function UnifiedHeader({
  user,
  levels,
  isLevelsLoading,
  onLevelChange,
}: UnifiedHeaderProps) {
  const activeLevel = levels?.[0];

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-between px-3 py-2 h-auto bg-transparent"
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {user.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="text-left min-w-0">
          <p className="text-xs font-medium text-slate-600">Wharehouse</p>
          <p className="text-sm font-semibold text-slate-900 truncate">
            {activeLevel?.title || "Dashboard"}
          </p>
        </div>
      </div>
      <ChevronsUpDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
    </Button>
  );
}
