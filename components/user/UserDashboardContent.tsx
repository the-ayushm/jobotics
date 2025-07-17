// components/user/UserDashboardContent.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, FileText, CheckCircle, Award } from "lucide-react"; // Icons for metrics
import { cn } from "@/lib/utils"; // For utility classes

export function UserDashboardContent() {
  // Mock Data for User Dashboard Metrics
  const userMetrics = [
    {
      title: "Jobs Applied",
      value: "5",
      trend: "Total applications",
      icon: Briefcase,
      color: "text-blue-500",
    },
    {
      title: "Active Applications",
      value: "3",
      trend: "Currently under review",
      icon: FileText,
      color: "text-purple-500",
    },
    {
      title: "Interviews Scheduled",
      value: "1",
      trend: "Upcoming interviews",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Offers Received",
      value: "0",
      trend: "Keep applying!",
      icon: Award,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-foreground">Welcome to Your Dashboard!</h1>
      <p className="text-lg text-muted-foreground">Here's a quick overview of your job search.</p>

      {/* Key Metrics Overview */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Your Application Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {userMetrics.map((metric, index) => (
            <Card key={index} className="bg-card shadow-md border border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <metric.icon className={cn("h-5 w-5", metric.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {metric.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metric.trend}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Links / Call to Action */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card shadow-md border border-border p-6 flex flex-col items-center text-center">
            <h3 className="text-xl font-semibold mb-3 text-foreground">Find New Opportunities</h3>
            <p className="text-muted-foreground mb-4">Explore available job listings that match your skills.</p>
            <Button onClick={() => alert("Navigate to Available Jobs")} className="w-full">Browse Jobs</Button>
          </Card>
          <Card className="bg-card shadow-md border border-border p-6 flex flex-col items-center text-center">
            <h3 className="text-xl font-semibold mb-3 text-foreground">Update Your Profile</h3>
            <p className="text-muted-foreground mb-4">Keep your profile and resume up-to-date for best matches.</p>
            <Button onClick={() => alert("Navigate to Profile")} className="w-full">Edit Profile</Button>
          </Card>
        </div>
      </section>

      {/* Placeholder for Recent Activity or Notifications */}
      <section>
        <Card className="bg-card shadow-md border border-border p-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold mb-4">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent activity yet. Apply for a job to see updates!</p>
            {/* In a real app, this would show recent application status changes, new job matches, etc. */}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
