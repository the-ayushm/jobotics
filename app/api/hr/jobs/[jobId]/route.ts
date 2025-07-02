import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {client} from '@/lib/prisma'

interface Params {
    jobId: string;
}

export async function GET(req: NextRequest , {params} : {params: Params}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user || !session.user.id || session.user.role !== "hr") {
            console.warn("Unauthorized access attempt to view job openings")
            return NextResponse.json({
                message: "Unauthorized access",
            }, { status: 401 });
        }
        const {jobId} = await params
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
                postedBy: { // Include information about the HR user who posted it
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        company: true,
                    },
                },
            },
        })
        if(!job){
            console.warn(`Job with ID ${jobId} not found.`)
            return NextResponse.json({message:'Job not found'} , {status: 404});
        }

        console.log(`Fetched job details for ID: ${jobId}`)
        return NextResponse.json(job, { status: 200 });


    }catch (error: any) {
        console.error(`Error fetching job details for ID ${params.jobId}:`, error);
        return NextResponse.json(
            { message: 'Failed to fetch job details.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest, {params} : {params: Params}){
    try{
        const session = await getServerSession(authOptions)
        if (!session || !session.user || session.user.role !== 'hr') {
            console.warn(`Unauthorized attempt to update job details for ID: ${params.jobId}`);
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const {jobId} = await params
        if(!jobId){
            return NextResponse.json({
                message: 'job ID is required.'
            },
        {status: 400})
        }

        const body = await req.json()
        const {
            jobTitle,
            numOpenings,
            minSalary,
            maxSalary,
            jobMode,
            jobDescription,
            deadline,
            status // Allow updating status as well
        } = body;

        // Basic validation for required fields (adjust as needed for partial updates)
        if (!jobTitle || numOpenings === '' || minSalary === '' || maxSalary === '' || !jobMode || !jobDescription || !deadline) {
            return NextResponse.json({ message: 'Missing required job fields for update' }, { status: 400 });
        }

        // Validate numbers 
        const numericMinSalary = Number(minSalary);
        const numericMaxSalary = Number(maxSalary);
        const numericNumOpenings = Number(numOpenings);

        if (isNaN(numericMinSalary) || isNaN(numericMaxSalary) || isNaN(numericNumOpenings) || numericMinSalary < 0 || numericMaxSalary < 0 || numericNumOpenings <= 0) {
            return NextResponse.json({ message: 'Salary and openings must be valid positive numbers' }, { status: 400 });
        }

         // Validate deadline
        const parsedDeadline = new Date(deadline);
        if (isNaN(parsedDeadline.getTime())) {
            return NextResponse.json({ message: 'Invalid deadline date format' }, { status: 400 });
        }

        const updatedJob = await client.job.update({
            where: {
                id: jobId,
                postedById: session.user.id,
            },
            data: {
                jobTitle,
                numOpenings: numericNumOpenings,
                minSalary: numericMinSalary,
                maxSalary: numericMaxSalary,
                jobMode,
                jobDescription,
                deadline: parsedDeadline,
                status: status || 'active', // Default to 'active' if status is not provided
            },
        })

        if (!updatedJob) {
            console.warn(`Job with ID ${jobId} not found or not authorized for update by user ${session.user.id}.`);
            return NextResponse.json({ message: 'Job not found or unauthorized to update' }, { status: 404 });
        }

        console.log(`Job with ID ${jobId} updated successfully by HR user ${session.user.id}.`);
        return NextResponse.json({ message: 'Job updated successfully!', job: updatedJob }, { status: 200 });



    }catch(error: any){
 console.error(`Error updating job with ID ${params.jobId}:`, error);
        return NextResponse.json(
            { message: 'Failed to update job.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest , {params} : {params : Params}){
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user || session.user.role !== 'hr') {
            console.warn(`Unauthorized attempt to delete job details for ID: ${params.jobId}`);
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const {jobId} = await params
        if(!jobId){
            return NextResponse.json({
                message: 'job ID is required.'
            },
        {status: 400})
        }

        const deletedJob = await client.job.delete({
            where: {
                id: jobId,
                postedById: session.user.id
            }
        })
        if (!deletedJob) {
            console.warn(`Job with ID ${jobId} not found or not authorized for deletion by user ${session.user.id}.`);
            return NextResponse.json({ message: 'Job not found or unauthorized to delete' }, { status: 404 });
        }
        console.log(`Job with ID ${jobId} deleted successfully by HR user ${session.user.name}.`);
        return NextResponse.json({ message: 'Job deleted successfully!', job: deletedJob }, { status: 200 });
    } catch (error: any) {
        // P2025 is Prisma's "record not found" error for delete operations
        if (error.code === 'P2025') {
            return NextResponse.json({ message: 'Job not found or already deleted.' }, { status: 404 });
        }
        console.error(`Error deleting job with ID ${params.jobId}:`, error);
        return NextResponse.json(
            { message: 'Failed to delete job.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}