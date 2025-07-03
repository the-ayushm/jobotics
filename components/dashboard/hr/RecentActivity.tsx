
// components/dashboard/hr/RecentActivity.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentActivityData = [
  { id: 1, text: "New applicant for Software Engineer: Alex Green", time: "5 min ago" },
  { id: 2, text: "Interview with Jane Doe scheduled for July 5", time: "1 hour ago" },
  { id: 3, text: "Offer extended to Michael Brown for Data Scientist", time: "Yesterday" },
  { id: 4, text: "Job 'UX/UI Designer' status changed to Paused", time: "2 days ago" },
];

export function RecentActivity() {
  return (
    <section className="mb-12">
      <Card className="bg-card shadow-md border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-foreground">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {recentActivityData.map((activity) => (
              <li key={activity.id} className="flex items-start justify-between text-foreground">
                <p className="text-sm">{activity.text}</p>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-4">
                  {activity.time}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
