"use client";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

import { useRouter, useSearchParams } from "next/navigation";

import SocialButtons from "./SocialButtons";

import AuthHeader from "@/app/(auth)/components/AuthHeader";

import SubmitButton from "./SubmitButton";
import { RegisterFormValues, RegisterUserSchema } from "../types/user.schema";
import { registerUser } from "../actions/users";
import { Input } from "@/components/ui/input";
import { config } from "@/config/site";

export default function Signup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = "/workspace";
  // const redirectTo = searchParams.get("redirect") || "/dashboard";
  console.log(redirectTo);
  // Initialize form with React Hook Form and Zod validation
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: RegisterFormValues) => {
    console.log(data);
    setIsSubmitting(true);

    try {
      const result = await registerUser(data);
      if (result.success) {
        toast.success("Success!", {
          description: "Your account has been created successfully",
        });
        // Optional: redirect to login page
        router.push(redirectTo);
      } else {
        if (result.status === "UNPROCESSABLE_ENTITY") {
          toast.error("Account Registration Failed", {
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
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="bg-card m-auto h-fit w-full max-w-md rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
        <div className="p-8 pb-6">
          <AuthHeader
            title={`Create a ${config.name} Account`}
            subTitle="Welcome! Create an account to get started"
          />
          <SocialButtons />

          <hr className="my-4 border-dashed" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Firstname</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Lastname</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input isPassword type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton
                title="Create Account"
                loadingTitle="Creating Account..."
                isLoading={isSubmitting}
              />
            </form>
          </Form>
        </div>

        <div className="bg-muted rounded-(--radius) border p-3">
          <p className="text-accent-foreground text-center text-sm">
            Have an account?
            <Button asChild variant="link" className="px-2 ml-3">
              <Link href="/login">Sign In</Link>
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
}
