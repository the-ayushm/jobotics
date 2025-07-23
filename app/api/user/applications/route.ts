// app/api/user/applications/route.ts
export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import { client } from "@/lib/prisma"


export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Ensure only authenticated 'user' roles can view their applications
        if (!session || !session.user || session.user.role !== 'user' || !session.user.id) {
            console.warn("Unauthorized attempt to fetch user applications.");
            return NextResponse.json({ message: 'Unauthorized: Access denied.' }, { status: 401 });
        }

        const userId = session.user.id;

        // Fetch applications for the current user
        const applications = await client.applicant.findMany({
            where: {
                userId: userId,
            },
            // Include details of the job they applied for
            include: {
                job: {
                    select: {
                        id: true,
                        jobTitle: true,
                        jobMode: true,
                        minSalary: true,
                        maxSalary: true,
                        deadline: true,
                    },
                },
            },
            orderBy: {
                appliedAt: 'desc', // Show most recent applications first
            }
        });

        console.log(`Fetched ${applications.length} applications for user ${userId}.`);
        return NextResponse.json(applications, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching user applications:", error);
        return NextResponse.json(
            { message: 'Failed to fetch your applications.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    } 
}
