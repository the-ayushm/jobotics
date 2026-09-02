// components/user/UserStatsCards.tsx
"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, FileText, CheckCircle, Award, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface DashboardStats {
  totalApplications: number;
  activeApplications: number;
  interviewsScheduled: number;
  offersReceived: number;
}

interface UserStatsCardsProps {
  stats: DashboardStats | null;
  loading: boolean;
}

export function UserStatsCards({ stats, loading }: UserStatsCardsProps) {
  const statsCardsData = [
    {
      title: "Total Applications",
      value: stats?.totalApplications || 0,
      trend: "All-time submissions",
      icon: Briefcase,
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "Active Applications",
      value: stats?.activeApplications || 0,
      trend: "Under review",
      icon: FileText,
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "Interviews Scheduled",
      value: stats?.interviewsScheduled || 0,
      trend: "Upcoming sessions",
      icon: CheckCircle,
      color: "from-teal-500 to-emerald-600",
    },
    {
      title: "Offers Received",
      value: stats?.offersReceived || 0,
      trend: "Offers extended",
      icon: Award,
      color: "from-amber-500 to-yellow-600",
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 bg-card border border-border">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-20" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {statsCardsData.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="cursor-default"
        >
          <Card className="bg-card backdrop-blur-sm border border-border shadow-md hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">{card.title}</h3>
                <div className="flex items-center space-x-1 text-sm text-primary">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-end justify-between mb-2">
                <p className="text-3xl font-bold text-foreground">{card.value}</p>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{card.trend}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
