"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCurrentBranch,
  useUserBranches,
  useCanSwitchBranches,
} from "@/hooks/usePermissions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Check, ChevronDown, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getAuthenticatedApi } from "@/config/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useSidebar } from "@/components/ui/sidebar";

export function BranchSwitcher() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [switching, setSwitching] = useState(false);
  const [switchingToId, setSwitchingToId] = useState<string | null>(null);
  const { state } = useSidebar();

  const {
    branchId,
    branchName,
    isLoading: sessionLoading,
  } = useCurrentBranch();
  const { branches, isLoading: branchesLoading } = useUserBranches();
  const { canSwitch } = useCanSwitchBranches();

  const isLoading = sessionLoading || branchesLoading;

  const handleSwitchBranch = async (targetBranchId: string) => {
    if (targetBranchId === branchId) {
      return; // Already on this branch
    }

    setSwitching(true);
    setSwitchingToId(targetBranchId);

    try {
      const api = await getAuthenticatedApi();
      const response = await api.post("/workspace/session", {
        branchId: targetBranchId,
      });

      if (response.data.success) {
        // Invalidate all queries to refetch with new branch context
        await queryClient.invalidateQueries();

        toast.success("Branch switched successfully", {
          description: `Now viewing ${response.data.session.branchName}`,
        });

        // Reload the page to update server-side data
        router.refresh();
      } else {
        throw new Error(response.data.error || "Failed to switch branch");
      }
    } catch (error) {
      console.error("Error switching branch:", error);
      toast.error("Failed to switch branch", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setSwitching(false);
      setSwitchingToId(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-2">
        <Skeleton className="h-9 w-full" />
      </div>
    );
  }

  if (state === "collapsed") {
    if (!canSwitch || branches.length <= 1) {
      return (
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted"
          title={branchName as string}
        >
          <Building2 className="h-4 w-4" />
        </Button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            disabled={switching}
            title={branchName as string}
          >
            {switching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Building2 className="h-4 w-4 text-muted " />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[280px]">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Switch Branch
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {branches.map((branch) => {
            const isCurrentBranch = branch.branchId === branchId;
            const isSwitching = switchingToId === branch.branchId;

            return (
              <DropdownMenuItem
                key={branch.branchId}
                onClick={() => handleSwitchBranch(branch.branchId)}
                disabled={isCurrentBranch || switching}
                className="flex items-start gap-2 py-3 cursor-pointer"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {isSwitching ? (
                    <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-primary" />
                  ) : isCurrentBranch ? (
                    <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                  ) : (
                    <div className="h-4 w-4 flex-shrink-0" />
                  )}
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium text-sm truncate ${
                          isCurrentBranch ? "text-primary" : "text-white"
                        }`}
                      >
                        {branch.branchName}
                      </span>
                      {isCurrentBranch && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-1.5 py-0"
                        >
                          Current
                        </Badge>
                      )}
                    </div>
                    {branch.branchLocation && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {branch.branchLocation}
                      </span>
                    )}
                    <Badge
                      variant="outline"
                      className="text-xs w-fit mt-1 px-1.5 py-0"
                    >
                      {branch.role}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Don't show if user can't switch branches
  if (!canSwitch || branches.length <= 1) {
    return (
      <div className="flex items-center gap-2 px-2">
        <div className="flex items-center gap-2 text-sm">
          <Building2 className="h-4 w-4 text-primary-foreground" />
          <span className="font-bold text-primary-foreground">
            {branchName}
          </span>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between gap-2 bg-transparent"
          disabled={switching}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="h-4 w-4 flex-shrink-0 text-primary-foreground" />
            <span className="font-medium text-sm truncate text-primary-foreground">
              {branchName}!!!
            </span>
          </div>
          {switching ? (
            <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
          ) : (
            <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[280px]">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Switch Branch
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {branches.map((branch) => {
          const isCurrentBranch = branch.branchId === branchId;
          const isSwitching = switchingToId === branch.branchId;

          return (
            <DropdownMenuItem
              key={branch.branchId}
              onClick={() => handleSwitchBranch(branch.branchId)}
              disabled={isCurrentBranch || switching}
              className="flex items-start gap-2 py-3 cursor-pointer"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {isSwitching ? (
                  <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-primary" />
                ) : isCurrentBranch ? (
                  <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                ) : (
                  <div className="h-4 w-4 flex-shrink-0" />
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium text-sm truncate ${
                        isCurrentBranch ? "text-primary" : ""
                      }`}
                    >
                      {branch.branchName}
                    </span>
                    {isCurrentBranch && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0"
                      >
                        Current
                      </Badge>
                    )}
                  </div>
                  {branch.branchLocation && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {branch.branchLocation}
                    </span>
                  )}
                  <Badge
                    variant="outline"
                    className="text-xs w-fit mt-1 px-1.5 py-0"
                  >
                    {branch.role}
                  </Badge>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Compact version for use in header/navbar
 */
export function BranchSwitcherCompact() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [switching, setSwitching] = useState(false);
  const [switchingToId, setSwitchingToId] = useState<string | null>(null);

  const {
    branchId,
    branchName,
    isLoading: sessionLoading,
  } = useCurrentBranch();
  const { branches, isLoading: branchesLoading } = useUserBranches();
  const { canSwitch } = useCanSwitchBranches();

  const isLoading = sessionLoading || branchesLoading;

  const handleSwitchBranch = async (targetBranchId: string) => {
    if (targetBranchId === branchId) {
      return;
    }

    setSwitching(true);
    setSwitchingToId(targetBranchId);

    try {
      const api = await getAuthenticatedApi();
      const response = await api.post("/workspace/session", {
        branchId: targetBranchId,
      });

      if (response.data.success) {
        await queryClient.invalidateQueries();
        toast.success("Branch switched", {
          description: response.data.session.branchName,
        });
        router.refresh();
      } else {
        throw new Error(response.data.error || "Failed to switch branch");
      }
    } catch (error) {
      toast.error("Failed to switch branch");
    } finally {
      setSwitching(false);
      setSwitchingToId(null);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-8 w-[120px]" />;
  }

  if (!canSwitch || branches.length <= 1) {
    return (
      <div className="flex items-center gap-1.5 text-sm px-2">
        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium truncate max-w-[100px]">{branchName}</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          disabled={switching}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span className="truncate max-w-[100px]">{branchName}</span>
          {switching ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        <DropdownMenuLabel className="text-xs">Branches</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {branches.map((branch) => {
          const isCurrentBranch = branch.branchId === branchId;
          const isSwitching = switchingToId === branch.branchId;

          return (
            <DropdownMenuItem
              key={branch.branchId}
              onClick={() => handleSwitchBranch(branch.branchId)}
              disabled={isCurrentBranch || switching}
              className="flex items-center gap-2 cursor-pointer"
            >
              {isSwitching ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : isCurrentBranch ? (
                <Check className="h-3.5 w-3.5 text-primary" />
              ) : (
                <div className="h-3.5 w-3.5" />
              )}
              <div className="flex flex-col flex-1 min-w-0">
                <span
                  className={`text-sm truncate ${
                    isCurrentBranch ? "font-medium text-primary" : ""
                  }`}
                >
                  {branch.branchName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {branch.role}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
