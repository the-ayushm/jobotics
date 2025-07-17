// app/api/user/profile/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust path as needed
import {client} from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Ensure only authenticated users can view their profile
        if (!session || !session.user || !session.user.id) {
            console.warn("Unauthorized attempt to fetch user profile.");
            return NextResponse.json({ message: 'Unauthorized: Access denied.' }, { status: 401 });
        }

        const userId = session.user.id;

        // Fetch the user's profile from the User table
        const userProfile = await client.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true, // Include phone number
                role: true,
                image: true, // Profile image URL from social login
                createdAt: true,
                // Do NOT select password or other sensitive data
            },
        });

        if (!userProfile) {
            console.warn(`User profile not found for ID: ${userId}`);
            return NextResponse.json({ message: 'User profile not found.' }, { status: 404 });
        }

        console.log(`Fetched profile for user: ${userId}`);
        return NextResponse.json(userProfile, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json(
            { message: 'Failed to fetch user profile.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}
