// app/dashboard/hr/layout.tsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HrNavbar } from "@/components/hr/hr-navbar"; // Correct path

export default function HrDashboardLayout({ children }: { children: React.ReactNode; }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || session?.user?.role !== "hr") {
      router.push("/auth/hr/signin");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen text-lg bg-background text-foreground">Loading HR dashboard...</div>;
  }

  if (status === "authenticated" && session.user?.role === "hr") {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <HrNavbar /> {/* Navbar here */}
        <main className="flex-grow">
          {children} {/* This renders /dashboard/hr/jobs/create/page.tsx */}
        </main>
        <footer className="p-4 text-center text-sm bg-card border-t border-border text-muted-foreground">
          &copy; {new Date().getFullYear()} Jobotics. All rights reserved.
        </footer>
      </div>
    );
  }
  return null;
}