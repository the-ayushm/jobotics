// app/api/user/jobs/route.ts
import { NextResponse } from 'next/server';
import { client } from "@/lib/prisma"; // Your Prisma client instance
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust path as needed

export async function GET(req: Request) {
    console.log("--- API: /api/user/jobs GET request received ---");
    try {
        const session = await getServerSession(authOptions);

        console.log("API: Session in /api/user/jobs:", session);

        if (!session || !session.user || !session.user.id || session.user.role !== 'user') {
            console.warn("API: Unauthorized attempt to fetch user jobs: Session invalid or not 'user' role.");
            return NextResponse.json({ message: 'Unauthorized: Access denied.' }, { status: 401 });
        }

        const userId = session.user.id;
        console.log("API: Authenticated user ID:", userId);

        // Fetch jobs that are 'active' and have a deadline in the future
        const jobs = await client.job.findMany({
            where: {
                status: 'active',
                deadline: {
                    gte: new Date(),
                },
            },
            select: {
                id: true,
                jobTitle: true,
                jobDescription: true,
                numOpenings: true,
                minSalary: true,
                maxSalary: true,
                jobMode: true,
                deadline: true,
                createdAt: true,
                applications: {
                    where: {
                        userId: userId,
                    },
                    select: {
                        id: true,
                        status: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        const jobsWithAppliedStatus = jobs.map(job => ({
            ...job,
            hasApplied: job.applications.length > 0,
            userApplicationStatus: job.applications.length > 0 ? job.applications[0].status : null,
            applications: undefined,
        }));

        console.log(`API: Fetched ${jobsWithAppliedStatus.length} available jobs for user.`);
        return NextResponse.json(jobsWithAppliedStatus, { status: 200 });

    } catch (error: any) {
        console.error("API Error in /api/user/jobs:", error); // This will log the detailed error
        // Check for specific Prisma errors
        if (error.name === 'PrismaClientKnownRequestError') {
            console.error("Prisma Error Code:", error.code);
            console.error("Prisma Error Message:", error.message);
            if (error.code === 'P2002') { // Unique constraint violation example
                return NextResponse.json({ message: 'Database conflict occurred.' }, { status: 409 });
            }
        } else if (error.name === 'PrismaClientInitializationError') {
             console.error("Prisma Initialization Error: Database connection failed.");
             return NextResponse.json({ message: 'Database connection error.' }, { status: 500 });
        }
        return NextResponse.json(
            { message: 'Failed to fetch available jobs.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    } 
}
