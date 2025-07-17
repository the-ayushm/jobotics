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
import { Skeleton } from "@/components/ui/skeleton"; // For loading states
import { Eye, Download, Search, Filter } from "lucide-react"; // Icons

import { HrNavbar } from "@/components/hr/hr-navbar";
import { cn } from "@/lib/utils";

// Define the Applicant type for better type safety
interface Applicant {
  id: string;
  name: string;
  email: string;
  jobApplied: string;
  status: "New Application" | "Screened" | "Interview Scheduled" | "Offer Extended" | "Rejected";
  lastActivity: string; // Date string
  resumeLink: string;
  profileLink: string;
}

export default function HrApplicantsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All"); // Default filter

  // All possible statuses for the filter dropdown
  const allApplicantStatuses = [
    "All",
    "New Application",
    "Screened",
    "Interview Scheduled",
    "Offer Extended",
    "Rejected",
  ];

  // Authentication check
  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus === "unauthenticated" || session?.user?.role !== "hr") {
      router.push("/auth/hr/signin");
    }
  }, [session, sessionStatus, router]);

  // Fetch applicants data
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
          queryParams.append('status', statusFilter);
        }

        const response = await fetch(`/api/hr/applicants?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch applicants: ${response.statusText}`);
        }
        const data: Applicant[] = await response.json();
        setApplicants(data);
      } catch (err) {
        console.error("Error fetching applicants:", err);
        setError("Failed to load applicants. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (sessionStatus === "authenticated" && session?.user?.role === "hr") {
      fetchApplicants();
    }
  }, [searchTerm, statusFilter, sessionStatus, session]); // Re-fetch when search/filter/auth changes

  // Loading state for initial session check
  if (sessionStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg bg-background text-foreground">
        Loading...
      </div>
    );
  }

  // Render dashboard only if authenticated and authorized as HR
  if (sessionStatus === "authenticated" && session.user?.role === "hr") {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <main className="flex-grow p-4 md:p-8 container mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Applicant Management
            </h1>
            <p className="text-lg text-muted-foreground">
              Overview and management of all job applicants.
            </p>
          </div>

          {/* Search and Filter Section */}
          <Card className="mb-8 bg-card shadow-md border border-border p-4">
            <CardContent className="flex flex-col md:flex-row gap-4 p-0">
              {/* Search Input */}
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

              {/* Status Filter */}
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

          {/* Loading, Error, or Applicants Table */}
          <Card className="bg-card shadow-md border border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground">
                All Applicants
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive">
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
                          <TableCell className="font-medium">{applicant.name}</TableCell>
                          <TableCell>{applicant.email}</TableCell>
                          <TableCell>{applicant.jobApplied}</TableCell>
                          <TableCell>
                            <Badge
                              className={cn(
                                "text-xs font-semibold",
                                applicant.status === "New Application" && "bg-blue-100 text-blue-700 hover:bg-blue-200",
                                applicant.status === "Screened" && "bg-purple-100 text-purple-700 hover:bg-purple-200",
                                applicant.status === "Interview Scheduled" && "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
                                applicant.status === "Offer Extended" && "bg-green-100 text-green-700 hover:bg-green-700",
                                applicant.status === "Rejected" && "bg-red-100 text-red-700 hover:bg-red-200"
                              )}
                            >
                              {applicant.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{applicant.lastActivity}</TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <Button variant="ghost" size="sm" onClick={() => router.push(applicant.profileLink)}>
                              <Eye className="h-4 w-4 mr-1" /> View Profile
                            </Button>
                            <a href={applicant.resumeLink} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="sm" className="ml-2">
                                <Download className="h-4 w-4 mr-1" /> Resume
                              </Button>
                            </a>
                            {/* Example of a status update button (requires more logic) */}
                            {/* <Button variant="ghost" size="sm" className="ml-2">
                                Change Status
                            </Button> */}
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

  return null; // Should not reach here if redirects are handled
}