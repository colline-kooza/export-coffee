// UserRoleModal.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { User } from "@/types/user.schema";
import { useUpdateRole } from "@/hooks/useUsers";
import { toast } from "sonner";

// Define available roles - adjust these based on your application
const USER_ROLES = [
  { value: "ADMIN", label: "Admin" },
  { value: "USER", label: "User" },
  { value: "VENDOR", label: "Vendor" },
  { value: "ASSISTANT_ADMIN", label: "Asst Admin" },
] as const;

type UserRole = (typeof USER_ROLES)[number]["value"];

interface UserRoleModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserRoleModal({ user, isOpen, onClose }: UserRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("USER");
  const updateRoleMutation = useUpdateRole();

  // Reset selected role when modal opens with a new user
  useEffect(() => {
    if (user && isOpen) {
      setSelectedRole((user.role as UserRole) || "USER");
    }
  }, [user, isOpen]);

  // Type-safe handler for role changes
  const handleRoleChange = (value: string) => {
    // Type guard to ensure the value is a valid UserRole
    if (USER_ROLES.some((role) => role.value === value)) {
      setSelectedRole(value as UserRole);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !selectedRole) {
      toast.error("Please select a role");
      return;
    }

    try {
      await updateRoleMutation.mutateAsync({
        id: user.id,
        role: selectedRole,
      });

      toast.success("Role updated successfully", {
        description: `${user.firstName} ${user.lastName} is now a ${selectedRole}`,
      });

      onClose();
    } catch (error) {
      toast.error("Failed to update role", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const handleClose = () => {
    setSelectedRole((user?.role as UserRole) ?? "USER");
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Update the role for {user.firstName} {user.lastName} ({user.email})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Select New Role</Label>
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a role" />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateRoleMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateRoleMutation.isPending || !selectedRole}
            >
              {updateRoleMutation.isPending ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
