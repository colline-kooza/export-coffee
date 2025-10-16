import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { QCForm } from "./qc-form";

export default function CreateQCPage() {
  // In a real app, you'd get the current user's ID from auth
  const inspectorId = "inspector-1";

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="bg-card w-full rounded-xl border p-6">
          <QCForm inspectorId={inspectorId} />
        </div>
      </div>
    </main>
  );
}
