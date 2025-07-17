// components/user/UserProfile.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For error display
import { Terminal, Edit } from 'lucide-react'; // Icons
import {format as formatDate} from 'date-fns'; // For date formatting
// Define the UserProfile type (should match API response)
interface UserProfileData {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  image: string | null; // Profile image URL
  createdAt: string; // ISO string
}

export function UserProfile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/user/profile'); // Your API endpoint
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile.');
      }
      const data: UserProfileData = await response.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred while fetching profile.');
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch profile only if authenticated
    if (session?.user?.id) {
      fetchUserProfile();
    }
  }, [session?.user?.id, fetchUserProfile]); // Re-fetch if user ID changes

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
        {/* Optional: Edit button */}
        <Button variant="outline" size="sm" onClick={() => alert("Edit Profile functionality coming soon!")}>
          <Edit className="h-4 w-4 mr-2" /> Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.image && (
          <div className="flex justify-center mb-4">
            <img src={profile.image} alt="Profile" className="w-24 h-24 rounded-full object-cover border border-border" />
          </div>
        )}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" value={profile.name || 'N/A'} readOnly className="mt-1" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={profile.email || 'N/A'} readOnly className="mt-1" />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" value={profile.phone || 'N/A'} readOnly className="mt-1" />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Input id="role" type="text" value={profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} readOnly className="mt-1" />
        </div>
        <div>
          <Label htmlFor="memberSince">Member Since</Label>
          <Input id="memberSince" type="text" value={formatDate(new Date(profile.createdAt), 'PPP')} readOnly className="mt-1" />
        </div>
      </CardContent>
    </Card>
  );
}
