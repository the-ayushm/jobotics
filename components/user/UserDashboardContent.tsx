// components/user/UserDashboardContent.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Ensure AlertTitle is imported
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal } from "lucide-react";

// Import the new sub-components
import { UserDashboardHeader } from './UserDashboardHeader';
import { UserStatsCards } from './UserStatsCards';
import { UserQuickActions } from './UserQuickActions';
import { UserRecentApplications } from './UserRecentApplications';
import { UserNewJobMatches } from './UserNewJobMatches';
import { UserUpcomingInterviewCard } from './UserUpcomingInterviewCard';
import { UserQuickStatsCard } from './UserQuickStatsCard';

// Define interfaces for mock data (can be moved to a types file if preferred)
interface DashboardStats {
  totalApplications: number;
  activeApplications: number;
  interviewsScheduled: number;
  offersReceived: number;
}

interface RecentApplication {
  id: string;
  jobTitle: string;
  companyName: string;
  status: string;
  appliedAt: string;
  jobMode: string;
  salary: string;
}

interface RecentJob {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  salary: string;
  jobMode: string;
  deadline: string;
  postedAt: string;
}

interface QuickStats {
  applicationsSent: number;
  profileViews: number;
  jobMatches: number;
}

interface UserDashboardContentProps {
  onSectionChange?: (section: string) => void;
}

export function UserDashboardContent({ onSectionChange }: UserDashboardContentProps = {}) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [upcomingInterview, setUpcomingInterview] = useState<any>(null); // Mock upcoming interview
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null); // Mock quick stats
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper for status colors (can be moved to utils if reused)
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'reviewed': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'interviewed': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'offer': return 'bg-green-100 text-green-700 border-green-200';
      case 'hired': return 'bg-green-500 text-white border-green-600';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/user/stats');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch dashboard data.');
      }
      const data = await res.json();
      setStats(data.stats);
      setRecentApplications(data.recentApplications || []);
      setRecentJobs(data.recentJobs || []);
      setUpcomingInterview(data.upcomingInterview);
      setQuickStats(data.quickStats);
    } catch (err: any) {
      console.error("Error loading candidate dashboard data:", err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);


  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <UserDashboardHeader />

      {/* Stats Cards */}
      <UserStatsCards stats={stats} loading={loading} />

      {/* Quick Actions */}
      <UserQuickActions loading={loading} onSectionChange={onSectionChange} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <UserRecentApplications recentApplications={recentApplications} loading={loading} getStatusColor={getStatusColor} onSectionChange={onSectionChange} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* New Job Matches */}
          <UserNewJobMatches recentJobs={recentJobs} loading={loading} />

          {/* Upcoming Interviews */}
          <UserUpcomingInterviewCard interview={upcomingInterview} loading={loading} />

          {/* Quick Stats */}
          <UserQuickStatsCard stats={quickStats} loading={loading} />
        </div>
      </div>
    </div>
  );
}
