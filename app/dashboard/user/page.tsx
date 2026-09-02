// app/user/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

// Import all the content components that will be rendered conditionally
import { UserDashboardContent } from "@/components/user/UserDashboardContent";
import { UserJobFeed } from "@/components/user/UserJobFeed";
import { UserApplicationsList } from "@/components/user/UserApplicationsList";
import { UserProfile } from "@/components/user/UserProfile";
import { UserSettings } from "@/components/user/UserSettings";

function UserDashboardInner() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");

  const [activeSection, setActiveSection] = useState(sectionParam || "dashboard");

  // Sync activeSection with URL query parameter
  useEffect(() => {
    if (sectionParam) {
      setActiveSection(sectionParam);
    }
  }, [sectionParam]);

  // Authentication and Authorization check for the page
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || session?.user?.role !== "user") {
      router.push("/auth/user/signin");
    }
  }, [session, status, router]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    router.push(`/dashboard/user?section=${section}`);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg bg-background text-foreground">
        Loading user dashboard...
      </div>
    );
  }

  if (status === "authenticated" && session.user?.role === "user") {
    return (
      <DashboardLayout activeSection={activeSection} onSectionChange={handleSectionChange}>
        {/* Conditionally render content based on activeSection */}
        {activeSection === "dashboard" && (
          <div className="space-y-8">
            <UserDashboardContent onSectionChange={handleSectionChange} />
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

export default function UserDashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen text-lg bg-background text-foreground">
        Loading user dashboard...
      </div>
    }>
      <UserDashboardInner />
    </Suspense>
  );
}
