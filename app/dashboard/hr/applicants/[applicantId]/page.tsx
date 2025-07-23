// app/dashboard/hr/applicants/[applicantId]/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
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
import { ArrowLeft, Download, Mail, Phone, ExternalLink, Check, X, Loader2, CalendarCheck } from "lucide-react";

import { HrNavbar } from "@/components/hr/hr-navbar";
import { format as formatDate } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { ScheduleInterviewDialog } from "@/components/hr/ScheduleInterviewDialog"; // Import the dialog

// Define the ApplicantData type (should match API response from /api/hr/applicants/[applicantId])
interface ApplicantData {
  id: string;
  fullName: string;
  contactEmail: string;
  phoneNumber: string | null;
  coverLetter: string | null;
  resumeUrl: string | null;
  status: "applied" | "reviewed" | "interviewed" | "offer" | "hired" | "rejected";
  appliedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  job: {
    id: string;
    jobTitle: string;
    jobMode: string;
    minSalary: number;
    maxSalary: number;
    deadline: string;
    postedBy: {
      name: string | null;
      company: string | null;
      email: string;
    };
  };
}

export default function HrApplicantDetailsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const applicantId = params.applicantId as string;

  const [applicant, setApplicant] = useState<ApplicantData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus === "unauthenticated" || session?.user?.role !== "hr") {
      router.push("/auth/hr/signin");
    }
  }, [session, sessionStatus, router]);

  const fetchApplicantDetails = useCallback(async () => {
    if (!applicantId) {
      setError("Applicant ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/hr/applicants/${applicantId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch applicant: ${response.statusText}`);
      }
      const data: ApplicantData = await response.json();
      setApplicant(data);
    } catch (err: any) {
      console.error(`Error fetching applicant details for ID ${applicantId}:`, err);
      setError(err.message || "Failed to load applicant details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [applicantId, sessionStatus, session]);

  useEffect(() => {
    if (sessionStatus === "authenticated" && session?.user?.role === "hr") {
      fetchApplicantDetails();
    }
  }, [fetchApplicantDetails, sessionStatus, session]);

  const handleStatusUpdate = async (newStatus: ApplicantData['status']) => {
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/hr/applicants/${applicantId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update status to ${newStatus}`);
      }
      setApplicant(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success(`Status updated!`, { description: `Applicant status changed to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}.` });
    } catch (err: any) {
      console.error("Error updating applicant status:", err);
      toast.error("Status Update Failed", { description: err.message || "An unexpected error occurred during status update." });
    } finally {
      setIsUpdatingStatus(false);
    }
  };


  if (sessionStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg bg-background text-foreground">
        Loading...
      </div>
    );
  }

  if (sessionStatus === "authenticated" && session.user?.role === "hr") {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <main className="flex-grow p-4 md:p-8 container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Applicants
            </Button>
            {/* Action buttons for status update */}
            {applicant && (
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleStatusUpdate('reviewed')} disabled={isUpdatingStatus || applicant.status === 'reviewed'}>
                  {isUpdatingStatus && applicant.status !== 'reviewed' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />} Mark Reviewed
                </Button>
                
                {/* FIX: Replace the simple button with the ScheduleInterviewDialog component */}
                <ScheduleInterviewDialog
                  applicantId={applicant.id}
                  applicantName={applicant.fullName}
                  jobId={applicant.job.id}
                  jobTitle={applicant.job.jobTitle}
                  onInterviewScheduled={fetchApplicantDetails} // Re-fetch applicant details after scheduling
                />

                <Button variant="destructive" size="sm" onClick={() => handleStatusUpdate('rejected')} disabled={isUpdatingStatus || applicant.status === 'rejected'}>
                  {isUpdatingStatus && applicant.status !== 'rejected' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />} Reject
                </Button>
              </div>
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
          ) : !applicant ? (
            <p className="text-center text-muted-foreground py-8">Applicant not found or could not be loaded.</p>
          ) : (
            <Card className="bg-card shadow-md border border-border">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-foreground">
                  {applicant.fullName}
                  <Badge className={cn("ml-3 text-sm font-semibold",
                    applicant.status === "applied" && "bg-blue-100 text-blue-700",
                    applicant.status === "reviewed" && "bg-purple-100 text-purple-700",
                    applicant.status === "interviewed" && "bg-indigo-100 text-indigo-700",
                    applicant.status === "offer" && "bg-green-100 text-green-700",
                    applicant.status === "hired" && "bg-green-500 text-white",
                    applicant.status === "rejected" && "bg-red-100 text-red-700"
                  )}>
                    {applicant.status === "interviewed" ? "Interview Scheduled" : applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Applied for: <span className="font-medium text-foreground">{applicant.job.jobTitle}</span> ({applicant.job.jobMode})
                  <br />
                  Applied on: {formatDate(new Date(applicant.appliedAt), 'PPP')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
                    <p className="text-lg flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" /> {applicant.contactEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                    <p className="text-lg flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" /> {applicant.phoneNumber || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Job Salary Range</p>
                    <p className="text-lg">${applicant.job.minSalary.toLocaleString()} - ${applicant.job.maxSalary.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Job Deadline</p>
                    <p className="text-lg">{formatDate(new Date(applicant.job.deadline), 'PPP')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Job Posted By</p>
                    <p className="text-lg">{applicant.job.postedBy?.name || applicant.job.postedBy?.email} ({applicant.job.postedBy?.company || 'N/A'})</p>
                  </div>
                </div>

                {applicant.coverLetter && (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Cover Letter</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{applicant.coverLetter}</p>
                  </div>
                )}

                {applicant.resumeUrl && (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Resume</h3>
                    <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="h-4 w-4" /> Download Resume
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </main>

        
      </div>
    );
  }

  return null;
}
