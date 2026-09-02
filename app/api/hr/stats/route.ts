// app/api/hr/stats/route.ts
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
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // 1. Key Metrics counts
        const [
            activeJobsCount,
            totalApplicantsCount,
            applicantsTodayCount,
            interviewsScheduledCount,
            hiresThisMonthCount,
        ] = await Promise.all([
            client.job.count({
                where: { postedById: hrUserId, status: 'active' },
            }),
            client.applicant.count({
                where: { job: { postedById: hrUserId } },
            }),
            client.applicant.count({
                where: {
                    job: { postedById: hrUserId },
                    appliedAt: { gte: startOfDay },
                },
            }),
            client.interview.count({
                where: {
                    job: { postedById: hrUserId },
                    status: 'scheduled',
                },
            }),
            client.applicant.count({
                where: {
                    job: { postedById: hrUserId },
                    status: 'hired',
                    updatedAt: { gte: startOfMonth },
                },
            }),
        ]);

        // 2. Funnel counts by status
        const [appliedCount, reviewedCount, interviewedCount, offerCount, hiredCount] = await Promise.all([
            client.applicant.count({ where: { job: { postedById: hrUserId }, status: 'applied' } }),
            client.applicant.count({ where: { job: { postedById: hrUserId }, status: 'reviewed' } }),
            client.applicant.count({ where: { job: { postedById: hrUserId }, status: 'interviewed' } }),
            client.applicant.count({ where: { job: { postedById: hrUserId }, status: 'offer' } }),
            client.applicant.count({ where: { job: { postedById: hrUserId }, status: 'hired' } }),
        ]);

        // 3. Upcoming Interviews (top 5)
        const upcomingInterviews = await client.interview.findMany({
            where: {
                job: { postedById: hrUserId },
                status: 'scheduled',
                interviewDate: { gte: startOfDay },
            },
            include: {
                applicant: {
                    select: { id: true, fullName: true, contactEmail: true },
                },
                job: {
                    select: { id: true, jobTitle: true },
                },
            },
            orderBy: [
                { interviewDate: 'asc' },
                { interviewTime: 'asc' },
            ],
            take: 5,
        });

        // 4. Recent real activity (latest applications + scheduled interviews)
        const recentApplications = await client.applicant.findMany({
            where: { job: { postedById: hrUserId } },
            include: {
                job: { select: { jobTitle: true } },
            },
            orderBy: { appliedAt: 'desc' },
            take: 4,
        });

        const recentInterviews = await client.interview.findMany({
            where: { job: { postedById: hrUserId } },
            include: {
                applicant: { select: { fullName: true } },
                job: { select: { jobTitle: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 3,
        });

        const activities: Array<{ id: string; text: string; time: string; timestamp: number }> = [];

        recentApplications.forEach((app) => {
            activities.push({
                id: `app-${app.id}`,
                text: `New applicant for ${app.job.jobTitle}: ${app.fullName}`,
                time: getRelativeTime(app.appliedAt),
                timestamp: new Date(app.appliedAt).getTime(),
            });
        });

        recentInterviews.forEach((interview) => {
            activities.push({
                id: `int-${interview.id}`,
                text: `Interview scheduled with ${interview.applicant.fullName} for ${interview.job.jobTitle}`,
                time: getRelativeTime(interview.createdAt),
                timestamp: new Date(interview.createdAt).getTime(),
            });
        });

        activities.sort((a, b) => b.timestamp - a.timestamp);

        return NextResponse.json({
            metrics: {
                activeJobs: activeJobsCount,
                totalApplicants: totalApplicantsCount,
                applicantsToday: applicantsTodayCount,
                interviewsScheduled: interviewsScheduledCount,
                hiresThisMonth: hiresThisMonthCount,
            },
            funnel: {
                applied: appliedCount,
                screened: reviewedCount,
                interviewed: interviewedCount,
                offer: offerCount,
                hired: hiredCount,
                total: totalApplicantsCount,
            },
            upcomingInterviews,
            recentActivity: activities.slice(0, 5),
        }, { status: 200 });

    } catch (error: any) {
        console.error("API Error in /api/hr/stats:", error);
        return NextResponse.json(
            { message: 'Failed to fetch HR dashboard statistics.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}

function getRelativeTime(date: Date | string): string {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
}
