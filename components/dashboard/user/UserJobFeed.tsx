// components/user/UserJobFeed.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { JobCardUser } from './JobCardUser'; // Import the new job card
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For error/empty state
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Ensure Card is imported
import { Terminal } from 'lucide-react'; // Icon for Alert

interface Job {
  id: string;
  jobTitle: string;
  jobDescription: string;
  numOpenings: number;
  minSalary: number;
  maxSalary: number;
  jobMode: string;
  deadline: string | null; // Allow null
  createdAt: string | null; // Allow null
}

export function UserJobFeed() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/user/jobs');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch jobs.');
      }
      const data: Job[] = await response.json();
      setJobs(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => ( // Render 3 skeleton cards
          <Card key={i} className="flex flex-col h-full bg-card text-card-foreground shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-1/4" />
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter className="flex justify-end p-4">
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (jobs.length === 0) {
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>No Jobs Found</AlertTitle>
        <AlertDescription>There are no active job openings available at the moment. Please check back later!</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCardUser key={job.id} job={job} onApplySuccess={fetchJobs} />
      ))}
    </div>
  );
}