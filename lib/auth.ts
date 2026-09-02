// lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { client } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(client),
  providers: [
    GitHubProvider({
      clientId: (process.env.GITHUB_CLIENT_ID || process.env.GITHUB_ID || "") as string,
      clientSecret: (process.env.GITHUB_CLIENT_SECRET || process.env.GITHUB_SECRET || "") as string,
    }),
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID || "") as string,
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || "") as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          throw new Error("Missing credentials");
        }

        const user = await client.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        if (!user.password) {
          throw new Error("Account has no password set. Please use social login.");
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        if (user.role !== credentials.role) {
          throw new Error(`Unauthorized role: Expected ${credentials.role}, got ${user.role}`);
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
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
        token.role = (user as any).role || "user";
      }

      // If role or id is missing in token, look up the user in the database (e.g. on OAuth sign in)
      if ((!token.role || !token.id) && token.email) {
        const dbUser = await client.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "user" | "hr") || "user";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/user/signin",
  },
  debug: process.env.NODE_ENV === "development",
};
                                                                           