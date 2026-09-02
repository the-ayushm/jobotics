// app/api/user/stats/route.ts
export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { client } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== 'user' || !session.user.id) {
            return NextResponse.json({ message: 'Unauthorized: Access denied.' }, { status: 401 });
        }

        const userId = session.user.id;
        const now = new Date();

        // 1. Fetch user's applications with jobs and scheduled interviews
        const userApplications = await client.applicant.findMany({
            where: { userId },
            include: {
                job: {
                    select: {
                        id: true,
                        jobTitle: true,
                        jobMode: true,
                        minSalary: true,
                        maxSalary: true,
                        postedBy: {
                            select: { company: true, name: true },
                        },
                    },
                },
                interviews: {
                    where: {
                        status: 'scheduled',
                        interviewDate: { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) },
                    },
                    orderBy: { interviewDate: 'asc' },
                },
            },
            orderBy: { appliedAt: 'desc' },
        });

        const totalApplications = userApplications.length;
        const activeApplications = userApplications.filter(
            (app) => app.status === 'applied' || app.status === 'reviewed' || app.status === 'interviewed'
        ).length;
        const offersReceived = userApplications.filter((app) => app.status === 'offer' || app.status === 'hired').length;

        // Collect all scheduled interviews across applications
        const allInterviews = userApplications.flatMap((app) =>
            app.interviews.map((interview) => ({
                ...interview,
                jobTitle: app.job.jobTitle,
            }))
        );
        allInterviews.sort((a, b) => new Date(a.interviewDate).getTime() - new Date(b.interviewDate).getTime());

        const interviewsScheduled = allInterviews.length;
        const earliestInterview = allInterviews.length > 0 ? allInterviews[0] : null;

        // 2. Fetch recent active jobs
        const recentJobs = await client.job.findMany({
            where: {
                status: 'active',
                deadline: { gte: now },
            },
            include: {
                postedBy: { select: { company: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 3,
        });

        // 3. Map recent applications for UI
        const mappedApplications = userApplications.slice(0, 4).map((app) => ({
            id: app.id,
            jobTitle: app.job.jobTitle,
            companyName: app.job.postedBy?.company || app.job.postedBy?.name || 'Company',
            status: app.status,
            appliedAt: app.appliedAt.toISOString(),
            jobMode: app.job.jobMode,
            salary: `₹${app.job.minSalary.toLocaleString()} - ₹${app.job.maxSalary.toLocaleString()}`,
        }));

        // 4. Map recent jobs for UI
        const mappedJobs = recentJobs.map((job) => ({
            id: job.id,
            jobTitle: job.jobTitle,
            companyName: job.postedBy?.company || job.postedBy?.name || 'Company',
            location: job.jobMode,
            salary: `₹${job.minSalary.toLocaleString()} - ₹${job.maxSalary.toLocaleString()}`,
            jobMode: job.jobMode,
            deadline: job.deadline ? job.deadline.toISOString() : '',
            postedAt: job.createdAt.toISOString(),
        }));

        // 5. Map upcoming interview
        let mappedUpcomingInterview = null;
        if (earliestInterview) {
            const intDate = new Date(earliestInterview.interviewDate);
            mappedUpcomingInterview = {
                jobTitle: earliestInterview.jobTitle,
                dateTime: `${intDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${earliestInterview.interviewTime}`,
                link: earliestInterview.meetLink || '/dashboard/user?section=my-applications',
            };
        }

        return NextResponse.json({
            stats: {
                totalApplications,
                activeApplications,
                interviewsScheduled,
                offersReceived,
            },
            recentApplications: mappedApplications,
            recentJobs: mappedJobs,
            upcomingInterview: mappedUpcomingInterview,
            quickStats: {
                applicationsSent: totalApplications,
                profileViews: totalApplications > 0 ? totalApplications * 2 + 1 : 0,
                jobMatches: recentJobs.length,
            },
        }, { status: 200 });

    } catch (error: any) {
        console.error("API Error in /api/user/stats:", error);
        return NextResponse.json(
            { message: 'Failed to fetch candidate stats.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}
