// components/user/UserSettings.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function UserSettings() {
  return (
    <Card className="bg-card text-card-foreground shadow-md p-6 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-4">Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">Email Notifications</Label>
          <Switch id="notifications" disabled /> {/* Placeholder for future functionality */}
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="darkMode">Dark Mode (Managed by System/Theme Switcher)</Label>
          <Switch id="darkMode" checked disabled /> {/* Placeholder, theme is handled globally */}
        </div>
        {/* Add more settings options here */}
        <p className="text-sm text-muted-foreground mt-4">More settings options will be available soon.</p>
      </CardContent>
    </Card>
  );
}
