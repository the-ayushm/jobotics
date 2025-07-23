// components/hr/HrInterviews.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CalendarCheck, Clock, Mail, ExternalLink, Download, Eye } from 'lucide-react'; // Added icons
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { format as formatDate } from 'date-fns';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

// Define Interview type based on API response
interface Interview {
  id: string;
  interviewDate: string; // ISO string
  interviewTime: string;
  interviewType: string;
  status: string; // e.g., "scheduled", "completed", "cancelled"
  meetLink: string | null;
  applicant: {
    id: string;
    fullName: string;
    contactEmail: string;
  };
  job: {
    id: string;
    jobTitle: string;
    jobMode: string;
  };
  interviewer?: { // Optional interviewer
    id: string;
    name: string | null;
    email: string;
  } | null;
}

export function HrInterviews() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/hr/interviews'); // Call your new API endpoint
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch interviews.');
      }
      const data: Interview[] = await response.json();
      setInterviews(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred while fetching interviews.');
      console.error("Error fetching interviews:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };


  return (
    <Card className="bg-card text-card-foreground shadow-md p-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-4">Scheduled Interviews</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : interviews.length === 0 ? (
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>No Interviews Scheduled</AlertTitle>
            <AlertDescription>
              You don't have any interviews scheduled yet.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Interviewer</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableCell>
                      {interview.interviewer?.name || interview.interviewer?.email || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(getStatusColor(interview.status), "border")}>
                        {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {interview.meetLink && (
                        <a href={interview.meetLink} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" className="ml-2">
                            <CalendarCheck className="h-4 w-4 mr-1" /> Join Meet
                          </Button>
                        </a>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/hr/interviews/${interview.id}`)}>
                        <Eye className="h-4 w-4 mr-1" /> View Details
                      </Button>
                      {/* Add more actions like edit/cancel here */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
