// components/dashboard/hr/CreateJobForm.tsx
"use client";

import React, { useState } from 'react';
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
import { format as formatDate, isBefore, startOfDay } from 'date-fns';

// For toast notifications - NOW USING SONNER
import { toast } from "sonner"; // Import toast directly from sonner

export function CreateJobForm() {
  const [jobTitle, setJobTitle] = useState("");
  const [numOpenings, setNumOpenings] = useState<number | ''>("");
  const [minSalary, setMinSalary] = useState<number | ''>("");
  const [maxSalary, setMaxSalary] = useState<number | ''>("");
  const [jobMode, setJobMode] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  // const { toast } = useToast(); // REMOVE useToast hook

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!jobTitle || numOpenings === '' || minSalary === '' || maxSalary === '' || !jobMode || !jobDescription || !deadline) {
      toast.error("Missing Information", { // Use toast.error for destructive variant
        description: "Please fill in all required fields.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/hr/jobs', {
        method: 'POST',
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
          deadline: deadline.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to post job');
      }

      const result = await response.json();
      console.log('Job posted successfully:', result);

      toast.success("Job Posted!", { // Use toast.success for success variant
        description: `"${jobTitle}" has been successfully added.`,
      });

      setJobTitle("");
      setNumOpenings("");
      setMinSalary("");
      setMaxSalary("");
      setJobMode("");
      setJobDescription("");
      setDeadline(undefined);

    } catch (error: any) {
      console.error("Error submitting job:", error);
      toast.error("Submission Failed", { // Use toast.error for destructive variant
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto w-full mb-12">
      <Card className="w-full p-8 space-y-6 bg-card text-card-foreground shadow-md rounded-lg border border-border">
        <CardHeader className="text-center">
          <CardTitle className="mx-auto text-2xl text-foreground">
            Create New Job Openings
          </CardTitle>
          <CardDescription className="mx-auto text-muted-foreground">
            Enter details of the Job to create job opening.
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
                    autoFocus
                    disabled = {(date) => isBefore(startOfDay(date), startOfDay(new Date()))}
                    
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
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
