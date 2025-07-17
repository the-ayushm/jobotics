// components/dashboard/hr/JobListingsTable.tsx
"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { format as formatDate } from 'date-fns';

interface Job {
  id: string;
  jobTitle: string;
  numOpenings: number;
  jobMode: string;
  status: string;
  createdAt: string | null;
  deadline: string | null;
}

export function JobListingsTable() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/hr/jobs');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch jobs: ${response.statusText}`);
        }
        const data: Job[] = await response.json();
        setJobs(data);
      } catch (err: any) {
        console.error("Error fetching job listings:", err);
        setError(err.message || "Failed to load job listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <section className="mb-12">
      <Card className="bg-card shadow-md border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-semibold text-foreground">
            Active Job Listings
          </CardTitle>
          <Button onClick={() => router.push('/dashboard/hr/jobs/create')} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Job
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
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
            <p className="text-center text-muted-foreground py-8">No job listings found. Create a new job to get started!</p>
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
                        {/* UPDATED: Link to the new dynamic job edit page */}
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
    </section>
  );
}