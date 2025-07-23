// components/hr/ScheduleInterviewDialog.tsx
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format as formatDate } from 'date-fns';
import { toast } from 'sonner';

interface ScheduleInterviewDialogProps {
  applicantId: string;
  jobId: string;
  applicantName: string;
  jobTitle: string;
  onInterviewScheduled: () => void;
}

export function ScheduleInterviewDialog({
  applicantId,
  jobId,
  applicantName,
  jobTitle,
  onInterviewScheduled,
}: ScheduleInterviewDialogProps) {
  const [interviewDate, setInterviewDate] = useState<Date | undefined>(undefined);
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewType, setInterviewType] = useState('');
  // FIX: Removed interviewerId state
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const interviewTypes = ["Technical", "HR Round", "Managerial", "Final Round"];
  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!interviewDate || !interviewTime || !interviewType) {
      toast.error("Missing Information", { description: "Please fill in date, time, and type." });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/hr/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantId,
          jobId,
          interviewDate: interviewDate.toISOString(),
          interviewTime,
          interviewType,
          // FIX: Removed interviewerId from payload
          notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to schedule interview.');
      }

      toast.success("Interview Scheduled!", {
        description: `Interview for ${applicantName} (${jobTitle}) scheduled on ${formatDate(interviewDate, 'PPP')} at ${interviewTime}.`,
      });
      onInterviewScheduled();
      setIsDialogOpen(false);
      // Reset form
      setInterviewDate(undefined);
      setInterviewTime('');
      setInterviewType('');
      // FIX: Removed setInterviewerId('')
      setNotes('');
    } catch (error: any) {
      console.error("Error scheduling interview:", error);
      toast.error("Scheduling Failed", { description: error.message || "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <CalendarIcon className="mr-2 h-4 w-4" /> Schedule Interview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-6 bg-card text-card-foreground rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Schedule Interview for {applicantName}</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Job: {jobTitle}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Interview Date */}
            <div>
              <Label htmlFor="interviewDate">Interview Date</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal mt-2"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {interviewDate ? formatDate(interviewDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={interviewDate}
                    onSelect={(date) => { setInterviewDate(date); setIsCalendarOpen(false); }}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Interview Time */}
            <div>
              <Label htmlFor="interviewTime">Interview Time</Label>
              <Select value={interviewTime} onValueChange={setInterviewTime}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select Time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Interview Type */}
          <div>
            <Label htmlFor="interviewType">Interview Type</Label>
            <Select value={interviewType} onValueChange={setInterviewType}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {interviewTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* FIX: Removed Interviewer (Optional) section entirely */}
          {/* <div>
            <Label htmlFor="interviewer">Interviewer (Optional)</Label>
            {fetchingInterviewers ? (
                <Skeleton className="h-10 w-full mt-2" />
            ) : interviewerError ? (
                <Alert variant="destructive" className="mt-2">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{interviewerError}</AlertDescription>
                </Alert>
            ) : (
                <Select value={interviewerId} onValueChange={setInterviewerId}>
                    <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="Select Interviewer" />
                    </SelectTrigger>
                    <SelectContent>
                        {interviewerId !== '' && (
                            <SelectItem value="">-- Clear Selection --</SelectItem>
                        )}
                        {interviewers.length === 0 ? (
                            <SelectItem value="" disabled>No interviewers found</SelectItem>
                        ) : (
                            interviewers.map((interviewer) => (
                                <SelectItem key={interviewer.id} value={interviewer.id}>
                                    {interviewer.name} ({interviewer.email})
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
            )}
          </div> */}

          {/* Notes (Optional) */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2 min-h-[80px]"
              placeholder="Add any relevant notes for the interview..."
            />
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              "Schedule Interview"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
