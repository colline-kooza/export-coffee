"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useWorkspaceStatus,
  useSetupWorkspace,
  getSetupStepInfo,
  type SetupStep,
} from "@/hooks/useWorkspace";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import {
  Building2,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Users,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function WorkspacePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SetupStep>("checking");
  const [isSettingUp, setIsSettingUp] = useState(false);

  const { hasWorkspace, needsSetup, isLoading, isError, error, refetch } =
    useWorkspaceStatus();
  const setupWorkspaceMutation = useSetupWorkspace();

  // Redirect if workspace already exists
  useEffect(() => {
    if (!isLoading && hasWorkspace && !needsSetup) {
      // Workspace already configured, redirect to dashboard
      router.push("/dashboard");
    }
  }, [hasWorkspace, needsSetup, isLoading, router]);

  // Handle workspace setup with step simulation
  const handleSetupWorkspace = async () => {
    setIsSettingUp(true);
    setCurrentStep("creating-institution");

    // Simulate step progression for better UX
    const steps: SetupStep[] = [
      "creating-institution",
      "creating-branch",
      "creating-roles",
      "creating-permissions",
      "assigning-permissions",
      "creating-staff",
      "finalizing",
    ];

    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length - 1) {
        stepIndex++;
        setCurrentStep(steps[stepIndex]);
      }
    }, 800); // Change step every 800ms for visual feedback

    try {
      const result = await setupWorkspaceMutation.mutateAsync();

      clearInterval(stepInterval);
      setCurrentStep("complete");

      // Wait a moment to show completion
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      clearInterval(stepInterval);
      setCurrentStep("error");
      setIsSettingUp(false);
    }
  };

  // Get current step info
  const stepInfo = getSetupStepInfo(currentStep);

  // Loading state - checking workspace status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 py-8">
              <Spinner className="h-12 w-12 text-primary" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Checking your workspace...
                </h3>
                <p className="text-sm text-muted-foreground">
                  Please wait while we verify your account
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Error Loading Workspace
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Failed to check workspace status</AlertTitle>
              <AlertDescription>
                {error?.message || "An unexpected error occurred"}
              </AlertDescription>
            </Alert>
            <Button onClick={() => refetch()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Setup in progress
  if (isSettingUp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-primary" />
                </div>
                {currentStep !== "complete" && currentStep !== "error" && (
                  <div className="absolute -bottom-1 -right-1">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                )}
                {currentStep === "complete" && (
                  <div className="absolute -bottom-1 -right-1">
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <CardTitle className="text-2xl">{stepInfo.title}</CardTitle>
            <CardDescription className="text-base">
              {stepInfo.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={stepInfo.progress} className="h-3" />
              <p className="text-center text-sm text-muted-foreground font-medium">
                {stepInfo.progress}% complete
              </p>
            </div>

            {/* Setup Steps Checklist */}
            <div className="space-y-3 bg-muted/30 rounded-lg p-4">
              <SetupChecklistItem
                title="Organization Created"
                completed={[
                  "creating-branch",
                  "creating-roles",
                  "creating-permissions",
                  "assigning-permissions",
                  "creating-staff",
                  "finalizing",
                  "complete",
                ].includes(currentStep)}
                active={currentStep === "creating-institution"}
              />
              <SetupChecklistItem
                title="Main Branch Established"
                completed={[
                  "creating-roles",
                  "creating-permissions",
                  "assigning-permissions",
                  "creating-staff",
                  "finalizing",
                  "complete",
                ].includes(currentStep)}
                active={currentStep === "creating-branch"}
              />
              <SetupChecklistItem
                title="Roles Configured"
                completed={[
                  "creating-permissions",
                  "assigning-permissions",
                  "creating-staff",
                  "finalizing",
                  "complete",
                ].includes(currentStep)}
                active={currentStep === "creating-roles"}
              />
              <SetupChecklistItem
                title="Permissions Setup"
                completed={[
                  "assigning-permissions",
                  "creating-staff",
                  "finalizing",
                  "complete",
                ].includes(currentStep)}
                active={currentStep === "creating-permissions"}
              />
              <SetupChecklistItem
                title="Access Control Configured"
                completed={[
                  "creating-staff",
                  "finalizing",
                  "complete",
                ].includes(currentStep)}
                active={currentStep === "assigning-permissions"}
              />
              <SetupChecklistItem
                title="Admin Profile Created"
                completed={["finalizing", "complete"].includes(currentStep)}
                active={currentStep === "creating-staff"}
              />
            </div>

            {currentStep === "complete" && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-900">Success!</AlertTitle>
                <AlertDescription className="text-green-800">
                  Your workspace is ready. Redirecting to dashboard...
                </AlertDescription>
              </Alert>
            )}

            {currentStep === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Setup Failed</AlertTitle>
                <AlertDescription>
                  An error occurred during workspace setup. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Welcome screen - needs setup
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">
              Welcome to Your Loan Management System
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Let's set up your workspace in just a few seconds
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* What will be created */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              What we'll set up for you:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FeatureCard
                icon={<Building2 className="h-5 w-5" />}
                title="Your Organization"
                description="A dedicated institution for your lending operations"
              />
              <FeatureCard
                icon={<Building2 className="h-5 w-5" />}
                title="Main Branch"
                description="Your primary location for business operations"
              />
              <FeatureCard
                icon={<Users className="h-5 w-5" />}
                title="User Roles"
                description="Admin, Manager, Loan Officer, and Auditor roles"
              />
              <FeatureCard
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Permissions"
                description="Role-based access control for security"
              />
            </div>
          </div>

          {/* Setup Button */}
          <div className="space-y-4">
            <Button
              onClick={handleSetupWorkspace}
              className="w-full h-12 text-base font-semibold"
              size="lg"
              disabled={setupWorkspaceMutation.isPending}
            >
              {setupWorkspaceMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Setting up workspace...
                </>
              ) : (
                <>
                  <Building2 className="mr-2 h-5 w-5" />
                  Set Up My Workspace
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              This will only take a few seconds and you can start managing loans
              immediately
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for setup checklist items
function SetupChecklistItem({
  title,
  completed,
  active,
}: {
  title: string;
  completed: boolean;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center transition-colors ${
          completed
            ? "bg-green-500 text-white"
            : active
            ? "bg-primary text-white"
            : "bg-muted border-2 border-muted-foreground/20"
        }`}
      >
        {completed ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : active ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
        )}
      </div>
      <span
        className={`text-sm font-medium transition-colors ${
          completed
            ? "text-green-700"
            : active
            ? "text-primary"
            : "text-muted-foreground"
        }`}
      >
        {title}
      </span>
    </div>
  );
}

// Helper component for feature cards
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 p-4 bg-background rounded-lg border border-border/50">
      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
