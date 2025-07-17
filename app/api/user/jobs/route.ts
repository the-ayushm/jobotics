// app/api/user/jobs/route.ts
import { NextResponse } from 'next/server';
import { client } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== 'user' || !session.user.id) {
            console.warn("Unauthorized attempt to fetch user jobs.");
            return NextResponse.json({ message: 'Unauthorized: Access denied.' }, { status: 401 });
        }

        const userId = session.user.id;

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
                // NEW: Select related applications for this user
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

        // Transform the data to add an 'hasApplied' flag
        const jobsWithAppliedStatus = jobs.map(job => ({
            ...job,
            hasApplied: job.applications.length > 0, // True if user has any application for this job
            // You might want to pass the application ID or status if needed later
            userApplicationStatus: job.applications.length > 0 ? job.applications[0].status : null,
            applications: undefined, // Remove the raw applications array to keep payload clean
        }));

        console.log(`Fetched ${jobsWithAppliedStatus.length} available jobs for user, with applied status.`);
        return NextResponse.json(jobsWithAppliedStatus, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching available jobs for user:", error);
        return NextResponse.json(
            { message: 'Failed to fetch available jobs.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    } finally {
        // await client.$disconnect();
    }
}
