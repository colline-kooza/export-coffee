"use server";

import { Resend } from "resend";
import { APIError } from "better-auth/api";
import {
  ForgotPasswordFormValues,
  LoginFormValues,
  RegisterFormValues,
} from "../types/user.schema";
import { auth } from "@/lib/auth";
import PasswordResetEmail from "@/emails/password-reset-email";
import db from "@/prisma/db";

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.BETTER_AUTH_URL || "";

export async function loginUser(data: LoginFormValues) {
  try {
    console.log("Login attempt for:", data.email);

    // Check if user exists and is active BEFORE attempting login
    const user = await db.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        email: true,
        isActive: true,
        role: true,
      },
    });

    if (!user) {
      console.log("User not found:", data.email);
      return {
        success: false,
        data: null,
        error: "Invalid email or password",
      };
    }

    if (!user.isActive) {
      console.log("User account is disabled:", data.email);
      return {
        success: false,
        data: null,
        error: "Your account has been disabled. Please contact support.",
      };
    }

    console.log("User is active, attempting login...");

    // Now attempt the actual login
    const result = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });

    console.log("Login successful for:", data.email);

    return {
      success: true,
      data: result,
      error: null,
    };
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof APIError) {
      console.log("API Error:", error.message, error.status);

      if (error.status === "UNAUTHORIZED") {
        return {
          success: false,
          data: null,
          error: "Invalid email or password",
          status: error.status,
        };
      }
    }

    return {
      success: false,
      data: null,
      error: "Something went wrong. Please try again.",
    };
  }
}

export async function registerUser(data: RegisterFormValues) {
  try {
    console.log("Registration attempt:", data.email);

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        success: false,
        data: null,
        error: "Email is already registered",
      };
    }

    // Call the register api
    await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
    });

    return {
      success: true,
      data: data,
      error: null,
    };
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof APIError) {
      console.log(error.message, error.status);
      if (error.status === "UNPROCESSABLE_ENTITY") {
        const errorMsg =
          error.message === "Failed to create user"
            ? "Phone Number is Already Taken"
            : "Email is Already Taken";
        return {
          success: false,
          data: null,
          error: errorMsg,
          status: error.status,
        };
      }
    }
    return {
      success: false,
      data: null,
      error: "Something went wrong",
    };
  }
}

type SendMailData = {
  to: string;
  subject: string;
  url: string;
};

export async function sendEmail(data: SendMailData) {
  try {
    const { data: resData, error } = await resend.emails.send({
      from: "Coffee Management <info@desishub.com>",
      to: data.to,
      subject: data.subject,
      react: PasswordResetEmail({
        userEmail: data.to,
        resetLink: data.url,
        expirationTime: "10 Mins",
      }),
    });

    if (error) {
      console.log("Email send error:", error);
      return {
        success: false,
        error: error,
        data: null,
      };
    }

    console.log("Email sent successfully");
    return {
      success: true,
      error: null,
      data: resData,
    };
  } catch (error) {
    console.error("Email error:", error);
    return {
      success: false,
      error: error,
      data: null,
    };
  }
}

export async function sendForgotPasswordToken(
  formData: ForgotPasswordFormValues
) {
  try {
    const data = await auth.api.forgetPassword({
      body: {
        email: formData.email,
        redirectTo: `${baseUrl}/reset-password`,
      },
    });

    return {
      success: true,
      data: data,
      error: null,
    };
  } catch (error) {
    if (error instanceof APIError) {
      console.log(error.message, error.status);
      if (error.status === "UNAUTHORIZED") {
        return {
          success: false,
          data: null,
          error: error.message,
          status: error.status,
        };
      }
    }
    return {
      success: false,
      data: null,
      error: "Something went wrong",
    };
  }
}

export async function resetPassword(formData: {
  newPassword: string;
  token: string;
}) {
  try {
    const data = await auth.api.resetPassword({
      body: {
        newPassword: formData.newPassword,
        token: formData.token,
      },
    });

    return {
      success: true,
      data: data,
      error: null,
    };
  } catch (error) {
    if (error instanceof APIError) {
      console.log(error.message, error.status);
      if (error.status === "UNAUTHORIZED") {
        return {
          success: false,
          data: null,
          error: error.message,
          status: error.status,
        };
      }
    }
    return {
      success: false,
      data: null,
      error: "Something went wrong",
    };
  }
}
