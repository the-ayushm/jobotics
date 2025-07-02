// components/SessionProviderWrapper.tsx
"use client"; // <-- This makes it a Client Component

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth"; // Import Session type

// Define props for the wrapper component
interface SessionProviderWrapperProps {
  children: React.ReactNode;
  session: Session | null; // Pass the session object fetched from the server
}

export default function SessionProviderWrapper({
  children,
  session,
}: SessionProviderWrapperProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
} 