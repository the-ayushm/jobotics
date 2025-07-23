// components/user/UserQuickActions.tsx
"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { Search, Activity, Users, Target, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  action: () => void;
}

interface UserQuickActionsProps {
  loading: boolean;
}

export function UserQuickActions({ loading }: UserQuickActionsProps) {
  const router = useRouter();

  const quickActionsData: QuickAction[] = [
    {
      title: "Browse Jobs",
      description: "Find new opportunities",
      icon: Search,
      color: "from-violet-500 to-violet-600",
      action: () => router.push('/dashboard/user?section=available-jobs')
    },
    {
      title: "My Applications",
      description: "Track your progress",
      icon: Activity,
      color: "from-blue-500 to-blue-600",
      action: () => router.push('/dashboard/user?section=my-applications')
    },
    {
      title: "Update Profile",
      description: "Keep info current",
      icon: Users,
      color: "from-emerald-500 to-emerald-600",
      action: () => router.push('/dashboard/user?section=profile')
    },
    {
      title: "Settings",
      description: "Manage preferences",
      icon: Target,
      color: "from-purple-500 to-purple-600",
      action: () => router.push('/dashboard/user?section=settings')
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-3 w-20" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {quickActionsData.map((action, index) => (
        <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group" onClick={action.action}>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center justify-center mb-4"> {/* Centered content */}
              <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}> {/* Icon container size adjusted */}
                <action.icon className="w-7 h-7 text-white" /> {/* Icon size adjusted */}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3> {/* Adjusted margin */}
              <p className="text-sm text-gray-600">{action.description}</p> {/* Removed mb-4 */}
            </div>
            <Button variant="link" className="text-violet-600 group-hover:text-violet-700 transition-colors"> {/* Changed to Button variant="link" */}
              <span className="text-sm font-medium">Get Started</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
