import { client } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest , NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user || session.user.role !== 'user') {
            console.warn("Unauthorized attempt to fetch user jobs.");
            return NextResponse.json({ message: 'Unauthorized: Access denied.' }, { status: 401 });
        }

        const jobs = await client.job.findMany({
            where: {
                status: 'active',
                deadline: {
                    gte: new Date(),
                }
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
            },
            orderBy: {
                createdAt: 'desc',
            }
        })

        console.log(`Fetched ${jobs.length} available jobs for user.`);
        return NextResponse.json(jobs, { status: 200 });

    }catch (error: any) {
        console.error("Error fetching available jobs for user:", error);
        return NextResponse.json(
            { message: 'Failed to fetch available jobs.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}