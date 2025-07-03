// components/dashboard/DashboardLayout.tsx
"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// Import SheetTitle and SheetDescription
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"; 
import { Menu } from "lucide-react";
import { Toaster } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function DashboardLayout({ children, activeSection, onSectionChange }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const navItems = [
    { name: "Available Jobs", id: "available-jobs" },
    { name: "My Applications", id: "my-applications" },
    { name: "Profile", id: "profile" },
    { name: "Settings", id: "settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Top Bar / AppBar */}
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center">
          {/* Mobile menu trigger */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden mr-4">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-white dark:bg-gray-800">
              {/* ADDED SheetHeader, SheetTitle, SheetDescription for accessibility */}
              <SheetHeader className="p-4 border-b dark:border-gray-700">
                <SheetTitle className="text-xl font-semibold">Dashboard Menu</SheetTitle>
                <SheetDescription className="sr-only">Navigation for the user dashboard.</SheetDescription> {/* sr-only hides visually but available to screen readers */}
              </SheetHeader>
              <nav className="flex flex-col p-4 space-y-2">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "secondary" : "ghost"}
                    className="justify-start text-base"
                    onClick={() => onSectionChange(item.id)}
                  >
                    {item.name}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <h1 className="text-2xl font-bold text-primary dark:text-primary-foreground">ResumeScreening</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:inline">
            Hello, <span className="font-semibold">{session?.user?.name || session?.user?.email}</span>! (Role: {session?.user?.role})
          </span>
          <Button onClick={handleSignOut} variant="destructive" className="px-4 py-2">
            Sign Out
          </Button>
        </div>
      </header>

      <div className="flex flex-grow">
        {/* Sidebar for Desktop */}
        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 shadow-md border-r dark:border-gray-700 p-4">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold">Dashboard Navigation</h2>
          </div>
          <nav className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "secondary" : "ghost"}
                className="justify-start text-base"
                onClick={() => onSectionChange(item.id)}
              >
                {item.name}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow p-8 container mx-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-700 mt-auto">
        &copy; {new Date().getFullYear()} ResumeScreening. All rights reserved.
      </footer>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}