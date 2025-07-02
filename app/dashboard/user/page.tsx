// app/user/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboarsLayout";
import { UserJobFeed } from "@/components/dashboard/user/UserJobFeed"; // Available jobs component
import { UserApplicationsList } from "@/components/dashboard/user/UserApplicationsList"; // Will create this
import { UserProfile } from "@/components/dashboard/user/UserProfile"; // Will create this
import { UserSettings } from "@/components/dashboard/user/UserSettings"; // Will create this

export default function UserDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("available-jobs"); // Default active section

  // Redirect if not authenticated or not a regular user
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || session?.user?.role !== "user") {
      router.push("/auth/user/signin");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        Loading user dashboard...
      </div>
    );
  }

  if (status === "authenticated" && session.user?.role === "user") {
    return (
      <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
        {activeSection === "available-jobs" && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold">Available Job Openings</h1>
            <UserJobFeed />
          </div>
        )}
        {activeSection === "my-applications" && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold">My Applications</h1>
            <UserApplicationsList /> {/* This component will be implemented next */}
          </div>
        )}
        {activeSection === "profile" && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold">My Profile</h1>
            <UserProfile /> {/* This component will be implemented */}
          </div>
        )}
        {activeSection === "settings" && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold">Settings</h1>
            <UserSettings /> {/* This component will be implemented */}
          </div>
        )}
      </DashboardLayout>
    );
  }

  return null; // Will be redirected by useEffect
}
