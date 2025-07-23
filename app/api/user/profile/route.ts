// app/api/user/profile/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust path as needed
import bcrypt from 'bcryptjs'; // For password hashing if changing password
import {client} from "@/lib/prisma"
// GET handler (no changes needed here, just for context)
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            console.warn("Unauthorized attempt to fetch user profile.");
            return NextResponse.json({ message: 'Unauthorized: Access denied.' }, { status: 401 });
        }

        const userId = session.user.id;

        const userProfile = await client.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                image: true,
                createdAt: true,
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
    } finally {
        // await client.$disconnect();
    }
}

// NEW: PATCH handler to update user profile details
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            console.warn("Unauthorized attempt to update user profile.");
            return NextResponse.json({ message: 'Unauthorized: Access denied.' }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await req.json();
        const { name, email, phone, currentPassword, newPassword } = body; // Include password fields for potential change

        // Fetch the existing user to verify current password if newPassword is provided
        const existingUser = await client.user.findUnique({
            where: { id: userId },
            select: { id: true, password: true, email: true } // Select existing password for comparison
        });

        if (!existingUser) {
            return NextResponse.json({ message: 'User not found.' }, { status: 404 });
        }

        // Handle password change if newPassword is provided
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ message: 'Current password is required to change password.' }, { status: 400 });
            }
            if (!existingUser.password || !(await bcrypt.compare(currentPassword, existingUser.password))) {
                return NextResponse.json({ message: 'Invalid current password.' }, { status: 401 });
            }
            if (newPassword.length < 8) {
                return NextResponse.json({ message: 'New password must be at least 8 characters long.' }, { status: 400 });
            }
        }

        // Prepare data for update
        const updateData: {
            name?: string;
            email?: string;
            phone?: string | null;
            password?: string;
        } = {};

        if (name !== undefined) updateData.name = name;
        if (email !== undefined && email !== existingUser.email) {
            // Check if new email already exists for another user
            const emailExists = await client.user.findUnique({ where: { email } });
            if (emailExists && emailExists.id !== userId) {
                return NextResponse.json({ message: 'Email already in use by another account.' }, { status: 409 });
            }
            updateData.email = email;
        }
        if (phone !== undefined) updateData.phone = phone === '' ? null : phone; // Handle empty string for optional phone
        if (newPassword) updateData.password = await bcrypt.hash(newPassword, 10);

        // Perform the update only if there's data to update
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ message: 'No changes detected.' }, { status: 200 });
        }

        const updatedUser = await client.user.update({
            where: { id: userId },
            data: updateData,
            select: { id: true, name: true, email: true, phone: true, role: true, image: true, createdAt: true }
        });

        console.log(`User profile updated successfully for ID: ${userId}.`);
        return NextResponse.json({ message: 'Profile updated successfully!', user: updatedUser }, { status: 200 });

    } catch (error: any) {
        console.error("Error updating user profile:", error);
        return NextResponse.json(
            { message: 'Failed to update profile.', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}
