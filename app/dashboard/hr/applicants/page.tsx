// app/dashboard/hr/applicants/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Download, Search, Filter } from "lucide-react";

import { HrNavbar } from "@/components/hr/hr-navbar"; // Correct path
import { cn } from "@/lib/utils";
import { format as formatDate } from 'date-fns'; // For date formatting

// Define the Applicant type for better type safety
interface Applicant {
  id: string;
  // These fields are now nested under 'user' and 'job' objects
  user: {
    id: string;
    name: string | null; // Applicant's name
    email: string;       // Applicant's email
    phone: string | null;
  };
  job: {
    id: string;
    jobTitle: string; // Job title
    jobMode: string;
    minSalary: number;
    maxSalary: number;
    deadline: string;
  };
  status: "applied" | "reviewed" | "interviewed" | "offer" | "hired" | "rejected";
  appliedAt: string; // This is the 'Last Activity'
  resumeUrl: string | null; // Assuming resumeUrl is stored in Applicant model
  profileLink: string; // This will need to be constructed on the frontend
}

export default function HrApplicantsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const allApplicantStatuses = [
    "All",
    "New Application", // Corresponds to 'applied' status from DB
    "Screened",
    "Interview Scheduled",
    "Offer Extended",
    "Rejected",
  ];

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus === "unauthenticated" || session?.user?.role !== "hr") {
      router.push("/auth/hr/signin");
    }
  }, [session, sessionStatus, router]);

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (searchTerm) {
          queryParams.append('search', searchTerm);
        }
        if (statusFilter !== 'All') {
          // Map frontend filter name to backend status name if different
          const backendStatus = statusFilter === "New Application" ? "applied" : statusFilter.toLowerCase();
          queryParams.append('status', backendStatus);
        }

        const response = await fetch(`/api/hr/applicants?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch applicants: ${response.statusText}`);
        }
        const data: Applicant[] = await response.json();
        setApplicants(data);
      } catch (err: any) {
        console.error("Error fetching applicants:", err);
        setError(err.message || "Failed to load applicants. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (sessionStatus === "authenticated" && session?.user?.role === "hr") {
      fetchApplicants();
    }
  }, [searchTerm, statusFilter, sessionStatus, session]);

  if (sessionStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg bg-background text-foreground">
        Loading...
      </div>
    );
  }

  if (sessionStatus === "authenticated" && session.user?.role === "hr") {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <main className="flex-grow p-4 md:p-8 container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Applicant Management
            </h1>
            <p className="text-lg text-muted-foreground">
              Overview and management of all job applicants.
            </p>
          </div>

          <Card className="mb-8 bg-card shadow-md border border-border p-4">
            <CardContent className="flex flex-col md:flex-row gap-4 p-0">
              <div className="flex-1 flex items-center relative">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, email, or job title..."
                  className="pl-9 pr-3 py-2 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {allApplicantStatuses.map((statusOption) => (
                      <SelectItem key={statusOption} value={statusOption}>
                        {statusOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-md border border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground">
                All Applicants
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : applicants.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No applicants found matching your criteria.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Job Applied</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Activity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applicants.map((applicant) => (
                        <TableRow key={applicant.id}>
                          {/* FIX: Access nested properties */}
                          <TableCell className="font-medium">{applicant.user.name || 'N/A'}</TableCell>
                          <TableCell>{applicant.user.email || 'N/A'}</TableCell>
                          <TableCell>{applicant.job.jobTitle || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge
                              className={cn(
                                "text-xs font-semibold",
                                applicant.status === "applied" && "bg-blue-100 text-blue-700 hover:bg-blue-200",
                                applicant.status === "reviewed" && "bg-purple-100 text-purple-700 hover:bg-purple-200",
                                applicant.status === "interviewed" && "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
                                applicant.status === "offer" && "bg-green-100 text-green-700 hover:bg-green-700",
                                applicant.status === "hired" && "bg-green-500 text-white hover:bg-green-600",
                                applicant.status === "rejected" && "bg-red-100 text-red-700 hover:bg-red-200"
                              )}
                            >
                              {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                            </Badge>
                          </TableCell>
                          {/* FIX: Use appliedAt and handle null */}
                          <TableCell>{applicant.appliedAt ? formatDate(new Date(applicant.appliedAt), 'PPP') : 'N/A'}</TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            {/* FIX: Construct profileLink using applicant.id */}
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/hr/applicants/${applicant.id}`)}>
                              <Eye className="h-4 w-4 mr-1" /> View Profile
                            </Button>
                            {/* Resume link is now from applicant.resumeUrl */}
                            {applicant.resumeUrl && (
                              <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm" className="ml-2">
                                  <Download className="h-4 w-4 mr-1" /> Resume
                                </Button>
                              </a>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return null;
}
