// app/dashboard/hr/jobs/edit/[jobId]/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect } from "react";

import { HrNavbar } from "@/components/dashboard/hr/hr-navbar"; // Your Navbar
import { EditJobForm } from "@/components/dashboard/hr/EditJobForm"; // Import the new EditJobForm

export default function EditJobPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;

  // Authentication check for the page
  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus === "unauthenticated" || session?.user?.role !== "hr") {
      router.push("/auth/hr/signin");
    }
  }, [session, sessionStatus, router]);

  // Loading state for initial session check
  if (sessionStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg bg-background text-foreground">
        Loading...
      </div>
    );
  }

  // Render page only if authenticated and authorized as HR
  if (sessionStatus === "authenticated" && session.user?.role === "hr") {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
       
        <main className="flex-grow p-4 md:p-8 container mx-auto">
          {/* Pass the jobId to the EditJobForm */}
          <EditJobForm jobId={jobId} />
        </main>

        <footer className="p-4 text-center text-sm bg-card border-t border-border text-muted-foreground">
          &copy; {new Date().getFullYear()} Jobotics. All rights reserved.
        </footer>
      </div>
    );
  }

  return null; // Will be redirected by useEffect
}