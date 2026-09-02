// components/hr/UpcomingInterviews.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarCheck, Eye, ExternalLink } from "lucide-react";
import { format as formatDate } from 'date-fns';

interface UpcomingInterviewItem {
  id: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: string;
  status: string;
  meetLink: string | null;
  applicant: {
    id: string;
    fullName: string;
    contactEmail: string;
  };
  job: {
    id: string;
    jobTitle: string;
  };
}

export function UpcomingInterviews() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<UpcomingInterviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await fetch("/api/hr/stats");
        if (res.ok) {
          const data = await res.json();
          setInterviews(data.upcomingInterviews || []);
        }
      } catch (err) {
        console.error("Failed to fetch upcoming interviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  return (
    <section className="mb-12">
      <Card className="bg-card shadow-md border border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-2xl font-semibold text-foreground">
              Upcoming Interviews
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your scheduled candidate interview sessions
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/hr/interviews')}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : interviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No upcoming interviews scheduled. Select an applicant to schedule an interview.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interviews.map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell className="font-medium">{interview.applicant.fullName}</TableCell>
                      <TableCell>{interview.job.jobTitle}</TableCell>
                      <TableCell>{interview.interviewType}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(new Date(interview.interviewDate), 'MMM dd, yyyy')} at {interview.interviewTime}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {interview.meetLink && (
                          <a href={interview.meetLink} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="mr-1 text-primary">
                              <CalendarCheck className="h-4 w-4 mr-1" /> Meet
                            </Button>
                          </a>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/hr/interviews/${interview.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}