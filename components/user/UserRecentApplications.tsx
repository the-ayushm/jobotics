// components/user/UserRecentApplications.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from 'next/navigation';
import { Briefcase, ArrowRight } from "lucide-react";
import { format as formatDate } from 'date-fns';

interface RecentApplication {
  id: string;
  jobTitle: string;
  companyName: string;
  status: string;
  appliedAt: string;
  jobMode: string;
  salary: string;
}

interface UserRecentApplicationsProps {
  recentApplications: RecentApplication[];
  loading: boolean;
  getStatusColor: (status: string) => string; // Pass the status color helper
}

export function UserRecentApplications({ recentApplications, loading, getStatusColor }: UserRecentApplicationsProps) {
  const router = useRouter();

  if (loading) {
    return (
      <Card className="bg-card text-card-foreground shadow-md">
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-gray-900">Recent Applications</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/user?section=my-applications')}>
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {recentApplications.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No recent applications.</p>
          ) : (
            recentApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{app.jobTitle}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{app.companyName} • {app.jobMode}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={`${getStatusColor(app.status)} border`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Badge>
                  <span className="text-sm text-gray-500">{formatDate(new Date(app.appliedAt), 'MMM dd')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
