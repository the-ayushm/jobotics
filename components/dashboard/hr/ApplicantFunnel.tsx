// components/dashboard/hr/ApplicantFunnel.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion"; // For potential animations on stages

const applicantFunnelData = [
  { stage: "Applied", count: 543, progress: 100 },
  { stage: "Screened", count: 320, progress: 60 },
  { stage: "Interviewed", count: 80, progress: 20 },
  { stage: "Offer", count: 15, progress: 5 },
  { stage: "Hired", count: 3, progress: 1 },
];

export function ApplicantFunnel() {
  return (
    <section className="mb-12">
      <Card className="bg-card shadow-md border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-foreground">
            Applicant Pipeline Overview
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            See how applicants are moving through your hiring process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end"> {/* Adjusted grid for better responsiveness */}
            {applicantFunnelData.map((stage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center p-3 sm:p-4 rounded-md bg-muted/20" // Subtle background for each stage card
              >
                <p className="text-xl font-bold text-foreground mb-1">{stage.count}</p> {/* Larger count */}
                <p className="text-sm text-muted-foreground mb-2 text-center">{stage.stage}</p>
                <Progress value={stage.progress} className="w-full h-2 rounded-full" /> {/* Progress bar */}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
