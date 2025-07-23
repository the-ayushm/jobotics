// components/user/UserStatsCards.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, CheckCircle, Award, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
      trend: "+2 this week",
      icon: Briefcase,
      // FIX: Changed color to a darker gradient, textColor to text-white
      color: "from-blue-600 to-blue-700", // Darker blue gradient
      bgColor: "bg-blue-50", // Keep light background for the card
      textColor: "text-white" // Icon color is white
    },
    {
      title: "Active Applications",
      value: stats?.activeApplications || 0,
      trend: "Under review",
      icon: FileText,
      // FIX: Changed color to a darker gradient, textColor to text-white
      color: "from-purple-600 to-purple-700", // Darker purple gradient
      bgColor: "bg-purple-50",
      textColor: "text-white"
    },
    {
      title: "Interviews Scheduled",
      value: stats?.interviewsScheduled || 0,
      trend: "Next: Tomorrow",
      icon: CheckCircle,
      // FIX: Changed color to a darker gradient, textColor to text-white
      color: "from-green-600 to-green-700", // Darker green gradient
      bgColor: "bg-green-50",
      textColor: "text-white"
    },
    {
      title: "Offers Received",
      value: stats?.offersReceived || 0,
      trend: "Keep applying!",
      icon: Award,
      // FIX: Changed color to a darker gradient, textColor to text-white
      color: "from-orange-600 to-orange-700", // Darker orange gradient
      bgColor: "bg-orange-50",
      textColor: "text-white"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-20" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCardsData.map((card, index) => (
        <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <div className="flex items-center space-x-1 text-sm text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-end justify-between mb-2">
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              {/* Icon container uses bg-gradient-to-r with the card.color */}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center flex-shrink-0`}>
                {/* Icon uses card.textColor (now text-white) */}
                <card.icon className={`w-5 h-5 ${card.textColor}`} />
              </div>
            </div>
            <p className="text-xs text-gray-500">{card.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
