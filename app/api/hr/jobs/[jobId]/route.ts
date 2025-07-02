// app/api/hr/jobs/[jobId]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Corrected import path
import { client } from '@/lib/prisma';

// Define a type for the dynamic route parameters
// This interface defines the structure of the 'params' object
interface RouteParams {
  jobId: string;
}

// GET handler
// FIX: Using a direct type for the context object
export async function GET(req: NextRequest, context: { params: RouteParams }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id || session.user.role !== "hr") {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
    }

    const { jobId } = context.params; // Access jobId from context.params
    if (!jobId) {
      return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
    }

    const job = await client.job.findUnique({
      where: { id: jobId },
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
        createdAt: true, // Changed from createdAt to postedAt as per schema
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

    return NextResponse.json(job, { status: 200 });
  } catch (error: any) {
    console.error(`Error fetching job details for ID ${context.params.jobId}:`, error);
    return NextResponse.json(
      { message: 'Failed to fetch job details.', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

// PATCH (update) job details
// FIX: Using a direct type for the context object
export async function PATCH(req: NextRequest, context: { params: RouteParams }) {
  try {
    const { jobId } = context.params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'hr') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!jobId) {
      return NextResponse.json({ message: 'Job ID is required.' }, { status: 400 });
    }

    const body = await req.json();
    const {
      jobTitle,
      numOpenings,
      minSalary,
      maxSalary,
      jobMode,
      jobDescription,
      deadline,
      status,
    } = body;

    if (!jobTitle || numOpenings === '' || minSalary === '' || maxSalary === '' || !jobMode || !jobDescription || !deadline) {
      return NextResponse.json({ message: 'Missing required job fields for update' }, { status: 400 });
    }

    const numericMinSalary = Number(minSalary);
    const numericMaxSalary = Number(maxSalary);
    const numericNumOpenings = Number(numOpenings);

    if (isNaN(numericMinSalary) || isNaN(numericMaxSalary) || isNaN(numericNumOpenings) || numericMinSalary < 0 || numericMaxSalary < 0 || numericNumOpenings <= 0) {
      return NextResponse.json({ message: 'Salary and openings must be valid positive numbers' }, { status: 400 });
    }

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
        status: status || 'active',
      },
    });

    if (!updatedJob) {
      return NextResponse.json({ message: 'Job not found or unauthorized to update' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Job updated successfully!', job: updatedJob }, { status: 200 });
  } catch (error: any) {
    console.error(`Error updating job with ID ${context.params.jobId}:`, error);
    return NextResponse.json(
      { message: 'Failed to update job.', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE job by ID
// FIX: Using a direct type for the context object
export async function DELETE(req: NextRequest, context: { params: RouteParams }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'hr') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { jobId } = context.params;
    if (!jobId) {
      return NextResponse.json({ message: 'Job ID is required.' }, { status: 400 });
    }

    const deletedJob = await client.job.delete({
      where: {
        id: jobId,
        postedById: session.user.id,
      },
    });

    if (!deletedJob) {
      return NextResponse.json({ message: 'Job not found or unauthorized to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Job deleted successfully!', job: deletedJob }, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Job not found or already deleted.' }, { status: 404 });
    }
    console.error(`Error deleting job with ID ${context.params.jobId}:`, error);
    return NextResponse.json(
      { message: 'Failed to delete job.', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
