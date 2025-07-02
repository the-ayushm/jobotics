import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { client } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const body = await req.json()
    // Destructure all expected fields from the request body
    const { 
        jobId, 
        fullName, 
        contactEmail, 
        phoneNumber,  
        resumeUrl 
    } = body;

    try {
        if (!session || !session.user || session.user.role !== 'user' || !session.user.id) {
            console.warn("Unauthorized attempt to submit application.")
            return NextResponse.json({ message: 'Unauthorized: Only authenticated users can apply.' }, { status: 401 });
        }

        // Basic validation for required application fields
        if (!jobId || !fullName || !contactEmail || !resumeUrl) { // phoneNumber and coverLetter are optional
            return NextResponse.json({ message: 'Missing required application fields (Job ID, Full Name, Contact Email, Resume URL).' }, { status: 400 });
        }

        // Validate email format (optional but good practice)
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
            return NextResponse.json({ message: 'Invalid email format for contact email.' }, { status: 400 });
        }

        const jobExists = await client.job.findUnique({
            where: { id: jobId },
            select: { id: true, deadline: true }
        })

        if (!jobExists) {
            return NextResponse.json({ message: "Job not Found!" }, { status: 404 })
        }

        if (jobExists.deadline && new Date() > jobExists.deadline) {
            return NextResponse.json({ message: 'Application deadline has passed for this job.' }, { status: 400 })
        }

        const newApplication = await client.applicant.create({
            data: {
                userId: session.user.id,
                jobId: jobId,
                status: 'applied',
                appliedAt: new Date(),
                fullName: fullName,
                contactEmail: contactEmail,
                phoneNumber: phoneNumber,
                resumeUrl: resumeUrl,
            }
        })
        console.log(`Application submitted successfully by user ${session.user.name} for job ${jobId}.`);
        return NextResponse.json({ message: 'Application submitted successfully!', application: newApplication }, { status: 201 });
    } catch (error: any) {
        // Handle unique constraint violation (user already applied to this job)
        if (error.code === 'P2002' && error.meta?.target?.includes('userId') && error.meta?.target?.includes('jobId')) {
            console.warn(`User ${session?.user?.name} already applied to job ${jobId}.`);
            return NextResponse.json({ message: 'You have already applied for this job.' }, { status: 409 });
        }

        console.error("Error submitting application:", error);
        return NextResponse.json(
            { message: 'Failed to submit application.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}