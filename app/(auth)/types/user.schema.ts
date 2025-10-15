import { z } from "zod";

export const UserRoleSchema = z.enum([
  "USER",
  "ADMIN",
  "ASSISTANT_ADMIN",
  "SUPER_ADMIN",
]);
export const UserBaseSchema = z.object({
  id: z.string().cuid(),
  firstName: z.string().min(2, "Firstname must be at least 2 characters"),
  emailVerified: z.boolean(),
  phoneVerified: z.boolean(),
  physicalVerified: z.boolean(),
  image: z.string().optional().nullable(),
  role: UserRoleSchema,
  lastName: z.string().min(2, "Lastname must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  createdAt: z.string(),
  updatedAt: z.string(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});
export const ShopBaseSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  shopBanner: z.string().optional().nullable(),
  shopName: z.string().min(2, "Shop Name must be at least 2 characters"),
  shopBuilding: z.string().min(3, "Please enter atleast 3 characters"),
  shopStreet: z.string().min(3, "Please enter atleast 3 characters"),
  shopRoom: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  verificationCode: z.string().optional().nullable(),
  isVerified: z.boolean(),
});

export const RegisterUserSchema = UserBaseSchema.omit({
  id: true,
  emailVerified: true,
  phoneVerified: true,
  physicalVerified: true,
  createdAt: true,
  updatedAt: true,
  role: true,
});
// Define the validation schema with Zod
export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});
export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});
// Reset password form schema
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    token: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const VendorUserSchema = UserBaseSchema.extend({
  shop: ShopBaseSchema,
});
export interface VendorUser {
  id: string;
  name: string;
  phone: string;
}

export interface Vendor {
  id: string;
  shopBanner: string | null;
  shopBuilding: string;
  shopName: string;
  shopSlug: string;
  shopRoom: string;
  shopStreet: string;
  verificationCode: string;
  isVerified: boolean;
  createdAt: Date;
  user: VendorUser;
}

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
// Type for the form values
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof RegisterUserSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type User = z.infer<typeof UserBaseSchema>;
// export type VendorUser = z.infer<typeof VendorUserSchema>;
