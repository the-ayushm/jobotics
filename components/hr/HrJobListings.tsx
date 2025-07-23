// components/hr/HrJobListings.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Eye, Pencil, PlusCircle } from 'lucide-react'; // Add Eye, Pencil, PlusCircle icons
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import Table components
import { Badge } from "@/components/ui/badge"; // Import Badge
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading
import { Button } from "@/components/ui/button"; // Import Button
import { format as formatDate } from 'date-fns'; // For date formatting
import { useRouter } from 'next/navigation'; // For navigation
import { cn } from "@/lib/utils"; // For utility classes

// Define the Job type (should match API response from /api/hr/jobs)
interface Job {
  id: string;
  jobTitle: string;
  numOpenings: number;
  jobMode: string;
  status: string;
  createdAt: string | null;
  deadline: string | null;
}

export function HrJobListings() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/hr/jobs'); // Call your existing API endpoint
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch jobs: ${response.statusText}`);
      }
      const data: Job[] = await response.json();
      setJobs(data);
    } catch (err: any) {
      console.error("Error fetching job listings in HrJobListings:", err);
      setError(err.message || "Failed to load job listings. Please try again.");
      // Consider using sonner toast here if you want a notification
      // toast.error("Failed to load jobs", { description: err.message || "Please check your network connection." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <Card className="bg-card text-card-foreground shadow-md p-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold mb-4">Your Posted Job Listings</CardTitle>
        <Button onClick={() => router.push('/dashboard/hr/jobs/create')} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Job
        </Button>
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
            <Skeleton className="h-10 w-full" />
          </div>
        ) : jobs.length === 0 ? (
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>No Job Listings</AlertTitle>
            <AlertDescription>
              You haven't posted any job listings yet. Click "New Job" to get started!
            </AlertDescription>
          </Alert>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Openings</TableHead>
                  <TableHead>Job Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Posted At</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.jobTitle}</TableCell>
                    <TableCell>{job.numOpenings}</TableCell>
                    <TableCell>{job.jobMode}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-xs font-semibold",
                          job.status === "active" && "bg-green-100 text-green-700 hover:bg-green-200",
                          job.status === "closed" && "bg-red-100 text-red-700 hover:bg-red-200",
                          job.status === "draft" && "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {job.createdAt ? formatDate(new Date(job.createdAt), 'PPP') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {job.deadline ? formatDate(new Date(job.deadline), 'PPP') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/hr/jobs/${job.id}`)}>
                        <Eye className="h-4 w-4 mr-1" /> View Details
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/hr/jobs/edit/${job.id}`)} className="ml-2">
                        <Pencil className="h-4 w-4 mr-1" /> Edit
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
  );
}
