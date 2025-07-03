// components/user/JobCardUser.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format as formatDate } from 'date-fns';
// import { toast } from 'sonner'; // No direct toast here anymore, handled by dialog

import { ApplyJobDialog } from '@/components/dashboard/user/ApplyJobDialog'; // Import the new dialog component

interface JobCardUserProps {
  job: {
    id: string;
    jobTitle: string;
    jobDescription: string;
    numOpenings: number;
    minSalary: number;
    maxSalary: number;
    jobMode: string;
    deadline: string | Date | null;
    createdAt: string | Date | null;
  };
  onApplySuccess: () => void; // Callback to refresh job list/applications after successful apply
}

export function JobCardUser({ job, onApplySuccess }: JobCardUserProps) {
  // handleApply logic is now moved into ApplyJobDialog

  return (
    <Card className="flex flex-col h-full bg-card text-card-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-2xl font-extrabold text-primary-foreground leading-tight">{job.jobTitle}</CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Posted: {job.createdAt ? formatDate(new Date(job.createdAt), 'MMM dd,yyyy') : 'N/A'} | Deadline: {job.deadline ? formatDate(new Date(job.deadline), 'MMM dd,yyyy') : 'N/A'}
        </CardDescription>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
            {job.jobMode}
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-sm font-medium border-green-500 text-green-700 dark:border-green-400 dark:text-green-300 rounded-full">
            {job.numOpenings} Openings
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-sm font-medium border-purple-500 text-purple-700 dark:border-purple-400 dark:text-purple-300 rounded-full">
            ₹{job.minSalary.toLocaleString()} - ₹{job.maxSalary.toLocaleString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-2">
        <p className="text-base text-gray-700 dark:text-gray-300 line-clamp-4 leading-relaxed">
          {job.jobDescription}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end p-6 pt-0">
        {/* Use the ApplyJobDialog component */}
        <ApplyJobDialog
          jobId={job.id}
          jobTitle={job.jobTitle}
          onApplySuccess={onApplySuccess}
        />
      </CardFooter>
    </Card>
  );
}