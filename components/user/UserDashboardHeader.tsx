// components/user/UserDashboardHeader.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { format as formatDate } from 'date-fns'; // For date formatting

export function UserDashboardHeader() {
  const { data: session } = useSession();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false); // New state to track if client-side hydration is complete

  // Update time every second
  useEffect(() => {
    setIsClient(true); // Mark as client-side after initial mount
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950 rounded-xl p-8">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full -ml-12 -mb-12" />
      <div className="relative z-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Welcome back, {session?.user?.name || 'User'}! 👋
        </h1>
        {/* FIX: Conditionally render date/time only on the client */}
        {isClient ? (
          <>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentTime.toLocaleTimeString()} • Your job search dashboard
            </p>
          </>
        ) : (
          // Placeholder for server-rendered content
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        )}
      </div>
    </div>
  );
}
