// app/api/hr/interviews/[interviewId]/route.ts
export const dynamic = "force-dynamic";
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { client } from "@/lib/prisma";

export async function GET(req: NextRequest, context: { params: Record<string, string | undefined> }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== 'hr' || !session.user.id) {
            return NextResponse.json({ message: 'Unauthorized: Access denied.' }, { status: 401 });
        }

        const interviewId = context.params?.interviewId;
        if (!interviewId) {
            return NextResponse.json({ message: 'Interview ID is required.' }, { status: 400 });
        }

        const interview = await client.interview.findUnique({
            where: { id: interviewId },
            include: {
                applicant: {
                    select: {
                        id: true,
                        fullName: true,
                        contactEmail: true,
                        phoneNumber: true,
                        resumeUrl: true,
                    },
                },
                job: {
                    select: {
                        id: true,
                        jobTitle: true,
                        jobMode: true,
                        minSalary: true,
                        maxSalary: true,
                    },
                },
                scheduledBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        company: true,
                    },
                },
            },
        });

        if (!interview) {
            return NextResponse.json({ message: 'Interview not found.' }, { status: 404 });
        }

        return NextResponse.json(interview, { status: 200 });

    } catch (error: any) {
        console.error("API Error fetching interview details:", error);
        return NextResponse.json(
            { message: 'Failed to fetch interview details.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest, context: { params: Record<string, string | undefined> }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== 'hr' || !session.user.id) {
            return NextResponse.json({ message: 'Unauthorized: Access denied.' }, { status: 401 });
        }

        const interviewId = context.params?.interviewId;
        if (!interviewId) {
            return NextResponse.json({ message: 'Interview ID is required.' }, { status: 400 });
        }

        const body = await req.json();
        const { status, notes } = body;

        const updatedInterview = await client.interview.update({
            where: { id: interviewId },
            data: {
                ...(status ? { status } : {}),
                ...(notes !== undefined ? { notes } : {}),
            },
        });

        return NextResponse.json({ message: 'Interview updated successfully!', interview: updatedInterview }, { status: 200 });

    } catch (error: any) {
        console.error("Error updating interview:", error);
        return NextResponse.json(
            { message: 'Failed to update interview.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}
