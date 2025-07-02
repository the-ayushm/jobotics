// components/dashboard/hr/EditJobForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Date picker specific imports
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format as formatDate } from 'date-fns';

// For toast notifications - NOW USING SONNER
import { toast } from "sonner"; // Import toast directly from sonner
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

// Define the Job type (should match the API response)
interface Job {
  id: string;
  jobTitle: string;
  numOpenings: number;
  minSalary: number;
  maxSalary: number;
  jobMode: string;
  jobDescription: string;
  deadline: string | null; // ISO string from DB
  status: string;
  postedAt: string | null; // ISO string from DB
  postedBy: {
    id: string;
    name: string | null;
    email: string;
    company: string | null;
  };
}

interface EditJobFormProps {
  jobId: string;
}

export function EditJobForm({ jobId }: EditJobFormProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [numOpenings, setNumOpenings] = useState<number | ''>("");
  const [minSalary, setMinSalary] = useState<number | ''>("");
  const [maxSalary, setMaxSalary] = useState<number | ''>("");
  const [jobMode, setJobMode] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<string>(""); // New state for job status
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingJob, setIsFetchingJob] = useState(true); // State for initial job fetch
  const [fetchError, setFetchError] = useState<string | null>(null); // Error for initial job fetch
  const router = useRouter()
  // const { toast } = useToast(); // REMOVED: useToast hook

  const jobs = [
    "Software Engineer", "Data Scientist", "Product Manager", "Web Developer",
    "Mobile Developer", "UX Designer", "DevOps Engineer", "System Administrator",
    "Network Engineer", "Database Administrator", "Cloud Engineer", "Cybersecurity Analyst",
    "Business Analyst", "Quality Assurance Engineer", "Technical Support Specialist",
    "Project Manager", "Sales Engineer", "Marketing Specialist", "Content Writer",
    "Graphic Designer", "SEO Specialist", "Social Media Manager", "HR Manager",
  ];
  const jobModes = [
    "Full-time(Remote)", "Full-time(On-site)", "Internship(Remote)", "Internship(On-site)",
  ];
  const jobStatuses = ["active", "closed", "draft"]; // Possible job statuses

  // Effect to fetch job data when the component mounts or jobId changes
  useEffect(() => {
    const fetchJobData = async () => {
      setIsFetchingJob(true);
      setFetchError(null);
      try {
        const response = await fetch(`/api/hr/jobs/${jobId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch job data: ${response.statusText}`);
        }
        const data: Job = await response.json();
        // Populate form fields with fetched data
        setJobTitle(data.jobTitle);
        setNumOpenings(data.numOpenings);
        setMinSalary(data.minSalary);
        setMaxSalary(data.maxSalary);
        setJobMode(data.jobMode);
        setJobDescription(data.jobDescription);
        // Handle potential null deadline
        setDeadline(data.deadline ? new Date(data.deadline) : undefined);
        setStatus(data.status); // Set status 
      } catch (err: any) {
        console.error("Error fetching job data for edit:", err);
        setFetchError(err.message || "Failed to load job data for editing.");
      } finally {
        setIsFetchingJob(false); 
      }
    };

    if (jobId) {
      fetchJobData();   
    }
  }, [jobId]); // Dependency on jobId

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Client-side validation
    if (!jobTitle || numOpenings === '' || minSalary === '' || maxSalary === '' || !jobMode || !jobDescription || !deadline || !status) {
      toast.error("Missing Information", { // UPDATED: Using sonner's toast.error
        description: "Please fill in all required fields.",
      });
      setIsLoading(false); 
      return;
    }

    try {
      const response = await fetch(`/api/hr/jobs/${jobId}`, {
        method: 'PATCH', // Use PATCH for updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle,
          numOpenings: Number(numOpenings), 
          minSalary: Number(minSalary),
          maxSalary: Number(maxSalary),
          jobMode,
          jobDescription,
          deadline: deadline.toISOString(), // Send date as ISO string
          status, // Include status in the update payload
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update job');
      }

      const result = await response.json();
      console.log('Job updated successfully:', result);

      toast.success(`Job Updated!, 
        ${jobTitle} has been successfully updated.`,
      );
      router.push('/dashboard/hr')
      

      // Optionally, redirect after successful update
      // router.push(`/dashboard/hr/jobs/${jobId}`); // Redirect to job details page
    } catch (error: any) {
      console.error("Error updating job:", error);
      toast.error("Update Failed", { // UPDATED: Using sonner's toast.error
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingJob) {
    return (
      <section className="max-w-xl mx-auto w-full mb-12">
        <Card className="bg-card shadow-md border border-border p-6">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
          <Skeleton className="h-32 w-full mt-8" />
        </Card>
      </section>
    );
  }

  if (fetchError) {
    return (
      <section className="max-w-xl mx-auto w-full mb-12">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Job</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      </section>
    );
  }

  return (
    <section className="max-w-xl mx-auto w-full mb-12">
      <Card className="w-full p-8 space-y-6 bg-card text-card-foreground shadow-md rounded-lg border border-border">
        <CardHeader className="text-center">
          <CardTitle className="mx-auto text-2xl text-foreground">
            Edit Job Opening
          </CardTitle>
          <CardDescription className="mx-auto text-muted-foreground">
            Modify details of the Job Opening.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Select value={jobTitle} onValueChange={setJobTitle}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select Job" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((jobOption) => (
                    <SelectItem key={jobOption} value={jobOption}>
                      {jobOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            
              <Label htmlFor="numOpenings" className="mt-4 block">No. of Job Openings</Label>
              <Input
                id="numOpenings"
                placeholder="Enter no. of Job Openings"
                type="number"
                className="mt-2"
                value={numOpenings}
                onChange={(e) => setNumOpenings(parseInt(e.target.value) || '')}
              />

              <Label htmlFor="minSalary" className="mt-4 block">Min. Salary</Label>
              <Input
                id="minSalary"
                placeholder="Enter min. Salary"
                type="number"
                className="mt-2"
                value={minSalary}
                onChange={(e) => setMinSalary(parseInt(e.target.value) || '')}
              />

              <Label htmlFor="maxSalary" className="mt-4 block">Max. Salary</Label>
              <Input
                id="maxSalary"
                placeholder="Enter max. Salary"
                type="number"
                className="mt-2"
                value={maxSalary}
                onChange={(e) => setMaxSalary(parseInt(e.target.value) || '')}
              />

              <Label htmlFor="jobMode" className="mt-4 block">Job Mode</Label>
              <Select value={jobMode} onValueChange={setJobMode}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select Job Mode" />
                </SelectTrigger>
                <SelectContent>
                  {jobModes.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Job Status Select */}
              <Label htmlFor="status" className="mt-4 block">Job Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {jobStatuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Job Deadline Date Picker */}
              <Label htmlFor="jobDeadline" className="mt-4 block">Application Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal mt-2",
                      !deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? formatDate(deadline, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                    // Optional: Disable past dates
                    // disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>

              <Label htmlFor="jobDescription" className="mt-4 block">Job Description</Label>
              <TextareaAutosize
                id="jobDescription"
                minRows={4}
                maxRows={15}
                placeholder="Enter Job Description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className={cn(
                  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  "mt-2 resize-none overflow-hidden"
                )}
                style={{ transition: 'height 0.2s ease-in-out' }}
              />

              <div className="mt-6 flex">
                <Button type="submit" className="mx-auto w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Job"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
