"use client";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

import AuthHeader from "@/app/(auth)/components/AuthHeader";

import SubmitButton from "./SubmitButton";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "../types/user.schema";
import { resetPassword } from "../actions/users";
import { Input } from "@/components/ui/input";

export default function ResetPassword({ token }: { token: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Initialize react-hook-form with zod validation
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      token: token,
    },
  });

  // Form submission handler
  async function onSubmit(values: ResetPasswordFormValues) {
    setIsLoading(true);
    console.log(values);
    try {
      const result = await resetPassword(values);
      if (result.success) {
        toast.success("Success!", {
          description: "Password reset successfully",
        });
        // Redirect to login page after successful reset
        router.push("/login");
      } else {
        toast.error("Error", {
          description: result.error || "Failed to reset password",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="bg-card m-auto h-fit w-full max-w-md rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
        <div className="p-8 pb-6">
          <AuthHeader
            title="Reset Your Password"
            subTitle="Enter your new password below"
          />
          <hr className="my-4 border-dashed" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="block text-sm">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input isPassword type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="block text-sm">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input isPassword type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton
                title="Reset Password"
                loadingTitle="Resetting..."
                isLoading={isLoading}
              />
            </form>
          </Form>
        </div>

        <div className="bg-muted rounded-(--radius) border p-3">
          <p className="text-accent-foreground text-center text-sm">
            Remember your password?
            <Button asChild variant="link" className="ml-3 px-2">
              <Link href="/login">Back to Sign In</Link>
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
}
