// app/api/hr/interviews/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { format as formatDate } from 'date-fns'; // Ensure formatDate is imported if used here
import {client} from "@/lib/prisma";

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CALENDAR_CLIENT_ID,
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_CALENDAR_EMAIL,
        clientId: process.env.GOOGLE_CALENDAR_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
});


// POST handler
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== 'hr' || !session.user.id) {
            console.warn("Unauthorized attempt to schedule interview.");
            return NextResponse.json({ message: 'Unauthorized: Only HR users can schedule interviews.' }, { status: 401 });
        }

        const hrUserId = session.user.id;
        const body = await req.json();
        const {
            applicantId,
            jobId,
            interviewDate,
            interviewTime,
            interviewType,
            notes
        } = body;

        if (!applicantId || !jobId || !interviewDate || !interviewTime || !interviewType) {
            return NextResponse.json({ message: 'Missing required interview fields.' }, { status: 400 });
        }

        const parsedInterviewDate = new Date(interviewDate);
        if (isNaN(parsedInterviewDate.getTime())) {
            return NextResponse.json({ message: 'Invalid interview date format.' }, { status: 400 });
        }

        const applicant = await client.applicant.findUnique({
            where: { id: applicantId },
            include: { user: true, job: true }
        });
        
        const job = applicant?.job;

        if (!applicant || !job) {
            return NextResponse.json({ message: 'Applicant or Job not found for scheduling.' }, { status: 404 });
        }

        const [hours, minutesPart] = interviewTime.split(':');
        const [minutes, ampm] = [parseInt(minutesPart.slice(0, 2)), minutesPart.slice(2, 4)];
        
        let startHours = parseInt(hours);
        if (ampm === 'PM' && startHours < 12) startHours += 12;
        if (ampm === 'AM' && startHours === 12) startHours = 0;

        const interviewStart = new Date(parsedInterviewDate);
        interviewStart.setHours(startHours, minutes, 0, 0);

        const interviewEnd = new Date(interviewStart.getTime() + 30 * 60 * 1000);

        let meetLink = '';
        try {
            const eventResponse = await calendar.events.insert({
                calendarId: 'primary',
                conferenceDataVersion: 1,
                requestBody: {
                    summary: `${interviewType} Interview: ${applicant.fullName} - ${job.jobTitle}`,
                    description: `Applicant: ${applicant.fullName}\nJob: ${job.jobTitle}\nNotes: ${notes || 'N/A'}`,
                    start: {
                        dateTime: interviewStart.toISOString(),
                        timeZone: 'Asia/Kolkata',
                    },
                    end: {
                        dateTime: interviewEnd.toISOString(),
                        timeZone: 'Asia/Kolkata',
                    },
                    attendees: [
                        { email: applicant.contactEmail },
                        { email: session.user.email },
                    ],
                    conferenceData: {
                        createRequest: { requestId: `${applicant.id}-${job.id}-${Date.now()}` },
                    },
                },
            });
            meetLink = eventResponse.data.hangoutLink || '';
            console.log(`Google Meet event created: ${meetLink}`); // FIX: Corrected console.log
        } catch (calError: any) {
            console.error("Error creating Google Meet event:", calError.message, calError.response?.data);
        }

        const newInterview = await client.interview.create({
            data: {
                applicantId,
                jobId,
                interviewDate: parsedInterviewDate,
                interviewTime,
                interviewType,
                scheduledById: hrUserId,
                interviewerId: null,
                notes,
                status: "scheduled",
                meetLink: meetLink || null,
            },
        });

        const emailContent = `
        Dear ${applicant.fullName},

        Your interview for the position of ${job.jobTitle} has been scheduled.

        **Interview Details:**
        - **Type:** ${interviewType}
        - **Date:** ${formatDate(parsedInterviewDate, 'PPP')}
        - **Time:** ${interviewTime} (Asia/Kolkata Time Zone)
        - **Interviewer(s):** HR Team (No Specific Interviewer mentioned)
        - **Platform:** Google Meet
        - **Join Link:** ${meetLink || 'Link could not be generated. Please contact HR.'}

        Please ensure you are ready a few minutes before the scheduled time.

        Best regards,
        The ${session.user.company || 'HR Team'} at Jobotics
        `;

        try {
            const mailOptions: any = {
                from: process.env.GOOGLE_CALENDAR_EMAIL,
                to: applicant.contactEmail,
                subject: `Interview Invitation: ${interviewType} for ${job.jobTitle}`,
                html: emailContent.replace(/\n/g, '<br/>'),
            };
            if (typeof session.user.email === 'string') {
                mailOptions.cc = session.user.email;
            }
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully!");
        } catch (mailError: any) {
            console.error("Error sending email:", mailError.message);
        }
        
        await client.applicant.update({
            where: { id: applicantId },
            data: { status: 'interviewed' }
        });


        console.log(`Interview scheduled successfully: ${newInterview.id} for applicant ${applicantId} by HR ${hrUserId}.`);
        return NextResponse.json({ message: 'Interview scheduled and email sent successfully!', interview: newInterview, meetLink: meetLink }, { status: 201 });

    } catch (error: any) {
        console.error("Error scheduling interview:", error);
        if (error.code === 'P2003') {
            return NextResponse.json({ message: 'Invalid Applicant, Job, or Interviewer ID provided.' }, { status: 400 });
        }
        if (error.response && error.response.data && error.response.data.error) {
            console.error("Google API Error:", error.response.data.error);
            return NextResponse.json({ message: `Google API Error: ${error.response.data.error.message || 'Check API credentials/scopes.'}` }, { status: 500 });
        }
        return NextResponse.json(
            { message: 'Failed to schedule interview.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    } 
}

// NEW: GET handler to fetch interview listings for the HR user
export async function GET(req: NextRequest) {
    console.log("--- API: /api/hr/interviews GET request received ---");
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== 'hr' || !session.user.id) {
            console.warn("API: Unauthorized attempt to fetch HR interviews.");
            return NextResponse.json({ message: 'Unauthorized: Access denied.' }, { status: 401 });
        }

        const hrUserId = session.user.id;

        // Fetch interviews scheduled by this HR user OR interviews for jobs posted by this HR user
        const interviews = await client.interview.findMany({
            where: {
                OR: [
                    { scheduledById: hrUserId }, // Interviews scheduled by this HR
                    { job: { postedById: hrUserId } } // Interviews for jobs posted by this HR
                ]
            },
            include: {
                applicant: { // Include applicant details
                    select: {
                        id: true,
                        fullName: true,
                        contactEmail: true,
                    },
                },
                job: { // Include job details
                    select: {
                        id: true,
                        jobTitle: true,
                        jobMode: true,
                    },
                },
                interviewer: { // Include interviewer details (if selected)
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: [
                { interviewDate: 'asc' }, 
                { interviewTime: 'asc'}
            ],
        });

        console.log(`API: Fetched ${interviews.length} interviews for HR user ${hrUserId}.`);
        return NextResponse.json(interviews, { status: 200 });

    } catch (error: any) {
        console.error("API Error in /api/hr/interviews:", error);
        return NextResponse.json(
            { message: 'Failed to fetch interviews.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    } 
}
