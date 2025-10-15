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
const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.BETTER_AUTH_URL || "";
export async function registerUser(data: RegisterFormValues) {
  try {
    console.log(data);
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
    // Others
    return {
      success: true,
      data: data,
      error: null,
    };
  } catch (error) {
    console.log(error);
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
export async function loginUser(data: LoginFormValues) {
  try {
    console.log(data);
    // Call the register api
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });
    // Others
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
type SendMailData = {
  to: string;
  subject: string;
  url: string;
};
export async function sendEmail(data: SendMailData) {
  try {
    const { data: resData, error } = await resend.emails.send({
      from: "Ads Market Pro <info@desishub.com>",
      to: data.to,
      subject: data.subject,
      react: PasswordResetEmail({
        userEmail: data.to,
        resetLink: data.url,
        expirationTime: "10 Mins",
      }),
    });
    if (error) {
      console.log("ERROR", error);
      return {
        success: false,
        error: error,
        data: null,
      };
    }
    console.log("SUCCESS DATA", data);
    return {
      success: false,
      error: null,
      data: resData,
    };
  } catch (error) {
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
    // console.log(data);
    // Call the register api
    const data = await auth.api.forgetPassword({
      body: {
        email: formData.email, // required
        redirectTo: `${baseUrl}/reset-password`,
      },
    });
    // Others
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
    // console.log(data);
    // Call the register api
    const data = await auth.api.resetPassword({
      body: {
        newPassword: formData.newPassword, // required
        token: formData.token, // required
      },
    });

    // Others
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
