// components/dashboard/hr/MetricCards.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Bell, CalendarCheck, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const metricsData = [
  {
    title: "Active Job Listings",
    value: "12",
    trend: "↑ 5% from last week",
    icon: Briefcase,
    color: "text-blue-500",
  },
  {
    title: "Total Applicants",
    value: "543",
    trend: "Overall",
    icon: Users,
    color: "text-green-500",
  },
  {
    title: "New Applicants Today",
    value: "27",
    trend: "🔥 High Activity",
    icon: Bell,
    color: "text-red-500",
  },
  {
    title: "Interviews Scheduled",
    value: "15",
    trend: "Upcoming 7 days",
    icon: CalendarCheck,
    color: "text-purple-500",
  },
  {
    title: "Hires This Month",
    value: "3",
    trend: "Goal: 5",
    icon: Award,
    color: "text-yellow-500",
  },
];

export function MetricCards() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-foreground">Key Metrics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {metricsData.map((metric, index) => (
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
  );
}
