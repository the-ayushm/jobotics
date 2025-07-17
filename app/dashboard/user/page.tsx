// app/user/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { UserJobFeed } from "@/components/user/UserJobFeed";
import { UserApplicationsList } from "@/components/user/UserApplicationsList";
import { UserProfile } from "@/components/user/UserProfile";
import { UserSettings } from "@/components/user/UserSettings";
import { UserDashboardContent } from "@/components/user/UserDashboardContent"; // <--- Import the new component

export default function UserDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard"); // Default active section is 'dashboard'

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
        {activeSection === "dashboard" && ( // <--- This condition will now render the content
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-foreground">Dashboard Overview</h1> {/* Added title for clarity */}
            <UserDashboardContent />
          </div>
        )}
        {activeSection === "available-jobs" && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-foreground">Available Job Openings</h1>
            <UserJobFeed />
          </div>
        )}
        {activeSection === "my-applications" && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-foreground">My Applications</h1>
            <UserApplicationsList />
          </div>
        )}
        {activeSection === "profile" && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-foreground">My Profile</h1>
            <UserProfile />
          </div>
        )}
        {activeSection === "settings" && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-foreground">Settings</h1>
            <UserSettings />
          </div>
        )}
      </DashboardLayout>
    );
  }

  return null;
}
