// components/user/UserSettings.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // For password change example
import { toast } from "sonner"; // For notifications
import { Loader2 } from 'lucide-react'; // For loading spinner

export function UserSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true); // Example setting
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
      // Here you would make an API call to change the password
      // Example: await fetch('/api/user/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

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
    <Card className="bg-card text-card-foreground shadow-md p-6 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-4">Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* General Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">General Preferences</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNotifications">Email Notifications</Label>
            <Switch
              id="emailNotifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="darkMode">Dark Mode</Label>
            <Switch id="darkMode" checked disabled /> {/* Theme is managed globally by ThemeProvider */}
          </div>
        </div>

        {/* Change Password Section */}
        <div className="border-t border-border pt-6 mt-6 space-y-4">
          <h3 className="text-lg font-medium text-foreground">Change Password</h3>
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </form>
        </div>

        <p className="text-sm text-muted-foreground mt-6">
          For other account-related changes or support, please contact our team.
        </p>
      </CardContent>
    </Card>
  );
}
