"use client";

import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SchoolSwitcherProps {
  schools: any[];
}

export function SchoolSwitcher({ schools }: SchoolSwitcherProps) {
  const activeSchool = schools.find((s) => s.isActive) || schools[0];

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-between px-3 py-2 h-auto bg-transparent"
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {activeSchool?.logo && (
          <img
            src={activeSchool.logo || "/placeholder.svg"}
            alt={activeSchool.name}
            className="h-5 w-5 rounded"
          />
        )}
        <div className="text-left min-w-0">
          <p className="text-xs font-medium text-slate-600">School</p>
          <p className="text-sm font-semibold text-slate-900 truncate">
            {activeSchool?.name}
          </p>
        </div>
      </div>
      <ChevronsUpDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
    </Button>
  );
}
