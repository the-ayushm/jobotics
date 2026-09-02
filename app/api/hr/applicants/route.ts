// app/api/hr/applicants/route.ts
export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import { client } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== 'hr' || !session.user.id) {
            return NextResponse.json({ message: 'Unauthorized: Access denied.' }, { status: 401 });
        }

        const hrUserId = session.user.id;
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search')?.trim() || '';
        const status = searchParams.get('status')?.trim() || '';

        const whereClause: any = {
            job: {
                postedById: hrUserId,
            },
        };

        if (status && status.toLowerCase() !== 'all') {
            whereClause.status = status.toLowerCase();
        }

        if (search) {
            whereClause.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { contactEmail: { contains: search, mode: 'insensitive' } },
                { job: { jobTitle: { contains: search, mode: 'insensitive' } } },
                { user: { name: { contains: search, mode: 'insensitive' } } },
            ];
        }

        const applicants = await client.applicant.findMany({
            where: whereClause,
            select: {
                id: true,
                status: true,
                appliedAt: true,
                resumeUrl: true,
                fullName: true,
                contactEmail: true,
                phoneNumber: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
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
                    },
                },
            },
            orderBy: {
                appliedAt: 'desc',
            },
        });

        return NextResponse.json(applicants, { status: 200 });

    } catch (error: any) {
        console.error("API Error in /api/hr/applicants:", error);
        return NextResponse.json(
            { message: 'Failed to fetch applicants.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}

