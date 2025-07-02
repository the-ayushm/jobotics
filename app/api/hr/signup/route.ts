// app/api/hr/signup/route.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod"; // Ensure you have zod installed: npm install zod

const client = new PrismaClient();

// Define a Zod schema for input validation for HR signup
const hrSignupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email format"),
    phone: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number format (10-15 digits, optional +)"),
    company: z.string().min(2, "Company name must be at least 2 characters long"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const validationResult = hrSignupSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { message: "Validation Error", errors: validationResult.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { name, email, phone, company, password } = validationResult.data;

        // Check for existing user by email in the single User table
        const existingUser = await client.user.findUnique({
            where: { email: email },
        });

        if (existingUser) {
            return NextResponse.json({ message: "A user with this email already exists!" }, { status: 409 });
        }

        const hashedPassword = await hash(password, 10);

        // *** HERE IS WHERE THE ROLE IS SET FOR HR ***
        const newHrUser = await client.user.create({
            data: {
                name,
                email,
                phone,
                company, // Company will be stored for HR users
                password: hashedPassword,
                role: "hr", // Explicitly set role to "hr"
            },
            select: { // Select only safe fields to return
                id: true,
                name: true,
                email: true,
                role: true,
                company: true,
            }
        });

        return NextResponse.json({
            message: "HR account added successfully! Please sign in.",
            user: newHrUser,
        }, { status: 201 });

    } catch (err) {
        console.error("Error in HR signup:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
