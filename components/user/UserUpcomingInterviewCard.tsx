// components/user/UserUpcomingInterviewCard.tsx
"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react"; // Renamed to avoid conflict with Shadcn Calendar component
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from 'next/navigation';

interface UpcomingInterview {
  jobTitle: string;
  dateTime: string;
  link: string;
}

interface UserUpcomingInterviewCardProps {
  interview: UpcomingInterview | null;
  loading: boolean;
}

export function UserUpcomingInterviewCard({ interview, loading }: UserUpcomingInterviewCardProps) {
  const router = useRouter();

  if (loading) {
    return (
      <Card className="bg-card shadow-md">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-full mt-4" />
        </CardContent>
      </Card>
    );
  }

  if (!interview) {
    return (
      <Card className="bg-card shadow-md">
        <CardContent className="p-6 text-center text-muted-foreground">
          No upcoming interviews.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <CalendarIcon className="w-6 h-6 mr-2" />
          <h3 className="font-semibold">Upcoming Interview</h3>
        </div>
        <p className="text-sm opacity-90 mb-2">{interview.jobTitle}</p>
        <p className="text-sm opacity-90 mb-4">{interview.dateTime}</p>
        <Button variant="secondary" size="sm" className="w-full" onClick={() => router.push(interview.link)}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
