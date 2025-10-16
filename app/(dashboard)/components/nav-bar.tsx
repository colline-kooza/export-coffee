"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface NavbarProps {
  onSearch: (query: string) => void;
  searchResults: any[];
  userId: string;
  schoolId: string;
  levelId: string;
}

export function Navbar({
  onSearch,
  searchResults,
  userId,
  schoolId,
  levelId,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center gap-4 px-4 flex-1">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search..."
          className="pl-10 bg-slate-50 border-slate-200"
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        {isOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
            {searchResults.map((result) => (
              <div
                key={result.href}
                className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm"
              >
                {result.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
