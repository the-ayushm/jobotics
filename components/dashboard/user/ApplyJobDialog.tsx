// components/user/ApplyJobDialog.tsx
"use client";

import React, { useState, useRef } from 'react';
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
import { Textarea } from "@/components/ui/textarea"; // Assuming you have this from shadcn
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react'; // Loading icon

interface ApplyJobDialogProps {
  jobId: string;
  jobTitle: string;
  onApplySuccess: () => void;
}

export function ApplyJobDialog({ jobId, jobTitle, onApplySuccess }: ApplyJobDialogProps) {
  const { data: session } = useSession();
  const [fullName, setFullName] = useState(session?.user?.name || '');
  const [contactEmail, setContactEmail] = useState(session?.user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog open/close
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    } else {
      setResumeFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!fullName || !contactEmail || !resumeFile) {
      toast.error("Missing Required Fields", {
        description: "Please provide your Full Name, Contact Email, and upload your Resume.",
      });
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      toast.error("Invalid Email", {
        description: "Please enter a valid contact email address.",
      });
      setIsLoading(false);
      return;
    }

    let resumeUrl = '';
    try {
      // 1. Upload Resume to Vercel Blob
      const formData = new FormData();
      formData.append('file', resumeFile); // Append the file directly

      const uploadResponse = await fetch(`/api/upload-resume?filename=${encodeURIComponent(resumeFile.name)}`, {
        method: 'POST',
        body: resumeFile, // Send the file directly as body
        headers: {
            'Content-Type': resumeFile.type, // Set content type of the file
        },
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'Failed to upload resume.');
      }
      const uploadResult = await uploadResponse.json();
      resumeUrl = uploadResult.url;
      toast.success("Resume Uploaded", { description: "Your resume has been uploaded successfully." });

      // 2. Submit Application Details
      const applicationResponse = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          fullName,
          contactEmail,
          phoneNumber,
          resumeUrl, // Include the uploaded resume URL
        }),
      });

      if (!applicationResponse.ok) {
        const errorData = await applicationResponse.json();
        throw new Error(errorData.message || 'Failed to submit application.');
      }

      toast.success("Application Submitted!", {
        description: `You have successfully applied for "${jobTitle}".`,
      });
      onApplySuccess(); // Notify parent to refresh data
      setIsDialogOpen(false); // Close the dialog on success
      // Reset form fields
      setFullName(session?.user?.name || '');
      setContactEmail(session?.user?.email || '');
      setPhoneNumber('');
      setResumeFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear file input
      }

    } catch (error: any) {
      console.error("Error during application process:", error);
      toast.error("Application Failed", {
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-6 bg-card text-card-foreground rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Apply for {jobTitle}</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Please fill in your details and upload your resume to apply for this position.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullName" className="text-right">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contactEmail" className="text-right">Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right">Phone</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="col-span-3"
              placeholder="Optional"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resume" className="text-right">Resume (PDF, DOCX)</Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="col-span-3 file:text-primary file:font-semibold"
              required
              ref={fileInputRef}
            />
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
