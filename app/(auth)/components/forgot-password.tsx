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
import { sendForgotPasswordToken } from "../actions/users";
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "../types/user.schema";
import { Input } from "@/components/ui/input";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // Initialize react-hook-form with zod validation
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Form submission handler
  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsLoading(true);
    console.log(values);
    try {
      const result = await sendForgotPasswordToken(values);
      if (result.success) {
        toast.success("Success!", {
          description: "Password Reset Link sent Successfully",
        });
        // Optional: redirect to login page
        router.push("/login");
      } else {
        if (result.status === "UNAUTHORIZED") {
          toast.error("Wrong Credentials", {
            description: result.error,
          });
        } else {
          toast.error("Error", {
            description: result.error,
          });
        }
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
            title="Recover Password"
            subTitle="Enter your email to receive a reset link"
          />

          <hr className="my-4 border-dashed" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="block text-sm">Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SubmitButton
                title="Send Reset Link"
                loadingTitle="Sending"
                isLoading={isLoading}
              />
            </form>
          </Form>
        </div>

        <div className="bg-muted rounded-(--radius) border p-3">
          <p className="text-accent-foreground text-center text-sm">
            Remember your password?
            <Button asChild variant="link" className="ml-3 px-2">
              <Link href="/login">Login</Link>
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
}
