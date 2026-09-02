// app/dashboard/hr/profile/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Edit, Save, XCircle, Loader2, Building, Mail, User } from 'lucide-react';
import { format as formatDate } from 'date-fns';
import { toast } from 'sonner';

interface HrProfileData {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  company?: string | null;
  createdAt: string;
}

export default function HrProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [profile, setProfile] = useState<HrProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCompany, setEditCompany] = useState('');

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch HR profile.');
      }
      const data: HrProfileData = await response.json();
      setProfile(data);
      setEditName(data.name || '');
      setEditEmail(data.email || '');
      setEditPhone(data.phone || '');
      setEditCompany(data.company || '');
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session?.user?.id, fetchProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          phone: editPhone,
          company: editCompany,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile.');
      }
      const updated: HrProfileData = await response.json();
      setProfile(updated);
      updateSession();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      toast.error('Update failed', { description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card className="p-6">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-10 w-full" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <Card className="bg-card shadow-md border border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">HR Profile</CardTitle>
            <CardDescription>Manage your company recruitment account details</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} disabled={isSaving}>
            {isEditing ? (
              <>
                <XCircle className="h-4 w-4 mr-1" /> Cancel
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                readOnly={!isEditing}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                readOnly={!isEditing}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                readOnly={!isEditing}
                className="mt-1"
                placeholder="N/A"
              />
            </div>
            <div>
              <Label htmlFor="company">Company / Organization</Label>
              <Input
                id="company"
                value={editCompany}
                onChange={(e) => setEditCompany(e.target.value)}
                readOnly={!isEditing}
                className="mt-1"
                placeholder="Company Name"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value="HR / Recruiter"
                readOnly
                className="mt-1 bg-muted/40"
              />
            </div>
            <div>
              <Label htmlFor="memberSince">Member Since</Label>
              <Input
                id="memberSince"
                value={profile?.createdAt ? formatDate(new Date(profile.createdAt), 'PPP') : 'N/A'}
                readOnly
                className="mt-1 bg-muted/40"
              />
            </div>

            {isEditing && (
              <Button type="submit" disabled={isSaving} className="w-full mt-4">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
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
    </div>
  );
}
