// app/api/user/jobs/[jobId]/route.ts
export const dynamic = "force-dynamic";
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { client } from '@/lib/prisma';

export async function GET(req: NextRequest, context: { params: Record<string, string | undefined> }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id || session.user.role !== 'user') {
            return NextResponse.json({ message: 'Unauthorized: Access denied.' }, { status: 401 });
        }

        const jobId = context.params?.jobId || context.params?.jobid;

        if (!jobId) {
            return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
        }

        const job = await client.job.findUnique({
            where: {
                id: jobId,
            },
            select: {
                id: true,
                jobTitle: true,
                numOpenings: true,
                minSalary: true,
                maxSalary: true,
                jobMode: true,
                jobDescription: true,
                deadline: true,
                status: true,
                createdAt: true,
                postedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        company: true,
                    },
                },
            },
        });

        if (!job) {
            return NextResponse.json({ message: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json({
            ...job,
            postedAt: job.createdAt,
        }, { status: 200 });

    } catch (error: any) {
        console.error(`API Error fetching job details:`, error);
        return NextResponse.json(
            { message: 'Failed to fetch job details.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    } 
}
