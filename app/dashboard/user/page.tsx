// app/user/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"; // The main dashboard layout

// Import all the content components that will be rendered conditionally
import { UserDashboardContent } from "@/components/user/UserDashboardContent";
import { UserJobFeed } from "@/components/user/UserJobFeed";
import { UserApplicationsList } from "@/components/user/UserApplicationsList";
import { UserProfile } from "@/components/user/UserProfile";
import { UserSettings } from "@/components/user/UserSettings";

// Define interfaces for mock data (these are now in UserDashboardContent.tsx)
// interface DashboardStats { /* ... */ }
// interface RecentApplication { /* ... */ }
// interface RecentJob { /* ... */ }
// interface QuickStats { /* ... */ }


export default function UserDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard"); // Default active section

  // Authentication and Authorization check for the page
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || session?.user?.role !== "user") {
      router.push("/auth/user/signin");
    }
  }, [session, status, router]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        Loading user dashboard...
      </div>
    );
  }

  if (status === "authenticated" && session.user?.role === "user") {
    return (
      // DashboardLayout now provides the full layout including header, sidebar, and footer
      // The content for each section is passed as children.
      <DashboardLayout activeSection={activeSection} onSectionChange={handleSectionChange}>
        {/* Conditionally render content based on activeSection */}
        {activeSection === "dashboard" && (
          <div className="space-y-8">
            <UserDashboardContent /> {/* This component contains all the overview data */}
          </div>
        )}
        {activeSection === "available-jobs" && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-foreground mb-6">Available Job Openings</h1>
            <UserJobFeed />
          </div>
        )}
        {activeSection === "my-applications" && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-foreground mb-6">My Applications</h1>
            <UserApplicationsList />
          </div>
        )}
        {activeSection === "profile" && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-foreground mb-6">My Profile</h1>
            <UserProfile />
          </div>
        )}
        {activeSection === "settings" && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-foreground mb-6">Settings</h1>
            <UserSettings />
          </div>
        )}
      </DashboardLayout>
    );
  }

  return null;
}
