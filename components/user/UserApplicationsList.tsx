// components/user/UserApplicationsList.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';
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
import { Eye, Download } from "lucide-react"; // Icons for actions
import { format as formatDate } from 'date-fns'; // For date formatting
import { useRouter } from 'next/navigation'; // For navigation

// Define the Application type (should match API response)
interface Application {
  id: string;
  status: string;
  appliedAt: string;
  job: {
    id: string;
    jobTitle: string;
    jobMode: string;
    minSalary: number;
    maxSalary: number;
    deadline: string;
  };
  resumeUrl: string | null; // Assuming resumeUrl is stored in Applicant model
}

export function UserApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize router

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/user/applications'); // Call the new API endpoint
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch applications.');
      }
      const data: Application[] = await response.json();
      setApplications(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <Card className="bg-card text-card-foreground shadow-md p-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-4">Your Submitted Applications</CardTitle>
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
        ) : applications.length === 0 ? (
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>No Applications Yet</AlertTitle>
            <AlertDescription>
              You haven't applied for any jobs yet. Browse the "Available Jobs" section to find opportunities!
            </AlertDescription>
          </Alert>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Job Mode</TableHead>
                  <TableHead>Salary Range</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.job.jobTitle}</TableCell>
                    <TableCell>{app.job.jobMode}</TableCell>
                    <TableCell>₹{app.job.minSalary.toLocaleString()} - ₹{app.job.maxSalary.toLocaleString()}</TableCell>
                    <TableCell>{formatDate(new Date(app.job.deadline), 'PPP')}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          app.status === "applied" ? "bg-blue-100 text-blue-700" :
                          app.status === "reviewed" ? "bg-purple-100 text-purple-700" :
                          app.status === "interviewed" ? "bg-indigo-100 text-indigo-700" :
                          app.status === "offer" ? "bg-green-100 text-green-700" :
                          app.status === "hired" ? "bg-green-500 text-white" :
                          "bg-red-100 text-red-700" // For "rejected" or other
                        }
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(new Date(app.appliedAt), 'PPP')}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/user/jobs/${app.job.id}`)}>
                        <Eye className="h-4 w-4 mr-1" /> View Job
                      </Button>
                      {app.resumeUrl && (
                        <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" className="ml-2">
                            <Download className="h-4 w-4 mr-1" /> Resume
                          </Button>
                        </a>
                      )}
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
