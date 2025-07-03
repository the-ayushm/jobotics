// components/user/UserApplicationsList.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';

export function UserApplicationsList() {
  return (
    <Card className="bg-card text-card-foreground shadow-md p-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-4">Your Submitted Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>No Applications Yet</AlertTitle>
          <AlertDescription>
            You haven't applied for any jobs yet. Browse the "Available Jobs" section to find opportunities!
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}