// app/dashboard/hr/settings/page.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, KeyRound, Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from "next-themes";

export default function HrSettingsPage() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [calendarSync, setCalendarSync] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordChanging(true);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Missing Fields", { description: "Please fill all password fields." });
      setIsPasswordChanging(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Password Mismatch", { description: "New password and confirmation do not match." });
      setIsPasswordChanging(false);
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password Too Short", { description: "New password must be at least 8 characters long." });
      setIsPasswordChanging(false);
      return;
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password.');
      }

      toast.success("Password Updated", { description: "Your password has been changed successfully." });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      toast.error("Password Change Failed", { description: error.message || "An error occurred while changing password." });
    } finally {
      setIsPasswordChanging(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <Card className="bg-card text-card-foreground shadow-md p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">HR Account Settings</CardTitle>
          <CardDescription>Manage your preferences and security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Preferences
            </h3>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
              <div>
                <Label htmlFor="emailNotifications" className="font-medium">Applicant Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive email alerts when candidates apply</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
              <div>
                <Label htmlFor="calendarSync" className="font-medium">Google Calendar Sync</Label>
                <p className="text-xs text-muted-foreground">Automatically create calendar events and Meet links</p>
              </div>
              <Switch
                id="calendarSync"
                checked={calendarSync}
                onCheckedChange={setCalendarSync}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
              <div>
                <Label htmlFor="darkMode" className="font-medium">Dark Mode</Label>
                <p className="text-xs text-muted-foreground">Toggle between light and dark interface</p>
              </div>
              {mounted && (
                <Switch
                  id="darkMode"
                  checked={resolvedTheme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              )}
            </div>
          </div>

          <div className="border-t border-border pt-6 mt-6 space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" /> Change Password
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <Button type="submit" disabled={isPasswordChanging} className="w-full">
                {isPasswordChanging ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
