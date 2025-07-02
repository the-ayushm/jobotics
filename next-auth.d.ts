// next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt"; // Import JWT as DefaultJWT

// Extend the NextAuth interfaces for v4
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user: {
      id: string; // Add custom ID
      role: "hr" | "user"; // Custom role property
      company?: string | null; // Custom company property, optional and can be null
    } & DefaultSession["user"]; // Merge with default session user properties
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the object returned from the `authorize` callback in the Credentials provider.
   */
  interface User extends DefaultUser {
    id: string; // Add custom ID
    role: "hr" | "user"; // Custom role property
    company?: string | null; // Custom company property, optional and can be null
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and `getToken`, when using JWT sessions
   */
  interface JWT extends DefaultJWT {
    id: string; // Add custom ID
    role: "hr" | "user"; // Custom role property
    company?: string | null; // Custom company property, optional and can be null
  }
}