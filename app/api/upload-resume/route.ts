// app/api/upload-resume/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Adjust path as needed

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  // Ensure only authenticated users can upload resumes
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ message: 'Filename is required' }, { status: 400 });
  }

  if (!request.body) {
    return NextResponse.json({ message: 'Request body is empty' }, { status: 400 });
  }

  try {
    // Generate a unique filename to prevent collisions and organize by user
    const uniqueFilename = `${session.user.id}/${Date.now()}-${filename}`;

    // Upload the file to Vercel Blob storage
    const blob = await put(uniqueFilename, request.body, {
      access: 'public', // Make the file publicly accessible
      // contentType: request.headers.get('content-type') || 'application/octet-stream', // Infer content type
    });

    console.log(`Resume uploaded successfully: ${blob.url}`);
    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    console.error('Error uploading resume:', error);
    return NextResponse.json({ message: 'Failed to upload resume.', error: error.message }, { status: 500 });
  }
}
