// components/user/UserNewJobMatches.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from 'next/navigation';
import { Star, MapPin, ArrowRight } from "lucide-react";
import { format as formatDate } from 'date-fns';

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

interface UserNewJobMatchesProps {
  recentJobs: RecentJob[];
  loading: boolean;
}

export function UserNewJobMatches({ recentJobs, loading }: UserNewJobMatchesProps) {
  const router = useRouter();

  if (loading) {
    return (
      <Card className="bg-card text-card-foreground shadow-md">
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <Star className="w-5 h-5 text-yellow-500 mr-2" />
          New Job Matches
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {recentJobs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No new job matches found.</p>
          ) : (
            recentJobs.map((job) => (
              <div key={job.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/user/jobs/${job.id}`)}>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{job.jobTitle}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{job.companyName}</p>
                <div className="flex items-center text-xs text-gray-500 space-x-2">
                  <MapPin className="w-3 h-3" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Badge variant="outline" className="text-xs">{job.jobMode}</Badge>
                  <span className="text-xs text-gray-500">
                    Deadline: {formatDate(new Date(job.deadline), 'MMM dd')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <Button variant="outline" className="w-full mt-4" onClick={() => router.push('/dashboard/user?section=available-jobs')}>
          View All Jobs
        </Button>
      </CardContent>
    </Card>
  );
}
