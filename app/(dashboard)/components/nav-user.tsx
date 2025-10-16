"use client";

import { LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "./unifiedHeader";

interface NavUserProps {
  user: User;
}

export function NavUser({ user }: NavUserProps) {
  return (
    <div className="flex items-center justify-between w-full px-2 py-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {user.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-900 truncate">
            {user.name}
          </p>
          <p className="text-xs text-slate-600 truncate">{user.email}</p>
        </div>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
