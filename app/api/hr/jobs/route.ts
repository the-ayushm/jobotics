import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/prisma";


export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user || !session.user.id || session.user.role !== "hr") {
            console.warn("Unauthorized access attempt to create job opening")
            return NextResponse.json({
                message: "Unauthorized access",
            },
                { status: 401 });
        }

        const { jobTitle, numOpenings, minSalary, maxSalary, jobMode, jobDescription, deadline } = await req.json();
        if (!jobTitle || !numOpenings || !minSalary || !maxSalary || !jobMode || !jobDescription || !deadline) {
            return NextResponse.json({
                message: "Please fill in all fields.",
            }, { status: 400 });
        }

        // Validate numbers
        const numericMinSalary = Number(minSalary);
        const numericMaxSalary = Number(maxSalary);
        const numericNumOpenings = Number(numOpenings);
        if (isNaN(numericMinSalary) || isNaN(numericMaxSalary) || isNaN(numericNumOpenings)) {
            return NextResponse.json({ message: 'Salary and openings must be valid numbers' }, { status: 400 });
        }
        if (numericMinSalary < 0 || numericMaxSalary < 0 || numericNumOpenings <= 0) {
            return NextResponse.json({ message: 'Salary and openings must be positive numbers' }, { status: 400 });
        }

        // Validate deadline as a valid date string
        const parsedDeadline = new Date(deadline)
        if (isNaN(parsedDeadline.getTime())) {
            return NextResponse.json({ message: 'Invalid deadline date' }, { status: 400 });
        }

        const newJob = await client.job.create({
            data: {
                jobTitle,
                numOpenings: numericNumOpenings,
                minSalary: numericMinSalary,
                maxSalary: numericMaxSalary,
                jobMode,
                jobDescription,
                deadline: parsedDeadline,
                postedById: session.user.id, // Assuming session.user.id is the HR's ID
            }
        });

        console.log(`Job posted successfully by HR user ${session.user.id}:`, newJob);
        return NextResponse.json({ message: 'Job posted successfully!', job: newJob }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating job:" , error)
        return NextResponse.json({
            message: "Failed to create job." , error: error.message || 'unknown error'
        })
    }
}

export async function GET(req: NextRequest){
    try{
        const session = await getServerSession(authOptions)
        if (!session || !session.user || !session.user.id || session.user.role !== "hr") {
            console.warn("Unauthorized access attempt to view job openings")
            return NextResponse.json({
                message: "Unauthorized access",
            }, { status: 401 });
        }

        const jobOpenings = await client.job.findMany({
            where: {
                postedById: session.user.id, // Fetch jobs posted by the HR user
            },
            orderBy: {
                createdAt: 'desc', // Order by creation date, most recent first
            },
        });
        console.log(`Fetched ${jobOpenings.length} job openings for HR user ${session.user.id}`);
        return NextResponse.json(jobOpenings, { status: 200 });


    }catch(error: any) {
        console.error("Error fetching job openings:", error);
        return NextResponse.json({
            message: "Failed to fetch job openings.",
            error: error.message || 'unknown error'
        }, { status: 500 });
    }
}