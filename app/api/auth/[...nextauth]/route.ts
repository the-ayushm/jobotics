// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter"; // Correct v4 adapter import
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const client = new PrismaClient();

// Define the common type for the user object returned by authorize
// Note: In v4, the 'User' interface extension in next-auth.d.ts often covers this.
// This interface is mainly for clarity in the authorize function's return.
interface AuthenticatedUser {
  id: string;
  name: string | null;
  email: string;
  password?: string; // Password is only used internally for comparison, not returned by NextAuth
  role: "hr" | "user";
  company?: string | null;
}

// Export authOptions directly for use with getServerSession in layout.tsx
export const authOptions = { // Exported for getServerSession in layout.tsx
  adapter: PrismaAdapter(client), // Use PrismaAdapter for database integration

  providers: [
    CredentialsProvider({
      name: "Credentials", // Changed name from 'Email' for better clarity, can be anything
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AuthenticatedUser | null> {
        if (!credentials?.email || !credentials?.password) {
          console.log("Authorize: No email or password provided for credentials login.");
          return null; // Return null if invalid credentials
        }

        const email = credentials.email;
        const password = credentials.password;

        // Find the user in the single 'User' table
        const user = await client.user.findUnique({
          where: { email: email },
        });

        // Check if user exists and has a password (i.e., not a social login without password)
        if (!user || !user.password) {
          console.log("Authorize: User not found or no password set for this account.");
          return null;
        }

        // Compare the provided password with the hashed password from the database
        const isValid = await compare(password, user.password);

        if (!isValid) {
          console.log("Authorize: Invalid password for credentials login.");
          return null;
        }

        // Return a user object that matches the 'User' interface extended in next-auth.d.ts
        // NextAuth.js will pick up these properties for the session.
        return { 
          id: String(user.id), // Ensure ID is a string for NextAuth.js
          name: user.name,
          email: user.email,
          role: user.role as ("hr" | "user"), // Assert role type from DB
          company: user.company, // This will be undefined/null for regular users, which is fine
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // Use with caution in production
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!, // Make sure your env var names are CLIENT_ID/CLIENT_SECRET
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  session: {
    strategy: "jwt" as const, // Use JWT for session management
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET!, // JWT secret
  },

  secret: process.env.NEXTAUTH_SECRET!, // Main secret

  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        // 'user' for Credentials comes from 'authorize' return (AuthenticatedUser/User)
        // 'user' for Social comes from adapter (Prisma User model)
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;

        // Ensure role is set in the token. Prisma User model should have it.
        // If it's a new social login, PrismaAdapter will set it to default (e.g., "user")
        if (typeof (user as any).role === 'string') {
          token.role = (user as any).role;
        } else {
          token.role = "user"; // Fallback to 'user' if role somehow missing
        }

        if (typeof (user as any).company === 'string' || (user as any).company === null) {
          token.company = (user as any).company;
        }
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as ("hr" | "user");
        session.user.company = token.company;
      }
      return session;
    },
    // Optional signIn callback for v4
    // async signIn({ user, account, profile }) {
    //   // You can add logic here to control who can sign in
    //   // Example: if (account?.type === "oauth" && user.role === "hr") return false;
    //   return true; // Default: allow sign-in
    // }
  },
  debug: process.env.NODE_ENV === "development",
};

// NextAuth.js v4 App Router pattern
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
