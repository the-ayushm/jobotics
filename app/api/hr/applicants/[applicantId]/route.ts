// app/api/hr/applicants/[applicantId]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {client} from "@/lib/prisma";

interface RouteParams {
  applicantId: string;
}

export async function GET(req: NextRequest, context: { params: RouteParams }) {
    console.log("--- API: /api/hr/applicants/[applicantId] GET request received ---");
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== 'hr' || !session.user.id) {
            console.warn(`Unauthorized attempt to view applicant details for ID: ${context.params.applicantId}`);
            return NextResponse.json({ message: 'Unauthorized: Access denied.' }, { status: 401 });
        }

        const { applicantId } = context.params;
        if (!applicantId) {
            return NextResponse.json({ message: 'Applicant ID is required' }, { status: 400 });
        }

        const applicant = await client.applicant.findUnique({
            where: {
                id: applicantId,
            },
            select: {
                id: true,
                status: true,
                appliedAt: true,
                fullName: true,
                contactEmail: true,
                phoneNumber: true,
                resumeUrl: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                job: {
                    select: {
                        id: true,
                        jobTitle: true,
                        jobMode: true,
                        minSalary: true,
                        maxSalary: true,
                        deadline: true,
                        postedBy: {
                            select: {
                                name: true,
                                company: true,
                                email: true, // <--- FIX: Add email here
                            },
                        },
                    },
                },
            },
        });

        if (!applicant) {
            console.warn(`Applicant with ID ${applicantId} not found.`);
            return NextResponse.json({ message: 'Applicant not found' }, { status: 404 });
        }

        console.log(`Fetched applicant details for ID: ${applicantId}`);
        return NextResponse.json(applicant, { status: 200 });

    } catch (error: any) {
        console.error(`API Error fetching applicant details for ID ${context.params.applicantId}:`, error);
        return NextResponse.json(
            { message: 'Failed to fetch applicant details.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    } 
}


// NEW: PATCH handler to update applicant status
export async function PATCH(req: NextRequest, context: { params: RouteParams }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== 'hr' || !session.user.id) {
            console.warn(`Unauthorized attempt to update applicant status for ID: ${context.params.applicantId}`);
            return NextResponse.json({ message: 'Unauthorized: Access denied.' }, { status: 401 });
        }

        const { applicantId } = context.params;
        if (!applicantId) {
            return NextResponse.json({ message: 'Applicant ID is required' }, { status: 400 });
        }

        const body = await req.json();
        const { status } = body; // Expecting 'status' in the request body

        // Basic validation for status
        const validStatuses = ["applied", "reviewed", "interviewed", "offer", "hired", "rejected"];
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json({ message: 'Invalid or missing status for update.' }, { status: 400 });
        }

        // Update the applicant's status in the database
        const updatedApplicant = await client.applicant.update({
            where: {
                id: applicantId,
                // Optional: You might want to ensure this HR user is authorized to update this applicant
                // e.g., by checking if the job applied for is posted by this HR.
                // job: { postedById: session.user.id } // Uncomment if you want this strict check
            },
            data: {
                status: status,
                updatedAt: new Date(), // Update timestamp
            },
        });

        if (!updatedApplicant) {
            console.warn(`Applicant with ID ${applicantId} not found or failed to update.`);
            return NextResponse.json({ message: 'Applicant not found or failed to update status' }, { status: 404 });
        }

        console.log(`Applicant ${applicantId} status updated to ${status} by HR user ${session.user.id}.`);
        return NextResponse.json({ message: 'Applicant status updated successfully!', applicant: updatedApplicant }, { status: 200 });

    } catch (error: any) {
        if (error.code === 'P2025') { // Prisma error for record not found
            return NextResponse.json({ message: 'Applicant not found.' }, { status: 404 });
        }
        console.error(`Error updating applicant status for ID ${context.params.applicantId || 'N/A'}:`, error);
        return NextResponse.json(
            { message: 'Failed to update applicant status.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    } finally {
        // await prisma.$disconnect();
    }
}