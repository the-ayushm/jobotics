// components/hr/ApplicantFunnel.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface FunnelData {
  applied: number;
  screened: number;
  interviewed: number;
  offer: number;
  hired: number;
  total: number;
}

export function ApplicantFunnel() {
  const [funnel, setFunnel] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFunnel = async () => {
      try {
        const res = await fetch("/api/hr/stats");
        if (res.ok) {
          const data = await res.json();
          setFunnel(data.funnel);
        }
      } catch (err) {
        console.error("Failed to fetch funnel data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFunnel();
  }, []);

  const total = funnel && funnel.total > 0 ? funnel.total : 1;

  const stages = [
    { stage: "Applied", count: funnel ? funnel.applied : 0, progress: funnel ? Math.min(100, Math.round((funnel.applied / total) * 100)) : 0 },
    { stage: "Screened", count: funnel ? funnel.screened : 0, progress: funnel ? Math.min(100, Math.round((funnel.screened / total) * 100)) : 0 },
    { stage: "Interviewed", count: funnel ? funnel.interviewed : 0, progress: funnel ? Math.min(100, Math.round((funnel.interviewed / total) * 100)) : 0 },
    { stage: "Offer", count: funnel ? funnel.offer : 0, progress: funnel ? Math.min(100, Math.round((funnel.offer / total) * 100)) : 0 },
    { stage: "Hired", count: funnel ? funnel.hired : 0, progress: funnel ? Math.min(100, Math.round((funnel.hired / total) * 100)) : 0 },
  ];

  return (
    <section className="mb-12">
      <Card className="bg-card shadow-md border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-foreground">
            Applicant Pipeline Overview
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Real-time breakdown of candidates progressing through recruitment stages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 rounded-md bg-muted/20 space-y-2">
                  <Skeleton className="h-6 w-12 mx-auto" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
              {stages.map((stage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.03 }}
                  className="flex flex-col items-center p-3 sm:p-4 rounded-md bg-muted/20 border border-border/40 hover:border-primary/50 transition-colors cursor-default"
                >
                  <p className="text-2xl font-bold text-foreground mb-1">{stage.count}</p>
                  <p className="text-sm text-muted-foreground mb-2 text-center">{stage.stage}</p>
                  <Progress value={stage.progress} className="w-full h-2 rounded-full" />
                  <span className="text-xs text-muted-foreground mt-1">{stage.progress}%</span>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}