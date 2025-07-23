// components/user/JobCardUser.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format as formatDate } from 'date-fns';
import { toast } from 'sonner';

import { ApplyJobDialog } from './ApplyJobDialog'; // Ensure this is correctly imported
import { Loader2 } from 'lucide-react'; // For loading spinner

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
  onApplySuccess: () => void;
  hasApplied?: boolean;
  userApplicationStatus?: string | null;
}

export function JobCardUser({ job, onApplySuccess, hasApplied, userApplicationStatus }: JobCardUserProps) { // <--- ENSURE IT'S EXPORTED AS A NAMED EXPORT
  const isApplied = hasApplied;

  let buttonText = "Apply Now";
  let buttonVariant: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" = "default";
  let buttonDisabled = false;

  if (isApplied) {
    buttonText = userApplicationStatus ? `Applied (${userApplicationStatus})` : "Applied";
    buttonVariant = "secondary";
    buttonDisabled = true;
  }

  const deadlinePassed = job.deadline ? new Date() > new Date(job.deadline) : false;
  if (deadlinePassed && !isApplied) {
    buttonText = "Deadline Passed";
    buttonVariant = "outline";
    buttonDisabled = true;
  } else if (deadlinePassed && isApplied) {
    buttonText = `Applied (Deadline Passed)`;
    buttonVariant = "secondary";
    buttonDisabled = true;
  }

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
            ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-2">
        <p className="text-base text-gray-700 dark:text-gray-300 line-clamp-4 leading-relaxed">
          {job.jobDescription}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end p-6 pt-0">
        {isApplied ? (
          <Button variant={buttonVariant} disabled={buttonDisabled} className="w-full">
            {buttonText}
          </Button>
        ) : (
          <ApplyJobDialog
            jobId={job.id}
            jobTitle={job.jobTitle}
            onApplySuccess={onApplySuccess}
          />
        )}
      </CardFooter>
    </Card>
  );
}
