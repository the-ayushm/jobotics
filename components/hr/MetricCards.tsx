// components/hr/MetricCards.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Bell, CalendarCheck, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatsMetrics {
  activeJobs: number;
  totalApplicants: number;
  applicantsToday: number;
  interviewsScheduled: number;
  hiresThisMonth: number;
}

export function MetricCards() {
  const [metrics, setMetrics] = useState<StatsMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/hr/stats");
        if (res.ok) {
          const data = await res.json();
          setMetrics(data.metrics);
        }
      } catch (err) {
        console.error("Failed to fetch HR metrics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const cards = [
    {
      title: "Active Job Listings",
      value: metrics ? metrics.activeJobs : 0,
      trend: "Current Openings",
      icon: Briefcase,
      color: "text-blue-500",
    },
    {
      title: "Total Applicants",
      value: metrics ? metrics.totalApplicants : 0,
      trend: "All Jobs",
      icon: Users,
      color: "text-emerald-500",
    },
    {
      title: "New Applicants Today",
      value: metrics ? metrics.applicantsToday : 0,
      trend: "Today's Activity",
      icon: Bell,
      color: "text-amber-500",
    },
    {
      title: "Interviews Scheduled",
      value: metrics ? metrics.interviewsScheduled : 0,
      trend: "Upcoming Calls",
      icon: CalendarCheck,
      color: "text-teal-500",
    },
    {
      title: "Hires This Month",
      value: metrics ? metrics.hiresThisMonth : 0,
      trend: "Offers Accepted",
      icon: Award,
      color: "text-yellow-500",
    },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-foreground">Key Metrics</h2>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
      >
        {cards.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <Card className="bg-card shadow-md border border-border h-full transition-shadow hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <metric.icon className={cn("h-5 w-5", metric.color)} />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-16 mb-2" />
                ) : (
                  <div className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {metric.trend}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}