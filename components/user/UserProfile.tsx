// components/user/UserProfile.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Edit, Save, XCircle, Loader2 } from 'lucide-react'; // Added Save, XCircle, Loader2 icons
import { format as formatDate } from 'date-fns';
import { toast } from 'sonner'; // For toasts

// Define the UserProfileData type (should match API response)
interface UserProfileData {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  image: string | null;
  createdAt: string;
}

export function UserProfile() {
  const { data: session, update: updateSession } = useSession(); // Get update function from useSession
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [isSaving, setIsSaving] = useState(false); // State for save loading

  // Form states for editing
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile.');
      }
      const data: UserProfileData = await response.json();
      setProfile(data);
      // Initialize edit form states with fetched data
      setEditName(data.name || '');
      setEditEmail(data.email || '');
      setEditPhone(data.phone || '');
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred while fetching profile.');
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserProfile();
    }
  }, [session?.user?.id, fetchUserProfile]);

  const handleEditToggle = () => {
    setIsEditing(prev => !prev);
    // Reset password fields when toggling out of edit mode
    if (isEditing) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!editName || !editEmail) {
      toast.error("Missing Information", { description: "Name and Email are required." });
      setIsSaving(false);
      return;
    }
    if (newPassword && newPassword !== confirmNewPassword) {
      toast.error("Password Mismatch", { description: "New password and confirmation do not match." });
      setIsSaving(false);
      return;
    }
    if (newPassword && newPassword.length < 8) {
        toast.error("Password Too Short", { description: "New password must be at least 8 characters long." });
        setIsSaving(false);
        return;
    }
    if (newPassword && !currentPassword) {
        toast.error("Current Password Required", { description: "Please enter your current password to change it." });
        setIsSaving(false);
        return;
    }


    try {
      const payload: any = {
        name: editName,
        email: editEmail,
        phone: editPhone,
      };

      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile.');
      }

      const updatedData: UserProfileData = await response.json();
      setProfile(updatedData); // Update local state with new profile data
      updateSession(); // Update NextAuth.js session to reflect changes (e.g., name, email)

      toast.success("Profile Updated!", { description: "Your profile has been successfully updated." });
      setIsEditing(false); // Exit edit mode
      setCurrentPassword(''); // Clear password fields
      setNewPassword('');
      setConfirmNewPassword('');

    } catch (err: any) {
      console.error("Error saving profile:", err);
      toast.error("Profile Update Failed", { description: err.message || "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-card text-card-foreground shadow-md p-6 max-w-2xl mx-auto">
        <CardHeader>
          <Skeleton className="h-6 w-1/2 mb-4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-10 w-full mt-4" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!profile) {
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Profile Not Found</AlertTitle>
        <AlertDescription>Could not load user profile data.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="bg-card text-card-foreground shadow-md p-6 max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">My Profile Information</CardTitle>
        <Button variant="outline" size="sm" onClick={handleEditToggle} disabled={isSaving}>
          {isEditing ? (
            <>
              <XCircle className="h-4 w-4 mr-2" /> Cancel
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.image && (
          <div className="flex justify-center mb-4">
            <img src={profile.image} alt="Profile" className="w-24 h-24 rounded-full object-cover border border-border" />
          </div>
        )}
        <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" value={editName} onChange={(e) => setEditName(e.target.value)} readOnly={!isEditing} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} readOnly={!isEditing} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value={editPhone || ''} onChange={(e) => setEditPhone(e.target.value)} readOnly={!isEditing} className="mt-1" placeholder="N/A" />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" type="text" value={profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} readOnly className="mt-1" />
            </div>
            <div>
              <Label htmlFor="memberSince">Member Since</Label>
              <Input id="memberSince" type="text" value={profile.createdAt ? formatDate(new Date(profile.createdAt), 'PPP') : 'N/A'} readOnly className="mt-1" />
            </div>

            {isEditing && (
                <div className="border-t border-border pt-4 mt-4 space-y-4">
                    <h3 className="text-lg font-medium text-foreground">Change Password</h3>
                    <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required={!!newPassword} // Required only if new password is being set
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
                            required={!!currentPassword} // Required if current password is provided
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
                            required={!!newPassword} // Required only if new password is being set
                            className="mt-1"
                        />
                    </div>
                </div>
            )}

            {isEditing && (
                <Button type="submit" disabled={isSaving} className="w-full mt-4">
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </>
                    )}
                </Button>
            )}
        </form>
      </CardContent>
    </Card>
  );
}
