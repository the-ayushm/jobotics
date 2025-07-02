// lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { client } from "@/lib/prisma"; // Your Prisma client instance

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(client),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }, // Add role to credentials
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          throw new Error("Missing credentials");
        }

        const user = await client.user.findUnique({
          where: { email: credentials.email },
        });

        if (
          !user ||
          !user.password ||
          !(await bcrypt.compare(credentials.password, user.password))
        ) {
          throw new Error("Invalid credentials");
        }

        // Check if the role matches
        if (user.role !== credentials.role) {
          throw new Error(`Unauthorized role: Expected ${credentials.role}, got ${user.role}`);
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Ensure role is returned
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Add role to JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as "user" | "hr"; // Add role to session
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/user/signin", // Default sign-in page for users
    // You might want to add custom error pages or other pages here
  },
  debug: process.env.NODE_ENV === "development",
};
