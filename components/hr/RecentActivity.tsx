// components/hr/RecentActivity.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";

interface ActivityItem {
  id: string;
  text: string;
  time: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch("/api/hr/stats");
        if (res.ok) {
          const data = await res.json();
          setActivities(data.recentActivity || []);
        }
      } catch (err) {
        console.error("Failed to fetch recent activity:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <section className="mb-12">
      <Card className="bg-card shadow-md border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" /> Recent Recruitment Activity
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Latest candidate submissions and scheduling events
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-6 w-4/5" />
            </div>
          ) : activities.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              No recent activity yet. When candidates apply or interviews are scheduled, they will appear here.
            </p>
          ) : (
            <ul className="space-y-4">
              {activities.map((activity) => (
                <li key={activity.id} className="flex items-start justify-between text-foreground p-3 rounded-lg bg-muted/20 border border-border/40">
                  <p className="text-sm font-medium">{activity.text}</p>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-4 font-mono">
                    {activity.time}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
