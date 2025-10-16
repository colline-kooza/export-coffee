import { createAuthClient } from "better-auth/react";
import { UserSession } from "./auth";
import { Permission, UserRole } from "./permissions";

/**
 * Better Auth client for client-side authentication
 */
export const { signIn, signUp, useSession, signOut, getSession } =
  createAuthClient({
    // baseURL is optional - inferred from window.location if not provided
    // baseURL: "http://localhost:3000",
  });

/**
 * Type-safe session hook with permissions
 */
export type UseSessionType = ReturnType<typeof useSession>;

export interface SessionData {
  user?: UserSession;
  session?: unknown;
}

/**
 * Helper hook to get user with permissions
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const session = await getSession();
    // getSession returns a wrapper (Data<T> | Error), the payload is on `.data`
    if (session && typeof session === "object" && "data" in session) {
      return (session.data?.user as UserSession) || null;
    }
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
