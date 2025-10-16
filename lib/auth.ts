import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { getRolePermissions } from "./permissions";
import { sendEmail } from "../app/(auth)/actions/users";
import db from "../prisma/db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        url: url,
      });
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          firstName: profile.given_name || "User",
          lastName: profile.family_name || "",
          name: profile.name,
          email: profile.email,
          emailVerified: profile.email_verified ?? true,
          phone: null,
          role: "OPERATIONS_MANAGER",
        };
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "OPERATIONS_MANAGER",
        input: false,
      },
      firstName: {
        type: "string",
        required: true,
      },
      lastName: {
        type: "string",
        required: true,
      },
      phone: {
        type: "string",
        required: false,
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: false,
      },
    },
  },
  // Add session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

export interface UserSession extends User {
  permissions?: string[];
  role: string;
}

/**
 * Get authenticated user with permissions
 */
export async function getAuthUser(): Promise<UserSession | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return null;
    }

    const user = session.user as UserSession;

    // Fetch user with permissions from database
    const dbUser = await db.user.findUnique({
      where: { email: user.email },
      include: {
        permissions: true,
      },
    });

    if (!dbUser) {
      return null;
    }

    // Check if user is active
    if (!dbUser.isActive) {
      console.log("User account is disabled:", user.email);
      return null;
    }

    // Get permissions from role definition
    const rolePermissions = getRolePermissions(dbUser.role as any);

    return {
      ...user,
      role: dbUser.role,
      permissions: rolePermissions,
      id: dbUser.id,
    };
  } catch (error) {
    console.error("Error getting auth user:", error);
    return null;
  }
}

/**
 * Get user permissions by user ID
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return [];
    }

    return getRolePermissions(user.role as any);
  } catch (error) {
    console.error("Error getting user permissions:", error);
    return [];
  }
}

/**
 * Check if user has permission
 */
export async function userHasPermission(
  userId: string,
  permission: string
): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return permissions.includes(permission);
}

/**
 * Verify user is active
 */
export async function isUserActive(userId: string): Promise<boolean> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { isActive: true },
    });

    return user?.isActive ?? false;
  } catch (error) {
    console.error("Error checking user active status:", error);
    return false;
  }
}
