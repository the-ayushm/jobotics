// app/api/hr/applicants/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 

const prisma = new PrismaClient();

export async function GET(req: Request) {
    console.log("--- API: /api/hr/applicants GET request received ---");
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== 'hr' || !session.user.id) {
            console.warn("API: Unauthorized attempt to fetch HR applicants.");
            return NextResponse.json({ message: 'Unauthorized: Access denied.' }, { status: 401 });
        }

        const hrUserId = session.user.id;
        console.log("API: Authenticated HR User ID:", hrUserId);

        const applicants = await prisma.applicant.findMany({
            where: {
                job: {
                    postedById: hrUserId,
                },
            },
            select: { // Use select to explicitly fetch required fields
                id: true,
                status: true,
                appliedAt: true, // Directly on Applicant model
                resumeUrl: true, // Directly on Applicant model
                user: { // Include user details
                    select: {
                        id: true,
                        name: true, // Applicant's name
                        email: true, // Applicant's email
                        phone: true,
                    },
                },
                job: { // Include job details
                    select: {
                        id: true,
                        jobTitle: true, // Job title
                        jobMode: true,
                        minSalary: true,
                        maxSalary: true,
                        deadline: true,
                    },
                },
                // fullName and contactEmail are directly on Applicant model
                fullName: true,
                contactEmail: true,
                phoneNumber: true,
            },
            orderBy: {
                appliedAt: 'desc',
            },
        });

        console.log(`API: Fetched ${applicants.length} applicants for HR user ${hrUserId}.`);
        return NextResponse.json(applicants, { status: 200 });

    } catch (error: any) {
        console.error("API Error in /api/hr/applicants:", error);
        return NextResponse.json(
            { message: 'Failed to fetch applicants.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}
