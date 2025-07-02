// app/dashboard/hr/jobs/[jobId]/page.tsx
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
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { format as formatDate } from 'date-fns';
import { toast } from "sonner"; // Use sonner for toasts

// Shadcn AlertDialog imports for confirmation
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


interface Job {
  id: string;
  jobTitle: string;
  numOpenings: number;
  minSalary: number;
  maxSalary: number;
  jobMode: string;
  jobDescription: string;
  deadline: string | null;
  status: string;
  postedAt: string | null;
  postedBy: {
    id: string;
    name: string | null;
    email: string;
    company: string | null;
  };
}

export default function JobDetailsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); // State for delete loading

  // Authentication check
  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus === "unauthenticated" || session?.user?.role !== "hr") {
      router.push("/auth/hr/signin");
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
        const response = await fetch(`/api/hr/jobs/${jobId}`);
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

    if (sessionStatus === "authenticated" && session?.user?.role === "hr") {
      fetchJobDetails();
    }
  }, [jobId, sessionStatus, session]);

  // Handle job deletion
  const handleDeleteJob = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/hr/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete job');
      }

      toast.success("Job Deleted!", {
        description: `"${job?.jobTitle || 'The job'}" has been successfully deleted.`,
      });

      router.push('/dashboard/hr'); // Redirect to job listings after deletion
    } catch (err: any) {
      console.error("Error deleting job:", err);
      toast.error("Deletion Failed", {
        description: err.message || "An unexpected error occurred during deletion.",
      });
    } finally {
      setIsDeleting(false);
    }
  };


  // Loading state for initial session check
  if (sessionStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg bg-background text-foreground">
        Loading...
      </div>
    );
  }

  // Render page only if authenticated and authorized as HR
  if (sessionStatus === "authenticated" && session.user?.role === "hr") {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <main className="flex-grow p-4 md:p-8 container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Job Listings
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => router.push(`/dashboard/hr/jobs/edit/${jobId}`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Job
              </Button>
              
              {/* Delete Button with Confirmation Dialog */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    <Trash2 className="mr-2 h-4 w-4" /> {isDeleting ? "Deleting..." : "Delete Job"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the job listing
                      "{job?.jobTitle || 'this job'}" from your records.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteJob} disabled={isDeleting}>
                      {isDeleting ? "Deleting..." : "Continue"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

            </div>
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
        </main>

        <footer className="p-4 text-center text-sm bg-card border-t border-border text-muted-foreground">
          &copy; {new Date().getFullYear()} Jobotics. All rights reserved.
        </footer>
      </div>
    );
  }

  return null;
}
