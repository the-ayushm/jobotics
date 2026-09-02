// app/dashboard/hr/interviews/[interviewId]/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, CalendarCheck, Clock, Mail, Phone, ExternalLink, Download, Check, X, Loader2 } from "lucide-react";
import { format as formatDate } from 'date-fns';
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface InterviewDetail {
  id: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: string;
  status: string;
  meetLink: string | null;
  notes: string | null;
  applicant: {
    id: string;
    fullName: string;
    contactEmail: string;
    phoneNumber: string | null;
    resumeUrl: string | null;
  };
  job: {
    id: string;
    jobTitle: string;
    jobMode: string;
    minSalary: number;
    maxSalary: number;
  };
  scheduledBy: {
    name: string | null;
    email: string;
    company: string | null;
  };
}

export default function HrInterviewDetailsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const interviewId = params.interviewId as string;

  const [interview, setInterview] = useState<InterviewDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus === "unauthenticated" || session?.user?.role !== "hr") {
      router.push("/auth/hr/signin");
    }
  }, [session, sessionStatus, router]);

  const fetchInterview = useCallback(async () => {
    if (!interviewId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/hr/interviews/${interviewId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch interview details.");
      }
      const data: InterviewDetail = await response.json();
      setInterview(data);
    } catch (err: any) {
      console.error("Error fetching interview:", err);
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  }, [interviewId]);

  useEffect(() => {
    if (sessionStatus === "authenticated" && session?.user?.role === "hr") {
      fetchInterview();
    }
  }, [fetchInterview, sessionStatus, session]);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/hr/interviews/${interviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update interview.");
      }
      setInterview((prev) => (prev ? { ...prev, status: newStatus } : null));
      toast.success(`Interview marked as ${newStatus}!`);
    } catch (err: any) {
      toast.error("Failed to update status", { description: err.message });
    } finally {
      setIsUpdating(false);
    }
  };

  if (sessionStatus === "loading") {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-grow p-4 md:p-8 container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.push('/dashboard/hr/interviews')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Interviews
          </Button>

          {interview && (
            <div className="flex items-center gap-2">
              {interview.meetLink && (
                <a href={interview.meetLink} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <CalendarCheck className="mr-2 h-4 w-4" /> Join Google Meet
                  </Button>
                </a>
              )}
              {interview.status !== "completed" && (
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange("completed")}
                  disabled={isUpdating}
                >
                  <Check className="mr-2 h-4 w-4 text-green-500" /> Complete
                </Button>
              )}
              {interview.status !== "cancelled" && (
                <Button
                  variant="destructive"
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={isUpdating}
                >
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              )}
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
          <Card className="p-6">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-4 w-1/3 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </Card>
        ) : !interview ? (
          <Card className="p-8 text-center text-muted-foreground">
            Interview not found.
          </Card>
        ) : (
          <Card className="bg-card shadow-md border border-border">
            <CardHeader>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="text-3xl font-bold">
                    {interview.interviewType} Interview
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    Candidate: <span className="font-semibold text-foreground">{interview.applicant.fullName}</span> for{" "}
                    <span className="font-semibold text-foreground">{interview.job.jobTitle}</span>
                  </CardDescription>
                </div>
                <Badge
                  className={cn(
                    "text-sm font-semibold capitalize",
                    interview.status === "scheduled" && "bg-blue-100 text-blue-700",
                    interview.status === "completed" && "bg-green-100 text-green-700",
                    interview.status === "cancelled" && "bg-red-100 text-red-700"
                  )}
                >
                  {interview.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 rounded-lg bg-muted/20 border border-border">
                  <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" /> Schedule Information
                  </h3>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="text-base font-medium">
                      {formatDate(new Date(interview.interviewDate), 'PPPP')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="text-base font-medium">{interview.interviewTime} (Asia/Kolkata)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Meeting Link</p>
                    {interview.meetLink ? (
                      <a
                        href={interview.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 font-medium mt-1"
                      >
                        {interview.meetLink} <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground italic mt-1">
                        Google Meet link not configured or failed to generate.
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-lg bg-muted/20 border border-border">
                  <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" /> Candidate Information
                  </h3>
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="text-base font-medium">{interview.applicant.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-base font-medium">{interview.applicant.contactEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="text-base font-medium">{interview.applicant.phoneNumber || "N/A"}</p>
                  </div>
                  {interview.applicant.resumeUrl && (
                    <div className="pt-2">
                      <a href={interview.applicant.resumeUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Download className="h-4 w-4" /> Download Candidate Resume
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {interview.notes && (
                <div className="p-4 rounded-lg bg-muted/10 border border-border">
                  <h3 className="font-semibold text-base mb-2 text-foreground">Interview Notes</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{interview.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
