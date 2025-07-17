// components/dashboard/hr/UpcomingInterviews.tsx
"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const upcomingInterviewsData = [
  {
    candidate: "Jane Doe",
    jobTitle: "Senior Software Engineer",
    interviewer: "Alice Smith",
    dateTime: "July 5, 2025 - 10:00 AM",
    link: "#", // Placeholder link
  },
  {
    candidate: "John Smith",
    jobTitle: "Product Manager",
    interviewer: "Bob Johnson",
    dateTime: "July 6, 2025 - 02:00 PM",
    link: "#",
  },
  {
    candidate: "Emily White",
    jobTitle: "UX/UI Designer",
    interviewer: "Charlie Brown",
    dateTime: "July 7, 2025 - 11:30 AM",
    link: "#",
  },
];

export function UpcomingInterviews() {
  const router = useRouter();
  return (
    <section className="mb-12">
      <Card className="bg-card shadow-md border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-foreground">
            Upcoming Interviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto"> {/* Added for responsiveness */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Interviewer</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingInterviewsData.map((interview, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{interview.candidate}</TableCell>
                    <TableCell>{interview.jobTitle}</TableCell>
                    <TableCell>{interview.interviewer}</TableCell>
                    <TableCell>{interview.dateTime}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button variant="link" size="sm" onClick={() => router.push(interview.link)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}