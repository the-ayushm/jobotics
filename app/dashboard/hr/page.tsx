// app/dashboard/hr/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Import your custom dashboard components
import { HrNavbar } from "@/components/dashboard/hr/hr-navbar"; // Ensure this path is correct
import { MetricCards } from "@/components/dashboard/hr/MetricCards";
import { JobListingsTable } from "@/components/dashboard/hr/JobListingsTable";
import { ApplicantFunnel } from "@/components/dashboard/hr/ApplicantFunnel";
import { UpcomingInterviews } from "@/components/dashboard/hr/UpcomingInterviews";
import { RecentActivity } from "@/components/dashboard/hr/RecentActivity";
// import { CreateJobForm } from "@/components/dashboard/hr/CreateJobForm"; // The job creation form

export default function HrDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated or not an HR user
  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading session
    if (status === "unauthenticated" || session?.user?.role !== "hr") {
      router.push("/auth/hr/signin"); // Redirect to HR login if not authenticated or not HR
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg bg-background text-foreground">
        Loading HR dashboard...
      </div>
    );
  }

  if (status === "authenticated" && session.user?.role === "hr") {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
       {/* Render your Navbar */}
        <main className="flex-grow p-4 md:p-8 container mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 p-6 bg-card rounded-lg shadow-sm border border-border">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Welcome, {session.user.name || "HR User"}!
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Here's a summary of your recruitment activity.
            </p>
          </div>

          {/* All Dashboard Content Components */}
          <MetricCards />
          <JobListingsTable />
          <ApplicantFunnel />
          <UpcomingInterviews />
          <RecentActivity />

        </main>
      </div>
    );
  }

  return null; // Will be redirected by useEffect
}