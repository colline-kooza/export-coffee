import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import React from "react";

export default function SubmitButton({
  isLoading,
  loadingTitle,
  title,
}: {
  isLoading: boolean;
  loadingTitle: string;
  title: string;
}) {
  return (
    <Button className="w-full" type="submit" disabled={isLoading}>
      {isLoading && <RefreshCcw className="animate-spin w-4 h-4 mr-2" />}
      {isLoading ? loadingTitle : title}
    </Button>
  );
}
