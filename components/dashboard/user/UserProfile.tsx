// components/user/UserProfile.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export function UserProfile() {
  const { data: session } = useSession();

  return (
    <Card className="bg-card text-card-foreground shadow-md p-6 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-4">My Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" value={session?.user?.name || ''} readOnly className="mt-1" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={session?.user?.email || ''} readOnly className="mt-1" />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Input id="role" type="text" value={session?.user?.role || ''} readOnly className="mt-1" />
        </div>
        {/* Add more profile fields here as needed, e.g., contact, address */}
        <Button className="mt-4 w-full">Edit Profile (Coming Soon)</Button>
      </CardContent>
    </Card>
  );
}
