// components/user/UserQuickStatsCard.tsx
"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface QuickStats {
  applicationsSent: number;
  profileViews: number;
  jobMatches: number;
}

interface UserQuickStatsCardProps {
  stats: QuickStats | null;
  loading: boolean;
}

export function UserQuickStatsCard({ stats, loading }: UserQuickStatsCardProps) {
  if (loading) {
    return (
      <Card className="bg-card shadow-md">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-4 w-1/2 mb-4" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/6" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">This Week</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-sm text-gray-600">Applications sent</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{stats?.applicationsSent || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span className="text-sm text-gray-600">Profile views</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{stats?.profileViews || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-600">Job matches</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{stats?.jobMatches || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
