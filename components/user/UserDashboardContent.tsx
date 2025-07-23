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


export function UserDashboardContent() {
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
      // Simulate API calls - replace with actual endpoints
      const mockStats: DashboardStats = { totalApplications: 12, activeApplications: 8, interviewsScheduled: 3, offersReceived: 1 };
      const mockApplications: RecentApplication[] = [
        { id: '1', jobTitle: 'Senior Frontend Developer', companyName: 'TechCorp Inc.', status: 'reviewed', appliedAt: '2024-01-15', jobMode: 'Remote', salary: '$80,000 - $120,000' },
        { id: '2', jobTitle: 'UX Designer', companyName: 'Design Studio', status: 'interviewed', appliedAt: '2024-01-14', jobMode: 'Hybrid', salary: '$70,000 - $100,000' },
        { id: '3', jobTitle: 'Full Stack Developer', companyName: 'StartupXYZ', status: 'applied', appliedAt: '2024-01-13', jobMode: 'On-site', salary: '$90,000 - $130,000' }
      ];
      const mockJobs: RecentJob[] = [
        { id: '1', jobTitle: 'React Developer', companyName: 'InnovateTech', location: 'San Francisco, CA', salary: '$85,000 - $125,000', jobMode: 'Remote', deadline: '2024-02-01', postedAt: '2024-01-16' },
        { id: '2', jobTitle: 'Product Manager', companyName: 'GrowthCorp', location: 'New York, NY', salary: '$100,000 - $150,000', jobMode: 'Hybrid', deadline: '2024-01-25', postedAt: '2024-01-15' }
      ];
      const mockUpcomingInterview = { jobTitle: "Senior Frontend Developer", dateTime: "Tomorrow at 2:00 PM", link: "#" };
      const mockQuickStats = { applicationsSent: 3, profileViews: 12, jobMatches: 8 };

      setStats(mockStats);
      setRecentApplications(mockApplications);
      setRecentJobs(mockJobs);
      setUpcomingInterview(mockUpcomingInterview);
      setQuickStats(mockQuickStats);

    } catch (err: any) {
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
      <UserQuickActions loading={loading} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <UserRecentApplications recentApplications={recentApplications} loading={loading} getStatusColor={getStatusColor} />
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
