// components/user/UserQuickActions.tsx
"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { Search, Activity, Users, Target, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  section: string;
}

interface UserQuickActionsProps {
  loading: boolean;
  onSectionChange?: (section: string) => void;
}

export function UserQuickActions({ loading, onSectionChange }: UserQuickActionsProps) {
  const router = useRouter();

  const quickActionsData: QuickAction[] = [
    {
      title: "Browse Jobs",
      description: "Find new opportunities",
      icon: Search,
      color: "from-blue-600 to-indigo-600",
      section: "available-jobs"
    },
    {
      title: "My Applications",
      description: "Track your progress",
      icon: Activity,
      color: "from-emerald-500 to-teal-600",
      section: "my-applications"
    },
    {
      title: "Update Profile",
      description: "Keep info current",
      icon: Users,
      color: "from-teal-600 to-emerald-700",
      section: "profile"
    },
    {
      title: "Settings",
      description: "Manage preferences",
      icon: Target,
      color: "from-amber-500 to-yellow-600",
      section: "settings"
    }
  ];

  const handleActionClick = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    } else {
      router.push(`/dashboard/user?section=${section}`);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 bg-card border border-border">
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
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer"
          onClick={() => handleActionClick(action.section)}
        >
          <Card className="bg-card backdrop-blur-sm border border-border shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300 group h-full">
            <CardContent className="p-6 text-center flex flex-col items-center justify-between h-full">
              <div className="flex flex-col items-center justify-center mb-4">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                  <action.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 text-base group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-primary group-hover:text-primary font-medium hover:bg-primary/10 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick(action.section);
                }}
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
