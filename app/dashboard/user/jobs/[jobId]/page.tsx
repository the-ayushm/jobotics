// app/dashboard/user/jobs/[jobId]/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react"; // Only ArrowLeft needed here

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"; // Your User Dashboard Layout
import { format as formatDate } from 'date-fns'; // For date formatting
import { ApplyJobDialog } from "@/components/user/ApplyJobDialog"; // For apply button

// Define the Job type (should match the API response)
interface Job {
  id: string;
  jobTitle: string;
  numOpenings: number;
  minSalary: number;
  maxSalary: number;
  jobMode: string;
  jobDescription: string;
  deadline: string | null; // ISO string from DB
  status: string;
  postedAt: string | null; // ISO string from DB
  postedBy: {
    id: string;
    name: string | null;
    email: string;
    company: string | null;
  };
}

export default function UserJobDetailsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Authentication check
  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus === "unauthenticated" || session?.user?.role !== "user") {
      router.push("/auth/user/signin");
    }
  }, [session, sessionStatus, router]);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) {
        setError("Job ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/user/jobs/${jobId}`); // Call the new API endpoint
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch job: ${response.statusText}`);
        }
        const data: Job = await response.json();
        setJob(data);
      } catch (err: any) {
        console.error(`Error fetching job details for ID ${jobId}:`, err);
        setError(err.message || "Failed to load job details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (sessionStatus === "authenticated" && session?.user?.role === "user") {
      fetchJobDetails();
    }
  }, [jobId, sessionStatus, session]);

  // Loading state for initial session check
  if (sessionStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg bg-background text-foreground">
        Loading...
      </div>
    );
  }

  // Render page only if authenticated and authorized as user
  if (sessionStatus === "authenticated" && session.user?.role === "user") {
    return (
      <DashboardLayout activeSection="available-jobs" onSectionChange={(section) => router.push(`/dashboard/user?section=${section}`)}> {/* Pass activeSection and onSectionChange */}
        <div className="flex-grow p-4 md:p-8 container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Job Listings
            </Button>
            {/* Apply button for this specific job */}
            {job && (
              <ApplyJobDialog jobId={job.id} jobTitle={job.jobTitle} onApplySuccess={() => router.back()} />
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <Card className="bg-card shadow-md border border-border p-6">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
              <Skeleton className="h-32 w-full mt-8" />
            </Card>
          ) : !job ? (
            <p className="text-center text-muted-foreground py-8">Job not found or could not be loaded.</p>
          ) : (
            <Card className="bg-card shadow-md border border-border">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-foreground">
                  {job.jobTitle}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Posted by {job.postedBy?.name || job.postedBy?.email} ({job.postedBy?.company || 'N/A'}) on{" "}
                  {job.postedAt ? formatDate(new Date(job.postedAt), 'PPP') : 'N/A'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Openings</p>
                    <p className="text-lg">{job.numOpenings}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Job Mode</p>
                    <p className="text-lg">{job.jobMode}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Salary Range</p>
                    <p className="text-lg">${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Application Deadline</p>
                    <p className="text-lg">
                      {job.deadline ? formatDate(new Date(job.deadline), 'PPP') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p className="text-lg capitalize">{job.status}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Job Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{job.jobDescription}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    );
  }

  return null;
}
